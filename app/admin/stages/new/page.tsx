import Link from "next/link";
import { createStage } from "@/app/admin/actions";
import { StageForm } from "@/app/admin/forms";
import { requireAdmin } from "@/lib/dal";

export default async function NewStagePage() {
  await requireAdmin();

  return (
    <div>
      <Link
        href="/admin/stages"
        className="text-sm font-medium text-stone-600 underline-offset-4 hover:underline"
      >
        Retour aux stages
      </Link>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-900">
        Nouveau stage
      </h1>
      <p className="mt-2 max-w-xl text-sm text-stone-600">
        Un stage appartient à une langue. Il n&apos;est pas traduit
        automatiquement.
      </p>
      <div className="mt-8">
        <StageForm action={createStage} submitLabel="Créer le stage" />
      </div>
    </div>
  );
}
