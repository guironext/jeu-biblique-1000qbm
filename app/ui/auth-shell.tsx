"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Source_Serif_4 } from "next/font/google";
import { easeOutSoft, fadeUp, stagger } from "@/app/ui/page-motion";

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["600", "700"],
});

export function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-16">
      <motion.div
        className="w-full max-w-md"
        initial="hidden"
        animate="show"
        variants={stagger}
      >
        <motion.p
          variants={fadeUp}
          className="text-sm font-medium tracking-[0.18em] text-olive-700 uppercase"
        >
          {eyebrow ?? "1000 QBM+"}
        </motion.p>
        <motion.h1
          variants={fadeUp}
          className={`${sourceSerif.className} mt-3 text-3xl font-semibold tracking-tight text-stone-900`}
        >
          {title}
        </motion.h1>
        <motion.p variants={fadeUp} className="mt-3 text-base leading-7 text-stone-600">
          {subtitle}
        </motion.p>
        <motion.div variants={fadeUp} className="mt-8">
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}

export function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string[];
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-stone-800">
        {label}
      </label>
      {children}
      <AnimatePresence>
        {error ? (
          <motion.p
            key={error[0]}
            role="alert"
            className="text-sm text-red-700"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: easeOutSoft }}
          >
            {error[0]}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export const fieldClassName =
  "h-11 w-full rounded-lg border border-stone-300 bg-white px-3 text-base text-stone-900 outline-none transition-colors focus:border-olive-700 focus:ring-2 focus:ring-olive-700/20";

export const primaryButtonClassName =
  "inline-flex h-11 w-full items-center justify-center rounded-lg bg-olive-800 px-4 text-sm font-semibold text-white transition-colors hover:bg-olive-900 disabled:cursor-not-allowed disabled:opacity-60";
