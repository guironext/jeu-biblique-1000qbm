"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useTransition } from "react";
import { submitAnswer, finishQuiz } from "@/app/actions/quiz";
import { MotionLink, fadeUp, hoverLift, stagger, tap } from "@/app/ui/page-motion";

type QuizQuestion = {
  id: string;
  prompt: string;
  answers: { id: string; label: string }[];
};

type QuizTranslations = {
  questionProgress: string;
  submit: string;
  next: string;
  correct: string;
  incorrect: string;
};

export function QuizGame({
  stageId,
  sectionId,
  sectionTitle,
  questions,
  headingClassName,
  backHref,
  translations,
}: {
  stageId: string;
  sectionId: string;
  sectionTitle: string;
  questions: QuizQuestion[];
  headingClassName: string;
  backHref: string;
  translations: QuizTranslations;
}) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [score, setScore] = useState(0);
  const [isPending, startTransition] = useTransition();

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const hasAnswered = feedback !== null;

  const handleSubmit = () => {
    if (!selectedAnswerId) return;

    startTransition(async () => {
      const result = await submitAnswer(currentQuestion.id, selectedAnswerId);
      setFeedback(result.correct ? "correct" : "incorrect");
      if (result.correct) {
        setScore(score + 1);
      }
    });
  };

  const handleNext = () => {
    if (isLastQuestion) {
      startTransition(async () => {
        await finishQuiz(stageId, sectionId, score, questions.length);
      });
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswerId(null);
      setFeedback(null);
    }
  };

  const progressText = translations.questionProgress
    .replace("{current}", String(currentQuestionIndex + 1))
    .replace("{total}", String(questions.length));

  return (
    <motion.main
      className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6"
      initial="hidden"
      animate="show"
      variants={stagger}
    >
      <motion.div variants={fadeUp}>
        <MotionLink
          href={backHref}
          whileHover={{ x: -2 }}
          className="text-sm font-medium text-olive-800 underline-offset-4 hover:underline"
        >
          ← Retour
        </MotionLink>
      </motion.div>

      <motion.div variants={fadeUp} className="mt-6">
        <p className="text-sm font-medium tracking-wide uppercase text-olive-800">
          {progressText}
        </p>
        <h1 className={`${headingClassName} mt-2 text-2xl font-semibold text-stone-900 sm:text-3xl`}>
          {sectionTitle}
        </h1>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="mt-8"
        >
          <div className="rounded-xl border border-olive-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-lg leading-relaxed text-stone-900 sm:text-xl">
              {currentQuestion.prompt}
            </p>

            <div className="mt-6 space-y-3">
              {currentQuestion.answers.map((answer) => {
                const isSelected = selectedAnswerId === answer.id;
                const showFeedback = hasAnswered && isSelected;

                return (
                  <button
                    key={answer.id}
                    onClick={() => {
                      if (!hasAnswered) {
                        setSelectedAnswerId(answer.id);
                      }
                    }}
                    disabled={hasAnswered || isPending}
                    className={`w-full rounded-lg border-2 px-4 py-3 text-left text-sm font-medium transition-all sm:text-base ${
                      showFeedback && feedback === "correct"
                        ? "border-green-500 bg-green-50 text-green-900"
                        : showFeedback && feedback === "incorrect"
                          ? "border-red-500 bg-red-50 text-red-900"
                          : isSelected
                            ? "border-olive-600 bg-olive-50 text-olive-900"
                            : "border-stone-300 bg-white text-stone-700 hover:border-olive-400 hover:bg-olive-50/50"
                    } ${hasAnswered || isPending ? "cursor-not-allowed opacity-75" : "cursor-pointer"}`}
                  >
                    {answer.label}
                  </button>
                );
              })}
            </div>

            {hasAnswered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`mt-4 rounded-lg px-4 py-3 text-center text-sm font-semibold ${
                  feedback === "correct"
                    ? "bg-green-100 text-green-900"
                    : "bg-red-100 text-red-900"
                }`}
              >
                {feedback === "correct" ? translations.correct : translations.incorrect}
              </motion.div>
            )}
          </div>

          <div className="mt-6">
            {!hasAnswered ? (
              <motion.button
                onClick={handleSubmit}
                disabled={!selectedAnswerId || isPending}
                whileHover={selectedAnswerId && !isPending ? hoverLift : undefined}
                whileTap={selectedAnswerId && !isPending ? tap : undefined}
                className="inline-flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-olive-600 to-olive-400 px-6 py-3 text-base font-semibold text-white shadow-sm hover:from-olive-700 hover:to-olive-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olive-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? "..." : translations.submit}
              </motion.button>
            ) : (
              <motion.button
                onClick={handleNext}
                disabled={isPending}
                whileHover={!isPending ? hoverLift : undefined}
                whileTap={!isPending ? tap : undefined}
                className="inline-flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-olive-600 to-olive-400 px-6 py-3 text-base font-semibold text-white shadow-sm hover:from-olive-700 hover:to-olive-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olive-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? "..." : isLastQuestion ? "Terminer" : translations.next}
              </motion.button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.main>
  );
}
