"use server";

import { and, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  AnswerInputSchema,
  LinkedQuestionInputSchema,
  LinkedSectionInputSchema,
  QuestionInputSchema,
  SectionInputSchema,
  StageInputSchema,
  type AdminFormState,
} from "@/lib/admin-schemas";
import { requireAdmin } from "@/lib/dal";
import { db } from "@/lib/db";
import { answers, questions, sections, stages } from "@/lib/db/schema";
import { removeUploadedImage, resolveImageUpload } from "@/lib/uploads";

function publishedFrom(formData: FormData) {
  const value = formData.get("published");
  return value === "on" || value === "true";
}

function correctFrom(formData: FormData) {
  const value = formData.get("isCorrect");
  return value === "on" || value === "true";
}

async function nextStageOrder(locale: string) {
  const last = await db.query.stages.findFirst({
    where: eq(stages.locale, locale),
    orderBy: [desc(stages.orderIndex)],
  });
  return (last?.orderIndex ?? 0) + 1;
}

async function nextSectionOrder(stageId: string) {
  const last = await db.query.sections.findFirst({
    where: eq(sections.stageId, stageId),
    orderBy: [desc(sections.orderIndex)],
  });
  return (last?.orderIndex ?? 0) + 1;
}

async function nextQuestionOrder(sectionId: string) {
  const last = await db.query.questions.findFirst({
    where: eq(questions.sectionId, sectionId),
    orderBy: [desc(questions.orderIndex)],
  });
  return (last?.orderIndex ?? 0) + 1;
}

async function nextAnswerOrder(questionId: string) {
  const last = await db.query.answers.findFirst({
    where: eq(answers.questionId, questionId),
    orderBy: [desc(answers.orderIndex)],
  });
  return (last?.orderIndex ?? 0) + 1;
}

export async function createStage(state: AdminFormState, formData: FormData) {
  await requireAdmin();

  const parsed = StageInputSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    locale: formData.get("locale"),
    description: formData.get("description"),
    orderIndex: formData.get("orderIndex") || (await nextStageOrder(String(formData.get("locale") ?? "fr"))),
    published: publishedFrom(formData),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const image = await resolveImageUpload(formData, "stages");
  if ("error" in image) {
    return { errors: { image: [image.error] } };
  }

  let stageId: string | undefined;

  try {
    const [stage] = await db
      .insert(stages)
      .values({ ...parsed.data, imageUrl: image.url })
      .returning({ id: stages.id });
    stageId = stage.id;
  } catch {
    return {
      message:
        "Impossible d'enregistrer ce stage. Vérifiez que le slug et l'ordre sont uniques pour cette langue.",
    };
  }

  revalidatePath("/admin", "layout");
  redirect(`/admin/stages/${stageId}`);
}

export async function updateStage(
  stageId: string,
  state: AdminFormState,
  formData: FormData,
) {
  await requireAdmin();

  const parsed = StageInputSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    locale: formData.get("locale"),
    description: formData.get("description"),
    orderIndex: formData.get("orderIndex"),
    published: publishedFrom(formData),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const current = await db.query.stages.findFirst({
    where: eq(stages.id, stageId),
    columns: { imageUrl: true },
  });

  const image = await resolveImageUpload(formData, "stages", current?.imageUrl);
  if ("error" in image) {
    return { errors: { image: [image.error] } };
  }

  try {
    await db
      .update(stages)
      .set({ ...parsed.data, imageUrl: image.url })
      .where(eq(stages.id, stageId));
  } catch {
    return {
      message: "Impossible de modifier ce stage. Vérifiez que le slug et l'ordre sont uniques pour cette langue.",
    };
  }

  revalidatePath("/admin", "layout");
  redirect(`/admin/stages/${stageId}`);
}

export async function deleteStage(stageId: string) {
  await requireAdmin();
  const stage = await db.query.stages.findFirst({
    where: eq(stages.id, stageId),
    columns: { imageUrl: true },
    with: { sections: { columns: { imageUrl: true } } },
  });
  await db.delete(stages).where(eq(stages.id, stageId));
  await removeUploadedImage(stage?.imageUrl);
  await Promise.all(
    (stage?.sections ?? []).map((section) => removeUploadedImage(section.imageUrl)),
  );
  revalidatePath("/admin", "layout");
  redirect("/admin/stages");
}

