import "server-only";

import { cache } from "react";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { withDbRetry } from "@/lib/db/retry";
import { playerProfiles, users } from "@/lib/db/schema";
import { getSession } from "@/lib/session";

export const getCurrentSession = cache(async () => {
  return getSession();
});

export const requireUser = cache(async () => {
  const session = await getCurrentSession();
  if (!session?.userId) {
    redirect("/login");
  }

  const user = await withDbRetry(async () => {
    const [row] = await db
      .select()
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1);
    return row;
  });

  if (!user) {
    redirect("/login");
  }

  return { session, user };
});

export const requireOnboardedPlayer = cache(async () => {
  const { session, user } = await requireUser();

  if (user.role === "ADMIN") {
    redirect("/admin");
  }

  const profile = await withDbRetry(async () => {
    const [row] = await db
      .select()
      .from(playerProfiles)
      .where(eq(playerProfiles.userId, user.id))
      .limit(1);
    return row;
  });

  if (!profile) {
    redirect("/onboarding");
  }

  return { session, user, profile };
});

export const requireAdmin = cache(async () => {
  const { session, user } = await requireUser();

  if (user.role !== "ADMIN") {
    redirect("/stages");
  }

  return { session, user };
});

export async function getProfile(userId: string) {
  return db.query.playerProfiles.findFirst({
    where: eq(playerProfiles.userId, userId),
  });
}
