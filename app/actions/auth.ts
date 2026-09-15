"use server";

import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import {
  LoginFormSchema,
  SignupFormSchema,
  type AuthFormState,
} from "@/lib/definitions";
import { db } from "@/lib/db";
import { playerProfiles, users } from "@/lib/db/schema";
import { afterLoginPath } from "@/lib/auth-paths";
import { createSession, deleteSession } from "@/lib/session";

export async function signup(state: AuthFormState, formData: FormData) {
  const validatedFields = SignupFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const email = validatedFields.data.email.toLowerCase();
  const passwordHash = await bcrypt.hash(validatedFields.data.password, 10);

  const existing = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (existing) {
    return {
      message: "Un compte existe déjà avec cet email.",
    };
  }

  const [user] = await db
    .insert(users)
    .values({
      email,
      passwordHash,
      role: "PLAYER",
    })
    .returning({ id: users.id, role: users.role });

  if (!user) {
    return {
      message: "Impossible de créer le compte. Réessayez.",
    };
  }

  await createSession({
    userId: user.id,
    role: user.role,
    onboarded: false,
  });

  redirect("/onboarding");
}

export async function login(state: AuthFormState, formData: FormData) {
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const email = validatedFields.data.email.toLowerCase();
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user) {
    return {
      message: "Email ou mot de passe incorrect.",
    };
  }

  const passwordOk = await bcrypt.compare(
    validatedFields.data.password,
    user.passwordHash,
  );

  if (!passwordOk) {
    return {
      message: "Email ou mot de passe incorrect.",
    };
  }

  const profile = await db.query.playerProfiles.findFirst({
    where: eq(playerProfiles.userId, user.id),
  });
  const onboarded = Boolean(profile);
  await createSession({
    userId: user.id,
    role: user.role,
    onboarded,
  });

  redirect(afterLoginPath(user.role, onboarded));
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
