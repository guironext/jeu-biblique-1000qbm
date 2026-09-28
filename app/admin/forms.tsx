"use client";

import { useActionState, useState } from "react";
import type { AdminFormState } from "@/lib/admin-schemas";
import { fieldClassName, primaryButtonClassName } from "@/app/ui/auth-shell";
import { ImagePicker } from "@/app/ui/image-picker";
import { LocaleSelect } from "@/app/ui/locale-select";

export function StageForm({
  action,
  defaults,
  submitLabel,
}: {
  action: (state: AdminFormState, formData: FormData) => Promise<AdminFormState>;
  defaults?: {
    title?: string;
    slug?: string;
    locale?: string;
    description?: string;
    orderIndex?: number;
    published?: boolean;
    imageUrl?: string | null;
  };
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-4">
      <label className="flex flex-col gap-1.5 text-sm font-medium text-stone-800">
        Titre
        <input
          name="title"
          required
          defaultValue={defaults?.title}
          className={fieldClassName}
        />
        {state?.errors?.title ? (
          <span className="font-normal text-red-700">{state.errors.title[0]}</span>
        ) : null}
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-medium text-stone-800">
        Slug
        <input
          name="slug"
          required
          defaultValue={defaults?.slug}
          placeholder="stage-1"
          className={fieldClassName}
        />
        {state?.errors?.slug ? (
          <span className="font-normal text-red-700">{state.errors.slug[0]}</span>
        ) : null}
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-medium text-stone-800">
        Langue
        <LocaleSelect
          defaultValue={defaults?.locale}
          className={fieldClassName}
          placeholder="Choisir une langue"
        />
        <span className="font-normal text-stone-500">
          Français, Anglais, Espagnol, Allemand ou Portugais. Le stage n&apos;est
          pas traduit automatiquement.
        </span>
        {state?.errors?.locale ? (
          <span className="font-normal text-red-700">{state.errors.locale[0]}</span>
        ) : null}
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-medium text-stone-800">
        Description
        <textarea
          name="description"
          required
          rows={4}
          defaultValue={defaults?.description}
          className={`${fieldClassName} h-auto py-2`}
        />
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-medium text-stone-800">
        Ordre
        <input
          name="orderIndex"
          type="number"
          min={1}
          defaultValue={defaults?.orderIndex}
          placeholder="Automatique si vide"
          className={fieldClassName}
        />
      </label>
      <label className="flex items-center gap-2 text-sm font-medium text-stone-800">
        <input
          name="published"
          type="checkbox"
          defaultChecked={defaults?.published}
        />
        Publié (visible des joueurs dans cette langue)
      </label>
      <ImagePicker
        currentUrl={defaults?.imageUrl}
        error={state?.errors?.image?.[0]}
      />
      {state?.message ? (
        <p className="text-sm text-red-700">{state.message}</p>
      ) : null}
      <button className={primaryButtonClassName} disabled={pending} type="submit">
        {pending ? "Enregistrement…" : submitLabel}
      </button>
    </form>
  );
}

