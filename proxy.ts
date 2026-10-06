import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/session-crypto";

function isAuthPage(path: string) {
  return path === "/login" || path === "/register";
}

function isPlayerPath(path: string) {
  return (
    path.startsWith("/onboarding") ||
    path.startsWith("/stages") ||
    path.startsWith("/joueur") ||
    path.startsWith("/compte")
  );
}

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const cookie = req.cookies.get("session")?.value;
  const session = await decrypt(cookie);

  if ((isPlayerPath(path) || path.startsWith("/admin")) && !session?.userId) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (path.startsWith("/admin") && session?.role && session.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/joueur", req.nextUrl));
  }

  if (isAuthPage(path) && session?.userId) {
    const destination =
      session.role === "ADMIN"
        ? "/admin"
        : session.onboarded
          ? "/joueur"
          : "/onboarding";
    return NextResponse.redirect(new URL(destination, req.nextUrl));
  }

  if (path.startsWith("/register") && session?.role === "ADMIN") {
    return NextResponse.redirect(new URL("/admin", req.nextUrl));
  }

  if (
    path.startsWith("/stages") &&
    session?.userId &&
    session.role !== "ADMIN" &&
    !session.onboarded
  ) {
    return NextResponse.redirect(new URL("/onboarding", req.nextUrl));
  }

  if (path.startsWith("/compte") && session?.role === "ADMIN") {
    return NextResponse.redirect(new URL("/admin", req.nextUrl));
  }

  if (path.startsWith("/onboarding") && session?.role === "ADMIN") {
    return NextResponse.redirect(new URL("/admin", req.nextUrl));
  }

  if (path.startsWith("/onboarding") && session?.onboarded) {
    return NextResponse.redirect(new URL("/joueur", req.nextUrl));
  }

  if (
    (path.startsWith("/stages") || path.startsWith("/joueur")) &&
    session?.role === "ADMIN"
  ) {
    return NextResponse.redirect(new URL("/admin", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg$).*)"],
};
