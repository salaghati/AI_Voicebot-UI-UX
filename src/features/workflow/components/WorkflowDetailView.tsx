"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, History, Pencil, X } from "lucide-react";
import { fetchWorkflow } from "@/lib/api-client";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AsyncState } from "@/components/shared/async-state";
import { formatDateTime } from "@/lib/utils";
import { mapStatusTone } from "@/lib/mappers";
import { WorkflowDiagramCanvas } from "./WorkflowDiagramCanvas";

function parseVersion(version: string) {
  const numeric = Number.parseFloat(version.replace("v", ""));
  return Number.isFinite(numeric) ? numeric : 1;
}

function buildVersionHistory(version: string, status: "Active" | "Draft", updatedAt: string) {
  const base = parseVersion(version);
  const baseTime = new Date(updatedAt).getTime();
  return Array.from({ length: 6 }).map((_, index) => {
    const nextVersion = Math.max(1, base - index * 0.1);
    const versionText = `v${nextVersion.toFixed(1)}`;
    const timeOffset = baseTime - index * 86400000;
    return {
      id: `${versionText}-${index}`,
      version: versionText,
      status: index === 0 ? status : index % 2 === 0 ? "Draft" : "Active",
      updatedAt: new Date(timeOffset).toISOString(),
    };
  });
}

