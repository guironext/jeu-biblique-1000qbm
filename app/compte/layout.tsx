import { PlayerShell } from "@/app/ui/player-shell";
import { requireOnboardedPlayer } from "@/lib/dal";

export default async function CompteLayout({
  children,
}: LayoutProps<"/compte">) {
  const { user, profile } = await requireOnboardedPlayer();

  return (
    <PlayerShell email={user.email} locale={profile.locale}>
      {children}
    </PlayerShell>
  );
}
