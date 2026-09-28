"use client";

import { motion } from "framer-motion";
import {
  MotionLink,
  fadeUp,
  hoverLift,
  stagger,
  tap,
} from "@/app/ui/page-motion";
import { StageRowActions } from "@/app/ui/stage-row-actions";

export type AdminStat = {
  label: string;
  value: number;
  hint: string;
  href: string;
};

export type AdminStagePreview = {
  id: string;
  title: string;
  localeLabel: string;
  published: boolean;
  sectionCount: number;
  orderIndex: number;
  imageUrl?: string | null;
};

function Chevron({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className={className}>
      <path
        d="M7.5 4.5 13 10l-5.5 5.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconStages() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-5">
      <path
        d="M4 7.5h16M4 12h16M4 16.5h10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconSections() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-5">
      <rect
        x="4"
        y="5"
        width="7"
        height="14"
        rx="1.6"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <rect
        x="13"
        y="5"
        width="7"
        height="9"
        rx="1.6"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function IconQuestions() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-5">
      <path
        d="M9.4 9.2a2.6 2.6 0 1 1 3.4 2.5c-.6.2-1 .8-1 1.5v.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="11.8" cy="17" r="1.1" fill="currentColor" />
      <circle cx="12" cy="12" r="8.4" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function IconPlus() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-5">
      <path
        d="M12 6v12M6 12h12"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

const icons: Record<string, React.ReactNode> = {
  "/admin/stages": <IconStages />,
  "/admin/sections": <IconSections />,
  "/admin/questions": <IconQuestions />,
};

export function AdminDashboard({
  headingClassName,
  publishedStages,
  totalStages,
  stats,
  stages,
}: {
  headingClassName: string;
  publishedStages: number;
  totalStages: number;
  stats: AdminStat[];
  stages: AdminStagePreview[];
}) {
  const publishRatio =
    totalStages === 0 ? 0 : Math.round((publishedStages / totalStages) * 100);
  const drafts = Math.max(totalStages - publishedStages, 0);

  return (
    <motion.div
      className="flex flex-col gap-5 sm:gap-7"
      initial="hidden"
      animate="show"
      variants={stagger}
    >
      <motion.section
        variants={fadeUp}
        className="relative overflow-hidden rounded-[1.6rem] border border-stone-800 bg-stone-950 text-white shadow-[0_24px_60px_-28px_rgba(28,25,23,0.7)]"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 right-0 h-56 w-56 rounded-full bg-olive-800/35 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-28 left-8 h-48 w-48 rounded-full bg-amber-300/15 blur-3xl"
        />
        <div className="relative flex flex-col gap-6 px-5 py-6 sm:flex-row sm:items-end sm:justify-between sm:gap-10 sm:px-8 sm:py-8">
          <div className="min-w-0 sm:max-w-xl">
            <p className="text-[11px] font-semibold tracking-[0.22em] text-amber-200/90 uppercase">
              Administration
            </p>
            <h1
              className={`${headingClassName} mt-2 text-[2.05rem] leading-[0.95] font-semibold tracking-tight sm:text-5xl`}
            >
              Tableau de bord
            </h1>
            <p className="mt-4 text-sm leading-6 text-stone-300 sm:text-[0.95rem] sm:leading-7">
              Composez le jeu : stages, sections, questions et réponses. Seul le
              contenu publié apparaît aux joueurs, dans leur langue.
            </p>
          </div>

          <div className="w-full shrink-0 sm:max-w-xs">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-xs font-medium tracking-wide text-stone-400 uppercase">
                    Publication
                  </p>
                  <p className="mt-1 text-lg font-semibold tracking-tight">
                    {publishedStages}
                    <span className="text-stone-400"> / {totalStages}</span>
                  </p>
                </div>
                <p className="text-sm text-stone-400">
                  {drafts} brouillon{drafts > 1 ? "s" : ""}
                </p>
              </div>
              <div
                role="progressbar"
                aria-valuenow={publishRatio}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Stages publiés"
                className="mt-3 h-2 overflow-hidden rounded-full bg-white/10"
              >
                <div
                  className="h-full rounded-full bg-amber-200"
                  style={{ width: `${publishRatio}%` }}
                />
              </div>
            </div>

            <MotionLink
              href="/admin/stages/new"
              whileHover={hoverLift}
              whileTap={tap}
              className="mt-3 inline-flex h-12 w-full items-center justify-center gap-1.5 rounded-2xl bg-amber-200 px-5 text-sm font-semibold text-stone-950 hover:bg-amber-100"
            >
              <IconPlus />
              Créer un stage
            </MotionLink>
          </div>
        </div>
      </motion.section>

      <motion.ul
        className="grid grid-cols-1 gap-3 sm:grid-cols-3"
        variants={stagger}
      >
        {stats.map((stat) => (
          <motion.li key={stat.label} variants={fadeUp}>
            <MotionLink
              href={stat.href}
              whileHover={hoverLift}
              whileTap={tap}
              className="flex items-center gap-3 rounded-2xl border border-stone-200/80 bg-white p-4 shadow-[0_12px_32px_-24px_rgba(28,25,23,0.5)] sm:min-h-[9rem] sm:flex-col sm:items-start sm:p-5"
            >
              <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-stone-950 text-amber-200">
                {icons[stat.href]}
              </span>
              <span className="min-w-0 flex-1 sm:w-full">
                <span className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold tracking-[0.14em] text-stone-500 uppercase">
                    {stat.label}
                  </span>
                  <Chevron className="size-4 text-stone-300" />
                </span>
                <span className="mt-1 flex items-baseline gap-2 sm:mt-1.5">
                  <span className="text-[1.85rem] leading-none font-semibold tracking-tight text-stone-900 sm:text-4xl">
                    {stat.value}
                  </span>
                </span>
                <span className="mt-1 block text-sm leading-5 text-stone-500">
                  {stat.hint}
                </span>
              </span>
            </MotionLink>
          </motion.li>
        ))}
      </motion.ul>

      <motion.section
        variants={fadeUp}
        className="rounded-[1.6rem] border border-stone-200/80 bg-white p-4 shadow-[0_12px_36px_-26px_rgba(28,25,23,0.5)] sm:p-6"
      >
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.16em] text-stone-500 uppercase">
              Catalogue
            </p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-stone-900">
              Stages récents
            </h2>
          </div>
          <MotionLink
            href="/admin/stages"
            whileTap={tap}
            className="hidden text-sm font-medium text-stone-700 underline-offset-4 hover:underline sm:inline"
          >
            Tout voir
          </MotionLink>
        </div>

        {stages.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-dashed border-stone-300 bg-stone-50 px-5 py-8 text-center">
            <p className="text-sm leading-6 text-stone-600">
              Aucun stage pour le moment. Créez le premier catalogue en
              Français, Anglais, Espagnol, Allemand ou Portugais.
            </p>
            <MotionLink
              href="/admin/stages/new"
              whileTap={tap}
              className="mt-4 inline-flex h-12 items-center justify-center rounded-2xl bg-stone-900 px-5 text-sm font-semibold text-white"
            >
              Nouveau stage
            </MotionLink>
          </div>
        ) : (
          <ul className="mt-5 flex flex-col gap-3">
            {stages.map((stage) => (
              <li key={stage.id}>
                <article className="overflow-hidden rounded-2xl border border-stone-200 bg-stone-50/80 sm:flex sm:items-center sm:gap-3 sm:p-4">
                  {stage.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={stage.imageUrl}
                      alt=""
                      className="h-36 w-full object-cover sm:size-16 sm:shrink-0 sm:rounded-xl sm:ring-1 sm:ring-stone-200"
                    />
                  ) : (
                    <div
                      aria-hidden
                      className="h-16 w-full bg-gradient-to-r from-stone-200 to-olive-50 sm:size-16 sm:shrink-0 sm:rounded-xl sm:ring-1 sm:ring-stone-200"
                    />
                  )}
                  <div className="flex items-center gap-3 p-3.5 sm:flex-1 sm:p-0">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate font-semibold text-stone-900">
                          {stage.title}
                        </h3>
                        <span
                          className={
                            stage.published
                              ? "rounded-full bg-olive-50 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-olive-800 uppercase"
                              : "rounded-full bg-stone-200/80 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-stone-600 uppercase"
                          }
                        >
                          {stage.published ? "Publié" : "Brouillon"}
                        </span>
                      </div>
                      <p className="mt-1 text-xs leading-5 text-stone-500 sm:text-sm">
                        {stage.localeLabel} · ordre {stage.orderIndex} ·{" "}
                        {stage.sectionCount} section
                        {stage.sectionCount > 1 ? "s" : ""}
                      </p>
                    </div>
                    <StageRowActions stageId={stage.id} />
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}

        <MotionLink
          href="/admin/stages"
          whileTap={tap}
          className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-2xl border border-stone-300 text-sm font-semibold text-stone-800 sm:hidden"
        >
          Voir tous les stages
        </MotionLink>
      </motion.section>
    </motion.div>
  );
}
