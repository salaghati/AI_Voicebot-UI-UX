import { KbEditForm } from "@/features/kb";

export default async function KbItemEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <KbEditForm kbId={id} />;
}
