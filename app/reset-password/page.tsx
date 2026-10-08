"use client";

import { Suspense, useActionState, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Source_Serif_4 } from "next/font/google";
import { resetPassword, verifyResetToken } from "@/app/actions/password-reset";
import { BrandLogo } from "@/app/ui/brand-logo";
import { Field } from "@/app/ui/auth-shell";
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

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [tokenStatus, setTokenStatus] = useState<"validating" | "valid" | "invalid">(
    token ? "validating" : "invalid"
  );

  const resetPasswordWithToken = resetPassword.bind(null, token || "");
  const [state, action, pending] = useActionState(
    resetPasswordWithToken,
    undefined,
  );

  useEffect(() => {
    if (!token) return;

    verifyResetToken(token).then((valid) => {
      setTokenStatus(valid ? "valid" : "invalid");
    });
  }, [token]);

  if (tokenStatus === "validating") {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <p className="text-sm text-stone-600">Vérification du lien...</p>
      </div>
    );
  }

  if (tokenStatus === "invalid") {
    return (
      <div className="relative flex min-h-dvh flex-1 flex-col overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(244,247,238,0.95),_transparent_58%),radial-gradient(ellipse_at_bottom_right,_rgba(212,221,184,0.45),_transparent_46%)]"
        />

        <div className="relative mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-4 py-10">
          <div className="rounded-2xl border border-red-200 bg-white/80 p-8 text-center backdrop-blur-sm">
            <h1
              className={`${sourceSerif.className} text-2xl font-semibold text-stone-900`}
            >
              Lien invalide ou expiré
            </h1>
            <p className="mt-3 text-base leading-7 text-stone-600">
              Ce lien de réinitialisation est invalide ou a expiré. Les liens
              sont valables pendant 1 heure seulement.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/forgot-password"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-olive-800 px-6 text-sm font-semibold text-white hover:bg-olive-900"
              >
                Demander un nouveau lien
              </Link>
              <Link
                href="/login"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-stone-300 bg-white px-6 text-sm font-semibold text-stone-900 hover:bg-stone-50"
              >
                Retour à la connexion
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-dvh flex-1 flex-col overflow-hidden">
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
              Créez un nouveau mot de passe sécurisé. Utilisez au moins 8
              caractères avec une combinaison de lettres et de chiffres.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mx-auto w-full max-w-md rounded-2xl border border-olive-200/70 bg-white/80 p-5 shadow-[0_24px_60px_-36px_rgba(28,25,23,0.45)] backdrop-blur-sm sm:rounded-3xl sm:p-8 lg:mx-0 lg:max-w-none"
          >
            <p className="text-xs font-semibold tracking-[0.18em] text-olive-800 uppercase">
              Réinitialisation
            </p>
            <h2
              className={`${sourceSerif.className} mt-2 text-2xl font-semibold tracking-tight text-stone-900 sm:text-[1.75rem]`}
            >
              Nouveau mot de passe
            </h2>
            <p className="mt-2 text-sm leading-6 text-stone-600 sm:text-base sm:leading-7">
              Choisissez un mot de passe fort pour sécuriser votre compte.
            </p>

            <form action={action} className="mt-6 flex flex-col gap-4 sm:mt-7">
              <Field
                id="password"
                label="Nouveau mot de passe"
                error={state?.errors?.password}
              >
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className={fieldClassName}
                />
              </Field>
              <Field
                id="confirmPassword"
                label="Confirmer le mot de passe"
                error={state?.errors?.confirmPassword}
              >
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className={fieldClassName}
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
                {pending ? "Enregistrement…" : "Réinitialiser le mot de passe"}
              </motion.button>
            </form>

            <p className="mt-6 text-center text-sm text-stone-600 lg:text-left">
              <Link
                href="/login"
                className="font-medium text-olive-800 underline-offset-4 hover:underline"
              >
                Retour à la connexion
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordContent />
    </Suspense>
  );
}
