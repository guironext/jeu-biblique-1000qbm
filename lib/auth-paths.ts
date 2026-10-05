export function afterLoginPath(role: "PLAYER" | "ADMIN", onboarded: boolean) {
  if (role === "ADMIN") {
    return "/admin";
  }

  return onboarded ? "/joueur" : "/onboarding";
}