export async function createLinkedSection(
  state: AdminFormState,
  formData: FormData,
) {
  await requireAdmin();

  const stageId = String(formData.get("stageId") ?? "").trim();
  const parsed = LinkedSectionInputSchema.safeParse({
    stageId,
    title: formData.get("title"),
    orderIndex: formData.get("orderIndex") || (stageId ? await nextSectionOrder(stageId) : 1),
    published: publishedFrom(formData),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const image = await resolveImageUpload(formData, "sections");
  if ("error" in image) {
    return { errors: { image: [image.error] } };
  }

  try {
    await db.insert(sections).values({
      title: parsed.data.title,
      orderIndex: parsed.data.orderIndex,
      published: parsed.data.published,
      stageId: parsed.data.stageId,
      imageUrl: image.url,
    });
  } catch {
    return { message: "Impossible d'ajouter cette section. L'ordre est peut-être déjà pris." };
  }

  revalidatePath("/admin", "layout");
  redirect("/admin/sections");
}

export async function createSection(stageId: string, state: AdminFormState, formData: FormData) {
  await requireAdmin();

  const parsed = SectionInputSchema.safeParse({
    title: formData.get("title"),
    orderIndex: formData.get("orderIndex") || (await nextSectionOrder(stageId)),
    published: publishedFrom(formData),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const image = await resolveImageUpload(formData, "sections");
  if ("error" in image) {
    return { errors: { image: [image.error] } };
  }

  let sectionId: string | undefined;

  try {
    const [section] = await db
      .insert(sections)
      .values({ ...parsed.data, stageId, imageUrl: image.url })
      .returning({ id: sections.id });
    sectionId = section.id;
  } catch {
    return { message: "Impossible d'ajouter cette section. L'ordre est peut-être déjà pris." };
  }

  revalidatePath("/admin", "layout");
  redirect(`/admin/sections/${sectionId}`);
}

export async function updateSection(
  sectionId: string,
  state: AdminFormState,
  formData: FormData,
) {
  await requireAdmin();

  const parsed = SectionInputSchema.safeParse({
    title: formData.get("title"),
    orderIndex: formData.get("orderIndex"),
    published: publishedFrom(formData),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const section = await db.query.sections.findFirst({
    where: eq(sections.id, sectionId),
  });
  if (!section) {
    return { message: "Section introuvable." };
  }

  const image = await resolveImageUpload(formData, "sections", section.imageUrl);
  if ("error" in image) {
    return { errors: { image: [image.error] } };
  }

  try {
    await db
      .update(sections)
      .set({ ...parsed.data, imageUrl: image.url })
      .where(eq(sections.id, sectionId));
  } catch {
    return { message: "Impossible de modifier cette section." };
  }

  revalidatePath("/admin", "layout");
  redirect(`/admin/sections/${sectionId}`);
}

export async function deleteSection(sectionId: string, stageId: string) {
  await requireAdmin();
  const section = await db.query.sections.findFirst({
    where: eq(sections.id, sectionId),
    columns: { imageUrl: true },
  });
  await db.delete(sections).where(eq(sections.id, sectionId));
  await removeUploadedImage(section?.imageUrl);
  revalidatePath("/admin", "layout");
  redirect(`/admin/stages/${stageId}`);
}

export async function deleteCatalogSection(sectionId: string) {
  await requireAdmin();
  const section = await db.query.sections.findFirst({
    where: eq(sections.id, sectionId),
    columns: { imageUrl: true },
  });
  await db.delete(sections).where(eq(sections.id, sectionId));
  await removeUploadedImage(section?.imageUrl);
  revalidatePath("/admin", "layout");
  redirect("/admin/sections");
}

export async function createQuestionWithAnswers(
  state: AdminFormState,
  formData: FormData,
) {
  await requireAdmin();

  const sectionId = String(formData.get("sectionId") ?? "").trim();
  const parsed = LinkedQuestionInputSchema.safeParse({
    sectionId,
    prompt: formData.get("prompt"),
    orderIndex:
      formData.get("orderIndex") ||
      (sectionId ? await nextQuestionOrder(sectionId) : 1),
    published: publishedFrom(formData),
  });

  const correctIndex = Number(formData.get("correctAnswer"));
  const choices = formData
    .getAll("answerLabel")
    .map((value, index) => ({ label: String(value).trim(), index }))
    .filter((choice) => choice.label.length > 0);

  const answerErrors: string[] = [];

  if (choices.length === 1) {
    answerErrors.push("Proposez au moins deux réponses.");
  }

  if (
    choices.length > 1 &&
    !choices.some((choice) => choice.index === correctIndex)
  ) {
    answerErrors.push("Cochez la bonne réponse.");
  }

  if (!parsed.success || answerErrors.length > 0) {
    return {
      errors: {
        ...(parsed.success ? {} : parsed.error.flatten().fieldErrors),
        ...(answerErrors.length > 0 ? { answers: answerErrors } : {}),
      },
    };
  }

  let questionId: string;

  try {
    const [question] = await db
      .insert(questions)
      .values(parsed.data)
      .returning({ id: questions.id });
    questionId = question.id;
  } catch {
    return {
      message: "Impossible d'ajouter cette question. L'ordre est peut-être déjà pris.",
    };
  }

  if (choices.length > 0) {
    try {
      await db.insert(answers).values(
        choices.map((choice, position) => ({
          questionId,
          label: choice.label,
          orderIndex: position + 1,
          isCorrect: choice.index === correctIndex,
        })),
      );
    } catch {
      await db.delete(questions).where(eq(questions.id, questionId));
      return {
        message: "Impossible d'enregistrer les réponses. La question n'a pas été créée.",
      };
    }
  }

  revalidatePath("/admin", "layout");
  redirect("/admin/questions");
}

export async function deleteCatalogQuestion(questionId: string) {
  await requireAdmin();
  await db.delete(questions).where(eq(questions.id, questionId));
  revalidatePath("/admin", "layout");
  redirect("/admin/questions");
}

export async function createQuestion(
  sectionId: string,
  state: AdminFormState,
  formData: FormData,
) {
  await requireAdmin();

  const parsed = QuestionInputSchema.safeParse({
    prompt: formData.get("prompt"),
    orderIndex: formData.get("orderIndex") || (await nextQuestionOrder(sectionId)),
    published: publishedFrom(formData),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  try {
    await db.insert(questions).values({ ...parsed.data, sectionId });
  } catch {
    return { message: "Impossible d'ajouter cette question." };
  }

  revalidatePath("/admin", "layout");
  redirect("/admin/questions");
}

export async function updateQuestion(
  questionId: string,
  state: AdminFormState,
  formData: FormData,
) {
  await requireAdmin();

  const sectionId = String(formData.get("sectionId") ?? "").trim();
  const schema = sectionId ? LinkedQuestionInputSchema : QuestionInputSchema;
  const parsed = schema.safeParse({
    ...(sectionId ? { sectionId } : {}),
    prompt: formData.get("prompt"),
    orderIndex: formData.get("orderIndex"),
    published: publishedFrom(formData),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  try {
    await db.update(questions).set(parsed.data).where(eq(questions.id, questionId));
  } catch {
    return {
      message:
        "Impossible de modifier cette question. L'ordre est peut-être déjà pris dans la section choisie.",
    };
  }

  revalidatePath("/admin", "layout");
  redirect("/admin/questions");
}

export async function deleteQuestion(questionId: string, sectionId: string) {
  await requireAdmin();
  await db.delete(questions).where(eq(questions.id, questionId));
  revalidatePath("/admin", "layout");
  redirect(`/admin/sections/${sectionId}`);
}

export async function createAnswer(
  questionId: string,
  state: AdminFormState,
  formData: FormData,
) {
  await requireAdmin();

  const parsed = AnswerInputSchema.safeParse({
    label: formData.get("label"),
    orderIndex: formData.get("orderIndex") || (await nextAnswerOrder(questionId)),
    isCorrect: correctFrom(formData),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  if (parsed.data.isCorrect) {
    await db
      .update(answers)
      .set({ isCorrect: false })
      .where(eq(answers.questionId, questionId));
  }

  try {
    await db.insert(answers).values({ ...parsed.data, questionId });
  } catch {
    return { message: "Impossible d'ajouter cette réponse." };
  }

  revalidatePath("/admin", "layout");
  redirect(`/admin/questions/${questionId}`);
}

export async function updateAnswer(
  answerId: string,
  questionId: string,
  state: AdminFormState,
  formData: FormData,
) {
  await requireAdmin();

  const parsed = AnswerInputSchema.safeParse({
    label: formData.get("label"),
    orderIndex: formData.get("orderIndex"),
    isCorrect: correctFrom(formData),
  });

  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  if (parsed.data.isCorrect) {
    await db
      .update(answers)
      .set({ isCorrect: false })
      .where(and(eq(answers.questionId, questionId), eq(answers.isCorrect, true)));
  }

  try {
    await db.update(answers).set(parsed.data).where(eq(answers.id, answerId));
  } catch {
    return { message: "Impossible de modifier cette réponse." };
  }

  revalidatePath("/admin", "layout");
  redirect(`/admin/questions/${questionId}`);
}

export async function deleteAnswer(answerId: string, questionId: string) {
  await requireAdmin();
  await db.delete(answers).where(eq(answers.id, answerId));
  revalidatePath("/admin", "layout");
  redirect(`/admin/questions/${questionId}`);
}
