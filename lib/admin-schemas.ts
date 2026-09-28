import { z } from "zod";
import { LOCALE_CODES } from "@/lib/locales";

export const StageInputSchema = z.object({
  title: z.string().trim().min(2, { error: "Le titre est trop court." }),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      error: "Slug en minuscules, chiffres et tirets uniquement.",
    }),
  locale: z.enum(LOCALE_CODES, {
    error: "Choisissez une langue.",
  }),
  description: z
    .string()
    .trim()
    .min(8, { error: "Ajoutez une description." }),
  orderIndex: z.coerce.number().int().min(1, { error: "Ordre minimum : 1." }),
  published: z.boolean(),
});

export const AdminUserEmailSchema = z.object({
  email: z
    .email({ error: "Entrez une adresse email valide." })
    .trim()
    .transform((email) => email.toLowerCase()),
});

export const AdminUserProfileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, { error: "Entrez un nom complet." })
    .max(120, { error: "Le nom est trop long." }),
  phone: z
    .string()
    .trim()
    .min(8, { error: "Entrez un numéro de téléphone valide." })
    .regex(/^[+\d][\d\s.-]{7,19}$/, {
      error: "Utilisez un numéro au format international.",
    }),
  countryCode: z.string().length(2, { error: "Choisissez un pays." }),
  locale: z.enum(LOCALE_CODES, { error: "Choisissez une langue." }),
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
