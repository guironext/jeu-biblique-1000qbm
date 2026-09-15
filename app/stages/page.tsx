import { Source_Serif_4 } from "next/font/google";
import { StageCatalog } from "@/app/ui/stage-catalog";
import { getPublishedStagesForLocale, localeLabel } from "@/lib/catalog";
import { requireOnboardedPlayer } from "@/lib/dal";
import { db } from "@/lib/db";
import { stageProgress } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["600", "700"],
});

export default async function StagesPage() {
  const { user, profile } = await requireOnboardedPlayer();

  const catalog = await getPublishedStagesForLocale(profile.locale);

  const progressRows = await db.query.stageProgress.findMany({
    where: eq(stageProgress.userId, user.id),
  });

  const progressByStage = new Map(
    progressRows.map((row) => [row.stageId, row.status]),
  );

  const nextPlayable = catalog.find((stage) => {
    const status = progressByStage.get(stage.id) ?? "LOCKED";
    return status === "UNLOCKED";
  });

  const stages = catalog.map((stage) => {
    const status = progressByStage.get(stage.id) ?? "LOCKED";
    return {
      id: stage.id,
      title: stage.title,
      description: stage.description,
      status,
      isNext: nextPlayable?.id === stage.id,
      imageUrl: stage.imageUrl,
    };
  });

  return (
    <StageCatalog
      stages={stages}
      headingClassName={sourceSerif.className}
      localeName={localeLabel(profile.locale)}
    />
  );
}
