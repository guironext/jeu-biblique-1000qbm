"use client";

import { useEffect, useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createLinkedSection } from "@/app/admin/actions";
import { SectionForm } from "@/app/admin/forms";
import {
  MotionLink,
  easeOutSoft,
  fadeUp,
  hoverLift,
  stagger,
  tap,
} from "@/app/ui/page-motion";
import { SectionRowActions } from "@/app/ui/section-row-actions";
import { CoverThumb } from "@/app/ui/image-picker";

export type AdminSectionItem = {
  id: string;
  title: string;
  orderIndex: number;
  published: boolean;
  questionCount: number;
  imageUrl?: string | null;
};

export type AdminSectionStageGroup = {
  id: string;
  title: string;
  localeLabel: string;
  published: boolean;
  orderIndex: number;
  sections: AdminSectionItem[];
};

export function AdminSectionsBoard({
  stages,
}: {
  stages: AdminSectionStageGroup[];
}) {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const stageOptions = stages.map((stage) => ({
    id: stage.id,
    title: stage.title,
    localeLabel: stage.localeLabel,
  }));
  const sectionCount = stages.reduce(
    (total, stage) => total + stage.sections.length,
    0,
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <motion.div
      className="flex flex-col gap-6 sm:gap-8"
      initial="hidden"
      animate="show"
      variants={stagger}
    >
      <motion.section
        variants={fadeUp}
        className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-[0_18px_50px_-32px_rgba(28,25,23,0.45)]"
      >
        <div className="bg-stone-900 px-5 py-4 sm:px-7 sm:py-5">
          <p className="text-[11px] font-semibold tracking-[0.2em] text-amber-200 uppercase">
            Contenu
          </p>
          <h1 className="mt-2 text-[1.85rem] leading-none font-semibold tracking-tight text-white sm:text-4xl">
            Sections
          </h1>
        </div>
        <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-end sm:justify-between sm:px-7 sm:py-6">
          <p className="max-w-xl text-[0.95rem] leading-7 text-stone-600">
            Chaque section appartient à un stage. {sectionCount} section
            {sectionCount > 1 ? "s" : ""} répartie
            {sectionCount > 1 ? "s" : ""} dans {stages.length} stage
            {stages.length > 1 ? "s" : ""}.
          </p>
          <motion.button
            type="button"
            whileHover={hoverLift}
            whileTap={tap}
            onClick={() => setOpen(true)}
            disabled={stages.length === 0}
            className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-stone-900 px-5 text-sm font-semibold text-white hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-44"
          >
            Créer Section
          </motion.button>
        </div>
      </motion.section>

      {stages.length === 0 ? (
        <motion.p
          variants={fadeUp}
          className="rounded-2xl border border-dashed border-stone-200 bg-white px-5 py-8 text-sm leading-6 text-stone-600"
        >
          Aucun stage pour le moment. Créez d&apos;abord un stage, puis
          rattachez-y des sections.
        </motion.p>
      ) : (
        <div className="flex flex-col gap-5">
          {stages.map((stage) => (
            <motion.section
              key={stage.id}
              variants={fadeUp}
              className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-[0_10px_30px_-24px_rgba(28,25,23,0.45)]"
            >
              <div className="flex items-start justify-between gap-3 border-b border-stone-100 bg-stone-50/80 px-4 py-3.5 sm:px-5 sm:py-4">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold tracking-[0.14em] text-stone-500 uppercase">
                    {stage.localeLabel} · ordre {stage.orderIndex}
                  </p>
                  <h2 className="mt-1 truncate text-lg font-semibold tracking-tight text-stone-900">
                    {stage.title}
                  </h2>
                  <p className="mt-0.5 text-sm text-stone-500">
                    {stage.sections.length} section
                    {stage.sections.length > 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <span
                    className={
                      stage.published
                        ? "rounded-full bg-olive-50 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-olive-800 uppercase"
                        : "rounded-full bg-stone-200/70 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-stone-600 uppercase"
                    }
                  >
                    {stage.published ? "Publié" : "Brouillon"}
                  </span>
                  <MotionLink
                    href={`/admin/stages/${stage.id}`}
                    whileTap={tap}
                    className="text-sm font-medium text-stone-700 underline-offset-4 hover:underline"
                  >
                    Stage
                  </MotionLink>
                </div>
              </div>

              {stage.sections.length === 0 ? (
                <p className="px-4 py-6 text-sm text-stone-500 sm:px-5">
                  Aucune section dans ce stage.
                </p>
              ) : (
                <ul className="divide-y divide-stone-100">
                  {stage.sections.map((section) => (
                    <li
                      key={section.id}
                      className="flex items-center gap-3 px-4 py-3.5 sm:px-5"
                    >
                      <CoverThumb src={section.imageUrl} alt="" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-stone-900">
                          {section.title}
                        </p>
                        <p className="mt-0.5 text-xs text-stone-500 sm:text-sm">
                          Ordre {section.orderIndex} · {section.questionCount}{" "}
                          question
                          {section.questionCount > 1 ? "s" : ""} ·{" "}
                          {section.published ? "Publiée" : "Brouillon"}
                        </p>
                      </div>
                      <SectionRowActions sectionId={section.id} />
                    </li>
                  ))}
                </ul>
              )}
            </motion.section>
          ))}
        </div>
      )}

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-40 flex items-end justify-center sm:items-center sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              aria-label="Fermer"
              className="absolute inset-0 bg-stone-950/50"
              onClick={() => setOpen(false)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 32, opacity: 0 }}
              transition={{ duration: 0.28, ease: easeOutSoft }}
              className="relative z-10 max-h-[min(92dvh,40rem)] w-full overflow-y-auto rounded-t-3xl bg-white p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl sm:max-w-lg sm:rounded-2xl sm:p-6"
            >
              <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-stone-200 sm:hidden" />
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold tracking-[0.16em] text-stone-500 uppercase">
                    Nouvelle section
                  </p>
                  <h2
                    id={titleId}
                    className="mt-1 text-xl font-semibold tracking-tight text-stone-900"
                  >
                    Créer Section
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex size-10 items-center justify-center rounded-lg text-stone-500 hover:bg-stone-100 hover:text-stone-800"
                  aria-label="Fermer le formulaire"
                >
                  <svg viewBox="0 0 20 20" fill="none" aria-hidden className="size-5">
                    <path
                      d="M5 5l10 10M15 5 5 15"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
              <p className="mt-2 mb-5 text-sm leading-6 text-stone-600">
                Choisissez le stage, puis donnez un titre. L&apos;ordre est
                attribué automatiquement s&apos;il est laissé vide.
              </p>
              <SectionForm
                action={createLinkedSection}
                stages={stageOptions}
                submitLabel="Créer la section"
              />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
