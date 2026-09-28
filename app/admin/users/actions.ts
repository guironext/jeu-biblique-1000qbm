"use server";

import { and, eq, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  AdminUserEmailSchema,
  AdminUserProfileSchema,
  type AdminFormState,
} from "@/lib/admin-schemas";
import { requireAdmin } from "@/lib/dal";
import { db } from "@/lib/db";
import { playerProfiles, users } from "@/lib/db/schema";

export async function updateUser(
  userId: string,
  _state: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  await requireAdmin();

  const [target] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  if (!target) {
    return { message: "Utilisateur introuvable." };
  }

  const emailResult = AdminUserEmailSchema.safeParse({
    email: formData.get("email"),
  });
  if (!emailResult.success) {
    return { errors: emailResult.error.flatten().fieldErrors };
  }

  const [profile] = await db
    .select({ userId: playerProfiles.userId })
    .from(playerProfiles)
    .where(eq(playerProfiles.userId, userId))
    .limit(1);

  let profileData:
    | ReturnType<typeof AdminUserProfileSchema.parse>
    | undefined;
  if (profile) {
    const profileResult = AdminUserProfileSchema.safeParse({
      fullName: formData.get("fullName"),
      phone: formData.get("phone"),
      countryCode: formData.get("countryCode"),
      locale: formData.get("locale"),
    });
    if (!profileResult.success) {
      return { errors: profileResult.error.flatten().fieldErrors };
    }
    profileData = profileResult.data;
  }

  const duplicate = await db.query.users.findFirst({
    where: and(ne(users.id, userId), eq(users.email, emailResult.data.email)),
    columns: { id: true },
  });
  if (duplicate) {
    return { errors: { email: ["Cette adresse email est déjà utilisée."] } };
  }

  try {
    await db
      .update(users)
      .set({ email: emailResult.data.email })
      .where(eq(users.id, userId));
    if (profileData) {
      await db
        .update(playerProfiles)
        .set(profileData)
        .where(eq(playerProfiles.userId, userId));
    }
  } catch {
    return { message: "Impossible de modifier cet utilisateur." };
  }

  revalidatePath("/admin/users");
  redirect(`/admin/users/${userId}`);
}

export async function deleteUser(userId: string) {
  const { user: admin } = await requireAdmin();
  if (admin.id === userId) {
    return;
  }

  await db.delete(users).where(eq(users.id, userId));
  revalidatePath("/admin/users");
  redirect("/admin/users");
}