export function SectionForm({
  action,
  defaults,
  stages,
  submitLabel,
}: {
  action: (state: AdminFormState, formData: FormData) => Promise<AdminFormState>;
  defaults?: {
    title?: string;
    orderIndex?: number;
    published?: boolean;
    stageId?: string;
    imageUrl?: string | null;
  };
  stages?: { id: string; title: string; localeLabel: string }[];
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-4">
      {stages ? (
        <label className="flex flex-col gap-1.5 text-sm font-medium text-stone-800">
          Stage
          <select
            name="stageId"
            required
            defaultValue={defaults?.stageId ?? ""}
            className={fieldClassName}
          >
            <option value="" disabled>
              Choisir un stage
            </option>
            {stages.map((stage) => (
              <option key={stage.id} value={stage.id}>
                {stage.title} · {stage.localeLabel}
              </option>
            ))}
          </select>
          {state?.errors?.stageId ? (
            <span className="font-normal text-red-700">{state.errors.stageId[0]}</span>
          ) : null}
        </label>
      ) : null}
      <label className="flex flex-col gap-1.5 text-sm font-medium text-stone-800">
        Titre
        
        <input
          name="title"
          required
          defaultValue={defaults?.title}
          className={fieldClassName}
        />
        {state?.errors?.title ? (
          <span className="font-normal text-red-700">{state.errors.title[0]}</span>
        ) : null}
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-medium text-stone-800">
        Ordre
        <input
          name="orderIndex"
          type="number"
          min={1}
          defaultValue={defaults?.orderIndex}
          placeholder="Automatique si vide"
          className={fieldClassName}
        />
      </label>
      <label className="flex items-center gap-2 text-sm font-medium text-stone-800">
        <input
          name="published"
          type="checkbox"
          defaultChecked={defaults?.published}
        />
        Publiée
      </label>
      <ImagePicker
        currentUrl={defaults?.imageUrl}
        error={state?.errors?.image?.[0]}
      />
      {state?.message ? (
        <p className="text-sm text-red-700">{state.message}</p>
      ) : null}
      <button className={primaryButtonClassName} disabled={pending} type="submit">
        {pending ? "Enregistrement…" : submitLabel}
      </button>
    </form>
  );
}

export function QuestionForm({
  action,
  defaults,
  sections,
  submitLabel,
}: {
  action: (state: AdminFormState, formData: FormData) => Promise<AdminFormState>;
  defaults?: {
    prompt?: string;
    orderIndex?: number;
    published?: boolean;
    sectionId?: string;
  };
  sections?: { id: string; title: string; stageTitle: string }[];
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-4">
      {sections ? (
        <label className="flex flex-col gap-1.5 text-sm font-medium text-stone-800">
          Section
          <select
            name="sectionId"
            required
            defaultValue={defaults?.sectionId ?? ""}
            className={fieldClassName}
          >
            <option value="" disabled>
              Choisir une section
            </option>
            {sections.map((section) => (
              <option key={section.id} value={section.id}>
                {section.stageTitle} · {section.title}
              </option>
            ))}
          </select>
          {state?.errors?.sectionId ? (
            <span className="font-normal text-red-700">
              {state.errors.sectionId[0]}
            </span>
          ) : null}
        </label>
      ) : null}
      <label className="flex flex-col gap-1.5 text-sm font-medium text-stone-800">
        Intitulé
        <textarea
          name="prompt"
          required
          rows={4}
          defaultValue={defaults?.prompt}
          className={`${fieldClassName} h-auto py-2`}
        />
        {state?.errors?.prompt ? (
          <span className="font-normal text-red-700">
            {state.errors.prompt[0]}
          </span>
        ) : null}
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-medium text-stone-800">
        Ordre
        <input
          name="orderIndex"
          type="number"
          min={1}
          defaultValue={defaults?.orderIndex}
          placeholder="Automatique si vide"
          className={fieldClassName}
        />
      </label>
      <label className="flex items-center gap-2 text-sm font-medium text-stone-800">
        <input
          name="published"
          type="checkbox"
          defaultChecked={defaults?.published}
        />
        Publiée
      </label>
      {state?.message ? (
        <p className="text-sm text-red-700">{state.message}</p>
      ) : null}
      <button className={primaryButtonClassName} disabled={pending} type="submit">
        {pending ? "Enregistrement…" : submitLabel}
      </button>
    </form>
  );
}

