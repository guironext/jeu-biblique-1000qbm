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
  const { profile } = await requireOnboardedPlayer();

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
        <span className="sm:hidden">{t("heroTitleShort")}</span>
        <span className="hidden sm:inline">{t("heroTitleLong")}</span>
      </h1>

      <p className="mt-5 max-w-prose text-sm leading-relaxed text-stone-900 sm:text-base lg:text-lg">
        {t("heroParagraph")}
      </p>

      <div className="mt-5 flex w-full max-w-prose flex-col items-center gap-3 sm:mt-6 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <p className="text-sm font-semibold leading-snug text-stone-900 sm:text-base">
          {t("challengeLine")}
        </p>
      </div>

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
