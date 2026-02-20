"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDateTime } from "@/lib/utils";
import { getKnowledgeRef } from "@/features/platform-review/mock";

function toneByStatus(status: string) {
  if (status === "Đã học") return "success" as const;
  if (status === "Đang học") return "info" as const;
  return "warning" as const;
}

export default function KnowledgeReferencePreviewPage() {
  const params = useParams<{ id: string }>();
  const kb = getKnowledgeRef(params.id);

  if (!kb) {
    return <Card><p className="text-sm">Không tìm thấy knowledge reference.</p></Card>;
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title={kb.title}
        description="Knowledge Base reference detail (preview mode)"
        actions={
          <Link href="/preview/platform-review/outbound">
            <Button variant="secondary" className="gap-2"><ArrowLeft className="h-4 w-4" /> Quay lại list</Button>
          </Link>
        }
      />

      <Card className="grid gap-3 md:grid-cols-2">
        <div>
          <p className="text-xs text-[var(--text-dim)]">KB ID</p>
          <p className="font-semibold">{kb.id}</p>
        </div>
        <div>
          <p className="text-xs text-[var(--text-dim)]">Status</p>
          <Badge tone={toneByStatus(kb.status)}>{kb.status}</Badge>
        </div>
        <div>
          <p className="text-xs text-[var(--text-dim)]">Source type</p>
          <p className="font-semibold">{kb.sourceType}</p>
        </div>
        <div>
          <p className="text-xs text-[var(--text-dim)]">Updated</p>
          <p className="font-semibold">{formatDateTime(kb.updatedAt)}</p>
        </div>
        <div className="md:col-span-2">
          <p className="text-xs text-[var(--text-dim)]">Summary</p>
          <p className="font-semibold">{kb.summary}</p>
        </div>
      </Card>
    </div>
  );
}
