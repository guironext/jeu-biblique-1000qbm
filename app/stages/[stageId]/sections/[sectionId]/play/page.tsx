import { redirect } from "next/navigation";

export default async function PlayRedirect({
  params,
}: {
  params: Promise<{ stageId: string; sectionId: string }>;
}) {
  const { stageId, sectionId } = await params;
  redirect(`/joueur/stages/${stageId}/sections/${sectionId}/play`);
}
