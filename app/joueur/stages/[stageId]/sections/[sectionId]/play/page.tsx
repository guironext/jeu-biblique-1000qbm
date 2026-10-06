import { redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { Source_Serif_4 } from "next/font/google";
import { PlayIntro } from "@/app/ui/play-intro";
import { getPublishedStageInLocale } from "@/lib/catalog";
import { requireOnboardedPlayer } from "@/lib/dal";
import { db } from "@/lib/db";
import { sectionProgress, sections } from "@/lib/db/schema";

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["600", "700"],
});

export default async function PlayPlaceholderPage({
  params,
}: {
  params: Promise<{ stageId: string; sectionId: string }>;
}) {
  const { stageId, sectionId } = await params;
  const { user, profile } = await requireOnboardedPlayer();

  const stage = await getPublishedStageInLocale(stageId, profile.locale);
  if (!stage) {
    redirect("/joueur/stages");
  }

  const section = await db.query.sections.findFirst({
    where: eq(sections.id, sectionId),
  });

  if (!section || section.stageId !== stage.id) {
    redirect("/joueur/stages");
  }

  const progress = await db.query.sectionProgress.findFirst({
    where: and(
      eq(sectionProgress.userId, user.id),
      eq(sectionProgress.sectionId, section.id),
    ),
  });

  if (!progress || progress.status === "LOCKED") {
    redirect(`/joueur/stages/${stageId}`);
  }

  return (
    <PlayIntro
      title={section.title}
      headingClassName={sourceSerif.className}
      backHref={`/joueur/stages/${stageId}`}
    />
  );
}
