import { Source_Serif_4 } from "next/font/google";
import { requireOnboardedPlayer } from "@/lib/dal";
import { localeLabel } from "@/lib/catalog";
import { translateJoueur } from "@/lib/joueur-i18n";
import { JoueurContent } from "./joueur-content";

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["600", "700"],
});

export default async function JoueurPage() {
  const { profile } = await requireOnboardedPlayer();

  const t = (key: Parameters<typeof translateJoueur>[0], replacements?: Record<string, string>) =>
    translateJoueur(key, profile.locale, replacements);

  return (
    <JoueurContent
      pageTitle={t("pageTitle")}
      heroTitleShort={t("heroTitleShort")}
      heroTitleLong={t("heroTitleLong")}
      heroParagraph={t("heroParagraph")}
      challengeLine={t("challengeLine")}
      ctaStart={t("ctaStart")}
      playStagesTitle={t("playStagesTitle")}
      playStagesDescription={t("playStagesDescription", {
        locale: localeLabel(profile.locale).toLowerCase(),
      })}
      myAccountTitle={t("myAccountTitle")}
      myAccountDescription={t("myAccountDescription")}
      headingClassName={sourceSerif.className}
    />
  );
}
