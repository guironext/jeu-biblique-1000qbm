import Link from "next/link";
import { CoverThumb } from "@/app/ui/image-picker";
import { StageRowActions } from "@/app/ui/stage-row-actions";
import { getAdminStages, localeLabel } from "@/lib/catalog";
import { requireAdmin } from "@/lib/dal";

export default async function AdminStagesPage() {
  await requireAdmin();

  const catalog = await getAdminStages();

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium tracking-[0.16em] text-stone-500 uppercase">
            Contenu
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">
            Stages
          </h1>
        </div>
        <Link
          href="/admin/stages/new"
          className="inline-flex h-11 items-center rounded-lg bg-stone-900 px-4 text-sm font-semibold text-white hover:bg-stone-800"
        >
          Nouveau stage
        </Link>
      </div>

      <ul className="mt-8 flex flex-col gap-3">
        {catalog.length === 0 ? (
          <li className="rounded-xl border border-stone-200 bg-white p-5 text-sm text-stone-600">
            Aucun stage pour le moment. Créez le premier catalogue en
            Français, Anglais, Espagnol, Allemand ou Portugais.
          </li>
        ) : (
          catalog.map((stage) => (
            <li
              key={stage.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3.5 sm:px-5 sm:py-4"
            >
              <CoverThumb src={stage.imageUrl} alt="" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium tracking-wide text-stone-500 uppercase">
                  {localeLabel(stage.locale)} · ordre {stage.orderIndex} ·{" "}
                  {stage.published ? "Publié" : "Brouillon"}
                </p>
                <h2 className="mt-1 truncate font-medium text-stone-900">
                  {stage.title}
                </h2>
                <p className="text-sm text-stone-500">
                  {stage.sections.length} section
                  {stage.sections.length > 1 ? "s" : ""}
                </p>
              </div>
              <StageRowActions stageId={stage.id} />
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
