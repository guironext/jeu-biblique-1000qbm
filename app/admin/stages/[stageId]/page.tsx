import Link from "next/link";
import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import {
  createSection,
  deleteStage,
  updateStage,
} from "@/app/admin/actions";
import { SectionForm, StageForm } from "@/app/admin/forms";
import { CoverThumb } from "@/app/ui/image-picker";
import { DeleteButton } from "@/app/ui/delete-button";
import { requireAdmin } from "@/lib/dal";
import { db } from "@/lib/db";
import { sections, stages } from "@/lib/db/schema";

export default async function AdminStageDetailPage({
  params,
}: PageProps<"/admin/stages/[stageId]">) {
  await requireAdmin();
  const { stageId } = await params;

  const stage = await db.query.stages.findFirst({
    where: eq(stages.id, stageId),
  });

  if (!stage) {
    notFound();
  }

  const stageSections = await db.query.sections.findMany({
    where: eq(sections.stageId, stage.id),
    orderBy: [asc(sections.orderIndex)],
    with: { questions: true },
  });

  const saveStage = updateStage.bind(null, stage.id);
  const addSection = createSection.bind(null, stage.id);
  const removeStage = deleteStage.bind(null, stage.id);

  return (
    <div className="space-y-10">
      <div>
        <Link
          href="/admin/stages"
          className="text-sm font-medium text-stone-600 underline-offset-4 hover:underline"
        >
          Retour aux stages
        </Link>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-900">
          {stage.title}
        </h1>
      </div>

      <section>
        <h2 className="text-lg font-semibold text-stone-900">Modifier le stage</h2>
        <div className="mt-4">
          <StageForm
            action={saveStage}
            submitLabel="Enregistrer"
            defaults={stage}
          />
        </div>
        <div className="mt-4">
          <DeleteButton action={removeStage} label="Supprimer ce stage" />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-stone-900">Sections</h2>
        <ul className="mt-4 flex flex-col gap-2">
          {stageSections.map((section) => (
            <li
              key={section.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3"
            >
              <CoverThumb src={section.imageUrl} alt="" />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-stone-900">{section.title}</p>
                <p className="text-sm text-stone-500">
                  {section.questions.length} question
                  {section.questions.length > 1 ? "s" : ""} ·{" "}
                  {section.published ? "Publiée" : "Brouillon"}
                </p>
              </div>
              <Link
                href={`/admin/sections/${section.id}`}
                className="text-sm font-medium underline-offset-4 hover:underline"
              >
                Éditer
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-stone-800">
            Ajouter une section
          </h3>
          <div className="mt-3">
            <SectionForm action={addSection} submitLabel="Ajouter la section" />
          </div>
        </div>
      </section>
    </div>
  );
}
