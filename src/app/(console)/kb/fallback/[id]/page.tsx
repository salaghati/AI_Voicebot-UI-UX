import { KbFallbackDetailView } from "@/features/kb";

export default async function KbFallbackItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <KbFallbackDetailView fallbackId={id} />;
}
