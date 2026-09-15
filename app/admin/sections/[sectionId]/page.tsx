import Link from "next/link";
import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import {
  createQuestion,
  deleteSection,
  updateSection,
} from "@/app/admin/actions";
import { QuestionForm, SectionForm } from "@/app/admin/forms";
import { DeleteButton } from "@/app/ui/delete-button";
import { requireAdmin } from "@/lib/dal";
import { db } from "@/lib/db";
import { questions, sections } from "@/lib/db/schema";

export default async function AdminSectionPage({
  params,
}: PageProps<"/admin/sections/[sectionId]">) {
  await requireAdmin();
  const { sectionId } = await params;

  const section = await db.query.sections.findFirst({
    where: eq(sections.id, sectionId),
    with: { stage: true },
  });

  if (!section) {
    notFound();
  }

  const sectionQuestions = await db.query.questions.findMany({
    where: eq(questions.sectionId, section.id),
    orderBy: [asc(questions.orderIndex)],
    with: { answers: true },
  });

  const saveSection = updateSection.bind(null, section.id);
  const addQuestion = createQuestion.bind(null, section.id);
  const removeSection = deleteSection.bind(null, section.id, section.stageId);

  return (
    <div className="space-y-10">
      <div>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <Link
            href="/admin/sections"
            className="text-sm font-medium text-stone-600 underline-offset-4 hover:underline"
          >
            Retour aux sections
          </Link>
          <Link
            href={`/admin/stages/${section.stageId}`}
            className="text-sm font-medium text-stone-600 underline-offset-4 hover:underline"
          >
            Voir le stage
          </Link>
        </div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-900">
          {section.title}
        </h1>
        <p className="mt-1 text-sm text-stone-500">{section.stage.title}</p>
      </div>

      <section>
        <h2 className="text-lg font-semibold text-stone-900">
          Modifier la section
        </h2>
        <div className="mt-4">
          <SectionForm
            action={saveSection}
            submitLabel="Enregistrer"
            defaults={section}
          />
        </div>
        <div className="mt-4">
          <DeleteButton action={removeSection} label="Supprimer cette section" />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-stone-900">Questions</h2>
        <ul className="mt-4 flex flex-col gap-2">
          {sectionQuestions.map((question) => (
            <li
              key={question.id}
              className="flex items-center justify-between rounded-xl border border-stone-200 bg-white px-4 py-3"
            >
              <div>
                <p className="font-medium text-stone-900">{question.prompt}</p>
                <p className="text-sm text-stone-500">
                  {question.answers.length} réponse
                  {question.answers.length > 1 ? "s" : ""} ·{" "}
                  {question.published ? "Publiée" : "Brouillon"}
                </p>
              </div>
              <Link
                href={`/admin/questions/${question.id}`}
                className="text-sm font-medium underline-offset-4 hover:underline"
              >
                Éditer
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-stone-800">
            Ajouter une question
          </h3>
          <div className="mt-3">
            <QuestionForm action={addQuestion} submitLabel="Ajouter la question" />
          </div>
        </div>
      </section>
    </div>
  );
}
