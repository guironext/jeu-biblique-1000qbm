"use client";

import { useActionState } from "react";
import { motion } from "framer-motion";
import { Source_Serif_4 } from "next/font/google";
import { completeOnboarding } from "@/app/actions/onboarding";
import { COUNTRIES } from "@/lib/countries";
import { BrandLogo } from "@/app/ui/brand-logo";
import { Field } from "@/app/ui/auth-shell";
import { LocaleSelect } from "@/app/ui/locale-select";
import {
  easeOutSoft,
  fadeUp,
  hoverLift,
  stagger,
  tap,
} from "@/app/ui/page-motion";

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["600", "700"],
});

const fieldClassName =
  "h-12 w-full rounded-xl border border-stone-300/90 bg-white px-3.5 text-base text-stone-900 outline-none transition-colors focus:border-olive-700 focus:ring-2 focus:ring-olive-700/20";

const primaryButtonClassName =
  "inline-flex h-12 w-full items-center justify-center rounded-xl bg-olive-800 px-4 text-sm font-semibold text-white transition-colors hover:bg-olive-900 disabled:cursor-not-allowed disabled:opacity-60";

export function OnboardingForm() {
  const [state, action, pending] = useActionState(
    completeOnboarding,
    undefined,
  );

  return (
    <div className="relative flex flex-1 flex-col">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(244,247,238,0.95),_transparent_58%),radial-gradient(ellipse_at_bottom_right,_rgba(212,221,184,0.45),_transparent_46%)]"
      />

      <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        <motion.div
          className="grid items-center gap-6 sm:gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16"
          initial="hidden"
          animate="show"
          variants={stagger}
        >
          <motion.div
            variants={fadeUp}
            className="flex flex-col items-center text-center lg:items-start lg:text-left"
          >
            <BrandLogo compact />
            <p className="mt-5 hidden text-xl leading-none font-semibold tracking-tight text-olive-800 uppercase lg:mt-7 lg:block">
              Jeu biblique
            </p>
            <h1
              className={`${sourceSerif.className} mt-2 hidden text-5xl leading-none font-semibold tracking-tight text-stone-900 lg:block`}
            >
              1000 QBM
            </h1>
            <motion.span
              className="mx-auto mt-3 hidden h-px origin-left bg-olive-800 lg:mx-0 lg:mt-4 lg:block"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.7, delay: 0.28, ease: easeOutSoft }}
              style={{ width: 64 }}
            />
            <p className="mt-3 hidden max-w-md text-base leading-7 text-stone-600 lg:mt-5 lg:block">
              Dernière étape avant de jouer : votre pays et la langue du
              catalogue. Seuls les stages publiés dans cette langue seront
              visibles.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mx-auto w-full max-w-md rounded-2xl border border-olive-200/70 bg-white/80 p-5 shadow-[0_24px_60px_-36px_rgba(28,25,23,0.45)] backdrop-blur-sm sm:rounded-3xl sm:p-8 lg:mx-0 lg:max-w-none"
          >
            <p className="text-xs font-semibold tracking-[0.18em] text-olive-800 uppercase">
              Profil joueur
            </p>
            <h2
              className={`${sourceSerif.className} mt-2 text-2xl font-semibold tracking-tight text-stone-900 sm:text-[1.75rem]`}
            >
              Votre profil
            </h2>
            <p className="mt-2 text-sm leading-6 text-stone-600 sm:text-base sm:leading-7">
              Choisissez Français, Anglais, Espagnol, Allemand ou Portugais.
              La langue détermine le catalogue, sans traduction automatique.
            </p>

            <form action={action} className="mt-6 flex flex-col gap-4 sm:mt-7">
              <Field
                id="fullName"
                label="Nom Complet"
                error={state?.errors?.fullName}
              >
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  placeholder="Jean Dupont"
                  required
                  className={fieldClassName}
                />
              </Field>
              <Field id="role" label="Rôle" error={state?.errors?.role}>
                <select
                  id="role"
                  name="role"
                  required
                  defaultValue=""
                  className={fieldClassName}
                >
                  <option value="" disabled>
                    Choisir un rôle
                  </option>
                  <option value="PLAYER">Joueur</option>
                  <option value="ADMIN">Administrateur</option>
                </select>
              </Field>
              <Field
                id="phone"
                label="Numéro de téléphone"
                error={state?.errors?.phone}
              >
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="+225 07 00 00 00 00"
                  required
                  className={fieldClassName}
                />
              </Field>
              <Field
                id="countryCode"
                label="Pays"
                error={state?.errors?.countryCode}
              >
                <select
                  id="countryCode"
                  name="countryCode"
                  required
                  defaultValue=""
                  className={fieldClassName}
                >
                  <option value="" disabled>
                    Choisir un pays
                  </option>
                  {COUNTRIES.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field
                id="locale"
                label="Langue du jeu"
                error={state?.errors?.locale}
              >
                <LocaleSelect
                  id="locale"
                  className={fieldClassName}
                  placeholder="Choisir une langue"
                />
              </Field>
              {state?.message ? (
                <p className="text-sm text-red-700" role="alert">
                  {state.message}
                </p>
              ) : null}
              <motion.button
                className={primaryButtonClassName}
                disabled={pending}
                type="submit"
                whileHover={pending ? undefined : hoverLift}
                whileTap={pending ? undefined : tap}
              >
                {pending ? "Enregistrement…" : "Continuer"}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
