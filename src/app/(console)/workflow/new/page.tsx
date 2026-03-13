import { WorkflowBuilder } from "@/features/workflow";

export default async function WorkflowNewPage({
  searchParams,
}: {
  searchParams: Promise<{
    prefillName?: string;
    prefillDescription?: string;
    prefillKind?: "Inbound" | "Outbound" | "Playground";
    returnTo?: string;
    sourceContext?: string;
  }>;
}) {
  const params = await searchParams;

  return (
    <WorkflowBuilder
      prefill={{
        name: params.prefillName,
        description: params.prefillDescription,
        kind: params.prefillKind,
        returnTo: params.returnTo,
        sourceContext: params.sourceContext,
      }}
    />
  );
}
