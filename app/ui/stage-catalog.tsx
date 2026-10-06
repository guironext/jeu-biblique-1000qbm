"use client";

import { motion } from "framer-motion";
import {
  MotionLink,
  fadeUp,
  hoverLift,
  stagger,
  tap,
} from "@/app/ui/page-motion";

function LockIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
      />
    </svg>
  );
}

export type StageCardItem = {
  id: string;
  title: string;
  description: string;
  status: "LOCKED" | "UNLOCKED" | "COMPLETED";
  imageUrl?: string | null;
  completedSections?: number;
  totalSections?: number;
};

export type StageCatalogTranslations = {
  title: string;
  subtitle: string;
  description1: string;
  description2: string;
  noStagesMessage: string;
  statusLocked: string;
  statusUnlocked: string;
  statusCompleted: string;
  playButton: string;
  lockedMessage: string;
  progressLabel: string;
};

export function StageCatalog({
  stages,
  headingClassName,
  translations,
}: {
  stages: StageCardItem[];
  headingClassName: string;
  translations: StageCatalogTranslations;
}) {
  return (
    <motion.main
      className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6"
      initial="hidden"
      animate="show"
      variants={stagger}
    >
      <motion.p
        variants={fadeUp}
        className="text-sm font-medium tracking-[0.18em] uppercase text-olive-800"
      >
        {translations.title}
      </motion.p>
      <motion.h1
        variants={fadeUp}
        className={`${headingClassName} mt-3 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl`}
      >
        {translations.subtitle}
      </motion.h1>
      <motion.div
        variants={fadeUp}
        className="mt-6 space-y-4 text-base leading-7 text-stone-700"
      >
        <p>{translations.description1}</p>
        <p>{translations.description2}</p>
      </motion.div>

      {stages.length === 0 ? (
        <motion.p
          variants={fadeUp}
          className="mt-10 rounded-xl border border-stone-200 bg-white p-5 text-sm leading-6 text-stone-600"
        >
          {translations.noStagesMessage}
        </motion.p>
      ) : (
        <motion.div
          className="mt-10 grid gap-5 md:grid-cols-2 md:gap-6"
          variants={stagger}
        >
          {stages.map((stage) => {
            const isLocked = stage.status === "LOCKED";
            const isCompleted = stage.status === "COMPLETED";

            return (
              <motion.div
                key={stage.id}
                variants={fadeUp}
                whileHover={!isLocked ? hoverLift : undefined}
                className={`flex flex-col overflow-hidden rounded-xl border shadow-sm transition-all ${
                  isLocked
                    ? "border-stone-200 bg-stone-50"
                    : "border-olive-200 bg-white hover:shadow-md"
                }`}
              >
                {stage.imageUrl ? (
                  <div className="relative h-32 w-full sm:h-36">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={stage.imageUrl}
                      alt=""
                      className={`h-full w-full object-cover ${isLocked ? "opacity-50" : ""}`}
                    />
                    {isLocked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-stone-900/20">
                        <LockIcon className="h-10 w-10 text-white/90" />
                      </div>
                    )}
                  </div>
                ) : isLocked ? (
                  <div className="flex h-32 w-full items-center justify-center bg-stone-100 sm:h-36">
                    <LockIcon className="h-10 w-10 text-stone-400" />
                  </div>
                ) : null}

                <div className="flex flex-1 flex-col p-4 sm:p-5">
                  <div className="mb-2 flex items-center justify-between">
                    <p
                      className={`text-xs font-medium uppercase tracking-wide ${
                        isLocked
                          ? "text-stone-500"
                          : isCompleted
                            ? "text-green-700"
                            : "text-olive-800"
                      }`}
                    >
                      {isLocked
                        ? translations.statusLocked
                        : isCompleted
                          ? translations.statusCompleted
                          : translations.statusUnlocked}
                    </p>
                    {!isLocked &&
                      stage.totalSections &&
                      stage.totalSections > 0 && (
                        <p className="text-xs font-medium text-stone-600">
                          {translations.progressLabel
                            .replace(
                              "{completed}",
                              String(stage.completedSections ?? 0),
                            )
                            .replace("{total}", String(stage.totalSections))}
                        </p>
                      )}
                  </div>

                  <h2
                    className={`${headingClassName} text-lg font-semibold sm:text-xl ${
                      isLocked ? "text-stone-600" : "text-stone-900"
                    }`}
                  >
                    {stage.title}
                  </h2>

                  <p
                    className={`mt-2 h-20 overflow-y-auto overscroll-contain pr-1 text-sm leading-5 [scrollbar-width:thin] ${
                      isLocked ? "text-stone-500" : "text-stone-600"
                    }`}
                  >
                    {stage.description}
                  </p>

                  <div className="mt-4">
                    {isLocked ? (
                      <div className="flex items-center gap-2 text-sm text-stone-500">
                        <LockIcon className="h-4 w-4" />
                        <span>{translations.lockedMessage}</span>
                      </div>
                    ) : (
                      <MotionLink
                        href={`/joueur/stages/${stage.id}`}
                        whileHover={hoverLift}
                        whileTap={tap}
                        className="inline-flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-olive-600 to-olive-400 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-olive-700 hover:to-olive-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olive-600"
                      >
                        {translations.playButton}
                      </MotionLink>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </motion.main>
  );
}
