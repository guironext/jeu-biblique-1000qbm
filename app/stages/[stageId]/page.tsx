import { redirect } from "next/navigation";

export default async function StageRedirect({
  params,
}: {
  params: Promise<{ stageId: string }>;
}) {
  const { stageId } = await params;
  redirect(`/joueur/stages/${stageId}`);
}
