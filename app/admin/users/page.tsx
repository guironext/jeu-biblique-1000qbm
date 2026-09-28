import { desc } from "drizzle-orm";
import { requireAdmin } from "@/lib/dal";
import { db } from "@/lib/db";
import { sectionProgress, stageProgress, users } from "@/lib/db/schema";
import { countryLabel } from "@/lib/countries";
import { localeLabel } from "@/lib/locales";
import { UserRowActions } from "@/app/admin/users/user-row-actions";

export default async function AdminUsersPage() {
  const { user: admin } = await requireAdmin();
  const [userList, sectionRows, stageRows] = await Promise.all([
    db.query.users.findMany({
      columns: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
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
      orderBy: [desc(users.createdAt)],
    }),
    db
      .select({
        userId: sectionProgress.userId,
        status: sectionProgress.status,
        bestScore: sectionProgress.bestScore,
        attempts: sectionProgress.attempts,
      })
      .from(sectionProgress),
    db
      .select({ userId: stageProgress.userId, status: stageProgress.status })
      .from(stageProgress),
  ]);

  const performanceByUser = new Map<
    string,
    {
      passedSections: number;
      completedStages: number;
      attempts: number;
      bestScoreTotal: number;
      scoredSections: number;
    }
  >();

  for (const progress of sectionRows) {
    const performance = performanceByUser.get(progress.userId) ?? {
      passedSections: 0,
      completedStages: 0,
      attempts: 0,
      bestScoreTotal: 0,
      scoredSections: 0,
    };
    if (progress.status === "PASSED") {
      performance.passedSections += 1;
    }
    performance.attempts += progress.attempts;
    if (progress.attempts > 0) {
      performance.bestScoreTotal += progress.bestScore;
      performance.scoredSections += 1;
    }
    performanceByUser.set(progress.userId, performance);
  }

  for (const progress of stageRows) {
    if (progress.status !== "COMPLETED") {
      continue;
    }
    const performance = performanceByUser.get(progress.userId) ?? {
      passedSections: 0,
      completedStages: 0,
      attempts: 0,
      bestScoreTotal: 0,
      scoredSections: 0,
    };
    performance.completedStages += 1;
    performanceByUser.set(progress.userId, performance);
  }

  const rankedPlayers = userList
    .filter((user) => user.role === "PLAYER")
    .map((user) => {
      const performance = performanceByUser.get(user.id) ?? {
        passedSections: 0,
        completedStages: 0,
        attempts: 0,
        bestScoreTotal: 0,
        scoredSections: 0,
      };
      return {
        ...user,
        ...performance,
        averageBestScore:
          performance.scoredSections > 0
            ? performance.bestScoreTotal / performance.scoredSections
            : null,
      };
    })
    .sort((left, right) => {
      const scoreDifference = (right.averageBestScore ?? -1) - (left.averageBestScore ?? -1);
      if (scoreDifference !== 0) {
        return scoreDifference;
      }
      if (right.passedSections !== left.passedSections) {
        return right.passedSections - left.passedSections;
      }
      if (right.completedStages !== left.completedStages) {
        return right.completedStages - left.completedStages;
      }
      return (left.profile?.fullName || left.email).localeCompare(
        right.profile?.fullName || right.email,
        "fr",
      );
    });

  return (
    <div className="flex flex-col gap-6">
      <header>
        <p className="text-xs font-semibold tracking-[0.18em] text-olive-800 uppercase">
          Administration
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">
          Utilisateurs
        </h1>
        <p className="mt-2 text-sm text-stone-600">
          {userList.length} compte{userList.length > 1 ? "s" : ""} inscrit
          {userList.length > 1 ? "s" : ""} au jeu
        </p>
      </header>

      <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
        {userList.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-stone-500">
            Aucun utilisateur pour le moment.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] border-collapse text-left text-sm">
              <thead className="bg-stone-50 text-xs font-semibold tracking-wide text-stone-500 uppercase">
                <tr>
                  <th scope="col" className="px-4 py-3">Utilisateur</th>
                  <th scope="col" className="px-4 py-3">Rôle</th>
                  <th scope="col" className="px-4 py-3">Téléphone</th>
                  <th scope="col" className="px-4 py-3">Pays</th>
                  <th scope="col" className="px-4 py-3">Langue</th>
                  <th scope="col" className="px-4 py-3">Inscription</th>
                  <th scope="col" className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {userList.map((user) => (
                  <tr key={user.id}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-stone-900">
                        {user.profile?.fullName || "Profil à compléter"}
                      </p>
                      <p className="mt-0.5 text-xs text-stone-500">{user.email}</p>
                    </td>
                    <td className="px-4 py-3 text-stone-700">
                      {user.role === "ADMIN" ? "Administrateur" : "Joueur"}
                    </td>
                    <td className="px-4 py-3 text-stone-700">
                      {user.profile?.phone || "—"}
                    </td>
                    <td className="px-4 py-3 text-stone-700">
                      {user.profile ? countryLabel(user.profile.countryCode) : "—"}
                    </td>
                    <td className="px-4 py-3 text-stone-700">
                      {user.profile ? localeLabel(user.profile.locale) : "—"}
                    </td>
                    <td className="px-4 py-3 text-stone-700">
                      {user.createdAt.toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end">
                        <UserRowActions
                          userId={user.id}
                          canDelete={user.id !== admin.id}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <section className="flex flex-col gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-stone-900">
            Classement des joueurs
          </h2>
          <p className="mt-1 text-sm text-stone-600">
            Trié par moyenne des meilleures notes, puis par sections réussies et stages terminés.
          </p>
        </div>
        <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
          {rankedPlayers.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-stone-500">
              Aucun joueur à classer pour le moment.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] border-collapse text-left text-sm">
                <thead className="bg-stone-50 text-xs font-semibold tracking-wide text-stone-500 uppercase">
                  <tr>
                    <th scope="col" className="px-4 py-3">Rang</th>
                    <th scope="col" className="px-4 py-3">Joueur</th>
                    <th scope="col" className="px-4 py-3">Contact</th>
                    <th scope="col" className="px-4 py-3">Moyenne des meilleures notes</th>
                    <th scope="col" className="px-4 py-3">Sections réussies</th>
                    <th scope="col" className="px-4 py-3">Stages terminés</th>
                    <th scope="col" className="px-4 py-3">Tentatives</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {rankedPlayers.map((player, index) => (
                    <tr key={player.id}>
                      <td className="px-4 py-3 font-semibold text-stone-500">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-stone-900">
                          {player.profile?.fullName || "Profil à compléter"}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-stone-700">
                        <p>{player.email}</p>
                        <p className="mt-0.5 text-xs text-stone-500">
                          {player.profile?.phone || "Téléphone non renseigné"}
                        </p>
                      </td>
                      <td className="px-4 py-3 font-medium text-stone-800">
                        {player.averageBestScore === null
                          ? "—"
                          : player.averageBestScore.toLocaleString("fr-FR", {
                              maximumFractionDigits: 1,
                            })}
                      </td>
                      <td className="px-4 py-3 text-stone-700">
                        {player.passedSections}
                      </td>
                      <td className="px-4 py-3 text-stone-700">
                        {player.completedStages}
                      </td>
                      <td className="px-4 py-3 text-stone-700">
                        {player.attempts}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
