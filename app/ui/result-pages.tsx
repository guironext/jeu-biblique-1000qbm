"use client";

import { motion } from "framer-motion";
import { MotionLink, fadeUp, hoverLift, stagger, tap } from "@/app/ui/page-motion";

function SuccessIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="h-24 w-24 text-green-600"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
  );
}

export function SuccessResult({
  stageId,
  title,
  message,
  scoreText,
  buttonText,
  headingClassName,
}: {
  stageId: string;
  title: string;
  message: string;
  scoreText: string;
  buttonText: string;
  headingClassName: string;
}) {
  return (
    <motion.main
      className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6"
      initial="hidden"
      animate="show"
      variants={stagger}
    >
      <motion.div
        variants={fadeUp}
        className="flex flex-col items-center text-center"
      >
        <div className="rounded-full bg-green-100 p-6">
          <SuccessIcon />
        </div>

        <h1
          className={`${headingClassName} mt-6 text-3xl font-bold text-stone-900 sm:text-4xl`}
        >
          {title}
        </h1>

        <p className="mt-4 text-lg leading-relaxed text-stone-600">
          {message}
        </p>

        <div className="mt-6 rounded-xl border-2 border-green-200 bg-green-50 px-6 py-4">
          <p className="text-xl font-semibold text-green-900">{scoreText}</p>
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className="mt-10">
        <MotionLink
          href={`/joueur/stages/${stageId}`}
          whileHover={hoverLift}
          whileTap={tap}
          className="inline-flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-olive-600 to-olive-400 px-6 py-3 text-base font-semibold text-white shadow-sm hover:from-olive-700 hover:to-olive-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olive-600"
        >
          {buttonText}
        </MotionLink>
      </motion.div>
    </motion.main>
  );
}

function FailureIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="h-24 w-24 text-amber-600"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
      />
    </svg>
  );
}

export function FailureResult({
  stageId,
  sectionId,
  title,
  message,
  scoreText,
  buttonText,
  headingClassName,
}: {
  stageId: string;
  sectionId: string;
  title: string;
  message: string;
  scoreText: string;
  buttonText: string;
  headingClassName: string;
}) {
  return (
    <motion.main
      className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6"
      initial="hidden"
      animate="show"
      variants={stagger}
    >
      <motion.div
        variants={fadeUp}
        className="flex flex-col items-center text-center"
      >
        <div className="rounded-full bg-amber-100 p-6">
          <FailureIcon />
        </div>

        <h1
          className={`${headingClassName} mt-6 text-3xl font-bold text-stone-900 sm:text-4xl`}
        >
          {title}
        </h1>

        <p className="mt-4 text-lg leading-relaxed text-stone-600">
          {message}
        </p>

        <div className="mt-6 rounded-xl border-2 border-amber-200 bg-amber-50 px-6 py-4">
          <p className="text-xl font-semibold text-amber-900">{scoreText}</p>
        </div>
      </motion.div>

      <motion.div variants={fadeUp} className="mt-10">
        <MotionLink
          href={`/joueur/stages/${stageId}/sections/${sectionId}/play`}
          whileHover={hoverLift}
          whileTap={tap}
          className="inline-flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-olive-600 to-olive-400 px-6 py-3 text-base font-semibold text-white shadow-sm hover:from-olive-700 hover:to-olive-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olive-600"
        >
          {buttonText}
        </MotionLink>
      </motion.div>
    </motion.main>
  );
}
