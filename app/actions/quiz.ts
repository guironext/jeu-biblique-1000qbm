"use server";

import { and, asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  answers,
  attempts,
  sectionProgress,
  sections,
  stageProgress,
  stages,
} from "@/lib/db/schema";
import { requireOnboardedPlayer } from "@/lib/dal";
import { redirect } from "next/navigation";

export async function submitAnswer(
  questionId: string,
  answerId: string,
): Promise<{ correct: boolean }> {
  const answer = await db.query.answers.findFirst({
    where: and(eq(answers.id, answerId), eq(answers.questionId, questionId)),
  });

  if (!answer) {
    throw new Error("Invalid answer");
  }

  return { correct: answer.isCorrect };
}

export async function finishQuiz(
  stageId: string,
  sectionId: string,
  score: number,
  totalQuestions: number,
) {
  const { user } = await requireOnboardedPlayer();
  const passed = score >= totalQuestions * 0.8;

  await db.insert(attempts).values({
    userId: user.id,
    sectionId,
    score,
    passed,
  });

  const progress = await db.query.sectionProgress.findFirst({
    where: and(
      eq(sectionProgress.userId, user.id),
      eq(sectionProgress.sectionId, sectionId),
    ),
  });

  if (!progress) {
    throw new Error("Section progress not found");
  }

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
    const section = await db.query.sections.findFirst({
      where: eq(sections.id, sectionId),
    });

    if (!section) {
      throw new Error("Section not found");
    }

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

          if (nextStageProgress?.status === "LOCKED") {
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
        }
      }
    }
  }

  redirect(
    `/joueur/stages/${stageId}/sections/${sectionId}/${passed ? "succes" : "echec"}`,
  );
}

