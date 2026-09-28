import { eq } from "drizzle-orm";
import { getPublishedStagesForLocale } from "@/lib/catalog";
import { db } from "@/lib/db";
import { sectionProgress, stageProgress } from "@/lib/db/schema";

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
