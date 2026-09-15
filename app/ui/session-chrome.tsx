"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { logout } from "@/app/actions/auth";
import { BrandLogo } from "@/app/ui/brand-logo";
import { easeOutSoft } from "@/app/ui/page-motion";

export type SessionNavLink = {
  href: string;
  label: string;
};

function isNavActive(pathname: string, href: string) {
  if (href === "/admin") {
    return pathname === "/admin";
  }
  if (href === "/admin/stages") {
    return pathname.startsWith("/admin/stages");
  }
  if (href === "/admin/sections") {
    return pathname.startsWith("/admin/sections");
  }
  if (href === "/admin/questions") {
    return pathname.startsWith("/admin/questions");
  }
  if (href === "/stages") {
    return pathname.startsWith("/stages");
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SessionChrome({
  brand,
  badge,
  email,
  links,
  variant,
}: {
  brand: string;
  badge?: string;
  email: string;
  links: SessionNavLink[];
  variant: "player" | "admin";
}) {
  const pathname = usePathname();
  const isAdmin = variant === "admin";
  const homeHref = isAdmin ? "/admin" : "/stages";

  return (
    <motion.header
      className={
        isAdmin
          ? "sticky top-0 z-20 border-b border-stone-800/90 bg-stone-950/92 text-stone-100 backdrop-blur-md"
          : "sticky top-0 z-20 border-b border-stone-200/80 bg-white/90 text-stone-900 backdrop-blur-md"
      }
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: easeOutSoft }}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col px-4 pt-[max(0.5rem,env(safe-area-inset-top))] sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 py-2.5 sm:gap-4 sm:py-3">
          <Link
            href={homeHref}
            className="flex min-w-0 items-center gap-2.5 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-olive-700/50"
          >
            <BrandLogo size="header" tone={isAdmin ? "dark" : "light"} />
            <span className="sr-only">{brand}</span>
            {badge ? (
              <span
                className={
                  isAdmin
                    ? "rounded-full bg-amber-200/15 px-2 py-0.5 text-[10px] font-semibold tracking-[0.14em] text-amber-200 uppercase sm:text-[11px]"
                    : "rounded-full bg-olive-50 px-2 py-0.5 text-[10px] font-semibold tracking-[0.14em] text-olive-800 uppercase sm:text-[11px]"
                }
              >
                {badge}
              </span>
            ) : null}
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-1 sm:flex">
            {links.map((link) => {
              const active = isNavActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex h-10 items-center rounded-lg px-3 text-sm font-medium transition-colors ${
                    isAdmin
                      ? active
                        ? "bg-white/10 text-white"
                        : "text-stone-300 hover:bg-white/10 hover:text-white"
                      : active
                        ? "bg-olive-50 text-olive-900"
                        : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-3 sm:ml-0">
            <p
              className={`hidden max-w-44 truncate text-sm lg:block ${
                isAdmin ? "text-stone-400" : "text-stone-600"
              }`}
            >
              {email}
            </p>
            <form action={logout}>
              <button
                type="submit"
                className={`inline-flex h-10 items-center rounded-lg px-2.5 text-sm font-medium underline-offset-4 hover:underline sm:px-0 ${
                  isAdmin ? "text-stone-300" : "text-stone-700"
                }`}
              >
                Déconnexion
              </button>
            </form>
          </div>
        </div>

        <nav
          aria-label="Navigation principale"
          className={`mb-2.5 grid gap-1 rounded-xl p-1 sm:hidden ${
            isAdmin ? "bg-white/10" : "bg-stone-100"
          }`}
          style={{
            gridTemplateColumns: `repeat(${links.length}, minmax(0, 1fr))`,
          }}
        >
          {links.map((link) => {
            const active = isNavActive(pathname, link.href);
            const compactLabel =
              link.href === "/admin"
                ? "Accueil"
                : link.href === "/admin/sections"
                  ? "Sections"
                  : link.label;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`inline-flex h-11 items-center justify-center rounded-lg px-1.5 text-center font-medium transition-colors ${
                  links.length > 3 ? "text-xs" : "text-[13px]"
                } ${
                  isAdmin
                    ? active
                      ? "bg-stone-800 text-white shadow-sm"
                      : "text-stone-300"
                    : active
                      ? "bg-white text-olive-900 shadow-sm"
                      : "text-stone-600"
                }`}
              >
                {compactLabel}
              </Link>
            );
          })}
        </nav>
      </div>
    </motion.header>
  );
}
