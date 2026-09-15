import "server-only";

import { cookies } from "next/headers";
import { decrypt, encrypt } from "@/lib/session-crypto";
import type { SessionPayload } from "@/lib/definitions";

const SESSION_COOKIE = "session";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

export async function createSession(payload: SessionPayload) {
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
  const session = await encrypt(payload);
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(SESSION_COOKIE)?.value;
  return decrypt(cookie);
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
