import { WorkflowPreviewView } from "@/features/workflow";

export default async function WorkflowPreviewKbPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <WorkflowPreviewView workflowId={id} tab="kb" />;
}
