"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createQuestionWithAnswers } from "@/app/admin/actions";
import { QuestionWithAnswersForm } from "@/app/admin/forms";
import {
  MotionLink,
  easeOutSoft,
  fadeUp,
  hoverLift,
  stagger,
  tap,
} from "@/app/ui/page-motion";
import { QuestionRowActions } from "@/app/ui/question-row-actions";

export type AdminQuestionItem = {
  id: string;
  prompt: string;
  orderIndex: number;
  published: boolean;
  answerCount: number;
  hasCorrectAnswer: boolean;
};

export type AdminQuestionSectionGroup = {
  id: string;
  title: string;
  orderIndex: number;
  published: boolean;
  stageId: string;
  stageTitle: string;
  localeLabel: string;
  questions: AdminQuestionItem[];
};

type Filter = "all" | "published" | "draft" | "incomplete";

const filterLabels: Record<Filter, string> = {
  all: "Toutes",
  published: "Publiées",
  draft: "Brouillons",
  incomplete: "À compléter",
};

function isIncomplete(question: AdminQuestionItem) {
  return question.answerCount === 0 || !question.hasCorrectAnswer;
}

function matchesFilter(question: AdminQuestionItem, filter: Filter) {
  if (filter === "published") return question.published;
  if (filter === "draft") return !question.published;
  if (filter === "incomplete") return isIncomplete(question);
  return true;
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      className={`size-5 transition-transform duration-200 ${
        open ? "rotate-180" : ""
      }`}
    >
      <path
        d="m6 8 4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className="size-[18px]">
      <circle cx="9" cy="9" r="5.25" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="m13 13 3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className="size-5">
      <path
        d="M10 4.75v10.5M4.75 10h10.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function AdminQuestionsBoard({
  headingClassName,
  sections,
}: {
  headingClassName: string;
  sections: AdminQuestionSectionGroup[];
}) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [collapsed, setCollapsed] = useState<string[]>([]);
  const titleId = useId();
  const searchId = useId();

  const sectionOptions = useMemo(
    () =>
      sections.map((section) => ({
        id: section.id,
        title: section.title,
        stageTitle: section.stageTitle,
      })),
    [sections],
  );

  const stats = useMemo(() => {
    const all = sections.flatMap((section) => section.questions);
    const incomplete = all.filter(isIncomplete).length;
    return {
      total: all.length,
      published: all.filter((question) => question.published).length,
      incomplete,
      complete: all.length - incomplete,
    };
  }, [sections]);

  const completeRatio =
    stats.total === 0 ? 0 : Math.round((stats.complete / stats.total) * 100);

  const search = query.trim().toLowerCase();

  const stages = useMemo(() => {
    const visible = sections
      .map((section) => {
        const sectionMatches =
          !search ||
          section.title.toLowerCase().includes(search) ||
          section.stageTitle.toLowerCase().includes(search);

        return {
          ...section,
          questions: section.questions.filter(
            (question) =>
              matchesFilter(question, filter) &&
              (sectionMatches ||
                question.prompt.toLowerCase().includes(search)),
          ),
        };
      })
      .filter((section) => section.questions.length > 0);

    const grouped: {
      id: string;
      title: string;
      localeLabel: string;
      sections: AdminQuestionSectionGroup[];
    }[] = [];

    for (const section of visible) {
      const stage = grouped.find((entry) => entry.id === section.stageId);
      if (stage) {
        stage.sections.push(section);
      } else {
        grouped.push({
          id: section.stageId,
          title: section.stageTitle,
          localeLabel: section.localeLabel,
          sections: [section],
        });
      }
    }

    return grouped;
  }, [sections, filter, search]);

  const visibleCount = stages.reduce(
    (total, stage) =>
      total +
      stage.sections.reduce(
        (count, section) => count + section.questions.length,
        0,
      ),
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

  const hasSections = sections.length > 0;
  const filtering = filter !== "all" || search.length > 0;

  const statTiles: { key: Filter; label: string; value: number }[] = [
    { key: "all", label: "Questions", value: stats.total },
    { key: "published", label: "Publiées", value: stats.published },
    { key: "incomplete", label: "À compléter", value: stats.incomplete },
  ];

  return (
    <motion.div
      className="flex flex-col gap-5 pb-24 sm:gap-7 sm:pb-0"
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
        <div className="relative px-5 py-6 sm:px-8 sm:py-8">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold tracking-[0.22em] text-amber-200/90 uppercase">
                Contenu
              </p>
              <h1
                className={`${headingClassName} mt-2 max-w-lg text-[2.05rem] leading-[0.95] font-semibold tracking-tight sm:text-5xl`}
              >
                Questions
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-6 text-stone-300 sm:text-[0.95rem] sm:leading-7">
                Chaque question appartient à une section. Une question est
                complète lorsqu&apos;elle propose des réponses dont une seule
                est correcte.
              </p>
            </div>
            <motion.button
              type="button"
              whileHover={hoverLift}
              whileTap={tap}
              onClick={() => setOpen(true)}
              disabled={!hasSections}
              className="hidden h-12 shrink-0 items-center justify-center gap-1.5 rounded-2xl bg-amber-200 px-5 text-sm font-semibold text-stone-950 transition-colors hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50 sm:inline-flex"
            >
              <PlusIcon />
              Ajouter Questions
            </motion.button>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-xs font-medium tracking-wide text-stone-400 uppercase">
                  Complétude
                </p>
                <p className="mt-1 text-lg font-semibold tracking-tight">
                  {stats.complete}
                  <span className="text-stone-400"> / {stats.total}</span>
                </p>
              </div>
              <p className="text-sm text-stone-400">
                {stats.incomplete} à compléter
              </p>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-amber-200"
                style={{ width: `${completeRatio}%` }}
              />
            </div>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2 sm:gap-3">
            {statTiles.map((tile) => {
              const active = filter === tile.key;
              const warn = tile.key === "incomplete" && tile.value > 0;

              return (
                <motion.button
                  key={tile.key}
                  type="button"
                  whileTap={tap}
                  onClick={() => setFilter(active ? "all" : tile.key)}
                  className={`rounded-2xl border p-4 text-left backdrop-blur-sm transition-colors ${
                    active
                      ? "border-amber-200/70 bg-amber-200/15"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <p
                    className={`text-[1.6rem] leading-none font-semibold tracking-tight tabular-nums sm:text-3xl ${
                      warn ? "text-amber-200" : "text-white"
                    }`}
                  >
                    {tile.value}
                  </p>
                  <p className="mt-1.5 text-[11px] leading-tight font-medium text-stone-400 sm:text-xs">
                    {tile.label}
                  </p>
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.section>

      {hasSections ? (
        <motion.div
          variants={fadeUp}
          className="flex flex-col gap-3 rounded-[1.6rem] border border-stone-200/80 bg-white p-4 shadow-[0_12px_36px_-26px_rgba(28,25,23,0.5)] sm:flex-row sm:items-center sm:p-5"
        >
          <div className="relative flex-1">
            <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-stone-400">
              <SearchIcon />
            </span>
            <input
              id={searchId}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Rechercher une question, une section…"
              className="h-12 w-full rounded-2xl border border-stone-200 bg-stone-50 pr-4 pl-10 text-[0.95rem] text-stone-900 placeholder:text-stone-400 focus:border-stone-400 focus:bg-white focus:outline-none"
            />
          </div>
          <div className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-0.5 sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
            {(Object.keys(filterLabels) as Filter[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={`h-10 shrink-0 rounded-full px-3.5 text-sm font-medium transition-colors ${
                  filter === key
                    ? "bg-stone-900 text-white"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {filterLabels[key]}
              </button>
            ))}
          </div>
        </motion.div>
      ) : null}

      {!hasSections ? (
        <motion.div
          variants={fadeUp}
          className="rounded-[1.6rem] border border-stone-200/80 bg-white p-4 shadow-[0_12px_36px_-26px_rgba(28,25,23,0.5)] sm:p-6"
        >
          <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 px-5 py-8 text-center">
            <p className="text-sm leading-6 text-stone-600">
              Aucune section pour le moment. Créez d&apos;abord une section,
              puis rattachez-y des questions.
            </p>
            <MotionLink
              href="/admin/sections"
              whileTap={tap}
              className="mt-4 inline-flex h-11 items-center justify-center rounded-xl bg-stone-900 px-4 text-sm font-semibold text-white"
            >
              Créer une section
            </MotionLink>
          </div>
        </motion.div>
      ) : stages.length === 0 ? (
        <motion.div
          variants={fadeUp}
          className="rounded-[1.6rem] border border-stone-200/80 bg-white px-5 py-10 text-center shadow-[0_12px_36px_-26px_rgba(28,25,23,0.5)]"
        >
          <p className="text-sm leading-6 text-stone-600">
            Aucune question ne correspond à cette recherche.
          </p>
          <button
            type="button"
            onClick={() => {
              setFilter("all");
              setQuery("");
            }}
            className="mt-3 text-sm font-semibold text-stone-900 underline underline-offset-4"
          >
            Réinitialiser les filtres
          </button>
        </motion.div>
      ) : (
        <div className="flex flex-col gap-6">
          {filtering ? (
            <motion.p variants={fadeUp} className="text-sm text-stone-500">
              {visibleCount} question{visibleCount > 1 ? "s" : ""} affichée
              {visibleCount > 1 ? "s" : ""}
            </motion.p>
          ) : null}

          {stages.map((stage) => (
            <motion.div key={stage.id} variants={fadeUp} className="space-y-3">
              <div className="flex items-center gap-3 px-1">
                <h2 className="truncate text-[0.95rem] font-semibold tracking-tight text-stone-900">
                  {stage.title}
                </h2>
                <span className="shrink-0 rounded-full bg-stone-100 px-2 py-0.5 text-[11px] font-semibold tracking-wide text-stone-500 uppercase">
                  {stage.localeLabel}
                </span>
                <span className="h-px flex-1 bg-stone-200" />
              </div>

              {stage.sections.map((section) => {
                const expanded = !collapsed.includes(section.id) || !!search;

                return (
                  <section
                    key={section.id}
                    className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-[0_12px_32px_-24px_rgba(28,25,23,0.5)]"
                  >
                    <div className="flex items-center gap-2 border-b border-stone-100 bg-stone-50/80 px-3 py-3 sm:px-4">
                      <button
                        type="button"
                        aria-expanded={expanded}
                        onClick={() =>
                          setCollapsed((current) =>
                            current.includes(section.id)
                              ? current.filter((id) => id !== section.id)
                              : [...current, section.id],
                          )
                        }
                        className="flex min-w-0 flex-1 items-center gap-2.5 rounded-xl px-1 py-1 text-left hover:bg-stone-100/70"
                      >
                        <span className="text-stone-400">
                          <ChevronIcon open={expanded} />
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate font-semibold tracking-tight text-stone-900">
                            {section.title}
                          </span>
                          <span className="mt-0.5 block text-xs text-stone-500">
                            {section.questions.length} question
                            {section.questions.length > 1 ? "s" : ""}
                            {section.published ? "" : " · brouillon"}
                          </span>
                        </span>
                      </button>
                      <MotionLink
                        href={`/admin/sections/${section.id}`}
                        whileTap={tap}
                        className="shrink-0 rounded-lg px-2.5 py-1.5 text-sm font-medium text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                      >
                        Section
                      </MotionLink>
                    </div>

                    {expanded ? (
                      <ul className="divide-y divide-stone-100">
                        {section.questions.map((question) => (
                          <li
                            key={question.id}
                            className="flex flex-col gap-3 px-3 py-3.5 sm:flex-row sm:items-center sm:gap-4 sm:px-4"
                          >
                            <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-sm font-semibold tabular-nums text-stone-600 sm:size-9">
                              {question.orderIndex}
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="line-clamp-2 leading-6 font-medium text-stone-900">
                                {question.prompt}
                              </p>
                              <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                                <span
                                  className={
                                    question.published
                                      ? "rounded-full bg-olive-50 px-2 py-0.5 text-[11px] font-semibold text-olive-800"
                                      : "rounded-full bg-stone-100 px-2 py-0.5 text-[11px] font-semibold text-stone-600"
                                  }
                                >
                                  {question.published ? "Publiée" : "Brouillon"}
                                </span>
                                <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[11px] font-medium text-stone-600 tabular-nums">
                                  {question.answerCount} réponse
                                  {question.answerCount > 1 ? "s" : ""}
                                </span>
                                {isIncomplete(question) ? (
                                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
                                    {question.answerCount === 0
                                      ? "Sans réponse"
                                      : "Sans bonne réponse"}
                                  </span>
                                ) : null}
                              </div>
                            </div>
                            <QuestionRowActions questionId={question.id} />
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </section>
                );
              })}
            </motion.div>
          ))}
        </div>
      )}

      {hasSections ? (
        <motion.button
          type="button"
          whileTap={tap}
          onClick={() => setOpen(true)}
          className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 inline-flex h-14 items-center gap-2 rounded-full bg-amber-200 pr-5 pl-4 text-sm font-semibold text-stone-950 shadow-[0_18px_40px_-14px_rgba(28,25,23,0.65)] sm:hidden"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: easeOutSoft }}
        >
          <PlusIcon />
          Ajouter Questions
        </motion.button>
      ) : null}

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
                    Nouvelle question
                  </p>
                  <h2
                    id={titleId}
                    className="mt-1 text-xl font-semibold tracking-tight text-stone-900"
                  >
                    Ajouter Questions
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
                Choisissez la section, saisissez l&apos;intitulé, puis les
                réponses proposées en cochant la bonne.
              </p>
              <QuestionWithAnswersForm
                action={createQuestionWithAnswers}
                sections={sectionOptions}
                submitLabel="Enregistrer la question"
              />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
