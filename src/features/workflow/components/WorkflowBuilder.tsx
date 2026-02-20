"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createWorkflow, fetchWorkflow, updateWorkflow } from "@/lib/api-client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { WorkflowNode } from "@/types/domain";
import { AsyncState } from "@/components/shared/async-state";
import { buildWorkflowConnectors } from "@/lib/workflow-diagram";

type NodeType = WorkflowNode["type"];
type NodeTone = "blue" | "green" | "orange" | "purple" | "slate" | "teal";

interface BuilderNode extends WorkflowNode {
  x: number;
  y: number;
  tone: NodeTone;
}

const toneStyles: Record<NodeTone, { header: string; border: string }> = {
  blue: { header: "bg-[#3b82f6]", border: "border-[#8db8ff]" },
  green: { header: "bg-[#10b981]", border: "border-[#8ee5c9]" },
  orange: { header: "bg-[#f59e0b]", border: "border-[#f3d291]" },
  purple: { header: "bg-[#8b5cf6]", border: "border-[#cab5ff]" },
  slate: { header: "bg-[#64748b]", border: "border-[#b2bed0]" },
  teal: { header: "bg-[#0f766e]", border: "border-[#88d8d1]" },
};

function toneByType(type: NodeType): NodeTone {
  if (type === "API") return "purple";
  if (type === "KB") return "green";
  if (type === "Condition") return "orange";
  return "blue";
}

function toneByNodeMeta(node: WorkflowNode): NodeTone {
  const label = node.label.toLowerCase();
  if (label.includes("start") || node.id === "node_start") {
    return "teal";
  }
  if (label.includes("kết") || label.includes("end")) {
    return "slate";
  }
  return toneByType(node.type);
}

function withNodeDefaults(node: WorkflowNode): BuilderNode {
  const base: BuilderNode = {
    ...node,
    x: typeof node.x === "number" ? node.x : 36,
    y: typeof node.y === "number" ? node.y : 34,
    tone: toneByNodeMeta(node),
    ttsText: node.ttsText ?? node.value,
    intents: node.intents ?? [],
    entities: node.entities ?? [],
  };

  if (base.type === "Intent") {
    return {
      ...base,
      mainIntent: base.mainIntent ?? base.intents[0] ?? "",
      confidenceThreshold: base.confidenceThreshold ?? 0.8,
      fallbackNodeId: base.fallbackNodeId ?? "",
      repromptText: base.repromptText ?? "Anh/chị có thể nói rõ hơn nhu cầu được không ạ?",
      timeoutSec: base.timeoutSec ?? 6,
      maxRetry: base.maxRetry ?? 2,
    };
  }

  if (base.type === "Condition") {
    return {
      ...base,
      conditionSource: base.conditionSource ?? "intent",
      conditionRulesText:
        base.conditionRulesText ??
        "intent == tra_cuoc -> node_api\nintent == khieu_nai -> node_end",
      defaultTargetNodeId: base.defaultTargetNodeId ?? "",
      onRuleError: base.onRuleError ?? "fallback",
    };
  }

  if (base.type === "API") {
    return {
      ...base,
      apiRef: base.apiRef ?? "tra_cuoc_api",
      apiMethod: base.apiMethod ?? "GET",
      apiUrl: base.apiUrl ?? "/billing/current",
      authProfile: base.authProfile ?? "billing_service_token",
      apiTimeoutMs: base.apiTimeoutMs ?? 3000,
      apiRetry: base.apiRetry ?? 2,
      successCondition: base.successCondition ?? "status == 200",
      requestMapping:
        base.requestMapping ??
        '{ "customer_id": "{{customer_id}}", "query_type": "billing_current" }',
      responseMapping:
        base.responseMapping ??
        '{ "balance": "$.data.balance", "due_date": "$.data.due_date" }',
      onFailAction: base.onFailAction ?? "fallback",
    };
  }

  if (base.type === "KB") {
    return {
      ...base,
      kbRefId: base.kbRefId ?? "KB-100",
      retrievalMode: base.retrievalMode ?? "hybrid",
      topK: base.topK ?? 3,
      scoreThreshold: base.scoreThreshold ?? 0.75,
      rerank: base.rerank ?? true,
      promptTemplate:
        base.promptTemplate ??
        "Trả lời ngắn gọn theo ngữ cảnh khách hàng, ưu tiên nội dung trong KB.",
      citationEnabled: base.citationEnabled ?? true,
      noAnswerAction: base.noAnswerAction ?? "fallback_node",
    };
  }

  return base;
}

