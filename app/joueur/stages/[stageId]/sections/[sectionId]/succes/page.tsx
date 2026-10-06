import { and, desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { Source_Serif_4 } from "next/font/google";
import { SuccessResult } from "@/app/ui/result-pages";
import { getPublishedStageInLocale } from "@/lib/catalog";
import { requireOnboardedPlayer } from "@/lib/dal";
import { db } from "@/lib/db";
import { attempts, questions, sections } from "@/lib/db/schema";
import { getJoueurTranslations } from "@/lib/joueur-i18n";

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["600", "700"],
});

export default async function SuccessPage({
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

  const lastAttempt = await db.query.attempts.findFirst({
    where: and(
      eq(attempts.userId, user.id),
      eq(attempts.sectionId, sectionId),
    ),
    orderBy: [desc(attempts.finishedAt)],
  });

  if (!lastAttempt || !lastAttempt.passed) {
    redirect(`/joueur/stages/${stageId}`);
  }

  const totalQuestions = await db.query.questions.findMany({
    where: and(
      eq(questions.sectionId, sectionId),
      eq(questions.published, true),
    ),
  });

  const t = getJoueurTranslations(profile.locale);
  const total = totalQuestions.length;
  const percent = Math.round((lastAttempt.score / total) * 100);

  const scoreText = t.successScore
    .replace("{score}", String(lastAttempt.score))
    .replace("{total}", String(total))
    .replace("{percent}", String(percent));

  return (
    <SuccessResult
      stageId={stageId}
      title={t.successTitle}
      message={t.successMessage}
      scoreText={scoreText}
      buttonText={t.successButton}
      headingClassName={sourceSerif.className}
    />
  );
}
