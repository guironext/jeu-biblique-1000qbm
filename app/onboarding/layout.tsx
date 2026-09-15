import { SlimSessionHeader } from "@/app/ui/slim-session-header";
import { requireUser } from "@/lib/dal";
import { redirect } from "next/navigation";

export default async function OnboardingLayout({
  children,
}: LayoutProps<"/onboarding">) {
  const { user } = await requireUser();

  if (user.role === "ADMIN") {
    redirect("/admin");
  }

  return (
    <div className="flex flex-1 flex-col">
      <SlimSessionHeader email={user.email} badge="Joueur" />
      {children}
    </div>
  );
}
