"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Edge,
  type Node,
  type OnConnect,
  BackgroundVariant,
  MarkerType,
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { createWorkflow, fetchWorkflow, updateWorkflow } from "@/lib/api-client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { WorkflowNode } from "@/types/domain";
import { AsyncState } from "@/components/shared/async-state";
import { WorkflowFlowNode } from "./flow-nodes";

const nodeTypes = { workflowNode: WorkflowFlowNode };

const defaultEdgeOptions = {
  animated: true,
  style: { stroke: "#94a3b8", strokeWidth: 2 },
  markerEnd: { type: MarkerType.ArrowClosed, color: "#94a3b8" },
};

type NodeType = WorkflowNode["type"];

interface WfNodeData extends Record<string, unknown> {
  label: string;
  value: string;
  nodeType: NodeType;
  nodeId: string;
  ttsText: string;
  intents: string[];
  entities: string[];
  mainIntent?: string;
  confidenceThreshold?: number;
  fallbackNodeId?: string;
  repromptText?: string;
  timeoutSec?: number;
  maxRetry?: number;
  conditionSource?: string;
  conditionRulesText?: string;
  defaultTargetNodeId?: string;
  onRuleError?: string;
  apiRef?: string;
  apiMethod?: string;
  apiUrl?: string;
  authProfile?: string;
  apiTimeoutMs?: number;
  apiRetry?: number;
  successCondition?: string;
  requestMapping?: string;
  responseMapping?: string;
  onFailAction?: string;
  kbRefId?: string;
  retrievalMode?: string;
  topK?: number;
  scoreThreshold?: number;
  rerank?: boolean;
  promptTemplate?: string;
  citationEnabled?: boolean;
  noAnswerAction?: string;
}

function workflowNodeToFlowNode(wn: WorkflowNode, index: number): Node<WfNodeData> {
  const leftX = 250;
  const branchX = 550;
  const gapY = 140;

  let x = wn.x ?? leftX;
  let y = wn.y ?? 50 + index * gapY;

  if (typeof wn.x !== "number") {
    x = wn.type === "API" ? branchX : leftX;
  }
  if (typeof wn.y !== "number") {
    y = 50 + index * gapY;
  }

  return {
    id: wn.id,
    type: "workflowNode",
    position: { x, y },
    data: {
      label: wn.label,
      value: wn.value,
      nodeType: wn.type,
      nodeId: wn.id,
      ttsText: wn.ttsText ?? wn.value,
      intents: wn.intents ?? [],
      entities: wn.entities ?? [],
      mainIntent: wn.mainIntent ?? "",
      confidenceThreshold: wn.confidenceThreshold ?? 0.8,
      fallbackNodeId: wn.fallbackNodeId ?? "",
      repromptText: wn.repromptText ?? "Anh/chị có thể nói rõ hơn nhu cầu được không ạ?",
      timeoutSec: wn.timeoutSec ?? 6,
      maxRetry: wn.maxRetry ?? 2,
      conditionSource: wn.conditionSource ?? "intent",
      conditionRulesText: wn.conditionRulesText ?? "",
      defaultTargetNodeId: wn.defaultTargetNodeId ?? "",
      onRuleError: wn.onRuleError ?? "fallback",
      apiRef: wn.apiRef ?? "",
      apiMethod: wn.apiMethod ?? "GET",
      apiUrl: wn.apiUrl ?? "",
      authProfile: wn.authProfile ?? "",
      apiTimeoutMs: wn.apiTimeoutMs ?? 3000,
      apiRetry: wn.apiRetry ?? 2,
      successCondition: wn.successCondition ?? "",
      requestMapping: wn.requestMapping ?? "",
      responseMapping: wn.responseMapping ?? "",
      onFailAction: wn.onFailAction ?? "fallback",
      kbRefId: wn.kbRefId ?? "",
      retrievalMode: wn.retrievalMode ?? "hybrid",
      topK: wn.topK ?? 3,
      scoreThreshold: wn.scoreThreshold ?? 0.75,
      rerank: wn.rerank ?? true,
      promptTemplate: wn.promptTemplate ?? "",
      citationEnabled: wn.citationEnabled ?? true,
      noAnswerAction: wn.noAnswerAction ?? "fallback_node",
    },
  };
}

