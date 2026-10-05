import { Source_Serif_4 } from "next/font/google";
import Link from "next/link";
import { requireOnboardedPlayer } from "@/lib/dal";
import { localeLabel } from "@/lib/catalog";
import { translateJoueur } from "@/lib/joueur-i18n";

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["600", "700"],
});

export default async function JoueurPage() {
  const { user, profile } = await requireOnboardedPlayer();

  const t = (key: Parameters<typeof translateJoueur>[0], replacements?: Record<string, string>) =>
    translateJoueur(key, profile.locale, replacements);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
      <p className="text-sm font-medium tracking-[0.18em] text-olive-800 uppercase">
        {t("pageTitle")}
      </p>
      <h1
        className={`${sourceSerif.className} mt-3 text-3xl font-semibold tracking-tight text-stone-900`}
      >
        {t("welcome", { name: profile.fullName || user.email })}
      </h1>
      <p className="mt-3 max-w-2xl text-base leading-7 text-stone-600">
        {t("description")}
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <Link
          href="/stages"
          className="group relative flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-white p-6 transition hover:border-olive-400 hover:shadow-md"
        >
          <h2 className="text-lg font-semibold text-stone-900 group-hover:text-olive-800">
            {t("playStagesTitle")}
          </h2>
          <p className="mt-2 text-sm text-stone-600">
            {t("playStagesDescription", {
              locale: localeLabel(profile.locale).toLowerCase(),
            })}
          </p>
        </Link>

        <Link
          href="/compte"
          className="group relative flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-white p-6 transition hover:border-olive-400 hover:shadow-md"
        >
          <h2 className="text-lg font-semibold text-stone-900 group-hover:text-olive-800">
            {t("myAccountTitle")}
          </h2>
          <p className="mt-2 text-sm text-stone-600">
            {t("myAccountDescription")}
          </p>
        </Link>
      </div>
    </main>
  );
}