export function WorkflowDetailView({ workflowId }: { workflowId: string }) {
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const [showVersions, setShowVersions] = useState(false);
  const versionRef = useRef<HTMLDivElement>(null);

  const closeVersions = useCallback((e: MouseEvent) => {
    if (versionRef.current && !versionRef.current.contains(e.target as Node)) {
      setShowVersions(false);
    }
  }, []);

  useEffect(() => {
    if (showVersions) {
      document.addEventListener("mousedown", closeVersions);
      return () => document.removeEventListener("mousedown", closeVersions);
    }
  }, [showVersions, closeVersions]);

  const query = useQuery({
    queryKey: ["workflow", workflowId],
    queryFn: () => fetchWorkflow(workflowId),
  });
  const wf = query.data?.data;
  const selectedNode = useMemo(
    () => {
      const nodes = wf?.nodes ?? [];
      return nodes.find((node) => node.id === selectedId) ?? nodes[0];
    },
    [wf?.nodes, selectedId],
  );

  if (query.isLoading) {
    return <AsyncState state="loading" />;
  }

  if (query.isError || !query.data?.data) {
    return <AsyncState state="error" onRetry={() => query.refetch()} />;
  }

  const currentWorkflow = query.data.data;
  const versionHistory = useMemo(
    () => buildVersionHistory(currentWorkflow.version, currentWorkflow.status, currentWorkflow.updatedAt),
    [currentWorkflow.version, currentWorkflow.status, currentWorkflow.updatedAt],
  );

  return (
    <div className="space-y-4">
      <PageHeader
        title={currentWorkflow.name}
        description="Chi tiết workflow theo dạng diagram. Chọn node để xem properties tương ứng."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={mapStatusTone(currentWorkflow.status)}>{currentWorkflow.status}</Badge>
            <Badge tone="info">{currentWorkflow.kind}</Badge>
            <div className="relative" ref={versionRef}>
              <Button
                variant="secondary"
                className="gap-2"
                onClick={() => setShowVersions((prev) => !prev)}
              >
                <History className="h-4 w-4" /> Version history
              </Button>
              {showVersions ? (
                <div className="absolute right-0 top-full z-30 mt-2 w-80 rounded-xl border border-[var(--line)] bg-white shadow-xl">
                  <div className="flex items-center justify-between border-b border-[var(--line)] px-4 py-3">
                    <h4 className="text-sm font-bold">Version history</h4>
                    <button type="button" onClick={() => setShowVersions(false)} className="rounded-lg p-1 hover:bg-[var(--surface-2)]">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto p-2">
                    {versionHistory.map((item, index) => (
                      <Link
                        key={item.id}
                        href={`/workflow/${currentWorkflow.id}/preview/session?version=${item.version}`}
                        onClick={() => setShowVersions(false)}
                        className="flex items-start gap-3 rounded-lg px-3 py-2.5 hover:bg-[var(--surface-2)]"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold">{item.version}</span>
                            {index === 0 ? <Badge tone="success">PUBLIC</Badge> : null}
                            {index !== 0 ? <Badge tone={mapStatusTone(item.status)}>{item.status}</Badge> : null}
                          </div>
                          <p className="mt-0.5 text-xs text-[var(--text-dim)]">
                            Created on: {formatDateTime(item.updatedAt)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="border-t border-[var(--line)] p-2">
                    <Link
                      href={`/workflow/${currentWorkflow.id}/versions`}
                      onClick={() => setShowVersions(false)}
                      className="block rounded-lg px-3 py-2 text-center text-sm font-medium text-[var(--accent)] hover:bg-[var(--surface-2)]"
                    >
                      Xem tất cả versions
                    </Link>
                  </div>
                </div>
              ) : null}
            </div>
            <Link href={`/workflow/${currentWorkflow.id}/edit`}>
              <Button variant="secondary" className="gap-2">
                <Pencil className="h-4 w-4" /> Chỉnh sửa
              </Button>
            </Link>
            <Link href={`/workflow/${currentWorkflow.id}/preview/session`}>
              <Button className="gap-2">
                Show Preview <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        }
      />

      <div className="overflow-hidden rounded-xl border border-[var(--line)] bg-white">
        <div className="grid min-h-[740px] xl:grid-cols-[1fr_360px]">
          <WorkflowDiagramCanvas
            nodes={currentWorkflow.nodes}
            selectedId={selectedNode?.id}
            onSelect={setSelectedId}
            title="Workflow Diagram"
            subtitle="Click vào từng node trong diagram để xem nội dung và metadata bên phải."
          />
          <aside className="border-l border-[var(--line)] bg-[#fbfcff] p-4">
            <h3 className="text-lg font-bold">Properties - {selectedNode?.label || "Node"}</h3>
            {selectedNode ? (
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-xs font-semibold text-[var(--text-dim)]">Tên node</p>
                  <div className="mt-1 rounded-xl border border-[var(--line)] bg-white px-3 py-2 text-sm font-medium">
                    {selectedNode.label}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[var(--text-dim)]">Loại node</p>
                  <div className="mt-1">
                    <Badge tone="info">{selectedNode.type}</Badge>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[var(--text-dim)]">Nội dung xử lý</p>
                  <div className="mt-1 rounded-xl border border-[var(--line)] bg-white p-3 text-sm text-[var(--text-main)]">
                    {selectedNode.value}
                  </div>
                </div>
                {selectedNode.type === "Intent" ? (
                  <div className="space-y-2 rounded-xl border border-[var(--line)] bg-white p-3">
                    <p className="text-xs font-semibold uppercase text-[var(--text-dim)]">Intent Properties</p>
                    <p className="text-sm">Intent chính: <span className="font-medium">{selectedNode.mainIntent || "--"}</span></p>
                    <p className="text-sm">Confidence threshold: <span className="font-medium">{selectedNode.confidenceThreshold ?? "--"}</span></p>
                    <p className="text-sm">Fallback node: <span className="font-medium">{selectedNode.fallbackNodeId || "--"}</span></p>
                    <p className="text-sm">Timeout/Retry: <span className="font-medium">{selectedNode.timeoutSec ?? "--"}s / {selectedNode.maxRetry ?? "--"}</span></p>
                    <p className="text-sm">Intents hợp lệ: <span className="font-medium">{(selectedNode.intents || []).join(", ") || "--"}</span></p>
                    <p className="text-sm">Entities bắt buộc: <span className="font-medium">{(selectedNode.entities || []).join(", ") || "--"}</span></p>
                  </div>
                ) : null}
                {selectedNode.type === "Condition" ? (
                  <div className="space-y-2 rounded-xl border border-[var(--line)] bg-white p-3">
                    <p className="text-xs font-semibold uppercase text-[var(--text-dim)]">Condition Properties</p>
                    <p className="text-sm">Nguồn điều kiện: <span className="font-medium">{selectedNode.conditionSource || "--"}</span></p>
                    <p className="text-sm">Nhánh mặc định: <span className="font-medium">{selectedNode.defaultTargetNodeId || "--"}</span></p>
                    <p className="text-sm">On rule error: <span className="font-medium">{selectedNode.onRuleError || "--"}</span></p>
                    <p className="text-sm whitespace-pre-wrap">Rules: <span className="font-medium">{selectedNode.conditionRulesText || "--"}</span></p>
                  </div>
                ) : null}
                {selectedNode.type === "API" ? (
                  <div className="space-y-2 rounded-xl border border-[var(--line)] bg-white p-3">
                    <p className="text-xs font-semibold uppercase text-[var(--text-dim)]">API Properties</p>
                    <p className="text-sm">API ref: <span className="font-medium">{selectedNode.apiRef || "--"}</span></p>
                    <p className="text-sm">Method/URL: <span className="font-medium">{selectedNode.apiMethod || "--"} {selectedNode.apiUrl || ""}</span></p>
                    <p className="text-sm">Auth profile: <span className="font-medium">{selectedNode.authProfile || "--"}</span></p>
                    <p className="text-sm">Timeout/Retry: <span className="font-medium">{selectedNode.apiTimeoutMs ?? "--"}ms / {selectedNode.apiRetry ?? "--"}</span></p>
                    <p className="text-sm">Success condition: <span className="font-medium">{selectedNode.successCondition || "--"}</span></p>
                    <p className="text-sm">On fail action: <span className="font-medium">{selectedNode.onFailAction || "--"}</span></p>
                  </div>
                ) : null}
                {selectedNode.type === "KB" ? (
                  <div className="space-y-2 rounded-xl border border-[var(--line)] bg-white p-3">
                    <p className="text-xs font-semibold uppercase text-[var(--text-dim)]">KB Properties</p>
                    <p className="text-sm">KB ref: <span className="font-medium">{selectedNode.kbRefId || "--"}</span></p>
                    <p className="text-sm">Retrieval mode: <span className="font-medium">{selectedNode.retrievalMode || "--"}</span></p>
                    <p className="text-sm">Top-K / Threshold: <span className="font-medium">{selectedNode.topK ?? "--"} / {selectedNode.scoreThreshold ?? "--"}</span></p>
                    <p className="text-sm">Rerank/Citation: <span className="font-medium">{selectedNode.rerank ? "On" : "Off"} / {selectedNode.citationEnabled ? "On" : "Off"}</span></p>
                    <p className="text-sm">No-answer action: <span className="font-medium">{selectedNode.noAnswerAction || "--"}</span></p>
                  </div>
                ) : null}
              </div>
            ) : null}

            <div className="mt-6 border-t border-[var(--line)] pt-4">
              <h4 className="text-sm font-bold">Thông tin workflow</h4>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-dim)]">Mã</span>
                  <span className="font-medium">{currentWorkflow.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-dim)]">Version</span>
                  <span className="font-medium">{currentWorkflow.version}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-dim)]">Cập nhật</span>
                  <span className="font-medium">{formatDateTime(currentWorkflow.updatedAt)}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-[var(--line)] pt-4">
              <p className="mb-2 text-sm font-bold">Intent trong workflow</p>
              <div className="flex flex-wrap gap-2">
                {currentWorkflow.intents.map((intent) => (
                  <Badge key={intent}>{intent}</Badge>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <Link href={`/workflow/${currentWorkflow.id}/preview/session`}>
                <Button className="w-full gap-2">
                  Show Preview <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </aside>
        </div>
      </div>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="space-y-2 lg:col-span-2">
          <h3 className="text-lg font-semibold">Tóm tắt cấu hình</h3>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-3">
              <p className="text-xs font-semibold text-[var(--text-dim)]">Tổng số node</p>
              <p className="mt-1 text-xl font-bold">{currentWorkflow.nodes.length}</p>
            </div>
            <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-3">
              <p className="text-xs font-semibold text-[var(--text-dim)]">Tổng số intent</p>
              <p className="mt-1 text-xl font-bold">{currentWorkflow.intents.length}</p>
            </div>
            <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-3">
              <p className="text-xs font-semibold text-[var(--text-dim)]">Loại</p>
              <p className="mt-1 text-xl font-bold">{currentWorkflow.kind}</p>
            </div>
          </div>
        </Card>

        <Card className="space-y-2">
          <h3 className="text-lg font-semibold">Trạng thái</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-dim)]">Trạng thái</span>
              <Badge tone={mapStatusTone(currentWorkflow.status)}>{currentWorkflow.status}</Badge>
            </div>
            <p className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-3 text-[var(--text-dim)]">
              Show Preview dùng để mô phỏng runtime của toàn bộ workflow này, không phải chỉ 1 node.
            </p>
          </div>
        </Card>
      </section>
    </div>
  );
}
