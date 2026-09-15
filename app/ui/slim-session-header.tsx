"use client";

import { logout } from "@/app/actions/auth";

export function SlimSessionHeader({
  email,
  badge,
}: {
  email: string;
  badge: string;
}) {
  return (
    <header className="sticky top-0 z-10 border-b border-olive-200/70 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-8 sm:py-4 lg:px-10">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <p className="truncate text-sm font-medium tracking-[0.18em] text-olive-800 uppercase">
            1000 QBM+
          </p>
          <span className="rounded-full bg-olive-50 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-olive-800 uppercase">
            {badge}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <p className="hidden text-sm text-stone-600 sm:block">{email}</p>
          <form action={logout}>
            <button
              type="submit"
              className="text-sm font-medium text-stone-700 underline-offset-4 hover:underline"
            >
              Déconnexion
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
