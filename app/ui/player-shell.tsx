import { SessionChrome } from "@/app/ui/session-chrome";
import { translateJoueur } from "@/lib/joueur-i18n";

export function PlayerShell({
  email,
  locale,
  children,
}: {
  email: string;
  locale?: string;
  children: React.ReactNode;
}) {
  const t = (key: Parameters<typeof translateJoueur>[0]) =>
    translateJoueur(key, locale ?? "fr");

  return (
    <div className="flex flex-1 flex-col">
      <SessionChrome
        brand="1000 QBM+"
        badge="Joueur"
        email={email}
        variant="player"
        links={[
          { href: "/joueur", label: t("navHome") },
          { href: "/joueur/stages", label: t("navStages") },
          { href: "/compte", label: t("navAccount") },
        ]}
      />
      {children}
    </div>
  );
}
