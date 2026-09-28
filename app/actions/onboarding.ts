"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import {
  OnboardingFormSchema,
  type OnboardingFormState,
} from "@/lib/definitions";
import { afterLoginPath } from "@/lib/auth-paths";
import { getProfile, requireUser } from "@/lib/dal";
import { db } from "@/lib/db";
import { playerProfiles, users } from "@/lib/db/schema";
import { ensurePlayerCatalogProgress } from "@/lib/player-progress";
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

  await db.update(users).set({ role }).where(eq(users.id, user.id));

  await db.insert(playerProfiles).values({
    userId: user.id,
    fullName,
    phone,
    countryCode,
    locale,
  });

  if (role === "PLAYER") {
    await ensurePlayerCatalogProgress(user.id, locale);
  }

  await createSession({
    userId: user.id,
    role,
    onboarded: true,
  });

  redirect(afterLoginPath(role, true));
}