function buildInitialEdges(wfNodes: WorkflowNode[]): Edge[] {
  const edges: Edge[] = [];
  for (let i = 0; i < wfNodes.length - 1; i++) {
    edges.push({
      id: `e-${wfNodes[i].id}-${wfNodes[i + 1].id}`,
      source: wfNodes[i].id,
      target: wfNodes[i + 1].id,
      ...defaultEdgeOptions,
    });
  }
  return edges;
}

const defaultWfNodes: WorkflowNode[] = [
  {
    id: "node_start", type: "Intent", label: "START", value: "Bắt đầu workflow",
    x: 250, y: 50, mainIntent: "greeting",
  },
  {
    id: "node_greeting", type: "Intent", label: "LỜI CHÀO", value: "Xin chào, MiTek xin nghe...",
    x: 250, y: 200, mainIntent: "support_request",
    intents: ["support_request", "payment_check", "handover_request"],
  },
  {
    id: "node_need", type: "KB", label: "HỎI NHU CẦU", value: "Quý khách cần hỗ trợ gì?",
    x: 250, y: 350, kbRefId: "KB-100",
  },
  {
    id: "node_classify", type: "Condition", label: "PHÂN LOẠI INTENT", value: "tra_cuoc, khieu_nai, khac",
    x: 250, y: 500, intents: ["tra_cuoc", "khieu_nai", "khac"], conditionSource: "intent",
  },
  {
    id: "node_api", type: "API", label: "GỌI API", value: "API: tra_cuoc_api",
    x: 550, y: 650, entities: ["Mã KH"], apiMethod: "GET", apiUrl: "/billing/current",
  },
  {
    id: "node_end", type: "Condition", label: "KẾT THÚC", value: "Tạm biệt",
    x: 250, y: 800, conditionSource: "context",
  },
];

