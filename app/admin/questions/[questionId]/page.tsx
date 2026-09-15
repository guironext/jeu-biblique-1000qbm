import Link from "next/link";
import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import {
  createAnswer,
  deleteAnswer,
  deleteQuestion,
  updateAnswer,
  updateQuestion,
} from "@/app/admin/actions";
import { AnswerForm, QuestionForm } from "@/app/admin/forms";
import { DeleteButton } from "@/app/ui/delete-button";
import { getAdminSectionOptions } from "@/lib/catalog";
import { requireAdmin } from "@/lib/dal";
import { db } from "@/lib/db";
import { answers, questions } from "@/lib/db/schema";

export default async function AdminQuestionPage({
  params,
}: PageProps<"/admin/questions/[questionId]">) {
  await requireAdmin();
  const { questionId } = await params;

  const question = await db.query.questions.findFirst({
    where: eq(questions.id, questionId),
    with: { section: true },
  });

  if (!question) {
    notFound();
  }

  const choices = await db.query.answers.findMany({
    where: eq(answers.questionId, question.id),
    orderBy: [asc(answers.orderIndex)],
  });

  const sectionOptions = await getAdminSectionOptions();

  const saveQuestion = updateQuestion.bind(null, question.id);
  const addAnswer = createAnswer.bind(null, question.id);
  const removeQuestion = deleteQuestion.bind(
    null,
    question.id,
    question.sectionId,
  );

  return (
    <div className="space-y-10">
      <div>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <Link
            href="/admin/questions"
            className="text-sm font-medium text-stone-600 underline-offset-4 hover:underline"
          >
            Retour aux questions
          </Link>
          <Link
            href={`/admin/sections/${question.sectionId}`}
            className="text-sm font-medium text-stone-600 underline-offset-4 hover:underline"
          >
            Voir la section
          </Link>
        </div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-900">
          Question
        </h1>
        <p className="mt-1 text-sm text-stone-500">{question.section.title}</p>
      </div>

      <section>
        <h2 className="text-lg font-semibold text-stone-900">
          Modifier la question
        </h2>
        <div className="mt-4">
          <QuestionForm
            action={saveQuestion}
            submitLabel="Enregistrer"
            sections={sectionOptions}
            defaults={question}
          />
        </div>
        <div className="mt-4">
          <DeleteButton
            action={removeQuestion}
            label="Supprimer cette question"
          />
        </div>
      </section>

      <section id="reponses" className="scroll-mt-24">
        <h2 className="text-lg font-semibold text-stone-900">Réponses</h2>
        <ul className="mt-4 flex flex-col gap-6">
          {choices.map((answer) => {
            const saveAnswer = updateAnswer.bind(
              null,
              answer.id,
              question.id,
            );
            const removeAnswer = deleteAnswer.bind(
              null,
              answer.id,
              question.id,
            );

            return (
              <li
                key={answer.id}
                className="rounded-xl border border-stone-200 bg-white p-5"
              >
                <p className="mb-3 text-xs font-medium tracking-wide text-stone-500 uppercase">
                  {answer.isCorrect ? "Bonne réponse" : "Proposition"}
                </p>
                <AnswerForm
                  action={saveAnswer}
                  submitLabel="Mettre à jour"
                  defaults={answer}
                />
                <div className="mt-3">
                  <DeleteButton
                    action={removeAnswer}
                    label="Supprimer cette réponse"
                  />
                </div>
              </li>
            );
          })}
        </ul>
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-stone-800">
            Ajouter une réponse
          </h3>
          <div className="mt-3">
            <AnswerForm action={addAnswer} submitLabel="Ajouter la réponse" />
          </div>
        </div>
      </section>
    </div>
  );
}
