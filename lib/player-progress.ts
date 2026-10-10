import { and, asc, eq, inArray } from "drizzle-orm";
import { getPublishedStagesForLocale } from "@/lib/catalog";
import { db } from "@/lib/db";
import { sectionProgress, sections, stageProgress } from "@/lib/db/schema";

export async function ensurePlayerCatalogProgress(
  userId: string,
  locale: string,
) {
  const catalog = await getPublishedStagesForLocale(locale);
  if (catalog.length === 0) {
    return catalog;
  }

  const existingStages = await db.query.stageProgress.findMany({
    where: eq(stageProgress.userId, userId),
  });
  const existingStageIds = new Set(existingStages.map((row) => row.stageId));
  const missingStages = catalog.filter((stage) => !existingStageIds.has(stage.id));

  if (missingStages.length > 0) {
    const hasStarted = existingStages.some(
      (row) => row.status === "UNLOCKED" || row.status === "COMPLETED",
    );

    await db.insert(stageProgress).values(
      missingStages.map((stage) => ({
        userId,
        stageId: stage.id,
        status:
          !hasStarted && stage.id === catalog[0].id
            ? ("UNLOCKED" as const)
            : ("LOCKED" as const),
      })),
    );
  }

  const firstStage = catalog[0];
  const firstStageStatus =
    existingStages.find((row) => row.stageId === firstStage.id)?.status ??
    (missingStages.some((stage) => stage.id === firstStage.id)
      ? "UNLOCKED"
      : "LOCKED");

  if (
    firstStage.sections.length > 0 &&
    (firstStageStatus === "UNLOCKED" || firstStageStatus === "COMPLETED")
  ) {
    const existingSections = await db.query.sectionProgress.findMany({
      where: eq(sectionProgress.userId, userId),
    });
    const existingSectionIds = new Set(
      existingSections.map((row) => row.sectionId),
    );
    const missingSections = firstStage.sections.filter(
      (section) => !existingSectionIds.has(section.id),
    );

    if (missingSections.length > 0) {
      const hasUnlockedSection = existingSections.some(
        (row) =>
          firstStage.sections.some((section) => section.id === row.sectionId) &&
          (row.status === "UNLOCKED" || row.status === "PASSED"),
      );

      await db.insert(sectionProgress).values(
        missingSections.map((section) => ({
          userId,
          sectionId: section.id,
          status:
            !hasUnlockedSection && section.id === firstStage.sections[0].id
              ? ("UNLOCKED" as const)
              : ("LOCKED" as const),
        })),
      );
    }
  }

  return catalog;
}

/**
 * Garantit que chaque section publiée d'une étape débloquée a une ligne de
 * progression, et que la première section non réussie (après des sections
 * toutes réussies) est jouable. À appeler pour toute étape UNLOCKED/COMPLETED.
 */
export async function ensureStageSectionProgress(
  userId: string,
  stageId: string,
) {
  const stageRow = await db.query.stageProgress.findFirst({
    where: and(
      eq(stageProgress.userId, userId),
      eq(stageProgress.stageId, stageId),
    ),
  });
  if (!stageRow || stageRow.status === "LOCKED") return;

  const stageSections = await db.query.sections.findMany({
    where: and(eq(sections.stageId, stageId), eq(sections.published, true)),
    orderBy: [asc(sections.orderIndex)],
  });
  if (stageSections.length === 0) return;

  const sectionIds = stageSections.map((section) => section.id);
  const existing = await db.query.sectionProgress.findMany({
    where: and(
      eq(sectionProgress.userId, userId),
      inArray(sectionProgress.sectionId, sectionIds),
    ),
  });
  const existingIds = new Set(existing.map((row) => row.sectionId));
  const missing = stageSections.filter((section) => !existingIds.has(section.id));

  if (missing.length > 0) {
    await db
      .insert(sectionProgress)
      .values(
        missing.map((section) => ({
          userId,
          sectionId: section.id,
          status: "LOCKED" as const,
        })),
      )
      .onConflictDoNothing();
  }

  const statusById = new Map(existing.map((row) => [row.sectionId, row.status]));

  // Première section qui n'est pas encore réussie : elle doit être jouable.
  for (const section of stageSections) {
    const status = statusById.get(section.id) ?? "LOCKED";
    if (status === "PASSED") continue;
    if (status === "LOCKED") {
      await db
        .update(sectionProgress)
        .set({ status: "UNLOCKED" })
        .where(
          and(
            eq(sectionProgress.userId, userId),
            eq(sectionProgress.sectionId, section.id),
          ),
        );
    }
    break;
  }
}

/** Applique ensureStageSectionProgress à toutes les étapes ouvertes du joueur. */
export async function ensureAllOpenStagesSectionProgress(userId: string) {
  const openStages = await db.query.stageProgress.findMany({
    where: eq(stageProgress.userId, userId),
  });
  for (const row of openStages) {
    if (row.status === "UNLOCKED" || row.status === "COMPLETED") {
      await ensureStageSectionProgress(userId, row.stageId);
    }
  }
}
