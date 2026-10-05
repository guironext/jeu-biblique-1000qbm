"use server";

import { eq, and, gt } from "drizzle-orm";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { redirect } from "next/navigation";
import {
  ForgotPasswordSchema,
  ResetPasswordSchema,
  type PasswordResetFormState,
} from "@/lib/definitions";
import { db } from "@/lib/db";
import { passwordResetTokens, users } from "@/lib/db/schema";
import { sendEmail, generatePasswordResetEmail } from "@/lib/email";

const TOKEN_EXPIRY_HOURS = 1;

/**
 * Request a password reset. Sends an email with reset link.
 */
export async function requestPasswordReset(
  state: PasswordResetFormState,
  formData: FormData,
): Promise<PasswordResetFormState> {
  const validatedFields = ForgotPasswordSchema.safeParse({
    email: formData.get("email"),
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

  // Don't reveal if user exists (security best practice)
  if (!user) {
    return {
      success: true,
      message:
        "Si un compte existe avec cet email, vous recevrez un lien de réinitialisation.",
    };
  }

  // Delete any existing tokens for this user
  try {
    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.userId, user.id));
  } catch (error) {
    // Table doesn't exist - migration not run
    console.error("Password reset table missing:", error);
    return {
      message:
        "La fonctionnalité de réinitialisation n'est pas configurée. Contactez l'administrateur. (Migration requise: npm run db:push)",
    };
  }

  // Generate secure random token
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

  // Store token in database
  try {
    await db.insert(passwordResetTokens).values({
      userId: user.id,
      token,
      expiresAt,
    });
  } catch (error) {
    console.error("Failed to create password reset token:", error);
    return {
      message:
        "Impossible de générer le lien de réinitialisation. Contactez l'administrateur.",
    };
  }

  // Generate reset URL
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const resetUrl = `${baseUrl}/reset-password?token=${token}`;

  // Send email
  const { html, text } = generatePasswordResetEmail(resetUrl);
  const emailSent = await sendEmail({
    to: email,
    subject: "Réinitialiser votre mot de passe - 1000 QBM+",
    html,
    text,
  });

  if (!emailSent) {
    console.error(`Failed to send password reset email to ${email}`);
    return {
      message:
        "Impossible d'envoyer l'email. Contactez l'administrateur si le problème persiste.",
    };
  }

  return {
    success: true,
    message:
      "Si un compte existe avec cet email, vous recevrez un lien de réinitialisation.",
  };
}

/**
 * Verify a password reset token is valid.
 */
export async function verifyResetToken(token: string): Promise<boolean> {
  if (!token) return false;

  try {
    const resetToken = await db.query.passwordResetTokens.findFirst({
      where: and(
        eq(passwordResetTokens.token, token),
        gt(passwordResetTokens.expiresAt, new Date()),
      ),
    });

    return Boolean(resetToken);
  } catch (error) {
    console.error("Failed to verify reset token (table may not exist):", error);
    return false;
  }
}

/**
 * Reset password using a valid token.
 */
export async function resetPassword(
  token: string,
  state: PasswordResetFormState,
  formData: FormData,
): Promise<PasswordResetFormState> {
  const validatedFields = ResetPasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Find valid token
  let resetToken;
  try {
    resetToken = await db.query.passwordResetTokens.findFirst({
      where: and(
        eq(passwordResetTokens.token, token),
        gt(passwordResetTokens.expiresAt, new Date()),
      ),
    });
  } catch (error) {
    console.error("Failed to query reset token (table may not exist):", error);
    return {
      message:
        "La fonctionnalité de réinitialisation n'est pas configurée. Contactez l'administrateur.",
    };
  }

  if (!resetToken) {
    return {
      message:
        "Le lien de réinitialisation est invalide ou expiré. Demandez un nouveau lien.",
    };
  }

  // Hash new password
  const passwordHash = await bcrypt.hash(validatedFields.data.password, 10);

  // Update user password
  try {
    await db
      .update(users)
      .set({ passwordHash })
      .where(eq(users.id, resetToken.userId));

    // Delete all reset tokens for this user
    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.userId, resetToken.userId));
  } catch (error) {
    console.error("Failed to update password:", error);
    return {
      message:
        "Impossible de réinitialiser le mot de passe. Réessayez ou contactez l'administrateur.",
    };
  }

  redirect("/login?reset=success");
}
