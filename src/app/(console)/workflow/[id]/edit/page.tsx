import { WorkflowBuilder } from "@/features/workflow";

export default async function WorkflowEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <WorkflowBuilder workflowId={id} />;
}
