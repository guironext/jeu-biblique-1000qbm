"use server";

import { and, asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  answers,
  attempts,
  questions,
  sectionProgress,
  sections,
  stageProgress,
  stages,
} from "@/lib/db/schema";
import { requireOnboardedPlayer } from "@/lib/dal";
import { redirect } from "next/navigation";
import { ensureStageSectionProgress } from "@/lib/player-progress";

export async function submitAnswer(
  sectionId: string,
  questionId: string,
  answerId: string,
): Promise<{ correct: boolean; correctAnswerId: string | null }> {
  const { user } = await requireOnboardedPlayer();

  const section = await db.query.sections.findFirst({
    where: eq(sections.id, sectionId),
  });

  if (!section) {
    throw new Error("Section not found");
  }

  const progress = await db.query.sectionProgress.findFirst({
    where: and(
      eq(sectionProgress.userId, user.id),
      eq(sectionProgress.sectionId, sectionId),
    ),
  });

  if (!progress || progress.status === "LOCKED") {
    throw new Error("Section is locked");
  }

  const question = await db.query.questions.findFirst({
    where: eq(questions.id, questionId),
  });

  if (!question || question.sectionId !== sectionId) {
    throw new Error("Invalid question");
  }

  const answer = await db.query.answers.findFirst({
    where: and(eq(answers.id, answerId), eq(answers.questionId, questionId)),
  });

  if (!answer) {
    throw new Error("Invalid answer");
  }

  if (answer.isCorrect) {
    return { correct: true, correctAnswerId: null };
  }

  const correctAnswer = await db.query.answers.findFirst({
    where: and(
      eq(answers.questionId, questionId),
      eq(answers.isCorrect, true),
    ),
  });

  return {
    correct: false,
    correctAnswerId: correctAnswer?.id ?? null,
  };
}

export async function finishQuiz(
  stageId: string,
  sectionId: string,
  answerPairs: Array<{ questionId: string; answerId: string }>,
) {
  const { user } = await requireOnboardedPlayer();

  const section = await db.query.sections.findFirst({
    where: eq(sections.id, sectionId),
  });

  if (!section || section.stageId !== stageId) {
    throw new Error("Invalid section");
  }

  const progress = await db.query.sectionProgress.findFirst({
    where: and(
      eq(sectionProgress.userId, user.id),
      eq(sectionProgress.sectionId, sectionId),
    ),
  });

  if (!progress || progress.status === "LOCKED") {
    throw new Error("Section is locked");
  }

  const publishedQuestions = await db.query.questions.findMany({
    where: and(
      eq(questions.sectionId, sectionId),
      eq(questions.published, true),
    ),
  });

  if (answerPairs.length !== publishedQuestions.length) {
    throw new Error("Invalid number of answers");
  }

  const questionIds = new Set(publishedQuestions.map((q) => q.id));
  const answeredQuestionIds = new Set(answerPairs.map((p) => p.questionId));

  if (
    answerPairs.some((p) => !questionIds.has(p.questionId)) ||
    questionIds.size !== answeredQuestionIds.size
  ) {
    throw new Error("Invalid questions answered");
  }

  const answersByQuestion = new Map<
    string,
    Array<{ id: string; questionId: string; isCorrect: boolean }>
  >();
  for (const question of publishedQuestions) {
    const qAnswers = await db.query.answers.findMany({
      where: eq(answers.questionId, question.id),
    });
    answersByQuestion.set(question.id, qAnswers);
  }

  let score = 0;
  for (const pair of answerPairs) {
    const questionAnswers = answersByQuestion.get(pair.questionId);
    const selectedAnswer = questionAnswers?.find((a) => a.id === pair.answerId);
    if (selectedAnswer?.isCorrect) {
      score++;
    }
  }

  const totalQuestions = publishedQuestions.length;
  const passed = score >= totalQuestions * 0.8;

  await db.insert(attempts).values({
    userId: user.id,
    sectionId,
    score,
    passed,
  });

  const newAttempts = progress.attempts + 1;
  const newLastScore = score;
  const newBestScore = Math.max(progress.bestScore, score);
  const newStatus = passed ? ("PASSED" as const) : ("FAILED" as const);

  await db
    .update(sectionProgress)
    .set({
      status: newStatus,
      lastScore: newLastScore,
      bestScore: newBestScore,
      attempts: newAttempts,
    })
    .where(
      and(
        eq(sectionProgress.userId, user.id),
        eq(sectionProgress.sectionId, sectionId),
      ),
    );

  if (passed) {
    const stageSections = await db.query.sections.findMany({
      where: and(
        eq(sections.stageId, section.stageId),
        eq(sections.published, true),
      ),
      orderBy: [asc(sections.orderIndex)],
    });

    const currentIndex = stageSections.findIndex((s) => s.id === sectionId);
    const nextSection = stageSections[currentIndex + 1];

    if (nextSection) {
      const nextProgress = await db.query.sectionProgress.findFirst({
        where: and(
          eq(sectionProgress.userId, user.id),
          eq(sectionProgress.sectionId, nextSection.id),
        ),
      });

      if (nextProgress?.status === "LOCKED") {
        await db
          .update(sectionProgress)
          .set({ status: "UNLOCKED" })
          .where(
            and(
              eq(sectionProgress.userId, user.id),
              eq(sectionProgress.sectionId, nextSection.id),
            ),
          );
      }
    }

    const allSectionProgress = await db.query.sectionProgress.findMany({
      where: eq(sectionProgress.userId, user.id),
    });

    const sectionStatusMap = new Map(
      allSectionProgress.map((sp) => [sp.sectionId, sp.status]),
    );

    const allPassed = stageSections.every(
      (s) => sectionStatusMap.get(s.id) === "PASSED",
    );

    if (allPassed) {
      await db
        .update(stageProgress)
        .set({ status: "COMPLETED" })
        .where(
          and(
            eq(stageProgress.userId, user.id),
            eq(stageProgress.stageId, section.stageId),
          ),
        );

      const currentStage = await db.query.stages.findFirst({
        where: eq(stages.id, section.stageId),
      });

      if (currentStage) {
        const allStagesInLocale = await db.query.stages.findMany({
          where: and(
            eq(stages.locale, currentStage.locale),
            eq(stages.published, true),
          ),
          orderBy: [asc(stages.orderIndex)],
        });

        const currentStageIndex = allStagesInLocale.findIndex(
          (st) => st.id === section.stageId,
        );

        if (
          currentStageIndex !== -1 &&
          currentStageIndex < allStagesInLocale.length - 1
        ) {
          const nextStage = allStagesInLocale[currentStageIndex + 1];
          const nextStageProgress = await db.query.stageProgress.findFirst({
            where: and(
              eq(stageProgress.userId, user.id),
              eq(stageProgress.stageId, nextStage.id),
            ),
          });

          if (!nextStageProgress) {
            await db
              .insert(stageProgress)
              .values({ userId: user.id, stageId: nextStage.id, status: "UNLOCKED" })
              .onConflictDoNothing();
          } else if (nextStageProgress.status === "LOCKED") {
            await db
              .update(stageProgress)
              .set({ status: "UNLOCKED" })
              .where(
                and(
                  eq(stageProgress.userId, user.id),
                  eq(stageProgress.stageId, nextStage.id),
                ),
              );
          }

          await ensureStageSectionProgress(user.id, nextStage.id);
        }
      }
    }
  }

  redirect(
    `/joueur/stages/${stageId}/sections/${sectionId}/${passed ? "succes" : "echec"}`,
  );
}

