import Link from "next/link";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { UserForm } from "@/app/admin/users/user-form";
import { requireAdmin } from "@/lib/dal";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

export default async function AdminUserPage({
  params,
}: PageProps<"/admin/users/[userId]">) {
  await requireAdmin();
  const { userId } = await params;
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: {
      id: true,
      email: true,
      role: true,
    },
    with: {
      profile: {
        columns: {
          fullName: true,
          phone: true,
          countryCode: true,
          locale: true,
        },
      },
    },
  });

  if (!user) {
    notFound();
  }

  return (
    <div>
      <Link
        href="/admin/users"
        className="text-sm font-medium text-stone-600 underline-offset-4 hover:underline"
      >
        Retour aux utilisateurs
      </Link>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-stone-900">
        Modifier l&apos;utilisateur
      </h1>
      <div className="mt-6 rounded-xl border border-stone-200 bg-white p-5 sm:p-7">
        <UserForm user={user} />
      </div>
    </div>
  );
}