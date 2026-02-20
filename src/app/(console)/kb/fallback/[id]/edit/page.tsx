import { KbFallbackEditor } from "@/features/kb";

export default async function KbFallbackItemEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <KbFallbackEditor fallbackId={id} />;
}
