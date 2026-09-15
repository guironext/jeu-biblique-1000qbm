import { AdminShell } from "@/app/ui/admin-shell";
import { requireAdmin } from "@/lib/dal";

export default async function AdminLayout({
  children,
}: LayoutProps<"/admin">) {
  const { user } = await requireAdmin();

  return <AdminShell email={user.email}>{children}</AdminShell>;
}
