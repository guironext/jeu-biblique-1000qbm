import { SessionChrome } from "@/app/ui/session-chrome";

export function AdminShell({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(77,124,15,0.16),transparent),linear-gradient(#f6f1e7,#ebe4d6)]">
      <SessionChrome
        brand="1000 QBM+"
        badge="Admin"
        email={email}
        variant="admin"
        links={[
          { href: "/admin", label: "Tableau de bord" },
          { href: "/admin/stages", label: "Stages" },
          { href: "/admin/sections", label: "Sections" },
          { href: "/admin/questions", label: "Questions" },
          { href: "/admin/users", label: "Utilisateurs" },
        ]}
      />
      <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-8 lg:px-8">
        {children}
      </div>
    </div>
  );
}
