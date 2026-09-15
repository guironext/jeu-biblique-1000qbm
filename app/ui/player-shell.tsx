import { SessionChrome } from "@/app/ui/session-chrome";

export function PlayerShell({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <SessionChrome
        brand="1000 QBM+"
        badge="Joueur"
        email={email}
        variant="player"
        links={[
          { href: "/stages", label: "Stages" },
          { href: "/compte", label: "Mon compte" },
        ]}
      />
      {children}
    </div>
  );
}
