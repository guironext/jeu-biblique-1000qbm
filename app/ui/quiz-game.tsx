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
  const [correctAnswerId, setCorrectAnswerId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [answerPairs, setAnswerPairs] = useState<Array<{ questionId: string; answerId: string }>>([]);
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
      if (!result.correct && result.correctAnswerId) {
        setCorrectAnswerId(result.correctAnswerId);
      }
      setAnswerPairs([...answerPairs, { questionId: currentQuestion.id, answerId }]);
    });
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

      <motion.div variants={fadeUp} className="mt-4">
        <div className="h-2 w-full overflow-hidden rounded-full bg-stone-200">
          <motion.div
            className="h-full bg-gradient-to-r from-olive-600 to-olive-400"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
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
                const isCorrect = correctAnswerId === answer.id || (isSelected && feedback === "correct");
                const isWrong = isSelected && feedback === "incorrect";
                const showAsCorrect = hasAnswered && isCorrect;
                const showAsWrong = hasAnswered && isWrong;

                return (
                  <button
                    key={answer.id}
                    onClick={() => handleAnswerClick(answer.id)}
                    disabled={hasAnswered || isPending}
                    className={`w-full rounded-lg border-2 px-4 py-3 text-left text-sm font-medium transition-all sm:text-base ${
                      showAsCorrect
                        ? "border-green-500 bg-green-50 text-green-900"
                        : showAsWrong
                          ? "border-red-500 bg-red-50 text-red-900"
                          : isSelected && !hasAnswered
                            ? "border-olive-600 bg-olive-50 text-olive-900"
                            : "border-stone-300 bg-white text-stone-700 hover:border-olive-400 hover:bg-olive-50/50"
                    } ${hasAnswered || isPending ? "cursor-not-allowed" : "cursor-pointer"} ${!hasAnswered && !isPending ? "active:scale-[0.98]" : ""}`}
                  >
                    <span className="flex items-center justify-between">
                      <span>{answer.label}</span>
                      {showAsCorrect && (
                        <span className="text-xl">✓</span>
                      )}
                      {showAsWrong && (
                        <span className="text-xl">✗</span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>

            {hasAnswered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`mt-4 rounded-lg px-4 py-3 text-center text-base font-bold ${
                  feedback === "correct"
                    ? "bg-green-100 text-green-900"
                    : "bg-red-100 text-red-900"
                }`}
              >
                {feedback === "correct" ? translations.correct : translations.incorrect}
              </motion.div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.main>
  );
}
