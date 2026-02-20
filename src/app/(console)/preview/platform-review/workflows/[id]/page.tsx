"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDateTime } from "@/lib/utils";
import { getWorkflowRef } from "@/features/platform-review/mock";

export default function WorkflowReferencePreviewPage() {
  const params = useParams<{ id: string }>();
  const workflow = getWorkflowRef(params.id);

  if (!workflow) {
    return <Card><p className="text-sm">Không tìm thấy workflow reference.</p></Card>;
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title={workflow.name}
        description="Workflow reference detail (preview mode)"
        actions={
          <Link href="/preview/platform-review/outbound">
            <Button variant="secondary" className="gap-2"><ArrowLeft className="h-4 w-4" /> Quay lại list</Button>
          </Link>
        }
      />

      <Card className="grid gap-3 md:grid-cols-2">
        <div>
          <p className="text-xs text-[var(--text-dim)]">Workflow ID</p>
          <p className="font-semibold">{workflow.id}</p>
        </div>
        <div>
          <p className="text-xs text-[var(--text-dim)]">Kind</p>
          <Badge tone="info">{workflow.kind}</Badge>
        </div>
        <div>
          <p className="text-xs text-[var(--text-dim)]">Version</p>
          <p className="font-semibold">{workflow.version}</p>
        </div>
        <div>
          <p className="text-xs text-[var(--text-dim)]">Updated</p>
          <p className="font-semibold">{formatDateTime(workflow.updatedAt)}</p>
        </div>
        <div className="md:col-span-2">
          <p className="text-xs text-[var(--text-dim)]">Summary</p>
          <p className="font-semibold">{workflow.summary}</p>
        </div>
      </Card>
    </div>
  );
}
