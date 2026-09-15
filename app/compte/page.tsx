import { Source_Serif_4 } from "next/font/google";
import { requireOnboardedPlayer } from "@/lib/dal";
import { countryLabel } from "@/lib/countries";
import { localeLabel } from "@/lib/catalog";

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["600", "700"],
});

export default async function ComptePage() {
  const { user, profile } = await requireOnboardedPlayer();

  const rows = [
    { label: "Email", value: user.email },
    { label: "Nom Complet", value: profile.fullName || "—" },
    { label: "Téléphone", value: profile.phone },
    { label: "Pays", value: countryLabel(profile.countryCode) },
    { label: "Langue du jeu", value: localeLabel(profile.locale) },
  ];

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
      <p className="text-sm font-medium tracking-[0.18em] text-olive-800 uppercase">
        Session joueur
      </p>
      <h1
        className={`${sourceSerif.className} mt-3 text-3xl font-semibold tracking-tight text-stone-900`}
      >
        Mon compte
      </h1>
      <p className="mt-3 max-w-2xl text-base leading-7 text-stone-600">
        Ces informations ont été renseignées à l&apos;onboarding. La langue
        détermine uniquement les stages chargés pour vous.
      </p>
      <dl className="mt-8 divide-y divide-stone-200 overflow-hidden rounded-xl border border-stone-200 bg-white">
        {rows.map((row) => (
          <div
            key={row.label}
            className="grid gap-1 px-5 py-4 sm:grid-cols-[10rem_1fr] sm:items-center"
          >
            <dt className="text-sm font-medium text-stone-500">{row.label}</dt>
            <dd className="text-sm text-stone-900">{row.value}</dd>
          </div>
        ))}
      </dl>
    </main>
  );
}
