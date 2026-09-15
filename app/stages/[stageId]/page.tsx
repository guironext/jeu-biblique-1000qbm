import { and, asc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { Source_Serif_4 } from "next/font/google";
import { SectionList } from "@/app/ui/section-list";
import { getPublishedStageInLocale } from "@/lib/catalog";
import { requireOnboardedPlayer } from "@/lib/dal";
import { db } from "@/lib/db";
import { sectionProgress, sections, stageProgress } from "@/lib/db/schema";

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["600", "700"],
});

export default async function StageSectionsPage({
  params,
}: {
  params: Promise<{ stageId: string }>;
}) {
  const { stageId } = await params;
  const { user, profile } = await requireOnboardedPlayer();

  const stage = await getPublishedStageInLocale(stageId, profile.locale);

  if (!stage) {
    redirect("/stages");
  }

  const progress = await db.query.stageProgress.findFirst({
    where: and(
      eq(stageProgress.userId, user.id),
      eq(stageProgress.stageId, stage.id),
    ),
  });

  if (!progress || progress.status === "LOCKED") {
    redirect("/stages");
  }

  const stageSections = await db.query.sections.findMany({
    where: and(eq(sections.stageId, stage.id), eq(sections.published, true)),
    orderBy: [asc(sections.orderIndex)],
  });

  const sectionRows = await db.query.sectionProgress.findMany({
    where: eq(sectionProgress.userId, user.id),
  });
  const progressBySection = new Map(
    sectionRows.map((row) => [row.sectionId, row.status]),
  );

  return (
    <SectionList
      stageTitle={stage.title}
      headingClassName={sourceSerif.className}
      sections={stageSections.map((section) => ({
        id: section.id,
        title: section.title,
        status: progressBySection.get(section.id) ?? "LOCKED",
        href: `/stages/${stage.id}/sections/${section.id}/play`,
        imageUrl: section.imageUrl,
      }))}
    />
  );
}
