"use client";

import { motion } from "framer-motion";
import {
  MotionLink,
  easeOutSoft,
  fadeUp,
  hoverLift,
  stagger,
  tap,
} from "@/app/ui/page-motion";

export function PlayIntro({
  title,
  headingClassName,
  backHref,
}: {
  title: string;
  headingClassName: string;
  backHref: string;
}) {
  return (
    <motion.main
      className="mx-auto w-full max-w-2xl flex-1 px-4 py-16 text-center"
      initial="hidden"
      animate="show"
      variants={stagger}
    >
      <motion.p
        variants={fadeUp}
        className="text-sm font-medium tracking-[0.18em] text-olive-800 uppercase"
      >
        Section débloquée
      </motion.p>
      <motion.h1
        variants={fadeUp}
        className={`${headingClassName} mt-3 text-3xl font-semibold tracking-tight text-stone-900`}
      >
        {title}
      </motion.h1>
      <motion.span
        className="mx-auto mt-6 block h-px origin-center bg-olive-800"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.65, delay: 0.2, ease: easeOutSoft }}
        style={{ width: 72 }}
      />
      <motion.p
        variants={fadeUp}
        className="mt-4 text-base leading-7 text-stone-600"
      >
        Le jeu de 40 questions sera branché ici au prochain lot. Votre
        progression jusqu&apos;à cette section est déjà enregistrée.
      </motion.p>
      <motion.div variants={fadeUp}>
        <MotionLink
          href={backHref}
          whileHover={hoverLift}
          whileTap={tap}
          className="mt-8 inline-flex h-11 items-center justify-center rounded-lg bg-olive-800 px-5 text-sm font-semibold text-white hover:bg-olive-900"
        >
          Retour aux sections
        </MotionLink>
      </motion.div>
    </motion.main>
  );
}
