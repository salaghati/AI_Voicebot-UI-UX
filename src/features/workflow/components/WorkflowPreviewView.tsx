"use client";

import Link from "next/link";
import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchWorkflow, fetchWorkflowPreview } from "@/lib/api-client";
import { preserveQuery } from "@/lib/query-utils";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { TabsNav } from "@/components/ui/tabs";
import { StateSwitcher } from "@/components/shared/state-switcher";
import { AsyncState } from "@/components/shared/async-state";
import { Badge } from "@/components/ui/badge";
import { getWorkflowNodeTypeLabel } from "@/lib/workflow-node-meta";
import { WorkflowDiagramCanvas } from "./WorkflowDiagramCanvas";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/utils";

const tabMap = {
  session: "Phiên",
  conversation: "Hội thoại",
  kb: "KB",
  "api-log": "API/Call Log",
} as const;

export function WorkflowPreviewView({ workflowId, tab }: { workflowId: string; tab: keyof typeof tabMap }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const workflow = useQuery({
    queryKey: ["workflow", workflowId],
    queryFn: () => fetchWorkflow(workflowId),
  });

  const activeNodeId = useMemo(
    () => params.get("nodeId") || workflow.data?.data.nodes[0]?.id,
    [params, workflow.data?.data.nodes],
  );
  const queryState = useMemo(
    () => ({
      state: params.get("state") || undefined,
      nodeId: activeNodeId,
    }),
    [activeNodeId, params],
  );
  const preview = useQuery({
    queryKey: ["workflow-preview", workflowId, tab, queryState],
    queryFn: () => fetchWorkflowPreview(workflowId, tab, queryState),
    enabled: Boolean(activeNodeId),
  });

  const search = new URLSearchParams(params.toString());
  const selectedNode = useMemo(
    () => workflow.data?.data.nodes.find((item) => item.id === activeNodeId) ?? workflow.data?.data.nodes[0],
    [activeNodeId, workflow.data?.data.nodes],
  );

  const selectNode = (nodeId: string) => {
    const next = new URLSearchParams(params.toString());
    next.set("nodeId", nodeId);
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };

  if (workflow.isLoading) {
    return <AsyncState state="loading" />;
  }

  if (workflow.isError || !workflow.data?.data) {
    return <AsyncState state="error" onRetry={() => workflow.refetch()} />;
  }

  const wf = workflow.data.data;
  const previewItems = preview.data?.data ?? [];
  const currentOutcome =
    tab === "api-log" ? "Success" : previewItems.length > 0 ? "Running" : "Idle";
  const currentLabel =
    selectedNode?.label ?? previewItems[0]?.nodeLabel ?? wf.nodes[0]?.label ?? "N/A";

  return (
    <div className="space-y-4">
      <PageHeader
        title={`Preview - ${wf.name}`}
        description="Mô phỏng runtime cho toàn bộ workflow. Click node để lọc log theo node đang chọn."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={wf.status === "Active" ? "success" : "muted"}>{wf.status.toUpperCase()}</Badge>
            <Badge tone="info">{wf.kind}</Badge>
            <Button variant="secondary">Reset</Button>
            <Button>Bắt đầu</Button>
            <Button variant="secondary">Xuất trace</Button>
          </div>
        }
      />

      <div className="overflow-hidden rounded-xl border border-[var(--line)] bg-white">
        <div className="grid min-h-[760px] xl:grid-cols-[1fr_400px]">
          <WorkflowDiagramCanvas
            nodes={wf.nodes}
            selectedId={selectedNode?.id}
            activeNodeId={selectedNode?.id}
            onSelect={selectNode}
            title={`Diagram - ${tabMap[tab]}`}
            subtitle="Workflow-level preview: log bên phải là dữ liệu runtime của workflow, đang filter theo node nếu bạn chọn."
          />

          <aside className="border-l border-[var(--line)] bg-[#fbfcff] p-4">
            <div className="mb-4 flex items-center justify-between rounded-xl border border-[var(--line)] bg-white px-3 py-2 text-sm">
              <div>
                <p className="text-xs text-[var(--text-dim)]">Session</p>
                <p className="font-semibold">sess_{wf.id.slice(-6).toLowerCase()}_preview</p>
              </div>
              <Link href={`/workflow/${workflowId}`}>
                <Button variant="ghost" size="sm">Về workflow</Button>
              </Link>
            </div>

            <Card className="space-y-3">
              <TabsNav
                items={[
                  {
                    label: "Phiên",
                    href: preserveQuery(`/workflow/${workflowId}/preview/session`, search),
                    active: tab === "session",
                  },
                  {
                    label: "Hội thoại",
                    href: preserveQuery(`/workflow/${workflowId}/preview/conversation`, search),
                    active: tab === "conversation",
                  },
                  {
                    label: "KB",
                    href: preserveQuery(`/workflow/${workflowId}/preview/kb`, search),
                    active: tab === "kb",
                  },
                  {
                    label: "API/Callog",
                    href: preserveQuery(`/workflow/${workflowId}/preview/api-log`, search),
                    active: tab === "api-log",
                  },
                ]}
              />
              <StateSwitcher />
              {selectedNode ? (
                <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-3 text-sm">
                  <p className="text-xs font-semibold text-[var(--text-dim)]">Đang lọc theo node</p>
                  <p className="mt-1 font-semibold">{selectedNode.label}</p>
                  <div className="mt-2">
                    <Badge tone="info">{getWorkflowNodeTypeLabel(selectedNode.type)}</Badge>
                  </div>
                </div>
              ) : null}
            </Card>

            <div className="mt-4">
              <Card className="mb-4 space-y-3">
                <h4 className="text-sm font-bold">Tóm tắt phiên</h4>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-[var(--text-dim)]">Workflow</p>
                    <p className="text-sm font-semibold">{wf.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-dim)]">Current node</p>
                    <p className="text-sm font-semibold">{currentLabel}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-dim)]">Outcome</p>
                    <div className="mt-1">
                      <Badge tone={currentOutcome === "Success" ? "success" : currentOutcome === "Running" ? "info" : "muted"}>
                        {currentOutcome}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--text-dim)]">Cập nhật workflow</p>
                    <p className="text-sm font-semibold">{formatDateTime(wf.updatedAt)}</p>
                  </div>
                </div>
              </Card>

              {preview.isLoading ? <AsyncState state="loading" /> : null}
              {preview.isError ? <AsyncState state="error" onRetry={() => preview.refetch()} /> : null}
              {!preview.isLoading && !preview.isError && (preview.data?.data.length ?? 0) === 0 ? (
                <AsyncState state="empty" />
              ) : null}

              {!preview.isLoading && !preview.isError && (preview.data?.data.length ?? 0) > 0 ? (
                <div className="space-y-3">
                  {preview.data?.data.map((item, index) => (
                    <div key={`${item.time}-${index}`} className="rounded-xl border border-[var(--line)] bg-white p-3">
                      <div className="flex items-center justify-between gap-2 text-sm">
                        <span className="font-medium">{item.speaker}</span>
                        <span className="text-[var(--text-dim)]">{item.time}</span>
                      </div>
                      <p className="mt-1 text-sm text-[var(--text-main)]">{item.content}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                        {item.nodeLabel ? <Badge>{item.nodeLabel}</Badge> : null}
                        {item.confidence ? (
                          <span className="text-[var(--text-dim)]">
                            Confidence: {(item.confidence * 100).toFixed(1)}%
                          </span>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              <div className="mt-4 flex gap-2">
                <Button variant="secondary" className="flex-1">Copy Log</Button>
                <Button variant="secondary" className="flex-1">Báo lỗi</Button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
