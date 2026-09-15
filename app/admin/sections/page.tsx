import { AdminSectionsBoard } from "@/app/ui/admin-sections-board";
import { getAdminStagesWithQuestionCounts, localeLabel } from "@/lib/catalog";
import { requireAdmin } from "@/lib/dal";

export default async function AdminSectionsPage() {
  await requireAdmin();

  const catalog = await getAdminStagesWithQuestionCounts();

  return (
    <AdminSectionsBoard
      stages={catalog.map((stage) => ({
        id: stage.id,
        title: stage.title,
        localeLabel: localeLabel(stage.locale),
        published: stage.published,
        orderIndex: stage.orderIndex,
        sections: stage.sections.map((section) => ({
          id: section.id,
          title: section.title,
          orderIndex: section.orderIndex,
          published: section.published,
          questionCount: section.questionCount,
          imageUrl: section.imageUrl,
        })),
      }))}
    />
  );
}
