import { Source_Serif_4 } from "next/font/google";
import { StageCatalog } from "@/app/ui/stage-catalog";
import { localeLabel } from "@/lib/catalog";
import { requireOnboardedPlayer } from "@/lib/dal";
import { db } from "@/lib/db";
import { sectionProgress, sections, stageProgress } from "@/lib/db/schema";
import { ensurePlayerCatalogProgress } from "@/lib/player-progress";
import { and, eq } from "drizzle-orm";
import { getJoueurTranslations } from "@/lib/joueur-i18n";

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["600", "700"],
});

async function unlockNextStageIfNeeded(
  userId: string,
  catalog: Awaited<ReturnType<typeof ensurePlayerCatalogProgress>>,
) {
  const progressRows = await db.query.stageProgress.findMany({
    where: eq(stageProgress.userId, userId),
  });

  const progressMap = new Map(
    progressRows.map((row) => [row.stageId, row]),
  );

  const allSectionProgressRows = await db.query.sectionProgress.findMany({
    where: eq(sectionProgress.userId, userId),
  });

  const sectionStatusMap = new Map(
    allSectionProgressRows.map((row) => [row.sectionId, row.status]),
  );

  for (let i = 0; i < catalog.length; i++) {
    const stage = catalog[i];
    const progress = progressMap.get(stage.id);

    if (!progress) continue;

    const publishedSections = await db.query.sections.findMany({
      where: and(eq(sections.stageId, stage.id), eq(sections.published, true)),
    });

    if (publishedSections.length === 0) continue;

    const allSectionsPassed = publishedSections.every((section) => {
      const status = sectionStatusMap.get(section.id);
      return status === "PASSED";
    });

    if (allSectionsPassed && progress.status !== "COMPLETED") {
      await db
        .update(stageProgress)
        .set({ status: "COMPLETED" })
        .where(
          and(
            eq(stageProgress.userId, userId),
            eq(stageProgress.stageId, stage.id),
          ),
        );

      const nextStage = catalog[i + 1];
      if (nextStage) {
        const nextProgress = progressMap.get(nextStage.id);
        if (nextProgress?.status === "LOCKED") {
          await db
            .update(stageProgress)
            .set({ status: "UNLOCKED" })
            .where(
              and(
                eq(stageProgress.userId, userId),
                eq(stageProgress.stageId, nextStage.id),
              ),
            );
        }
      }
    }
  }
}

export default async function StagesPage() {
  const { user, profile } = await requireOnboardedPlayer();

  const catalog = await ensurePlayerCatalogProgress(user.id, profile.locale);

  await unlockNextStageIfNeeded(user.id, catalog);

  const progressRows = await db.query.stageProgress.findMany({
    where: eq(stageProgress.userId, user.id),
  });

  const progressByStage = new Map(
    progressRows.map((row) => [row.stageId, row.status]),
  );

  const allSectionProgressRows = await db.query.sectionProgress.findMany({
    where: eq(sectionProgress.userId, user.id),
  });

  const sectionStatusMap = new Map(
    allSectionProgressRows.map((row) => [row.sectionId, row.status]),
  );

  const stages = await Promise.all(
    catalog.map(async (stage) => {
      const status = progressByStage.get(stage.id) ?? "LOCKED";

      const publishedSections = await db.query.sections.findMany({
        where: and(
          eq(sections.stageId, stage.id),
          eq(sections.published, true),
        ),
      });

      const completedSections = publishedSections.filter((section) => {
        const sectionStatus = sectionStatusMap.get(section.id);
        return sectionStatus === "PASSED";
      }).length;

      return {
        id: stage.id,
        title: stage.title,
        description: stage.description,
        status,
        imageUrl: stage.imageUrl,
        completedSections,
        totalSections: publishedSections.length,
      };
    }),
  );

  const t = getJoueurTranslations(profile.locale);
  const localeName = localeLabel(profile.locale);

  return (
    <StageCatalog
      stages={stages}
      headingClassName={sourceSerif.className}
      translations={{
        title: t.stagesPageTitle,
        subtitle: t.stagesPageSubtitle,
        description1: t.stagesPageDescription1,
        description2: t.stagesPageDescription2.replace("{localeName}", localeName),
        noStagesMessage: t.noStagesMessage.replace("{localeName}", localeName),
        statusLocked: t.statusLocked,
        statusUnlocked: t.statusUnlocked,
        statusCompleted: t.statusCompleted,
        playButton: t.playButton,
        lockedMessage: t.lockedMessage,
        progressLabel: t.progressLabel,
      }}
    />
  );
}
