"use client";

import { motion } from "framer-motion";
import {
  MotionLink,
  fadeUp,
  hoverLift,
  stagger,
  tap,
} from "@/app/ui/page-motion";

type JoueurContentProps = {
  pageTitle: string;
  heroTitleShort: string;
  heroTitleLong: string;
  heroParagraph: string;
  challengeLine: string;
  ctaStart: string;
  playStagesTitle: string;
  playStagesDescription: string;
  myAccountTitle: string;
  myAccountDescription: string;
  headingClassName: string;
};

export function JoueurContent({
  pageTitle,
  heroTitleShort,
  heroTitleLong,
  heroParagraph,
  challengeLine,
  ctaStart,
  playStagesTitle,
  playStagesDescription,
  myAccountTitle,
  myAccountDescription,
  headingClassName,
}: JoueurContentProps) {
  return (
    <motion.main
      className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:py-10 lg:py-12"
      initial="hidden"
      animate="show"
      variants={stagger}
    >
      {/* Badge */}
      <motion.p
        variants={fadeUp}
        className="text-sm font-medium tracking-[0.18em] text-olive-800 uppercase"
      >
        {pageTitle}
      </motion.p>

      {/* Hero Title */}
      <motion.h1
        variants={fadeUp}
        className={`${headingClassName} mt-4 text-[2rem] font-bold leading-[1.1] tracking-tight text-stone-900 sm:mt-5 sm:text-4xl lg:text-5xl`}
      >
        <span className="sm:hidden">{heroTitleShort}</span>
        <span className="hidden sm:inline">{heroTitleLong}</span>
      </motion.h1>

      {/* Decorative Divider */}
      <motion.span
        variants={fadeUp}
        className="mt-4 block h-1 w-16 rounded-full bg-gradient-to-r from-olive-600 to-olive-400 sm:mt-5"
        aria-hidden="true"
      />

      {/* Hero Paragraph */}
      <motion.p
        variants={fadeUp}
        className="mt-6 max-w-prose text-[0.9375rem] leading-relaxed text-stone-700 sm:mt-7 sm:text-base sm:leading-relaxed lg:text-lg lg:leading-relaxed"
      >
        {heroParagraph}
      </motion.p>

      {/* Challenge Line */}
      <motion.div
        variants={fadeUp}
        className="mt-6 flex w-full max-w-prose items-center gap-3 rounded-xl border-2 border-olive-200 bg-olive-50/50 px-4 py-3 sm:mt-7 sm:px-5 sm:py-4"
      >
        <span
          className="text-2xl sm:text-3xl"
          role="img"
          aria-label="Bible"
        >
          📖
        </span>
        <p className="flex-1 text-[0.9375rem] font-semibold leading-snug text-olive-900 sm:text-base">
          {challengeLine}
        </p>
      </motion.div>

      {/* CTA Button */}
      <motion.div variants={fadeUp} className="mt-6 flex w-full max-w-prose sm:mt-7">
        <MotionLink
          href="/joueur/stages"
          className="inline-flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-olive-600 to-olive-400 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:from-olive-700 hover:to-olive-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olive-600 sm:w-auto sm:px-5 sm:py-4 sm:text-base"
          whileHover={hoverLift}
          whileTap={tap}
        >
          {ctaStart}
        </MotionLink>
      </motion.div>

      
    </motion.main>
  );
}
