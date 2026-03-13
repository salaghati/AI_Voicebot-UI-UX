"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, History, Pencil, X } from "lucide-react";
import { fetchAgentSettings, fetchWorkflow } from "@/lib/api-client";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AsyncState } from "@/components/shared/async-state";
import { formatDateTime } from "@/lib/utils";
import { mapStatusTone } from "@/lib/mappers";
import {
  getWorkflowNodeContentLabel,
  getWorkflowNodeDescription,
  getWorkflowNodeTypeLabel,
} from "@/lib/workflow-node-meta";
import { WorkflowInteractiveCanvas } from "./WorkflowInteractiveCanvas";

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
  const agentSettingsQuery = useQuery({
    queryKey: ["settings-agent"],
    queryFn: fetchAgentSettings,
  });
  const wf = query.data?.data;
  const selectedNode = useMemo(
    () => {
      const nodes = wf?.nodes ?? [];
      return nodes.find((node) => node.id === selectedId) ?? nodes[0];
    },
    [wf?.nodes, selectedId],
  );
  const versionHistory = useMemo(
    () => wf ? buildVersionHistory(wf.version, wf.status, wf.updatedAt) : [],
    [wf],
  );
  const entityScope = useMemo(
    () =>
      Array.from(
        new Set(
          (wf?.nodes ?? []).flatMap((node) => node.entities ?? []).filter(Boolean),
        ),
      ),
    [wf?.nodes],
  );
  const handoverProfilesById = useMemo(
    () =>
      new Map(
        (agentSettingsQuery.data?.data.handoverProfiles ?? []).map((profile) => [profile.id, profile.name]),
      ),
    [agentSettingsQuery.data?.data.handoverProfiles],
  );

  if (query.isLoading) {
    return <AsyncState state="loading" />;
  }

  if (query.isError || !query.data?.data) {
    return <AsyncState state="error" onRetry={() => query.refetch()} />;
  }

  const currentWorkflow = query.data.data;

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

      <div className="grid gap-3 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1.8fr)]">
        <Card className="p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-dim)]">Workflow Summary</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-xs text-[var(--text-dim)]">Workflow ID</p>
              <p className="mt-1 text-base font-semibold text-[var(--text-main)]">{currentWorkflow.id}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--text-dim)]">Version</p>
              <p className="mt-1 text-base font-semibold text-[var(--text-main)]">{currentWorkflow.version}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--text-dim)]">Updated</p>
              <p className="mt-1 text-base font-semibold text-[var(--text-main)]">{formatDateTime(currentWorkflow.updatedAt)}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--text-dim)]">Node Count</p>
              <p className="mt-1 text-base font-semibold text-[var(--text-main)]">{currentWorkflow.nodes.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-dim)]">Intent & Entity Scope</p>
              <p className="mt-1 text-sm text-[var(--text-dim)]">
                Intent quyết định nhánh xử lý. Entity là dữ liệu được thu từ lời khách và dùng tiếp ở Condition hoặc API.
              </p>
            </div>
            <div className="rounded-full bg-[#eef6ff] px-3 py-1 text-xs font-semibold text-[#3565b3]">
              Kéo thả node trực tiếp trên diagram để sắp layout review
            </div>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-xs font-semibold text-[var(--text-dim)]">Intent toàn workflow</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {currentWorkflow.intents.map((intent) => (
                  <Badge key={intent}>{intent}</Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-[var(--text-dim)]">Entity scope</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {entityScope.length > 0 ? entityScope.map((entity) => (
                  <Badge key={entity} tone="info">{entity}</Badge>
                )) : (
                  <span className="text-sm text-[var(--text-dim)]">Workflow này chưa cần entity đầu vào.</span>
                )}
              </div>
            </div>
          </div>
          <div className="mt-4 rounded-xl border border-[#d7e2f0] bg-[#f8fbff] p-3 text-sm text-[var(--text-dim)]">
            <p className="font-semibold text-[var(--text-main)]">Cách đọc flow này</p>
            <p className="mt-1">`Intent node` hỏi và hiểu khách muốn gì. `Entity` là dữ liệu bot nghe được như mã khách hàng. `Condition` đọc intent đó để rẽ nhánh. `API` dùng entity để tra cứu. `KB` dùng câu hỏi hiện tại để trả lời chính sách.</p>
          </div>
        </Card>
      </div>

      <div className="overflow-hidden rounded-xl border border-[var(--line)] bg-white">
        <div className="grid min-h-[740px] xl:grid-cols-[1fr_360px]">
          <WorkflowInteractiveCanvas
            workflowNodes={currentWorkflow.nodes}
            selectedId={selectedNode?.id}
            onSelect={setSelectedId}
            title="Workflow Diagram"
            subtitle="Click để xem properties của node. Kéo thả để sắp lại layout review ngay trên màn hình này."
          />
          <aside className="border-l border-[var(--line)] bg-[#fbfcff] p-4">
            <h3 className="text-lg font-bold">Node Properties - {selectedNode?.label || "Node"}</h3>
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
                    <Badge tone="info">{getWorkflowNodeTypeLabel(selectedNode.type)}</Badge>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[var(--text-dim)]">{getWorkflowNodeContentLabel(selectedNode.type)}</p>
                  <div className="mt-1 rounded-xl border border-[var(--line)] bg-white p-3 text-sm text-[var(--text-main)]">
                    {selectedNode.value}
                  </div>
                </div>
                <div className="rounded-xl border border-[var(--line)] bg-white p-3 text-sm text-[var(--text-dim)]">
                  {getWorkflowNodeDescription(selectedNode.type)}
                </div>
                {selectedNode.type === "Start" ? (
                  <div className="space-y-2 rounded-xl border border-[var(--line)] bg-white p-3">
                    <p className="text-xs font-semibold uppercase text-[var(--text-dim)]">Start Properties</p>
                    <p className="text-sm">Node này chỉ đánh dấu entry point của workflow.</p>
                  </div>
                ) : null}
                {selectedNode.type === "Prompt" ? (
                  <div className="space-y-2 rounded-xl border border-[var(--line)] bg-white p-3">
                    <p className="text-xs font-semibold uppercase text-[var(--text-dim)]">Prompt Properties</p>
                    <p className="text-sm">TTS / Bot nói: <span className="font-medium">{selectedNode.ttsText || selectedNode.value || "--"}</span></p>
                  </div>
                ) : null}
                {selectedNode.type === "Intent" ? (
                  <div className="space-y-2 rounded-xl border border-[var(--line)] bg-white p-3">
                    <p className="text-xs font-semibold uppercase text-[var(--text-dim)]">Intent Capture Properties</p>
                    <div className="rounded-lg border border-[#d7e2f0] bg-[#f8fbff] p-3 text-sm text-[var(--text-dim)]">
                      <p><span className="font-semibold text-[var(--text-main)]">Intent</span> = khách đang muốn làm gì.</p>
                      <p><span className="font-semibold text-[var(--text-main)]">Entity</span> = dữ liệu cụ thể bot lấy ra từ câu nói của khách.</p>
                      <p className="mt-2">Ví dụ: “Cho tôi kiểm tra hóa đơn KH123” thì `intent = payment_check`, `entity = customer_id: KH123`.</p>
                    </div>
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
                    <div className="rounded-lg border border-[#d7e2f0] bg-[#fffaf1] p-3 text-sm text-[var(--text-dim)]">
                      Condition không thu dữ liệu mới. Nó chỉ đọc intent hoặc entity đã có để quyết định đi sang API, KB, Handover hay End.
                    </div>
                    <p className="text-sm">Nguồn điều kiện: <span className="font-medium">{selectedNode.conditionSource || "--"}</span></p>
                    <p className="text-sm">Nhánh mặc định: <span className="font-medium">{selectedNode.defaultTargetNodeId || "--"}</span></p>
                    <p className="text-sm">On rule error: <span className="font-medium">{selectedNode.onRuleError || "--"}</span></p>
                    <p className="text-sm whitespace-pre-wrap">Rules: <span className="font-medium">{selectedNode.conditionRulesText || "--"}</span></p>
                  </div>
                ) : null}
                {selectedNode.type === "API" ? (
                  <div className="space-y-2 rounded-xl border border-[var(--line)] bg-white p-3">
                    <p className="text-xs font-semibold uppercase text-[var(--text-dim)]">API Properties</p>
                    <div className="rounded-lg border border-[#d7e2f0] bg-[#f8fbff] p-3 text-sm text-[var(--text-dim)]">
                      API node dùng entity đã thu ở node Intent trước đó. Trong flow demo này, API đang cần `customer_id` hoặc `bill_code`.
                    </div>
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
                    <div className="rounded-lg border border-[#d7e2f0] bg-[#f4fcf8] p-3 text-sm text-[var(--text-dim)]">
                      KB node thường trả lời câu hỏi kiến thức chung. Nó dựa vào câu hỏi hiện tại và KB đã bind, không nhất thiết phải cần entity như API.
                    </div>
                    <p className="text-sm">KB binding: <span className="font-medium">Được chọn khi gắn workflow vào campaign/route</span></p>
                    <p className="text-sm">Retrieval mode: <span className="font-medium">{selectedNode.retrievalMode || "--"}</span></p>
                    <p className="text-sm">Top-K / Threshold: <span className="font-medium">{selectedNode.topK ?? "--"} / {selectedNode.scoreThreshold ?? "--"}</span></p>
                    <p className="text-sm">Rerank/Citation: <span className="font-medium">{selectedNode.rerank ? "On" : "Off"} / {selectedNode.citationEnabled ? "On" : "Off"}</span></p>
                    <p className="text-sm">No-answer action: <span className="font-medium">{selectedNode.noAnswerAction || "--"}</span></p>
                  </div>
                ) : null}
                {selectedNode.type === "Handover" ? (
                  <div className="space-y-2 rounded-xl border border-[var(--line)] bg-white p-3">
                    <p className="text-xs font-semibold uppercase text-[var(--text-dim)]">Handover Properties</p>
                    <div className="rounded-lg border border-[#d7e2f0] bg-[#fff8fb] p-3 text-sm text-[var(--text-dim)]">
                      Handover node chỉ quyết định khi nào chuyển người thật. Profile thật được lấy từ route/campaign hoặc override bằng một profile cụ thể.
                    </div>
                    <p className="text-sm">
                      Handover mode:{" "}
                      <span className="font-medium">
                        {selectedNode.handoverMode === "override_profile"
                          ? "Override handover profile"
                          : "Dùng profile mặc định từ campaign/route"}
                      </span>
                    </p>
                    <p className="text-sm">
                      Handover profile:{" "}
                      <span className="font-medium">
                        {selectedNode.handoverProfileId
                          ? `${handoverProfilesById.get(selectedNode.handoverProfileId) || selectedNode.handoverProfileId} (${selectedNode.handoverProfileId})`
                          : selectedNode.handoverMode === "use_default"
                            ? "Lấy từ campaign/route"
                            : "--"}
                      </span>
                    </p>
                    <p className="text-sm">Thông điệp chuyển máy: <span className="font-medium">{selectedNode.handoverMessage || selectedNode.ttsText || "--"}</span></p>
                    <p className="text-sm">Nếu chuyển máy thất bại: <span className="font-medium">{selectedNode.onHandoverFail || "--"}</span></p>
                  </div>
                ) : null}
                {selectedNode.type === "End" ? (
                  <div className="space-y-2 rounded-xl border border-[var(--line)] bg-white p-3">
                    <p className="text-xs font-semibold uppercase text-[var(--text-dim)]">End Properties</p>
                    <p className="text-sm">TTS / Bot nói: <span className="font-medium">{selectedNode.ttsText || selectedNode.value || "--"}</span></p>
                    <p className="text-sm">End reason: <span className="font-medium">{selectedNode.endReason || "--"}</span></p>
                  </div>
                ) : null}
              </div>
            ) : null}

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
