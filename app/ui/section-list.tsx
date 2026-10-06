"use client";

import { motion } from "framer-motion";
import {
  MotionLink,
  fadeUp,
  hoverLift,
  stagger,
  tap,
} from "@/app/ui/page-motion";
import { CoverThumb } from "@/app/ui/image-picker";

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
      className="mx-auto w-full max-w-3xl flex-1 px-4 py-10"
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

      <motion.ol className="mt-10 flex flex-col gap-3" variants={stagger}>
        {sections.map((section) => {
          const playable = section.status !== "LOCKED";

          return (
            <motion.li
              key={section.id}
              variants={fadeUp}
              whileHover={playable ? hoverLift : undefined}
              className={`flex items-center justify-between gap-4 rounded-xl border px-5 py-4 ${
                playable
                  ? "border-olive-200 bg-white"
                  : "border-stone-200 bg-stone-100"
              }`}
            >
              <div className="flex min-w-0 items-center gap-3">
                <CoverThumb src={section.imageUrl} alt="" />
                <div className="min-w-0">
                <p className="text-xs font-medium tracking-wide text-olive-800 uppercase">
                  {section.status === "LOCKED"
                    ? "Verrouillée"
                    : section.status === "PASSED"
                      ? "Réussie"
                      : section.status === "FAILED"
                        ? "À reprendre"
                        : "Active"}
                </p>
                <h2 className="mt-1 truncate font-medium text-stone-900">
                  {section.title}
                </h2>
                </div>
              </div>
              {playable ? (
                <MotionLink
                  href={section.href}
                  whileHover={hoverLift}
                  whileTap={tap}
                  className="inline-flex h-10 items-center rounded-lg bg-olive-800 px-4 text-sm font-semibold text-white hover:bg-olive-900"
                >
                  Jouer
                </MotionLink>
              ) : (
                <span className="text-sm text-stone-500">Verrouillée</span>
              )}
            </motion.li>
          );
        })}
      </motion.ol>
    </motion.main>
  );
}
