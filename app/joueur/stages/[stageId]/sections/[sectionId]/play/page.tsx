import { and, asc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { Source_Serif_4 } from "next/font/google";
import { QuizGame } from "@/app/ui/quiz-game";
import { getPublishedStageInLocale } from "@/lib/catalog";
import { requireOnboardedPlayer } from "@/lib/dal";
import { db } from "@/lib/db";
import {
  answers,
  questions,
  sectionProgress,
  sections,
} from "@/lib/db/schema";
import { getJoueurTranslations } from "@/lib/joueur-i18n";

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["600", "700"],
});

export default async function PlayPage({
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

  const questionRows = await db.query.questions.findMany({
    where: and(
      eq(questions.sectionId, section.id),
      eq(questions.published, true),
    ),
    orderBy: [asc(questions.orderIndex)],
  });

  if (questionRows.length === 0) {
    const t = getJoueurTranslations(profile.locale);
    return (
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-4 py-10">
        <p className="text-center text-lg text-stone-600">{t.quizNoQuestions}</p>
      </main>
    );
  }

  const questionIds = questionRows.map((q) => q.id);
  const answersByQuestion = new Map<string, Array<{ id: string; questionId: string; label: string; orderIndex: number }>>();

  for (const questionId of questionIds) {
    const qAnswers = await db
      .select({
        id: answers.id,
        questionId: answers.questionId,
        label: answers.label,
        orderIndex: answers.orderIndex,
      })
      .from(answers)
      .where(eq(answers.questionId, questionId))
      .orderBy(asc(answers.orderIndex));
    answersByQuestion.set(questionId, qAnswers);
  }

  const quizQuestions = questionRows.map((q) => ({
    id: q.id,
    prompt: q.prompt,
    answers: (answersByQuestion.get(q.id) || []).map((a) => ({
      id: a.id,
      label: a.label,
    })),
  }));

  const t = getJoueurTranslations(profile.locale);

  return (
    <QuizGame
      stageId={stageId}
      sectionId={sectionId}
      sectionTitle={section.title}
      questions={quizQuestions}
      headingClassName={sourceSerif.className}
      backHref={`/joueur/stages/${stageId}`}
      translations={{
        questionProgress: t.quizQuestionProgress,
        submit: t.quizSubmit,
        next: t.quizNext,
        correct: t.quizCorrect,
        incorrect: t.quizIncorrect,
      }}
    />
  );
}
