"use client";

import { motion } from "framer-motion";
import { BrandLogo } from "@/app/ui/brand-logo";
import {
  MotionLink,
  easeOutSoft,
  fadeUp,
  hoverLift,
  stagger,
  tap,
} from "@/app/ui/page-motion";

export function HomeHero({
  href,
  signedIn,
  headingClassName,
}: {
  href: string;
  signedIn: boolean;
  headingClassName: string;
}) {
  return (
    <div className="relative flex min-h-dvh flex-1 flex-col overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(244,247,238,0.95),_transparent_58%),radial-gradient(ellipse_at_bottom_right,_rgba(212,221,184,0.45),_transparent_46%)]"
      />

      <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-5 py-8 sm:px-8 sm:py-14 lg:px-10 lg:py-16">
        <motion.main
          className="grid items-center gap-7 sm:gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-16"
          initial="hidden"
          animate="show"
          variants={stagger}
        >
          <motion.div variants={fadeUp} className="flex justify-center lg:justify-start">
            <BrandLogo />
          </motion.div>

          <div className="mx-auto w-full max-w-xl text-center lg:mx-0 lg:text-left">
            <motion.p
              variants={fadeUp}
              className="text-xs font-semibold tracking-[0.22em] text-olive-800 uppercase sm:text-sm"
            >
              Jeu biblique
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className={`${headingClassName} mt-2 text-[2.15rem] leading-none font-semibold tracking-tight text-stone-900 sm:mt-3 sm:text-5xl lg:text-6xl`}
            >
              1000 QBM
            </motion.h1>
            <motion.span
              className="mx-auto mt-4 block h-px origin-left bg-olive-800 sm:mt-5 lg:mx-0"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.7, delay: 0.28, ease: easeOutSoft }}
              style={{ width: 64 }}
            />
            <motion.p
              variants={fadeUp}
              className="mx-auto mt-4 max-w-md text-[0.95rem] leading-7 text-stone-600 sm:mt-5 sm:text-lg sm:leading-8 lg:mx-0"
            >
              Un parcours de questions à choix unique, stage après stage.
              Inscrivez-vous avec votre email, puis commencez par le Stage 1.
            </motion.p>
            <motion.div
              variants={fadeUp}
              className="mt-7 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:justify-center lg:justify-start"
            >
              <MotionLink
                href={href}
                whileHover={hoverLift}
                whileTap={tap}
                className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-olive-800 px-6 text-sm font-semibold text-white hover:bg-olive-900 sm:w-auto sm:min-w-40"
              >
                {signedIn ? "Continuer" : "S'inscrire"}
              </MotionLink>
              {signedIn ? null : (
                <MotionLink
                  href="/login"
                  whileHover={hoverLift}
                  whileTap={tap}
                  className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-stone-300 bg-white/80 px-6 text-sm font-semibold text-stone-800 hover:bg-white sm:w-auto sm:min-w-40"
                >
                  Se connecter
                </MotionLink>
              )}
            </motion.div>
          </div>
        </motion.main>
      </div>
    </div>
  );
}
