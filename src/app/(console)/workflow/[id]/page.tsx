import { WorkflowDetailView } from "@/features/workflow";

export default async function WorkflowDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <WorkflowDetailView workflowId={id} />;
}
