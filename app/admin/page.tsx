import { Source_Serif_4 } from "next/font/google";
import { count, eq } from "drizzle-orm";
import { AdminDashboard } from "@/app/ui/admin-dashboard";
import { getAdminStages, localeLabel } from "@/lib/catalog";
import { requireAdmin } from "@/lib/dal";
import { db } from "@/lib/db";
import { answers, questions, sections, stages } from "@/lib/db/schema";

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["600", "700"],
});

export default async function AdminHomePage() {
  await requireAdmin();

  const [stageCount] = await db.select({ value: count() }).from(stages);
  const [publishedStageCount] = await db
    .select({ value: count() })
    .from(stages)
    .where(eq(stages.published, true));
  const [sectionCount] = await db.select({ value: count() }).from(sections);
  const [questionCount] = await db.select({ value: count() }).from(questions);
  const [answerCount] = await db.select({ value: count() }).from(answers);

  const recentStages = (await getAdminStages()).slice(0, 4);

  const stats = [
    {
      label: "Stages",
      value: stageCount.value,
      hint: `${publishedStageCount.value} publié${
        publishedStageCount.value > 1 ? "s" : ""
      }`,
      href: "/admin/stages",
    },
    {
      label: "Sections",
      value: sectionCount.value,
      hint: "Réparties dans les stages",
      href: "/admin/sections",
    },
    {
      label: "Questions",
      value: questionCount.value,
      hint: `${answerCount.value} réponse${
        answerCount.value > 1 ? "s" : ""
      } au total`,
      href: "/admin/questions",
    },
  ];

  return (
    <AdminDashboard
      headingClassName={sourceSerif.className}
      publishedStages={publishedStageCount.value}
      totalStages={stageCount.value}
      stats={stats}
      stages={recentStages.map((stage) => ({
        id: stage.id,
        title: stage.title,
        localeLabel: localeLabel(stage.locale),
        published: stage.published,
        sectionCount: stage.sections.length,
        orderIndex: stage.orderIndex,
        imageUrl: stage.imageUrl,
      }))}
    />
  );
}
