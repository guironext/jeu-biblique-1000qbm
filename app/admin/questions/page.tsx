import { Source_Serif_4 } from "next/font/google";
import { AdminQuestionsBoard } from "@/app/ui/admin-questions-board";
import { getAdminQuestionCatalog, localeLabel } from "@/lib/catalog";
import { requireAdmin } from "@/lib/dal";

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["600", "700"],
});

export default async function AdminQuestionsPage() {
  await requireAdmin();

  const catalog = await getAdminQuestionCatalog();

  return (
    <AdminQuestionsBoard
      headingClassName={sourceSerif.className}
      sections={catalog.map((section) => ({
        id: section.id,
        title: section.title,
        orderIndex: section.orderIndex,
        published: section.published,
        stageId: section.stageId,
        stageTitle: section.stageTitle,
        localeLabel: localeLabel(section.stageLocale),
        questions: section.questions,
      }))}
    />
  );
}
