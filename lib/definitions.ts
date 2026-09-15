import { z } from "zod";

export const SignupFormSchema = z.object({
  email: z.email({ error: "Entrez une adresse email valide." }).trim(),
  password: z
    .string()
    .min(8, { error: "Au moins 8 caractères." })
    .regex(/[a-zA-Z]/, { error: "Au moins une lettre." })
    .regex(/[0-9]/, { error: "Au moins un chiffre." }),
});

export const LoginFormSchema = z.object({
  email: z.email({ error: "Entrez une adresse email valide." }).trim(),
  password: z.string().min(1, { error: "Le mot de passe est requis." }),
});

export const OnboardingFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, { error: "Entrez votre nom complet." })
    .max(120, { error: "Le nom est trop long." }),
  phone: z
    .string()
    .trim()
    .min(8, { error: "Entrez un numéro de téléphone valide." })
    .regex(/^[+\d][\d\s.-]{7,19}$/, {
      error: "Utilisez un format international, par exemple +225 07 00 00 00 00.",
    }),
  countryCode: z
    .string()
    .length(2, { error: "Choisissez un pays." }),
  locale: z
    .string()
    .trim()
    .min(2, { error: "Choisissez une langue." })
    .max(8, { error: "Choisissez une langue." }),
  role: z.enum(["PLAYER", "ADMIN"], {
    error: "Choisissez un rôle.",
  }),
});

export type AuthFormState =
  | {
      errors?: {
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

export type OnboardingFormState =
  | {
      errors?: {
        fullName?: string[];
        phone?: string[];
        countryCode?: string[];
        locale?: string[];
        role?: string[];
      };
      message?: string;
    }
  | undefined;

export type SessionPayload = {
  userId: string;
  role: "PLAYER" | "ADMIN";
  onboarded: boolean;
};
