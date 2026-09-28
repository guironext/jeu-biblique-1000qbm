"use client";

import Link from "next/link";
import { useActionState } from "react";
import { updateUser } from "@/app/admin/users/actions";
import { fieldClassName, primaryButtonClassName } from "@/app/ui/auth-shell";
import { LocaleSelect } from "@/app/ui/locale-select";
import { COUNTRIES } from "@/lib/countries";
import type { AdminFormState } from "@/lib/admin-schemas";

type EditableUser = {
  id: string;
  email: string;
  role: "PLAYER" | "ADMIN";
  profile: {
    fullName: string;
    phone: string;
    countryCode: string;
    locale: string;
  } | null;
};

export function UserForm({ user }: { user: EditableUser }) {
  const action = updateUser.bind(null, user.id);
  const [state, formAction, pending] = useActionState<AdminFormState, FormData>(
    action,
    undefined,
  );

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-4">
      <label className="flex flex-col gap-1.5 text-sm font-medium text-stone-800">
        Adresse email
        <input
          name="email"
          type="email"
          required
          defaultValue={user.email}
          autoComplete="email"
          className={fieldClassName}
        />
        {state?.errors?.email ? (
          <span className="font-normal text-red-700">{state.errors.email[0]}</span>
        ) : null}
      </label>

      {user.profile ? (
        <>
          <label className="flex flex-col gap-1.5 text-sm font-medium text-stone-800">
            Nom complet
            <input
              name="fullName"
              required
              defaultValue={user.profile.fullName}
              className={fieldClassName}
            />
            {state?.errors?.fullName ? (
              <span className="font-normal text-red-700">
                {state.errors.fullName[0]}
              </span>
            ) : null}
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium text-stone-800">
            Téléphone
            <input
              name="phone"
              type="tel"
              required
              defaultValue={user.profile.phone}
              className={fieldClassName}
            />
            {state?.errors?.phone ? (
              <span className="font-normal text-red-700">
                {state.errors.phone[0]}
              </span>
            ) : null}
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium text-stone-800">
            Pays
            <select
              name="countryCode"
              required
              defaultValue={user.profile.countryCode}
              className={fieldClassName}
            >
              {COUNTRIES.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
            {state?.errors?.countryCode ? (
              <span className="font-normal text-red-700">
                {state.errors.countryCode[0]}
              </span>
            ) : null}
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium text-stone-800">
            Langue du jeu
            <LocaleSelect
              defaultValue={user.profile.locale}
              className={fieldClassName}
            />
            {state?.errors?.locale ? (
              <span className="font-normal text-red-700">
                {state.errors.locale[0]}
              </span>
            ) : null}
          </label>
        </>
      ) : (
        <p className="rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-600">
          Ce compte n&apos;a pas encore complété son profil joueur.
        </p>
      )}

      <p className="text-sm text-stone-600">
        Rôle : {user.role === "ADMIN" ? "Administrateur" : "Joueur"}
      </p>
      {state?.message ? (
        <p className="text-sm text-red-700" role="alert">{state.message}</p>
      ) : null}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
        <Link
          href="/admin/users"
          className="inline-flex h-11 items-center justify-center rounded-lg border border-stone-300 px-4 text-sm font-semibold text-stone-700 hover:bg-stone-50"
        >
          Annuler
        </Link>
        <button
          className={primaryButtonClassName}
          disabled={pending}
          type="submit"
        >
          {pending ? "Enregistrement…" : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}