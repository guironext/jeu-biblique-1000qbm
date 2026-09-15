"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import {
  OnboardingFormSchema,
  type OnboardingFormState,
} from "@/lib/definitions";
import {
  getPublishedLocales,
  getPublishedStagesForLocale,
} from "@/lib/catalog";
import { afterLoginPath } from "@/lib/auth-paths";
import { getProfile, requireUser } from "@/lib/dal";
import { db } from "@/lib/db";
import {
  playerProfiles,
  sectionProgress,
  stageProgress,
  users,
} from "@/lib/db/schema";
import { createSession } from "@/lib/session";

export async function completeOnboarding(
  state: OnboardingFormState,
  formData: FormData,
): Promise<OnboardingFormState> {
  const { user } = await requireUser();
  const existingProfile = await getProfile(user.id);

  if (existingProfile) {
    redirect(afterLoginPath(user.role, true));
  }

  const validatedFields = OnboardingFormSchema.safeParse({
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
    countryCode: formData.get("countryCode"),
    locale: formData.get("locale"),
    role: formData.get("role"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { fullName, phone, countryCode, locale, role } = validatedFields.data;
  const publishedLocales = await getPublishedLocales();

  if (!publishedLocales.includes(locale)) {
    return {
      errors: {
        locale: [
          "Aucun stage n'a encore été chargé dans cette langue.",
        ],
      },
    };
  }

  await db.update(users).set({ role }).where(eq(users.id, user.id));

  await db.insert(playerProfiles).values({
    userId: user.id,
    fullName,
    phone,
    countryCode,
    locale,
  });

  if (role === "PLAYER") {
    const catalog = await getPublishedStagesForLocale(locale);

    if (catalog.length > 0) {
      await db.insert(stageProgress).values(
        catalog.map((stage, index) => ({
          userId: user.id,
          stageId: stage.id,
          status: index === 0 ? ("UNLOCKED" as const) : ("LOCKED" as const),
        })),
      );

      const firstStage = catalog[0];
      if (firstStage.sections.length > 0) {
        await db.insert(sectionProgress).values(
          firstStage.sections.map((section, index) => ({
            userId: user.id,
            sectionId: section.id,
            status: index === 0 ? ("UNLOCKED" as const) : ("LOCKED" as const),
          })),
        );
      }
    }
  }

  await createSession({
    userId: user.id,
    role,
    onboarded: true,
  });

  redirect(afterLoginPath(role, true));
}
