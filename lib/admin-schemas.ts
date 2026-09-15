import { z } from "zod";

export const StageInputSchema = z.object({
  title: z.string().trim().min(2, { error: "Le titre est trop court." }),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      error: "Slug en minuscules, chiffres et tirets uniquement.",
    }),
  locale: z.string().trim().min(2, { error: "Indiquez une langue (ex. fr)." }).max(8),
  description: z
    .string()
    .trim()
    .min(8, { error: "Ajoutez une description." }),
  orderIndex: z.coerce.number().int().min(1, { error: "Ordre minimum : 1." }),
  published: z.boolean(),
});

export const SectionInputSchema = z.object({
  title: z.string().trim().min(2, { error: "Le titre est trop court." }),
  orderIndex: z.coerce.number().int().min(1, { error: "Ordre minimum : 1." }),
  published: z.boolean(),
});

export const LinkedSectionInputSchema = SectionInputSchema.extend({
  stageId: z.string().uuid({ error: "Choisissez le stage de rattachement." }),
});

export const QuestionInputSchema = z.object({
  prompt: z.string().trim().min(4, { error: "La question est trop courte." }),
  orderIndex: z.coerce.number().int().min(1, { error: "Ordre minimum : 1." }),
  published: z.boolean(),
});

export const LinkedQuestionInputSchema = QuestionInputSchema.extend({
  sectionId: z.string().uuid({ error: "Choisissez la section de rattachement." }),
});

export const AnswerInputSchema = z.object({
  label: z.string().trim().min(1, { error: "La réponse est vide." }),
  orderIndex: z.coerce.number().int().min(1, { error: "Ordre minimum : 1." }),
  isCorrect: z.boolean(),
});

export type AdminFormState =
  | {
      errors?: Record<string, string[] | undefined>;
      message?: string;
    }
  | undefined;
