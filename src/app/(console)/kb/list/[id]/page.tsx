import { KbDetailView } from "@/features/kb";

export default async function KbItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <KbDetailView kbId={id} />;
}
