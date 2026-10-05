import { PlayerShell } from "@/app/ui/player-shell";
import { requireOnboardedPlayer } from "@/lib/dal";

export default async function JoueurLayout({
  children,
}: LayoutProps<"/joueur">) {
  const { user } = await requireOnboardedPlayer();

  return <PlayerShell email={user.email}>{children}</PlayerShell>;
}
