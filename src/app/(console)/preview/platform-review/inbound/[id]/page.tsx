"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDateTime } from "@/lib/utils";
import { getKnowledgeRef, getWorkflowRef, inboundRoutesMock } from "@/features/platform-review/mock";

type DetailTab = "configure" | "workflow" | "knowledge" | "data-source";

function toneByStatus(status: string) {
  if (status === "Hoạt động") return "success" as const;
  if (status === "Nháp") return "warning" as const;
  return "muted" as const;
}

export default function InboundRouteDetailPreviewPage() {
  const params = useParams<{ id: string }>();
  const route = inboundRoutesMock.find((item) => item.id === params.id);
  const [tab, setTab] = useState<DetailTab>("configure");

  const workflow = useMemo(() => (route ? getWorkflowRef(route.workflowId) : null), [route]);
  const knowledge = useMemo(() => (route ? getKnowledgeRef(route.kbId) : null), [route]);

  if (!route) {
    return (
      <Card>
        <p className="text-sm">Không tìm thấy inbound route.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title={route.name}
        description="Inbound Detail theo pattern chatbot."
        actions={
          <div className="flex items-center gap-2">
            <Badge tone={toneByStatus(route.status)}>{route.status}</Badge>
            <Link href="/preview/platform-review/inbound">
              <Button variant="secondary" className="gap-2"><ArrowLeft className="h-4 w-4" /> Danh sách</Button>
            </Link>
          </div>
        }
      />

      <Card className="space-y-3">
        <div className="grid gap-2 md:grid-cols-4">
          {[
            { id: "configure", label: "Configure" },
            { id: "workflow", label: "Workflow" },
            { id: "knowledge", label: "Knowledge" },
            { id: "data-source", label: "Data source" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id as DetailTab)}
              className={`rounded-lg border px-3 py-2 text-sm ${tab === item.id ? "border-[var(--accent)] bg-[rgba(24,144,255,0.12)] text-[var(--accent)]" : "border-[var(--line)] bg-white"}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </Card>

      {tab === "configure" ? (
        <Card className="grid gap-3 md:grid-cols-2">
          <div>
            <p className="text-xs text-[var(--text-dim)]">Route ID</p>
            <p className="font-semibold">{route.id}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--text-dim)]">Cập nhật</p>
            <p className="font-semibold">{formatDateTime(route.updatedAt)}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--text-dim)]">Queue / Extension</p>
            <p className="font-semibold">{route.queue} / {route.extension}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--text-dim)]">Entry point</p>
            <p className="font-semibold">{route.entryPoint}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-xs text-[var(--text-dim)]">Description</p>
            <p className="font-semibold">{route.description}</p>
          </div>
        </Card>
      ) : null}

      {tab === "workflow" ? (
        <Card className="space-y-3">
          <p className="text-sm text-[var(--text-dim)]">Inbound route chỉ giữ reference workflowId.</p>
          <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-4">
            <p className="text-xs text-[var(--text-dim)]">Workflow reference</p>
            <Link href={`/preview/platform-review/workflows/${route.workflowId}`} className="text-lg font-semibold text-[var(--accent)] hover:underline">
              {workflow?.name || route.workflowId}
            </Link>
            <p className="mt-1 text-sm text-[var(--text-dim)]">{route.workflowId} • Version {workflow?.version || "N/A"}</p>
            <p className="mt-2 text-sm">{workflow?.summary}</p>
          </div>
        </Card>
      ) : null}

      {tab === "knowledge" ? (
        <Card className="space-y-3">
          <p className="text-sm text-[var(--text-dim)]">Inbound route chỉ giữ kbId, dữ liệu tri thức nằm ở Knowledge Base module.</p>
          <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-4">
            <p className="text-xs text-[var(--text-dim)]">Knowledge reference</p>
            <Link href={`/preview/platform-review/kb/${route.kbId}`} className="text-lg font-semibold text-[var(--accent)] hover:underline">
              {knowledge?.title || route.kbId}
            </Link>
            <p className="mt-1 text-sm text-[var(--text-dim)]">{route.kbId} • Nguồn {knowledge?.sourceType || "N/A"}</p>
            <p className="mt-2 text-sm">{knowledge?.summary}</p>
          </div>
        </Card>
      ) : null}

      {tab === "data-source" ? (
        <Card className="space-y-3">
          <p className="text-sm text-[var(--text-dim)]">Nguồn vào của inbound route.</p>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-3">
              <p className="text-xs text-[var(--text-dim)]">Entry number</p>
              <p className="font-semibold">{route.entryPoint}</p>
            </div>
            <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-3">
              <p className="text-xs text-[var(--text-dim)]">Queue</p>
              <p className="font-semibold">{route.queue}</p>
            </div>
            <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-3">
              <p className="text-xs text-[var(--text-dim)]">Extension</p>
              <p className="font-semibold">{route.extension}</p>
            </div>
          </div>
        </Card>
      ) : null}
    </div>
  );
}
