"use client";

import { motion } from "framer-motion";
import {
  MotionLink,
  fadeUp,
  hoverLift,
  stagger,
  tap,
} from "@/app/ui/page-motion";

export type SectionItem = {
  id: string;
  title: string;
  status: "LOCKED" | "UNLOCKED" | "FAILED" | "PASSED";
  href: string;
  imageUrl?: string | null;
};

export function SectionList({
  stageTitle,
  headingClassName,
  sections,
}: {
  stageTitle: string;
  headingClassName: string;
  sections: SectionItem[];
}) {
  return (
    <motion.main
      className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6"
      initial="hidden"
      animate="show"
      variants={stagger}
    >
      <motion.div variants={fadeUp}>
        <MotionLink
          href="/joueur/stages"
          whileHover={{ x: -2 }}
          className="text-sm font-medium text-olive-800 underline-offset-4 hover:underline"
        >
          Retour aux stages
        </MotionLink>
      </motion.div>
      <motion.h1
        variants={fadeUp}
        className={`${headingClassName} mt-4 text-3xl font-semibold tracking-tight text-stone-900`}
      >
        {stageTitle}
      </motion.h1>
      <motion.p
        variants={fadeUp}
        className="mt-3 max-w-2xl text-base leading-7 text-stone-600"
      >
        Seule la première section est active au départ. Chaque victoire (au
        moins 80 %) ouvre la suivante.
      </motion.p>

      <motion.ol
        className="mt-10 grid gap-5 md:grid-cols-2 md:gap-6"
        variants={stagger}
      >
        {sections.map((section, index) => {
          const playable = section.status !== "LOCKED";
          const statusLabel =
            section.status === "LOCKED"
              ? "Verrouillée"
              : section.status === "PASSED"
                ? "Réussie"
                : section.status === "FAILED"
                  ? "À reprendre"
                  : "Active";

          return (
            <motion.li
              key={section.id}
              variants={fadeUp}
              whileHover={playable ? hoverLift : undefined}
              className={`flex flex-col overflow-hidden rounded-xl border shadow-sm transition-shadow ${
                playable
                  ? "border-olive-200 bg-white hover:shadow-md"
                  : "border-stone-200 bg-stone-50"
              }`}
            >
              {/* Titre en haut */}
              <div className="px-4 pt-4 pb-3 sm:px-5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-stone-500">
                    Section {index + 1}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase ${
                      section.status === "PASSED"
                        ? "bg-green-100 text-green-800"
                        : section.status === "FAILED"
                          ? "bg-amber-100 text-amber-800"
                          : playable
                            ? "bg-olive-100 text-olive-800"
                            : "bg-stone-200 text-stone-600"
                    }`}
                  >
                    {statusLabel}
                  </span>
                </div>
                <h2
                  className={`${headingClassName} mt-2 line-clamp-2 text-lg font-semibold sm:text-xl ${
                    playable ? "text-stone-900" : "text-stone-500"
                  }`}
                >
                  {section.title}
                </h2>
              </div>

              {/* Image au milieu */}
              <div className="relative h-36 w-full bg-stone-100 sm:h-40">
                {section.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={section.imageUrl}
                    alt=""
                    className={`h-full w-full object-cover ${playable ? "" : "opacity-50 grayscale"}`}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-olive-50 to-stone-100">
                    <span className={`${headingClassName} text-4xl font-semibold text-olive-300`}>
                      {index + 1}
                    </span>
                  </div>
                )}
                {!playable && (
                  <div className="absolute inset-0 flex items-center justify-center bg-stone-900/20">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-10 w-10 text-white/90"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* Bouton en bas */}
              <div className="mt-auto p-4 sm:p-5">
                {playable ? (
                  <MotionLink
                    href={section.href}
                    whileHover={hoverLift}
                    whileTap={tap}
                    className="inline-flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-olive-600 to-olive-400 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-olive-700 hover:to-olive-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olive-600"
                  >
                    {section.status === "PASSED"
                      ? "Rejouer"
                      : section.status === "FAILED"
                        ? "Réessayer"
                        : "Jouer"}
                  </MotionLink>
                ) : (
                  <span
                    aria-disabled="true"
                    className="inline-flex w-full cursor-not-allowed items-center justify-center rounded-lg bg-stone-200 px-4 py-2.5 text-sm font-semibold text-stone-500"
                  >
                    Verrouillée
                  </span>
                )}
              </div>
            </motion.li>
          );
        })}
      </motion.ol>
    </motion.main>
  );
}