const initialNodes: BuilderNode[] = [
  withNodeDefaults({
    id: "node_start",
    type: "Intent",
    label: "START",
    value: "Bắt đầu workflow",
    x: 36,
    y: 34,
    mainIntent: "greeting",
  }),
  withNodeDefaults({
    id: "node_greeting",
    type: "Intent",
    label: "LỜI CHÀO",
    value: "\"Xin chào, MiTek xin nghe...\"",
    x: 36,
    y: 156,
    mainIntent: "support_request",
    intents: ["support_request", "payment_check", "handover_request"],
  }),
  withNodeDefaults({
    id: "node_need",
    type: "KB",
    label: "HỎI NHU CẦU",
    value: "Quý khách cần hỗ trợ gì?",
    x: 36,
    y: 278,
    kbRefId: "KB-100",
  }),
  withNodeDefaults({
    id: "node_classify",
    type: "Condition",
    label: "PHÂN LOẠI INTENT",
    value: "tra_cuoc, khieu_nai, khac",
    x: 36,
    y: 400,
    intents: ["tra_cuoc", "khieu_nai", "khac"],
    conditionSource: "intent",
  }),
  withNodeDefaults({
    id: "node_api",
    type: "API",
    label: "GỌI API",
    value: "API: tra_cuoc_api",
    x: 298,
    y: 522,
    entities: ["Mã KH"],
    apiMethod: "GET",
    apiUrl: "/billing/current",
  }),
  withNodeDefaults({
    id: "node_end",
    type: "Condition",
    label: "KẾT THÚC",
    value: "Tạm biệt",
    x: 84,
    y: 644,
    conditionSource: "context",
    conditionRulesText: "is_end == true -> END",
    onRuleError: "end_call",
  }),
];

