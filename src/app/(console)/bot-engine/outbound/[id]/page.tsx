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
import { getKnowledgeRef, getWorkflowRef, outboundCampaignsMock } from "@/features/bot-engine/mock";

type DetailTab = "configure" | "workflow" | "knowledge" | "data-source";

function toneByStatus(status: string) {
  if (status === "Đang chạy") return "success" as const;
  if (status === "Nháp") return "warning" as const;
  if (status === "Tạm dừng") return "muted" as const;
  return "info" as const;
}

export default function OutboundCampaignDetailPage() {
  const params = useParams<{ id: string }>();
  const campaign = outboundCampaignsMock.find((item) => item.id === params.id);
  const [tab, setTab] = useState<DetailTab>("configure");

  const workflow = useMemo(
    () => (campaign ? getWorkflowRef(campaign.workflowId) : null),
    [campaign],
  );
  const knowledge = useMemo(
    () => (campaign ? getKnowledgeRef(campaign.kbId) : null),
    [campaign],
  );

  if (!campaign) {
    return (
      <Card>
        <p className="text-sm">Không tìm thấy campaign.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title={campaign.name}
        description="Chi tiết Campaign"
        actions={
          <div className="flex items-center gap-2">
            <Badge tone={toneByStatus(campaign.status)}>{campaign.status}</Badge>
            <Link href="/bot-engine/outbound">
              <Button variant="secondary" className="gap-2"><ArrowLeft className="h-4 w-4" /> Danh sách</Button>
            </Link>
          </div>
        }
      />

      <Card className="space-y-3">
        <div className="grid gap-2 md:grid-cols-4">
          {([
            { id: "configure", label: "Configure" },
            { id: "workflow", label: "Workflow" },
            { id: "knowledge", label: "Knowledge" },
            { id: "data-source", label: "Data source" },
          ] as const).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
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
            <p className="text-xs text-[var(--text-dim)]">Campaign ID</p>
            <p className="font-semibold">{campaign.id}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--text-dim)]">Ngày tạo</p>
            <p className="font-semibold">{formatDateTime(campaign.createdAt)}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--text-dim)]">Lịch gọi</p>
            <p className="font-semibold">{campaign.schedule}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--text-dim)]">Retry rule</p>
            <p className="font-semibold">{campaign.retryRule}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-xs text-[var(--text-dim)]">Description</p>
            <p className="font-semibold">{campaign.description}</p>
          </div>
        </Card>
      ) : null}

      {tab === "workflow" ? (
        <Card className="space-y-3">
          <p className="text-sm text-[var(--text-dim)]">Campaign chỉ reference workflow, không nhúng node data.</p>
          <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-4">
            <p className="text-xs text-[var(--text-dim)]">Workflow reference</p>
            <Link href={`/workflow/${campaign.workflowId}`} className="text-lg font-semibold text-[var(--accent)] hover:underline">
              {workflow?.name || campaign.workflowId}
            </Link>
            <p className="mt-1 text-sm text-[var(--text-dim)]">{campaign.workflowId} • Version {workflow?.version || "N/A"}</p>
            <p className="mt-2 text-sm">{workflow?.summary}</p>
          </div>
        </Card>
      ) : null}

      {tab === "knowledge" ? (
        <Card className="space-y-3">
          <p className="text-sm text-[var(--text-dim)]">Campaign chỉ giữ kbId, tri thức được quản lý độc lập tại module Knowledge Base.</p>
          <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-4">
            <p className="text-xs text-[var(--text-dim)]">Knowledge reference</p>
            <Link href={`/kb/list/${campaign.kbId}`} className="text-lg font-semibold text-[var(--accent)] hover:underline">
              {knowledge?.title || campaign.kbId}
            </Link>
            <p className="mt-1 text-sm text-[var(--text-dim)]">{campaign.kbId} • Nguồn {knowledge?.sourceType || "N/A"}</p>
            <p className="mt-2 text-sm">{knowledge?.summary}</p>
          </div>
        </Card>
      ) : null}

      {tab === "data-source" ? (
        <Card className="space-y-3">
          <p className="text-sm text-[var(--text-dim)]">Nguồn dữ liệu gọi ra của campaign.</p>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-3">
              <p className="text-xs text-[var(--text-dim)]">Data Source</p>
              <p className="font-semibold">{campaign.dataSource}</p>
            </div>
            <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-3">
              <p className="text-xs text-[var(--text-dim)]">Số cuộc gọi</p>
              <p className="font-semibold">{campaign.totalCalls}</p>
            </div>
            <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-3">
              <p className="text-xs text-[var(--text-dim)]">Tỉ lệ thành công</p>
              <p className="font-semibold">{campaign.successRate}%</p>
            </div>
          </div>
        </Card>
      ) : null}
    </div>
  );
}
