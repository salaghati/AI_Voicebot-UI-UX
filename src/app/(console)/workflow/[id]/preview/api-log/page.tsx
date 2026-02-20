import { WorkflowPreviewView } from "@/features/workflow";

export default async function WorkflowPreviewApiLogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <WorkflowPreviewView workflowId={id} tab="api-log" />;
}