export function WorkflowBuilder({ workflowId }: { workflowId?: string }) {
  const router = useRouter();
  const isEditing = Boolean(workflowId);
  const scrollRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const [name, setName] = useState("Test test");
  const [status, setStatus] = useState<"Draft" | "Active">("Draft");
  const [kind, setKind] = useState<"Inbound" | "Outbound" | "Playground">("Outbound");
  const [nodes, setNodes] = useState<BuilderNode[]>(initialNodes);
  const [selectedId, setSelectedId] = useState(initialNodes[1].id);
  const [newIntent, setNewIntent] = useState("");
  const [newEntity, setNewEntity] = useState("");
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const workflowQuery = useQuery({
    queryKey: ["workflow", workflowId],
    queryFn: () => fetchWorkflow(workflowId!),
    enabled: isEditing,
  });

  useEffect(() => {
    if (!workflowQuery.data?.data) {
      return;
    }
    const wf = workflowQuery.data.data;
    /* eslint-disable react-hooks/set-state-in-effect */
    setName(wf.name);
    setStatus(wf.status);
    setKind(wf.kind);
    const hydratedNodes: BuilderNode[] = wf.nodes.map((node, index) =>
      withNodeDefaults({
        ...node,
        x:
          typeof node.x === "number"
            ? node.x
            : node.type === "API"
              ? 298
              : node.label.toLowerCase().includes("kết thúc")
                ? 84
                : 36,
        y:
          typeof node.y === "number"
            ? node.y
            : node.type === "API"
              ? 522 + Math.max(0, index - 3) * 122
              : node.label.toLowerCase().includes("kết thúc")
                ? 644
                : 34 + index * 122,
        intents: node.intents ?? (node.type === "Condition" ? wf.intents.slice(0, 3) : []),
      }),
    );
    setNodes(hydratedNodes.length ? hydratedNodes : initialNodes);
    setSelectedId((hydratedNodes[0] ?? initialNodes[0]).id);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [workflowQuery.data]);

  const selectedNode = useMemo(
    () => nodes.find((node) => node.id === selectedId) ?? nodes[0],
    [nodes, selectedId],
  );
  const canvasNodes = useMemo(
    () =>
      nodes.map((node) => ({
        node,
        x: node.x,
        y: node.y,
        width: 220,
        height: 76,
        tone: node.tone,
      })),
    [nodes],
  );
  const connectors = useMemo(() => buildWorkflowConnectors(canvasNodes), [canvasNodes]);
  const canvasHeight = useMemo(() => {
    const maxBottom = nodes.reduce((max, node) => Math.max(max, node.y + 76), 0);
    return Math.max(860, maxBottom + 120);
  }, [nodes]);

  const mutation = useMutation({
    mutationFn: (payload: { name: string; kind: "Inbound" | "Outbound" | "Playground"; status: "Active" | "Draft"; intents: string[]; nodes: WorkflowNode[] }) =>
      isEditing && workflowId ? updateWorkflow(workflowId, payload) : createWorkflow(payload),
    onSuccess: (result) => {
      toast.success(isEditing ? "Cập nhật workflow thành công" : "Tạo workflow thành công");
      router.push(`/workflow/${result.data.id}`);
    },
    onError: () => toast.error(isEditing ? "Không thể cập nhật workflow" : "Không thể tạo workflow"),
  });

  const updateNode = (id: string, patch: Partial<BuilderNode>) => {
    setNodes((prev) => prev.map((node) => (node.id === id ? { ...node, ...patch } : node)));
  };

  useEffect(() => {
    if (!draggingId) {
      return;
    }

    const move = (event: PointerEvent) => {
      const drag = dragRef.current;
      const canvas = canvasRef.current;
      if (!drag || !canvas || drag.id !== draggingId) {
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const scrollLeft = scrollRef.current?.scrollLeft ?? 0;
      const scrollTop = scrollRef.current?.scrollTop ?? 0;
      const rawX = event.clientX - rect.left + scrollLeft - drag.offsetX;
      const rawY = event.clientY - rect.top + scrollTop - drag.offsetY;
      const maxX = Math.max(12, canvas.scrollWidth - 232);
      const maxY = Math.max(12, canvas.scrollHeight - 88);
      const nextX = Math.min(maxX, Math.max(12, rawX));
      const nextY = Math.min(maxY, Math.max(12, rawY));

      setNodes((prev) =>
        prev.map((node) =>
          node.id === drag.id
            ? {
                ...node,
                x: Math.round(nextX),
                y: Math.round(nextY),
              }
            : node,
        ),
      );
    };

    const end = () => {
      dragRef.current = null;
      setDraggingId(null);
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", end);

    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", end);
    };
  }, [draggingId]);

  if (isEditing && workflowQuery.isLoading) {
    return <AsyncState state="loading" />;
  }

  if (isEditing && (workflowQuery.isError || !workflowQuery.data?.data)) {
    return <AsyncState state="error" onRetry={() => workflowQuery.refetch()} />;
  }

  const addNode = (type: NodeType) => {
    const nextIndex = nodes.length + 1;
    const newNode: BuilderNode = withNodeDefaults({
      id: `node_${Date.now()}_${nextIndex}`,
      type,
      label: `${type.toUpperCase()} ${nextIndex}`,
      value: type === "API" ? "API: endpoint_name" : "Nhập nội dung node",
      x: 36,
      y: 760 + (nextIndex - 7) * 122,
    });
    setNodes((prev) => [...prev, newNode]);
    setSelectedId(newNode.id);
  };

  const removeSelectedNode = () => {
    if (nodes.length <= 1) {
      toast.error("Workflow cần ít nhất 1 node");
      return;
    }
    setNodes((prev) => prev.filter((node) => node.id !== selectedNode.id));
    const next = nodes.find((node) => node.id !== selectedNode.id);
    if (next) setSelectedId(next.id);
  };

  const addIntent = () => {
    const value = newIntent.trim();
    if (!value) return;
    const next = Array.from(new Set([...(selectedNode.intents || []), value]));
    updateNode(selectedNode.id, { intents: next, value: next.join(", ") });
    setNewIntent("");
  };

  const removeIntent = (intent: string) => {
    const next = (selectedNode.intents || []).filter((item) => item !== intent);
    updateNode(selectedNode.id, { intents: next, value: next.join(", ") });
  };

  const addEntity = () => {
    const value = newEntity.trim();
    if (!value) return;
    const next = Array.from(new Set([...(selectedNode.entities || []), value]));
    updateNode(selectedNode.id, { entities: next });
    setNewEntity("");
  };

  const removeEntity = (entity: string) => {
    const next = (selectedNode.entities || []).filter((item) => item !== entity);
    updateNode(selectedNode.id, { entities: next });
  };

  const submit = () => {
    if (!name.trim()) {
      toast.error("Vui lòng nhập tên workflow");
      return;
    }
    const payloadNodes: WorkflowNode[] = nodes.map((node) => {
      const payload = { ...node } as Partial<BuilderNode>;
      delete payload.tone;
      return payload as WorkflowNode;
    });
    const intents = Array.from(
      new Set(
        nodes
          .flatMap((node) => node.intents || [])
          .map((item) => item.trim())
          .filter(Boolean),
      ),
    );
    mutation.mutate({
      name: name.trim(),
      kind,
      status,
      intents,
      nodes: payloadNodes,
    });
  };

  return (
    <div className="space-y-4">
      <Card className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href={isEditing && workflowId ? `/workflow/${workflowId}` : "/workflow"}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <Input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-[240px] text-base font-semibold"
          />
          <span className="rounded-full bg-[#eef2f8] px-2 py-1 text-xs font-semibold text-[#5b6a80]">
            {status.toUpperCase()}
          </span>
          <Select value={kind} onChange={(event) => setKind(event.target.value as typeof kind)} className="w-[140px]">
            <option value="Outbound">Outbound</option>
            <option value="Inbound">Inbound</option>
            <option value="Playground">Playground</option>
          </Select>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isEditing && workflowId ? (
            <Link href={`/workflow/${workflowId}/versions`}>
              <Button variant="secondary">Version history</Button>
            </Link>
          ) : (
            <Button variant="secondary" onClick={() => toast.error("Lưu workflow trước để xem version history")}>
              Version history
            </Button>
          )}
          <Button variant="secondary" onClick={() => setStatus("Draft")}>
            Save
          </Button>
          <Button onClick={submit} disabled={mutation.isPending}>
            {mutation.isPending ? "Đang lưu..." : isEditing ? "Cập nhật" : "Publish"}
          </Button>
          <Link href={isEditing && workflowId ? `/workflow/${workflowId}/preview/session` : "#"}>
            <Button
              variant="secondary"
              onClick={(event) => {
                if (!isEditing || !workflowId) {
                  event.preventDefault();
                  toast.error("Hãy lưu workflow trước khi preview");
                }
              }}
            >
              <Eye className="h-4 w-4" /> Show Preview
            </Button>
          </Link>
        </div>
      </Card>

      <div className="overflow-hidden rounded-xl border border-[var(--line)] bg-white">
        <div className="grid min-h-[860px] xl:grid-cols-[1fr_360px]">
          <section
            ref={(element) => {
              scrollRef.current = element;
            }}
            className="relative overflow-auto bg-[radial-gradient(circle,#e6ebf2_1px,transparent_1px)] [background-size:18px_18px] p-6"
          >
            <div ref={canvasRef} className="relative min-h-full min-w-[760px]" style={{ height: canvasHeight }}>
            {connectors.map((connector, index) => (
              <div
                key={`line-${index}`}
                className={`absolute rounded-full ${
                  connector.fromId === selectedNode.id || connector.toId === selectedNode.id
                    ? "bg-[#58a6ff]"
                    : "bg-[#c8d3e1]"
                }`}
                style={{
                  left: connector.x,
                  top: connector.y,
                  width: connector.w,
                  height: connector.h,
                  boxShadow:
                    connector.fromId === selectedNode.id || connector.toId === selectedNode.id
                      ? "0 0 0 1px rgba(88,166,255,0.22)"
                      : undefined,
                }}
              />
            ))}

            <div className="absolute right-6 top-6 flex flex-wrap gap-2">
              <Button size="sm" variant="secondary" onClick={() => addNode("Intent")}>
                <Plus className="h-4 w-4" /> Intent
              </Button>
              <Button size="sm" variant="secondary" onClick={() => addNode("Condition")}>
                <Plus className="h-4 w-4" /> Condition
              </Button>
              <Button size="sm" variant="secondary" onClick={() => addNode("API")}>
                <Plus className="h-4 w-4" /> API
              </Button>
              <Button size="sm" variant="secondary" onClick={() => addNode("KB")}>
                <Plus className="h-4 w-4" /> KB
              </Button>
            </div>

            {nodes.map((node) => {
              const tone = toneStyles[node.tone];
              const isSelected = selectedNode.id === node.id;
              return (
                <button
                  key={node.id}
                  type="button"
                  className={`absolute w-[220px] overflow-hidden rounded-xl border bg-white text-left shadow-sm transition ${
                    tone.border
                  } ${isSelected ? "ring-2 ring-[#5ea9ff]" : ""} ${
                    draggingId === node.id ? "cursor-grabbing shadow-[0_10px_28px_rgba(35,88,177,0.22)]" : "cursor-grab"
                  }`}
                  style={{ left: node.x, top: node.y }}
                  onClick={() => setSelectedId(node.id)}
                  onPointerDown={(event) => {
                    const canvas = canvasRef.current;
                    if (!canvas) {
                      setSelectedId(node.id);
                      return;
                    }
                    const rect = canvas.getBoundingClientRect();
                    const scrollLeft = scrollRef.current?.scrollLeft ?? 0;
                    const scrollTop = scrollRef.current?.scrollTop ?? 0;
                    dragRef.current = {
                      id: node.id,
                      offsetX: event.clientX - rect.left + scrollLeft - node.x,
                      offsetY: event.clientY - rect.top + scrollTop - node.y,
                    };
                    setSelectedId(node.id);
                    setDraggingId(node.id);
                    event.preventDefault();
                  }}
                >
                  <div className={`px-3 py-1.5 text-xs font-bold text-white ${tone.header}`}>
                    {node.label}
                  </div>
                  <div className="p-3 text-sm text-[var(--text-main)]">
                    {node.value}
                    {(node.intents || []).length ? (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {(node.intents || []).slice(0, 3).map((intent) => (
                          <span key={intent} className="rounded-full bg-[#eef4ff] px-2 py-0.5 text-xs text-[#3565b3]">
                            {intent}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </button>
              );
            })}
            </div>
          </section>

          <aside className="border-l border-[var(--line)] bg-[#fbfcff] p-4">
            <h3 className="text-lg font-bold">Properties - {selectedNode.label}</h3>
            <div className="mt-3 space-y-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-[var(--text-dim)]">Tên node</label>
                <Input
                  value={selectedNode.label}
                  onChange={(event) => updateNode(selectedNode.id, { label: event.target.value })}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-[var(--text-dim)]">Loại node</label>
                <Input value={selectedNode.type} readOnly />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-[var(--text-dim)]">Lời thoại</label>
                <Textarea
                  value={selectedNode.value}
                  onChange={(event) => updateNode(selectedNode.id, { value: event.target.value })}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-[var(--text-dim)]">Bản đọc thoại (TTS)</label>
                <Textarea
                  value={selectedNode.ttsText || ""}
                  onChange={(event) => updateNode(selectedNode.id, { ttsText: event.target.value })}
                />
              </div>

              {selectedNode.type === "Intent" ? (
                <div className="space-y-3 rounded-xl border border-[var(--line)] bg-white/80 p-3">
                  <p className="text-xs font-semibold uppercase text-[var(--text-dim)]">Intent Properties</p>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[var(--text-dim)]">Intent chính</label>
                    <Input
                      value={selectedNode.mainIntent || ""}
                      onChange={(event) => updateNode(selectedNode.id, { mainIntent: event.target.value })}
                      placeholder="payment_check"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[var(--text-dim)]">Confidence threshold</label>
                    <Input
                      type="number"
                      min={0}
                      max={1}
                      step="0.01"
                      value={selectedNode.confidenceThreshold ?? 0.8}
                      onChange={(event) =>
                        updateNode(selectedNode.id, {
                          confidenceThreshold: Number.parseFloat(event.target.value || "0"),
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[var(--text-dim)]">Node fallback</label>
                    <Select
                      value={selectedNode.fallbackNodeId || ""}
                      onChange={(event) => updateNode(selectedNode.id, { fallbackNodeId: event.target.value })}
                    >
                      <option value="">Chưa cấu hình</option>
                      {nodes
                        .filter((node) => node.id !== selectedNode.id)
                        .map((node) => (
                          <option key={node.id} value={node.id}>
                            {node.label} ({node.id})
                          </option>
                        ))}
                    </Select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[var(--text-dim)]">Prompt hỏi lại</label>
                    <Textarea
                      value={selectedNode.repromptText || ""}
                      onChange={(event) => updateNode(selectedNode.id, { repromptText: event.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-[var(--text-dim)]">Timeout (s)</label>
                      <Input
                        type="number"
                        min={1}
                        value={selectedNode.timeoutSec ?? 6}
                        onChange={(event) =>
                          updateNode(selectedNode.id, { timeoutSec: Number.parseInt(event.target.value || "1", 10) })
                        }
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-[var(--text-dim)]">Max retry</label>
                      <Input
                        type="number"
                        min={0}
                        value={selectedNode.maxRetry ?? 2}
                        onChange={(event) =>
                          updateNode(selectedNode.id, { maxRetry: Number.parseInt(event.target.value || "0", 10) })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[var(--text-dim)]">Intent hợp lệ</label>
                    <div className="space-y-2">
                      {(selectedNode.intents || []).map((intent) => (
                        <div key={intent} className="flex items-center justify-between rounded-lg border border-[var(--line)] bg-white px-3 py-2 text-sm">
                          <span>{intent}</span>
                          <button type="button" className="text-red-500" onClick={() => removeIntent(intent)}>
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      <div className="flex gap-2">
                        <Input
                          value={newIntent}
                          onChange={(event) => setNewIntent(event.target.value)}
                          placeholder="intent_moi"
                        />
                        <Button type="button" variant="secondary" onClick={addIntent}>
                          + Thêm
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[var(--text-dim)]">Entity bắt buộc</label>
                    <div className="space-y-2">
                      {(selectedNode.entities || []).map((entity) => (
                        <div key={entity} className="flex items-center justify-between rounded-lg border border-[var(--line)] bg-white px-3 py-2 text-sm">
                          <span>{entity}</span>
                          <button type="button" className="text-red-500" onClick={() => removeEntity(entity)}>
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      <div className="flex gap-2">
                        <Input
                          value={newEntity}
                          onChange={(event) => setNewEntity(event.target.value)}
                          placeholder="entity_name"
                        />
                        <Button type="button" variant="secondary" onClick={addEntity}>
                          + Thêm
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {selectedNode.type === "Condition" ? (
                <div className="space-y-3 rounded-xl border border-[var(--line)] bg-white/80 p-3">
                  <p className="text-xs font-semibold uppercase text-[var(--text-dim)]">Condition Properties</p>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[var(--text-dim)]">Nguồn điều kiện</label>
                    <Select
                      value={selectedNode.conditionSource || "intent"}
                      onChange={(event) =>
                        updateNode(selectedNode.id, {
                          conditionSource: event.target.value as WorkflowNode["conditionSource"],
                        })
                      }
                    >
                      <option value="intent">Intent</option>
                      <option value="entity">Entity</option>
                      <option value="context">Context</option>
                      <option value="api_result">API Result</option>
                    </Select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[var(--text-dim)]">Danh sách rule</label>
                    <Textarea
                      rows={5}
                      value={selectedNode.conditionRulesText || ""}
                      onChange={(event) => updateNode(selectedNode.id, { conditionRulesText: event.target.value })}
                      placeholder={"intent == tra_cuoc -> node_api\nintent == khieu_nai -> node_end"}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[var(--text-dim)]">Nhánh mặc định</label>
                    <Select
                      value={selectedNode.defaultTargetNodeId || ""}
                      onChange={(event) => updateNode(selectedNode.id, { defaultTargetNodeId: event.target.value })}
                    >
                      <option value="">Chưa cấu hình</option>
                      {nodes
                        .filter((node) => node.id !== selectedNode.id)
                        .map((node) => (
                          <option key={node.id} value={node.id}>
                            {node.label} ({node.id})
                          </option>
                        ))}
                    </Select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[var(--text-dim)]">On rule error</label>
                    <Select
                      value={selectedNode.onRuleError || "fallback"}
                      onChange={(event) =>
                        updateNode(selectedNode.id, {
                          onRuleError: event.target.value as WorkflowNode["onRuleError"],
                        })
                      }
                    >
                      <option value="fallback">Đi tới fallback node</option>
                      <option value="transfer_agent">Chuyển agent</option>
                      <option value="end_call">Kết thúc cuộc gọi</option>
                    </Select>
                  </div>
                </div>
              ) : null}

              {selectedNode.type === "API" ? (
                <div className="space-y-3 rounded-xl border border-[var(--line)] bg-white/80 p-3">
                  <p className="text-xs font-semibold uppercase text-[var(--text-dim)]">API Properties</p>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[var(--text-dim)]">API reference</label>
                    <Input
                      value={selectedNode.apiRef || ""}
                      onChange={(event) => updateNode(selectedNode.id, { apiRef: event.target.value })}
                      placeholder="tra_cuoc_api"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-[var(--text-dim)]">Method</label>
                      <Select
                        value={selectedNode.apiMethod || "GET"}
                        onChange={(event) =>
                          updateNode(selectedNode.id, { apiMethod: event.target.value as WorkflowNode["apiMethod"] })
                        }
                      >
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                        <option value="DELETE">DELETE</option>
                      </Select>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-[var(--text-dim)]">Auth profile</label>
                      <Input
                        value={selectedNode.authProfile || ""}
                        onChange={(event) => updateNode(selectedNode.id, { authProfile: event.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[var(--text-dim)]">URL</label>
                    <Input
                      value={selectedNode.apiUrl || ""}
                      onChange={(event) => updateNode(selectedNode.id, { apiUrl: event.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-[var(--text-dim)]">Timeout (ms)</label>
                      <Input
                        type="number"
                        min={100}
                        value={selectedNode.apiTimeoutMs ?? 3000}
                        onChange={(event) =>
                          updateNode(selectedNode.id, {
                            apiTimeoutMs: Number.parseInt(event.target.value || "3000", 10),
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-[var(--text-dim)]">Retry</label>
                      <Input
                        type="number"
                        min={0}
                        value={selectedNode.apiRetry ?? 2}
                        onChange={(event) =>
                          updateNode(selectedNode.id, {
                            apiRetry: Number.parseInt(event.target.value || "0", 10),
                          })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[var(--text-dim)]">Success condition</label>
                    <Input
                      value={selectedNode.successCondition || ""}
                      onChange={(event) => updateNode(selectedNode.id, { successCondition: event.target.value })}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[var(--text-dim)]">Request mapping</label>
                    <Textarea
                      rows={3}
                      value={selectedNode.requestMapping || ""}
                      onChange={(event) => updateNode(selectedNode.id, { requestMapping: event.target.value })}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[var(--text-dim)]">Response mapping</label>
                    <Textarea
                      rows={3}
                      value={selectedNode.responseMapping || ""}
                      onChange={(event) => updateNode(selectedNode.id, { responseMapping: event.target.value })}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[var(--text-dim)]">On fail action</label>
                    <Select
                      value={selectedNode.onFailAction || "fallback"}
                      onChange={(event) =>
                        updateNode(selectedNode.id, {
                          onFailAction: event.target.value as WorkflowNode["onFailAction"],
                        })
                      }
                    >
                      <option value="retry">Retry API</option>
                      <option value="fallback">Đi tới fallback node</option>
                      <option value="transfer_agent">Chuyển agent</option>
                      <option value="end_call">Kết thúc cuộc gọi</option>
                    </Select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[var(--text-dim)]">Entity đầu vào</label>
                    <div className="space-y-2">
                      {(selectedNode.entities || []).map((entity) => (
                        <div key={entity} className="flex items-center justify-between rounded-lg border border-[var(--line)] bg-white px-3 py-2 text-sm">
                          <span>{entity}</span>
                          <button type="button" className="text-red-500" onClick={() => removeEntity(entity)}>
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      <div className="flex gap-2">
                        <Input
                          value={newEntity}
                          onChange={(event) => setNewEntity(event.target.value)}
                          placeholder="entity_name"
                        />
                        <Button type="button" variant="secondary" onClick={addEntity}>
                          + Thêm
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {selectedNode.type === "KB" ? (
                <div className="space-y-3 rounded-xl border border-[var(--line)] bg-white/80 p-3">
                  <p className="text-xs font-semibold uppercase text-[var(--text-dim)]">KB Properties</p>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[var(--text-dim)]">Knowledge Base ref</label>
                    <Input
                      value={selectedNode.kbRefId || ""}
                      onChange={(event) => updateNode(selectedNode.id, { kbRefId: event.target.value })}
                      placeholder="KB-100"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-[var(--text-dim)]">Retrieval mode</label>
                      <Select
                        value={selectedNode.retrievalMode || "hybrid"}
                        onChange={(event) =>
                          updateNode(selectedNode.id, {
                            retrievalMode: event.target.value as WorkflowNode["retrievalMode"],
                          })
                        }
                      >
                        <option value="hybrid">Hybrid</option>
                        <option value="semantic">Semantic</option>
                        <option value="keyword">Keyword</option>
                      </Select>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-[var(--text-dim)]">Top-K</label>
                      <Input
                        type="number"
                        min={1}
                        value={selectedNode.topK ?? 3}
                        onChange={(event) =>
                          updateNode(selectedNode.id, { topK: Number.parseInt(event.target.value || "1", 10) })
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-[var(--text-dim)]">Score threshold</label>
                      <Input
                        type="number"
                        min={0}
                        max={1}
                        step="0.01"
                        value={selectedNode.scoreThreshold ?? 0.75}
                        onChange={(event) =>
                          updateNode(selectedNode.id, {
                            scoreThreshold: Number.parseFloat(event.target.value || "0"),
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2 pt-5">
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={Boolean(selectedNode.rerank)}
                          onChange={(event) => updateNode(selectedNode.id, { rerank: event.target.checked })}
                        />
                        Bật rerank
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={Boolean(selectedNode.citationEnabled)}
                          onChange={(event) => updateNode(selectedNode.id, { citationEnabled: event.target.checked })}
                        />
                        Hiển thị citation
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[var(--text-dim)]">Prompt template</label>
                    <Textarea
                      rows={3}
                      value={selectedNode.promptTemplate || ""}
                      onChange={(event) => updateNode(selectedNode.id, { promptTemplate: event.target.value })}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[var(--text-dim)]">No-answer action</label>
                    <Select
                      value={selectedNode.noAnswerAction || "fallback_node"}
                      onChange={(event) =>
                        updateNode(selectedNode.id, {
                          noAnswerAction: event.target.value as WorkflowNode["noAnswerAction"],
                        })
                      }
                    >
                      <option value="fallback_node">Đi tới fallback node</option>
                      <option value="ask_again">Hỏi lại khách hàng</option>
                      <option value="transfer_agent">Chuyển agent</option>
                      <option value="end_call">Kết thúc cuộc gọi</option>
                    </Select>
                  </div>
                </div>
              ) : null}

              <div className="pt-2">
                <Button type="button" variant="danger" className="w-full" onClick={removeSelectedNode}>
                  Xóa node đang chọn
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