export function WorkflowBuilder({ workflowId }: { workflowId?: string }) {
  const router = useRouter();
  const isEditing = Boolean(workflowId);

  const [wfName, setWfName] = useState("Workflow mới");
  const [status, setStatus] = useState<"Draft" | "Active">("Draft");
  const [kind, setKind] = useState<"Inbound" | "Outbound" | "Playground">("Outbound");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>("node_greeting");
  const [newIntent, setNewIntent] = useState("");
  const [newEntity, setNewEntity] = useState("");

  const initFlowNodes = useMemo(() => defaultWfNodes.map((n, i) => workflowNodeToFlowNode(n, i)), []);
  const initEdges = useMemo(() => buildInitialEdges(defaultWfNodes), []);

  const [nodes, setNodes, onNodesChange] = useNodesState(initFlowNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initEdges);

  const workflowQuery = useQuery({
    queryKey: ["workflow", workflowId],
    queryFn: () => fetchWorkflow(workflowId!),
    enabled: isEditing,
  });

  useEffect(() => {
    if (!workflowQuery.data?.data) return;
    const wf = workflowQuery.data.data;
    setWfName(wf.name);
    setStatus(wf.status);
    setKind(wf.kind);
    const flowNodes = wf.nodes.map((n, i) => workflowNodeToFlowNode(n, i));
    const flowEdges = buildInitialEdges(wf.nodes);
    setNodes(flowNodes);
    setEdges(flowEdges);
    if (flowNodes.length > 0) setSelectedNodeId(flowNodes[0].id);
  }, [workflowQuery.data, setNodes, setEdges]);

  const onConnect: OnConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) =>
        addEdge(
          { ...connection, ...defaultEdgeOptions, id: `e-${connection.source}-${connection.target}` },
          eds,
        ),
      );
    },
    [setEdges],
  );

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId) ?? null,
    [nodes, selectedNodeId],
  );

  const selectedData = selectedNode?.data as WfNodeData | null;

  const updateSelectedData = useCallback(
    (patch: Partial<WfNodeData>) => {
      if (!selectedNodeId) return;
      setNodes((nds) =>
        nds.map((n) =>
          n.id === selectedNodeId ? { ...n, data: { ...n.data, ...patch } } : n,
        ),
      );
    },
    [selectedNodeId, setNodes],
  );

  const addNode = useCallback(
    (type: NodeType) => {
      const id = `node_${Date.now()}`;
      const viewport = { x: 250, y: (nodes.length + 1) * 150 };
      const newNode = workflowNodeToFlowNode(
        { id, type, label: `${type.toUpperCase()} ${nodes.length + 1}`, value: "Nhập nội dung", x: viewport.x, y: viewport.y },
        nodes.length,
      );
      setNodes((nds) => [...nds, newNode]);
      setSelectedNodeId(id);
      toast.success(`Đã thêm node ${type}`);
    },
    [nodes.length, setNodes],
  );

  const removeSelectedNode = useCallback(() => {
    if (!selectedNodeId) return;
    if (nodes.length <= 1) {
      toast.error("Workflow cần ít nhất 1 node");
      return;
    }
    setNodes((nds) => nds.filter((n) => n.id !== selectedNodeId));
    setEdges((eds) => eds.filter((e) => e.source !== selectedNodeId && e.target !== selectedNodeId));
    const remaining = nodes.filter((n) => n.id !== selectedNodeId);
    setSelectedNodeId(remaining[0]?.id ?? null);
    toast.success("Đã xóa node");
  }, [selectedNodeId, nodes, setNodes, setEdges]);

  const mutation = useMutation({
    mutationFn: (payload: { name: string; kind: typeof kind; status: typeof status; intents: string[]; nodes: WorkflowNode[] }) =>
      isEditing && workflowId ? updateWorkflow(workflowId, payload) : createWorkflow(payload),
    onSuccess: (result) => {
      toast.success(isEditing ? "Cập nhật workflow thành công" : "Tạo workflow thành công");
      router.push(`/workflow/${result.data.id}`);
    },
    onError: () => toast.error("Không thể lưu workflow"),
  });

  const submit = () => {
    if (!wfName.trim()) { toast.error("Vui lòng nhập tên workflow"); return; }
    const payloadNodes: WorkflowNode[] = nodes.map((n) => {
      const d = n.data as WfNodeData;
      return {
        id: n.id,
        type: d.nodeType,
        label: String(d.label),
        value: String(d.value),
        x: Math.round(n.position.x),
        y: Math.round(n.position.y),
        ttsText: d.ttsText,
        intents: d.intents,
        entities: d.entities,
        mainIntent: d.mainIntent,
        confidenceThreshold: d.confidenceThreshold,
        fallbackNodeId: d.fallbackNodeId,
        repromptText: d.repromptText,
        timeoutSec: d.timeoutSec,
        maxRetry: d.maxRetry,
        conditionSource: d.conditionSource as WorkflowNode["conditionSource"],
        conditionRulesText: d.conditionRulesText,
        defaultTargetNodeId: d.defaultTargetNodeId,
        onRuleError: d.onRuleError as WorkflowNode["onRuleError"],
        apiRef: d.apiRef,
        apiMethod: d.apiMethod as WorkflowNode["apiMethod"],
        apiUrl: d.apiUrl,
        authProfile: d.authProfile,
        apiTimeoutMs: d.apiTimeoutMs,
        apiRetry: d.apiRetry,
        successCondition: d.successCondition,
        requestMapping: d.requestMapping,
        responseMapping: d.responseMapping,
        onFailAction: d.onFailAction as WorkflowNode["onFailAction"],
        kbRefId: d.kbRefId,
        retrievalMode: d.retrievalMode as WorkflowNode["retrievalMode"],
        topK: d.topK,
        scoreThreshold: d.scoreThreshold,
        rerank: d.rerank,
        promptTemplate: d.promptTemplate,
        citationEnabled: d.citationEnabled,
        noAnswerAction: d.noAnswerAction as WorkflowNode["noAnswerAction"],
      };
    });
    const allIntents = Array.from(new Set(nodes.flatMap((n) => ((n.data as WfNodeData).intents ?? []))));
    mutation.mutate({ name: wfName.trim(), kind, status, intents: allIntents, nodes: payloadNodes });
  };

  if (isEditing && workflowQuery.isLoading) return <AsyncState state="loading" />;
  if (isEditing && (workflowQuery.isError || !workflowQuery.data?.data))
    return <AsyncState state="error" onRetry={() => workflowQuery.refetch()} />;

  const addIntent = () => {
    const v = newIntent.trim();
    if (!v || !selectedData) return;
    const next = Array.from(new Set([...selectedData.intents, v]));
    updateSelectedData({ intents: next, value: next.join(", ") });
    setNewIntent("");
  };
  const removeIntent = (intent: string) => {
    if (!selectedData) return;
    const next = selectedData.intents.filter((i) => i !== intent);
    updateSelectedData({ intents: next, value: next.join(", ") });
  };
  const addEntity = () => {
    const v = newEntity.trim();
    if (!v || !selectedData) return;
    updateSelectedData({ entities: Array.from(new Set([...selectedData.entities, v])) });
    setNewEntity("");
  };
  const removeEntity = (entity: string) => {
    if (!selectedData) return;
    updateSelectedData({ entities: selectedData.entities.filter((e) => e !== entity) });
  };

  return (
    <div className="space-y-4">
      <Card className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href={isEditing && workflowId ? `/workflow/${workflowId}` : "/workflow"}>
            <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <Input value={wfName} onChange={(e) => setWfName(e.target.value)} className="w-[240px] text-base font-semibold" />
          <span className="rounded-full bg-[#eef2f8] px-2 py-1 text-xs font-semibold text-[#5b6a80]">{status}</span>
          <Select value={kind} onChange={(e) => setKind(e.target.value as typeof kind)} className="w-[140px]">
            <option value="Outbound">Outbound</option>
            <option value="Inbound">Inbound</option>
            <option value="Playground">Playground</option>
          </Select>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="secondary" onClick={() => { setStatus("Draft"); toast.success("Đã lưu Draft"); }}>Save</Button>
          <Button onClick={submit} disabled={mutation.isPending}>
            {mutation.isPending ? "Đang lưu..." : isEditing ? "Cập nhật" : "Publish"}
          </Button>
          {isEditing && workflowId && (
            <Link href={`/workflow/${workflowId}/preview/session`}>
              <Button variant="secondary"><Eye className="h-4 w-4" /> Preview</Button>
            </Link>
          )}
        </div>
      </Card>

      <div className="overflow-hidden rounded-xl border border-[var(--line)] bg-white">
        <div className="grid xl:grid-cols-[1fr_380px]" style={{ height: "calc(100vh - 200px)", minHeight: 600 }}>
          <div className="relative">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={(_, node) => setSelectedNodeId(node.id)}
              onPaneClick={() => setSelectedNodeId(null)}
              nodeTypes={nodeTypes}
              defaultEdgeOptions={defaultEdgeOptions}
              fitView
              snapToGrid
              snapGrid={[20, 20]}
              deleteKeyCode={["Backspace", "Delete"]}
              proOptions={{ hideAttribution: true }}
            >
              <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#d1d5db" />
              <Controls showInteractive={false} />
              <MiniMap
                nodeColor={(n) => {
                  const t = String((n.data as WfNodeData)?.nodeType ?? "Intent");
                  if (t === "API") return "#8b5cf6";
                  if (t === "KB") return "#10b981";
                  if (t === "Condition") return "#f59e0b";
                  return "#3b82f6";
                }}
                maskColor="rgba(0,0,0,0.08)"
                className="!bg-white/80 !border-[var(--line)]"
              />
              <Panel position="top-right" className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => addNode("Intent")}>
                  <Plus className="h-3.5 w-3.5" /> Intent
                </Button>
                <Button size="sm" variant="secondary" onClick={() => addNode("Condition")}>
                  <Plus className="h-3.5 w-3.5" /> Condition
                </Button>
                <Button size="sm" variant="secondary" onClick={() => addNode("API")}>
                  <Plus className="h-3.5 w-3.5" /> API
                </Button>
                <Button size="sm" variant="secondary" onClick={() => addNode("KB")}>
                  <Plus className="h-3.5 w-3.5" /> KB
                </Button>
              </Panel>
            </ReactFlow>
          </div>

          <aside className="overflow-y-auto border-l border-[var(--line)] bg-[#fbfcff] p-4">
            {selectedData ? (
              <>
                <h3 className="text-lg font-bold">Properties — {String(selectedData.label)}</h3>
                <p className="mb-3 text-xs text-[var(--text-dim)]">ID: {selectedNodeId}</p>
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[var(--text-dim)]">Tên node</label>
                    <Input value={String(selectedData.label)} onChange={(e) => updateSelectedData({ label: e.target.value })} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[var(--text-dim)]">Loại node</label>
                    <Input value={String(selectedData.nodeType)} readOnly className="bg-[#f1f5f9]" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[var(--text-dim)]">Lời thoại</label>
                    <Textarea value={String(selectedData.value)} onChange={(e) => updateSelectedData({ value: e.target.value })} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[var(--text-dim)]">TTS Text</label>
                    <Textarea value={selectedData.ttsText || ""} onChange={(e) => updateSelectedData({ ttsText: e.target.value })} />
                  </div>

                  {selectedData.nodeType === "Intent" && (
                    <div className="space-y-3 rounded-xl border border-[var(--line)] bg-white/80 p-3">
                      <p className="text-xs font-semibold uppercase text-[var(--text-dim)]">Intent Properties</p>
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-[var(--text-dim)]">Intent chính</label>
                        <Input value={selectedData.mainIntent || ""} onChange={(e) => updateSelectedData({ mainIntent: e.target.value })} />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-[var(--text-dim)]">Confidence threshold</label>
                        <Input type="number" min={0} max={1} step="0.01" value={selectedData.confidenceThreshold ?? 0.8} onChange={(e) => updateSelectedData({ confidenceThreshold: parseFloat(e.target.value || "0") })} />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-[var(--text-dim)]">Node fallback</label>
                        <Select value={selectedData.fallbackNodeId || ""} onChange={(e) => updateSelectedData({ fallbackNodeId: e.target.value })}>
                          <option value="">Chưa cấu hình</option>
                          {nodes.filter((n) => n.id !== selectedNodeId).map((n) => (
                            <option key={n.id} value={n.id}>{String((n.data as WfNodeData).label)} ({n.id})</option>
                          ))}
                        </Select>
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-[var(--text-dim)]">Prompt hỏi lại</label>
                        <Textarea value={selectedData.repromptText || ""} onChange={(e) => updateSelectedData({ repromptText: e.target.value })} />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="mb-1 block text-xs font-semibold text-[var(--text-dim)]">Timeout (s)</label>
                          <Input type="number" min={1} value={selectedData.timeoutSec ?? 6} onChange={(e) => updateSelectedData({ timeoutSec: parseInt(e.target.value || "1") })} />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-semibold text-[var(--text-dim)]">Max retry</label>
                          <Input type="number" min={0} value={selectedData.maxRetry ?? 2} onChange={(e) => updateSelectedData({ maxRetry: parseInt(e.target.value || "0") })} />
                        </div>
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-[var(--text-dim)]">Intents</label>
                        <div className="space-y-2">
                          {selectedData.intents.map((intent) => (
                            <div key={intent} className="flex items-center justify-between rounded-lg border border-[var(--line)] bg-white px-3 py-2 text-sm">
                              <span>{intent}</span>
                              <button type="button" className="text-red-500" onClick={() => removeIntent(intent)}><Trash2 className="h-4 w-4" /></button>
                            </div>
                          ))}
                          <div className="flex gap-2">
                            <Input value={newIntent} onChange={(e) => setNewIntent(e.target.value)} placeholder="intent_moi" onKeyDown={(e) => e.key === "Enter" && addIntent()} />
                            <Button type="button" variant="secondary" onClick={addIntent}>+</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedData.nodeType === "Condition" && (
                    <div className="space-y-3 rounded-xl border border-[var(--line)] bg-white/80 p-3">
                      <p className="text-xs font-semibold uppercase text-[var(--text-dim)]">Condition Properties</p>
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-[var(--text-dim)]">Nguồn điều kiện</label>
                        <Select value={selectedData.conditionSource || "intent"} onChange={(e) => updateSelectedData({ conditionSource: e.target.value })}>
                          <option value="intent">Intent</option>
                          <option value="entity">Entity</option>
                          <option value="context">Context</option>
                          <option value="api_result">API Result</option>
                        </Select>
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-[var(--text-dim)]">Danh sách rule</label>
                        <Textarea rows={4} value={selectedData.conditionRulesText || ""} onChange={(e) => updateSelectedData({ conditionRulesText: e.target.value })} placeholder={"intent == tra_cuoc -> node_api\nintent == khieu_nai -> node_end"} />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-[var(--text-dim)]">Nhánh mặc định</label>
                        <Select value={selectedData.defaultTargetNodeId || ""} onChange={(e) => updateSelectedData({ defaultTargetNodeId: e.target.value })}>
                          <option value="">Chưa cấu hình</option>
                          {nodes.filter((n) => n.id !== selectedNodeId).map((n) => (
                            <option key={n.id} value={n.id}>{String((n.data as WfNodeData).label)} ({n.id})</option>
                          ))}
                        </Select>
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-[var(--text-dim)]">On rule error</label>
                        <Select value={selectedData.onRuleError || "fallback"} onChange={(e) => updateSelectedData({ onRuleError: e.target.value })}>
                          <option value="fallback">Đi tới fallback node</option>
                          <option value="transfer_agent">Chuyển agent</option>
                          <option value="end_call">Kết thúc cuộc gọi</option>
                        </Select>
                      </div>
                    </div>
                  )}

                  {selectedData.nodeType === "API" && (
                    <div className="space-y-3 rounded-xl border border-[var(--line)] bg-white/80 p-3">
                      <p className="text-xs font-semibold uppercase text-[var(--text-dim)]">API Properties</p>
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-[var(--text-dim)]">API reference</label>
                        <Input value={selectedData.apiRef || ""} onChange={(e) => updateSelectedData({ apiRef: e.target.value })} />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="mb-1 block text-xs font-semibold text-[var(--text-dim)]">Method</label>
                          <Select value={selectedData.apiMethod || "GET"} onChange={(e) => updateSelectedData({ apiMethod: e.target.value })}>
                            <option value="GET">GET</option>
                            <option value="POST">POST</option>
                            <option value="PUT">PUT</option>
                            <option value="DELETE">DELETE</option>
                          </Select>
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-semibold text-[var(--text-dim)]">Auth</label>
                          <Input value={selectedData.authProfile || ""} onChange={(e) => updateSelectedData({ authProfile: e.target.value })} />
                        </div>
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-[var(--text-dim)]">URL</label>
                        <Input value={selectedData.apiUrl || ""} onChange={(e) => updateSelectedData({ apiUrl: e.target.value })} />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="mb-1 block text-xs font-semibold text-[var(--text-dim)]">Timeout (ms)</label>
                          <Input type="number" min={100} value={selectedData.apiTimeoutMs ?? 3000} onChange={(e) => updateSelectedData({ apiTimeoutMs: parseInt(e.target.value || "3000") })} />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-semibold text-[var(--text-dim)]">Retry</label>
                          <Input type="number" min={0} value={selectedData.apiRetry ?? 2} onChange={(e) => updateSelectedData({ apiRetry: parseInt(e.target.value || "0") })} />
                        </div>
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-[var(--text-dim)]">Success condition</label>
                        <Input value={selectedData.successCondition || ""} onChange={(e) => updateSelectedData({ successCondition: e.target.value })} />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-[var(--text-dim)]">Request mapping</label>
                        <Textarea rows={3} value={selectedData.requestMapping || ""} onChange={(e) => updateSelectedData({ requestMapping: e.target.value })} />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-[var(--text-dim)]">Response mapping</label>
                        <Textarea rows={3} value={selectedData.responseMapping || ""} onChange={(e) => updateSelectedData({ responseMapping: e.target.value })} />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-[var(--text-dim)]">On fail</label>
                        <Select value={selectedData.onFailAction || "fallback"} onChange={(e) => updateSelectedData({ onFailAction: e.target.value })}>
                          <option value="retry">Retry</option>
                          <option value="fallback">Fallback node</option>
                          <option value="transfer_agent">Chuyển agent</option>
                          <option value="end_call">Kết thúc</option>
                        </Select>
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-[var(--text-dim)]">Entity đầu vào</label>
                        <div className="space-y-2">
                          {selectedData.entities.map((entity) => (
                            <div key={entity} className="flex items-center justify-between rounded-lg border border-[var(--line)] bg-white px-3 py-2 text-sm">
                              <span>{entity}</span>
                              <button type="button" className="text-red-500" onClick={() => removeEntity(entity)}><Trash2 className="h-4 w-4" /></button>
                            </div>
                          ))}
                          <div className="flex gap-2">
                            <Input value={newEntity} onChange={(e) => setNewEntity(e.target.value)} placeholder="entity" onKeyDown={(e) => e.key === "Enter" && addEntity()} />
                            <Button type="button" variant="secondary" onClick={addEntity}>+</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedData.nodeType === "KB" && (
                    <div className="space-y-3 rounded-xl border border-[var(--line)] bg-white/80 p-3">
                      <p className="text-xs font-semibold uppercase text-[var(--text-dim)]">KB Properties</p>
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-[var(--text-dim)]">KB Reference</label>
                        <Input value={selectedData.kbRefId || ""} onChange={(e) => updateSelectedData({ kbRefId: e.target.value })} />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="mb-1 block text-xs font-semibold text-[var(--text-dim)]">Retrieval mode</label>
                          <Select value={selectedData.retrievalMode || "hybrid"} onChange={(e) => updateSelectedData({ retrievalMode: e.target.value })}>
                            <option value="hybrid">Hybrid</option>
                            <option value="semantic">Semantic</option>
                            <option value="keyword">Keyword</option>
                          </Select>
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-semibold text-[var(--text-dim)]">Top-K</label>
                          <Input type="number" min={1} value={selectedData.topK ?? 3} onChange={(e) => updateSelectedData({ topK: parseInt(e.target.value || "1") })} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="mb-1 block text-xs font-semibold text-[var(--text-dim)]">Score threshold</label>
                          <Input type="number" min={0} max={1} step="0.01" value={selectedData.scoreThreshold ?? 0.75} onChange={(e) => updateSelectedData({ scoreThreshold: parseFloat(e.target.value || "0") })} />
                        </div>
                        <div className="space-y-2 pt-5">
                          <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" checked={Boolean(selectedData.rerank)} onChange={(e) => updateSelectedData({ rerank: e.target.checked })} />
                            Rerank
                          </label>
                          <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" checked={Boolean(selectedData.citationEnabled)} onChange={(e) => updateSelectedData({ citationEnabled: e.target.checked })} />
                            Citation
                          </label>
                        </div>
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-[var(--text-dim)]">Prompt template</label>
                        <Textarea rows={3} value={selectedData.promptTemplate || ""} onChange={(e) => updateSelectedData({ promptTemplate: e.target.value })} />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-[var(--text-dim)]">No-answer action</label>
                        <Select value={selectedData.noAnswerAction || "fallback_node"} onChange={(e) => updateSelectedData({ noAnswerAction: e.target.value })}>
                          <option value="fallback_node">Fallback node</option>
                          <option value="ask_again">Hỏi lại</option>
                          <option value="transfer_agent">Chuyển agent</option>
                          <option value="end_call">Kết thúc</option>
                        </Select>
                      </div>
                    </div>
                  )}

                  <div className="pt-2">
                    <Button type="button" variant="danger" className="w-full" onClick={removeSelectedNode}>
                      <Trash2 className="h-4 w-4" /> Xóa node này
                    </Button>
                  </div>

                  <div className="rounded-lg border border-[var(--line)] bg-[#f8fafc] p-3">
                    <p className="text-xs font-semibold text-[var(--text-dim)]">Kết nối ({edges.filter((e) => e.source === selectedNodeId || e.target === selectedNodeId).length})</p>
                    <div className="mt-2 space-y-1">
                      {edges.filter((e) => e.source === selectedNodeId || e.target === selectedNodeId).map((e) => {
                        const otherId = e.source === selectedNodeId ? e.target : e.source;
                        const otherNode = nodes.find((n) => n.id === otherId);
                        const otherLabel = otherNode ? String((otherNode.data as WfNodeData).label) : otherId;
                        const direction = e.source === selectedNodeId ? "→" : "←";
                        return (
                          <div key={e.id} className="flex items-center justify-between rounded bg-white px-2 py-1.5 text-xs">
                            <span>{direction} {otherLabel}</span>
                            <button
                              type="button"
                              className="text-red-400 hover:text-red-600"
                              onClick={() => setEdges((eds) => eds.filter((ed) => ed.id !== e.id))}
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-center text-[var(--text-dim)]">
                <p className="text-lg font-semibold">Chọn một node</p>
                <p className="mt-1 text-sm">Click vào node trên canvas để xem và chỉnh sửa properties</p>
                <div className="mt-6 space-y-2 text-left text-xs">
                  <p><strong>Kéo thả:</strong> Di chuyển node trên canvas</p>
                  <p><strong>Nối dây:</strong> Kéo từ chấm tròn dưới node → chấm tròn trên node khác</p>
                  <p><strong>Xóa:</strong> Chọn node/edge rồi nhấn Delete</p>
                  <p><strong>Zoom:</strong> Scroll chuột hoặc dùng Controls góc trái</p>
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
