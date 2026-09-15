import { and, asc, eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { answers, questions, sections, stages } from "@/lib/db/schema";

const LOCALE_LABELS: Record<string, string> = {
  fr: "Français",
  en: "English",
  es: "Español",
  pt: "Português",
};

export function localeLabel(code: string) {
  return LOCALE_LABELS[code] ?? code.toUpperCase();
}

export async function getPublishedLocales() {
  const rows = await db.query.stages.findMany({
    where: eq(stages.published, true),
    columns: { locale: true },
    orderBy: [asc(stages.locale)],
  });

  return [...new Set(rows.map((row) => row.locale))];
}

export async function getPublishedStagesForLocale(locale: string) {
  const publishedStages = await db
    .select()
    .from(stages)
    .where(and(eq(stages.locale, locale), eq(stages.published, true)))
    .orderBy(asc(stages.orderIndex));

  if (publishedStages.length === 0) {
    return [];
  }

  const publishedSections = await db
    .select()
    .from(sections)
    .where(
      and(
        inArray(
          sections.stageId,
          publishedStages.map((stage) => stage.id),
        ),
        eq(sections.published, true),
      ),
    )
    .orderBy(asc(sections.orderIndex));

  return publishedStages.map((stage) => ({
    ...stage,
    sections: publishedSections.filter((section) => section.stageId === stage.id),
  }));
}

export async function getAdminStages() {
  const stageRows = await db
    .select()
    .from(stages)
    .orderBy(asc(stages.locale), asc(stages.orderIndex));
  const sectionRows = await db
    .select()
    .from(sections)
    .orderBy(asc(sections.orderIndex));

  return stageRows.map((stage) => ({
    ...stage,
    sections: sectionRows.filter((section) => section.stageId === stage.id),
  }));
}

export async function getAdminStagesWithQuestionCounts() {
  const catalog = await getAdminStages();
  if (catalog.length === 0) {
    return [];
  }

  const sectionIds = catalog.flatMap((stage) =>
    stage.sections.map((section) => section.id),
  );
  const questionRows =
    sectionIds.length === 0
      ? []
      : await db
          .select({
            id: questions.id,
            sectionId: questions.sectionId,
          })
          .from(questions)
          .where(inArray(questions.sectionId, sectionIds));

  const questionCountBySection = new Map<string, number>();
  for (const question of questionRows) {
    questionCountBySection.set(
      question.sectionId,
      (questionCountBySection.get(question.sectionId) ?? 0) + 1,
    );
  }

  return catalog.map((stage) => ({
    ...stage,
    sections: stage.sections.map((section) => ({
      ...section,
      questionCount: questionCountBySection.get(section.id) ?? 0,
    })),
  }));
}

export async function getAdminSectionOptions() {
  const catalog = await getAdminStages();

  return catalog.flatMap((stage) =>
    stage.sections.map((section) => ({
      id: section.id,
      title: section.title,
      stageTitle: stage.title,
    })),
  );
}

export async function getAdminQuestionCatalog() {
  const catalog = await getAdminStages();
  const sectionIds = catalog.flatMap((stage) =>
    stage.sections.map((section) => section.id),
  );

  const questionRows =
    sectionIds.length === 0
      ? []
      : await db
          .select()
          .from(questions)
          .where(inArray(questions.sectionId, sectionIds))
          .orderBy(asc(questions.orderIndex));

  const answerRows =
    questionRows.length === 0
      ? []
      : await db
          .select({
            questionId: answers.questionId,
            isCorrect: answers.isCorrect,
          })
          .from(answers)
          .where(
            inArray(
              answers.questionId,
              questionRows.map((question) => question.id),
            ),
          );

  const answerStats = new Map<string, { total: number; hasCorrect: boolean }>();
  for (const answer of answerRows) {
    const current = answerStats.get(answer.questionId) ?? {
      total: 0,
      hasCorrect: false,
    };
    answerStats.set(answer.questionId, {
      total: current.total + 1,
      hasCorrect: current.hasCorrect || answer.isCorrect,
    });
  }

  return catalog.flatMap((stage) =>
    stage.sections.map((section) => ({
      id: section.id,
      title: section.title,
      orderIndex: section.orderIndex,
      published: section.published,
      stageId: stage.id,
      stageTitle: stage.title,
      stageLocale: stage.locale,
      questions: questionRows
        .filter((question) => question.sectionId === section.id)
        .map((question) => ({
          id: question.id,
          prompt: question.prompt,
          orderIndex: question.orderIndex,
          published: question.published,
          answerCount: answerStats.get(question.id)?.total ?? 0,
          hasCorrectAnswer: answerStats.get(question.id)?.hasCorrect ?? false,
        })),
    })),
  );
}

export async function getPublishedStageInLocale(stageId: string, locale: string) {
  return db.query.stages.findFirst({
    where: and(
      eq(stages.id, stageId),
      eq(stages.locale, locale),
      eq(stages.published, true),
    ),
  });
}