export function QuestionWithAnswersForm({
  action,
  sections,
  submitLabel,
}: {
  action: (state: AdminFormState, formData: FormData) => Promise<AdminFormState>;
  sections: { id: string; title: string; stageTitle: string }[];
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [rows, setRows] = useState([0, 1, 2, 3]);
  const [nextRow, setNextRow] = useState(4);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-4">
      <label className="flex flex-col gap-1.5 text-sm font-medium text-stone-800">
        Section
        <select
          name="sectionId"
          required
          defaultValue=""
          className={fieldClassName}
        >
          <option value="" disabled>
            Choisir une section
          </option>
          {sections.map((section) => (
            <option key={section.id} value={section.id}>
              {section.stageTitle} · {section.title}
            </option>
          ))}
        </select>
        {state?.errors?.sectionId ? (
          <span className="font-normal text-red-700">
            {state.errors.sectionId[0]}
          </span>
        ) : null}
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-medium text-stone-800">
        Intitulé
        <textarea
          name="prompt"
          required
          rows={3}
          placeholder="Quelle est la capitale du Maroc ?"
          className={`${fieldClassName} h-auto py-2`}
        />
        {state?.errors?.prompt ? (
          <span className="font-normal text-red-700">
            {state.errors.prompt[0]}
          </span>
        ) : null}
      </label>

      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-medium text-stone-800">
          Réponses
          <span className="ml-1.5 font-normal text-stone-500">
            cochez la bonne
          </span>
        </legend>
        <div className="flex flex-col gap-2">
          {rows.map((row, index) => (
            <div key={row} className="flex items-center gap-2">
              <label className="inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-stone-200 bg-white has-checked:border-olive-700 has-checked:bg-olive-50">
                <input
                  type="radio"
                  name="correctAnswer"
                  value={index}
                  className="size-4 accent-olive-700"
                />
                <span className="sr-only">Réponse {index + 1} correcte</span>
              </label>
              <input
                name="answerLabel"
                placeholder={`Réponse ${index + 1}`}
                className={`${fieldClassName} flex-1`}
              />
              <button
                type="button"
                onClick={() => setRows(rows.filter((id) => id !== row))}
                disabled={rows.length <= 2}
                aria-label={`Retirer la réponse ${index + 1}`}
                className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl text-stone-400 hover:bg-stone-100 hover:text-stone-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <svg viewBox="0 0 20 20" fill="none" aria-hidden className="size-5">
                  <path
                    d="M5.5 5.5l9 9M14.5 5.5l-9 9"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
        {state?.errors?.answers ? (
          <p className="text-sm text-red-700">{state.errors.answers[0]}</p>
        ) : null}
        <button
          type="button"
          onClick={() => {
            setRows([...rows, nextRow]);
            setNextRow(nextRow + 1);
          }}
          disabled={rows.length >= 8}
          className="self-start text-sm font-semibold text-stone-700 underline underline-offset-4 disabled:opacity-40"
        >
          Ajouter une réponse
        </button>
      </fieldset>

      <label className="flex flex-col gap-1.5 text-sm font-medium text-stone-800">
        Ordre
        <input
          name="orderIndex"
          type="number"
          min={1}
          placeholder="Automatique si vide"
          className={fieldClassName}
        />
      </label>
      <label className="flex items-center gap-2 text-sm font-medium text-stone-800">
        <input name="published" type="checkbox" />
        Publiée
      </label>
      {state?.message ? (
        <p className="text-sm text-red-700">{state.message}</p>
      ) : null}
      <button className={primaryButtonClassName} disabled={pending} type="submit">
        {pending ? "Enregistrement…" : submitLabel}
      </button>
    </form>
  );
}

export function AnswerForm({
  action,
  defaults,
  submitLabel,
}: {
  action: (state: AdminFormState, formData: FormData) => Promise<AdminFormState>;
  defaults?: { label?: string; orderIndex?: number; isCorrect?: boolean };
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-4">
      <label className="flex flex-col gap-1.5 text-sm font-medium text-stone-800">
        Libellé
        <input
          name="label"
          required
          defaultValue={defaults?.label}
          className={fieldClassName}
        />
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-medium text-stone-800">
        Ordre
        <input
          name="orderIndex"
          type="number"
          min={1}
          defaultValue={defaults?.orderIndex}
          placeholder="Automatique si vide"
          className={fieldClassName}
        />
      </label>
      <label className="flex items-center gap-2 text-sm font-medium text-stone-800">
        <input
          name="isCorrect"
          type="checkbox"
          defaultChecked={defaults?.isCorrect}
        />
        Bonne réponse (une seule par question)
      </label>
      {state?.message ? (
        <p className="text-sm text-red-700">{state.message}</p>
      ) : null}
      <button className={primaryButtonClassName} disabled={pending} type="submit">
        {pending ? "Enregistrement…" : submitLabel}
      </button>
    </form>
  );
}
