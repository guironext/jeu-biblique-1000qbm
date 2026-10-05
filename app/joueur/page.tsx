import { Source_Serif_4 } from "next/font/google";
import Link from "next/link";
import { requireOnboardedPlayer } from "@/lib/dal";
import { localeLabel } from "@/lib/catalog";

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["600", "700"],
});

export default async function JoueurPage() {
  const { user, profile } = await requireOnboardedPlayer();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
      <p className="text-sm font-medium tracking-[0.18em] text-olive-800 uppercase">
        Espace Joueur
      </p>
      <h1
        className={`${sourceSerif.className} mt-3 text-3xl font-semibold tracking-tight text-stone-900`}
      >
        Bienvenue, {profile.fullName || user.email}
      </h1>
      <p className="mt-3 max-w-2xl text-base leading-7 text-stone-600">
        Vous êtes connecté en tant que joueur. Commencez à jouer aux stages
        bibliques ou consultez vos informations de compte.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <Link
          href="/stages"
          className="group relative flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-white p-6 transition hover:border-olive-400 hover:shadow-md"
        >
          <h2 className="text-lg font-semibold text-stone-900 group-hover:text-olive-800">
            Jouer aux stages
          </h2>
          <p className="mt-2 text-sm text-stone-600">
            Accédez à tous les stages bibliques disponibles en{" "}
            {localeLabel(profile.locale).toLowerCase()}.
          </p>
        </Link>

        <Link
          href="/compte"
          className="group relative flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-white p-6 transition hover:border-olive-400 hover:shadow-md"
        >
          <h2 className="text-lg font-semibold text-stone-900 group-hover:text-olive-800">
            Mon compte
          </h2>
          <p className="mt-2 text-sm text-stone-600">
            Consultez vos informations personnelles et les paramètres de votre
            compte.
          </p>
        </Link>
      </div>
    </main>
  );
}
