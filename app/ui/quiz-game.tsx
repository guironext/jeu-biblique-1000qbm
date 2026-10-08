"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useTransition, useEffect, useCallback } from "react";
import { submitAnswer, finishQuiz } from "@/app/actions/quiz";
import { MotionLink, fadeUp, stagger } from "@/app/ui/page-motion";

type QuizQuestion = {
  id: string;
  prompt: string;
  answers: { id: string; label: string }[];
};

type QuizTranslations = {
  questionProgress: string;
  correct: string;
  incorrect: string;
};

export function QuizGame({
  stageId,
  sectionId,
  sectionTitle,
  sectionImageUrl,
  questions,
  headingClassName,
  backHref,
  translations,
}: {
  stageId: string;
  sectionId: string;
  sectionTitle: string;
  sectionImageUrl?: string | null;
  questions: QuizQuestion[];
  headingClassName: string;
  backHref: string;
  translations: QuizTranslations;
}) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [correctAnswerId, setCorrectAnswerId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [answerPairs, setAnswerPairs] = useState<Array<{ questionId: string; answerId: string }>>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [isPending, startTransition] = useTransition();

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const hasAnswered = feedback !== null;
  const progress = ((currentQuestionIndex + (hasAnswered ? 1 : 0)) / questions.length) * 100;

  const handleAdvance = useCallback(() => {
    if (isLastQuestion) {
      startTransition(async () => {
        await finishQuiz(stageId, sectionId, answerPairs);
      });
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswerId(null);
      setCorrectAnswerId(null);
      setFeedback(null);
    }
  }, [isLastQuestion, stageId, sectionId, answerPairs]);

  useEffect(() => {
    if (hasAnswered) {
      const delay = feedback === "correct" ? 1200 : 1500;
      const timer = setTimeout(() => {
        handleAdvance();
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [hasAnswered, feedback, handleAdvance]);

  const handleAnswerClick = (answerId: string) => {
    if (hasAnswered || isPending) return;

    setSelectedAnswerId(answerId);

    startTransition(async () => {
      const result = await submitAnswer(sectionId, currentQuestion.id, answerId);
      setFeedback(result.correct ? "correct" : "incorrect");
      if (result.correct) {
        setCorrectCount((c) => c + 1);
      }
      if (!result.correct && result.correctAnswerId) {
        setCorrectAnswerId(result.correctAnswerId);
      }
      setAnswerPairs([...answerPairs, { questionId: currentQuestion.id, answerId }]);
    });
  };

  const progressText = translations.questionProgress
    .replace("{current}", String(currentQuestionIndex + 1))
    .replace("{total}", String(questions.length));

  const letters = ["A", "B", "C", "D", "E", "F", "G", "H"];

  return (
    <motion.main
      className="mx-auto w-full max-w-3xl flex-1 px-3 pt-4 pb-10 sm:px-6 sm:pt-8"
      initial="hidden"
      animate="show"
      variants={stagger}
    >
      {/* Bandeau de la section : image + titre */}
      <motion.section
        variants={fadeUp}
        className="relative overflow-hidden rounded-2xl shadow-md ring-1 ring-stone-200"
      >
        <div className="relative h-36 w-full sm:h-56">
          {sectionImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={sectionImageUrl}
              alt={sectionTitle}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-olive-700 via-olive-500 to-olive-300" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-900/30 to-transparent" />

          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3 sm:p-4">
            <MotionLink
              href={backHref}
              whileHover={{ x: -2 }}
              className="inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-stone-800 shadow-sm backdrop-blur hover:bg-white sm:text-sm"
            >
              <span aria-hidden>←</span> Retour
            </MotionLink>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-stone-900/60 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur sm:text-sm">
                {progressText}
              </span>
              <span className="relative inline-flex items-center gap-1 rounded-full bg-amber-400 px-3 py-1.5 text-xs font-bold text-stone-900 shadow-sm sm:text-sm">
                <span aria-hidden>⭐</span>
                <span>Score</span>
                <motion.span
                  key={correctCount}
                  initial={{ scale: 1.6 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  className="tabular-nums"
                >
                  {correctCount}/{questions.length}
                </motion.span>
                <AnimatePresence>
                  {feedback === "correct" && (
                    <motion.span
                      key={`plus-${currentQuestionIndex}`}
                      initial={{ opacity: 0, y: 0 }}
                      animate={{ opacity: 1, y: -22 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6 }}
                      className="pointer-events-none absolute -top-1 right-2 text-sm font-extrabold text-green-400 drop-shadow"
                    >
                      +1
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
            <h1
              className={`${headingClassName} text-xl leading-tight font-semibold text-white drop-shadow sm:text-3xl`}
            >
              {sectionTitle}
            </h1>
          </div>
        </div>

        {/* Barre de progression */}
        <div className="h-1.5 w-full bg-stone-200 sm:h-2">
          <motion.div
            className="h-full bg-gradient-to-r from-olive-600 to-olive-400"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </motion.section>

      {/* Pastilles d'étapes */}
      <motion.div
        variants={fadeUp}
        className="mt-4 flex flex-wrap justify-center gap-1.5"
        aria-hidden
      >
        {questions.map((q, i) => (
          <span
            key={q.id}
            className={`h-2 rounded-full transition-all duration-300 ${
              i < currentQuestionIndex || (i === currentQuestionIndex && hasAnswered)
                ? "w-2 bg-olive-500"
                : i === currentQuestionIndex
                  ? "w-6 bg-olive-700"
                  : "w-2 bg-stone-300"
            }`}
          />
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="mt-4 sm:mt-6"
        >
          <div className="rounded-2xl border border-olive-100 bg-white p-4 shadow-sm sm:p-8">
            <span className="inline-flex items-center rounded-full bg-olive-50 px-3 py-1 text-xs font-semibold tracking-wide text-olive-800 uppercase">
              Question {currentQuestionIndex + 1}
            </span>
            <p
              className={`${headingClassName} mt-3 text-lg leading-snug font-semibold text-stone-900 sm:text-2xl`}
            >
              {currentQuestion.prompt}
            </p>

            <div className="mt-5 grid grid-cols-1 gap-2.5 sm:mt-6 sm:grid-cols-2 sm:gap-3">
              {currentQuestion.answers.map((answer, index) => {
                const isSelected = selectedAnswerId === answer.id;
                const isCorrect =
                  correctAnswerId === answer.id || (isSelected && feedback === "correct");
                const isWrong = isSelected && feedback === "incorrect";
                const showAsCorrect = hasAnswered && isCorrect;
                const showAsWrong = hasAnswered && isWrong;
                const isChecking = isSelected && isPending && !hasAnswered;
                const dimmed = hasAnswered && !showAsCorrect && !showAsWrong;

                return (
                  <motion.button
                    key={answer.id}
                    type="button"
                    onClick={() => handleAnswerClick(answer.id)}
                    disabled={hasAnswered || isPending}
                    whileTap={!hasAnswered && !isPending ? { scale: 0.97 } : undefined}
                    animate={
                      showAsWrong
                        ? { x: [0, -6, 6, -4, 4, 0] }
                        : showAsCorrect
                          ? { scale: [1, 1.03, 1] }
                          : {}
                    }
                    transition={{ duration: 0.4 }}
                    className={`group flex min-h-14 w-full items-center gap-3 rounded-xl border-2 px-3 py-3 text-left text-sm font-medium transition-colors sm:px-4 sm:text-base ${
                      showAsCorrect
                        ? "border-green-500 bg-green-50 text-green-900"
                        : showAsWrong
                          ? "border-red-500 bg-red-50 text-red-900"
                          : isChecking
                            ? "border-olive-600 bg-olive-50 text-olive-900"
                            : "border-stone-200 bg-white text-stone-800 hover:border-olive-400 hover:bg-olive-50/60"
                    } ${dimmed ? "opacity-50" : ""} ${
                      hasAnswered || isPending ? "cursor-default" : "cursor-pointer"
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold transition-colors ${
                        showAsCorrect
                          ? "bg-green-500 text-white"
                          : showAsWrong
                            ? "bg-red-500 text-white"
                            : isChecking
                              ? "bg-olive-600 text-white"
                              : "bg-stone-100 text-stone-600 group-hover:bg-olive-100 group-hover:text-olive-800"
                      }`}
                    >
                      {showAsCorrect ? "✓" : showAsWrong ? "✗" : letters[index] ?? index + 1}
                    </span>
                    <span className="flex-1">{answer.label}</span>
                    {isChecking && (
                      <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-olive-600 border-t-transparent" />
                    )}
                  </motion.button>
                );
              })}
            </div>

            <div className="mt-4 min-h-12" aria-live="polite">
              <AnimatePresence>
                {hasAnswered && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-base font-bold ${
                      feedback === "correct"
                        ? "bg-green-100 text-green-900"
                        : "bg-red-100 text-red-900"
                    }`}
                  >
                    <span className="text-lg" aria-hidden>
                      {feedback === "correct" ? "🎉" : "💡"}
                    </span>
                    {feedback === "correct" ? translations.correct : translations.incorrect}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.main>
  );
}
