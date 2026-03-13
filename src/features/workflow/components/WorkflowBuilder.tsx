"use client";

import { useCallback, useMemo, useState } from "react";
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
import {
  getWorkflowNodeContentLabel,
  getWorkflowNodeDescription,
  getWorkflowNodeTypeLabel,
} from "@/lib/workflow-node-meta";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { Workflow, WorkflowNode, WorkflowNodeType } from "@/types/domain";
import { AsyncState } from "@/components/shared/async-state";
import { WorkflowFlowNode } from "./flow-nodes";

const nodeTypes = { workflowNode: WorkflowFlowNode };

const defaultEdgeOptions = {
  animated: true,
  style: { stroke: "#94a3b8", strokeWidth: 2 },
  markerEnd: { type: MarkerType.ArrowClosed, color: "#94a3b8" },
};

type NodeType = WorkflowNodeType;

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
  retrievalMode?: string;
  topK?: number;
  scoreThreshold?: number;
  rerank?: boolean;
  promptTemplate?: string;
  citationEnabled?: boolean;
  noAnswerAction?: string;
  handoverTarget?: string;
  handoverMessage?: string;
  onHandoverFail?: string;
  endReason?: string;
}

function createNodeDefaults(type: NodeType, index: number): WorkflowNode {
  const order = index + 1;

  switch (type) {
    case "Prompt":
      return {
        id: `node_${Date.now()}`,
        type,
        label: `PROMPT ${order}`,
        value: "Xin chào anh/chị, em là AI Voicebot hỗ trợ cuộc gọi này.",
        ttsText: "Xin chào anh chị, em là AI Voicebot hỗ trợ cuộc gọi này.",
      };
    case "Intent":
      return {
        id: `node_${Date.now()}`,
        type,
        label: `THU NHU CẦU ${order}`,
        value: "Anh/chị cần em hỗ trợ nội dung gì ạ?",
        ttsText: "Anh chị cần em hỗ trợ nội dung gì ạ?",
        mainIntent: "support_request",
        confidenceThreshold: 0.8,
        repromptText: "Anh/chị có thể nói rõ hơn nhu cầu giúp em được không ạ?",
        timeoutSec: 6,
        maxRetry: 2,
        intents: ["support_request"],
      };
    case "Condition":
      return {
        id: `node_${Date.now()}`,
        type,
        label: `ĐIỀU HƯỚNG ${order}`,
        value: "Điều hướng theo intent hoặc context.",
        conditionSource: "intent",
      };
    case "API":
      return {
        id: `node_${Date.now()}`,
        type,
        label: `GỌI API ${order}`,
        value: "Tra cứu dữ liệu nghiệp vụ từ hệ thống ngoài.",
        ttsText: "Em đang kiểm tra dữ liệu giúp anh chị.",
        apiMethod: "GET",
        apiTimeoutMs: 3000,
        apiRetry: 2,
      };
    case "KB":
      return {
        id: `node_${Date.now()}`,
        type,
        label: `TRA KB ${order}`,
        value: "Tra cứu tri thức để trả lời câu hỏi nghiệp vụ.",
        ttsText: "Em đang tra cứu thông tin phù hợp cho anh chị.",
        retrievalMode: "hybrid",
        topK: 3,
        scoreThreshold: 0.75,
        rerank: true,
        citationEnabled: true,
        noAnswerAction: "fallback_node",
      };
    case "Handover":
      return {
        id: `node_${Date.now()}`,
        type,
        label: `CHUYỂN AGENT ${order}`,
        value: "Em chuyển cuộc gọi sang tổng đài viên để hỗ trợ tiếp.",
        ttsText: "Em chuyển cuộc gọi sang tổng đài viên để hỗ trợ tiếp.",
        handoverTarget: "queue_default",
        handoverMessage: "Chuyển máy sang tổng đài viên gần nhất.",
        onHandoverFail: "fallback_node",
      };
    case "End":
      return {
        id: `node_${Date.now()}`,
        type,
        label: `KẾT THÚC ${order}`,
        value: "Cảm ơn anh/chị, chúc anh/chị một ngày tốt lành.",
        ttsText: "Cảm ơn anh chị, chúc anh chị một ngày tốt lành.",
        endReason: "completed",
      };
    case "Start":
    default:
      return {
        id: `node_${Date.now()}`,
        type: "Start",
        label: "START",
        value: "Điểm bắt đầu của workflow",
      };
  }
}

function workflowNodeToFlowNode(wn: WorkflowNode, index: number): Node<WfNodeData> {
  const leftX = 250;
  const branchX = 550;
  const gapY = 140;

  let x = wn.x ?? leftX;
  let y = wn.y ?? 50 + index * gapY;

  if (typeof wn.x !== "number") {
    x = wn.type === "API" || wn.type === "KB" || wn.type === "Handover" ? branchX : leftX;
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
      retrievalMode: wn.retrievalMode ?? "hybrid",
      topK: wn.topK ?? 3,
      scoreThreshold: wn.scoreThreshold ?? 0.75,
      rerank: wn.rerank ?? true,
      promptTemplate: wn.promptTemplate ?? "",
      citationEnabled: wn.citationEnabled ?? true,
      noAnswerAction: wn.noAnswerAction ?? "fallback_node",
      handoverTarget: wn.handoverTarget ?? "",
      handoverMessage: wn.handoverMessage ?? "",
      onHandoverFail: wn.onHandoverFail ?? "fallback_node",
      endReason: wn.endReason ?? "",
    },
  };
}

function parseRuleTargets(conditionRulesText?: string) {
  if (!conditionRulesText) return [];
  return Array.from(conditionRulesText.matchAll(/->\s*([A-Za-z0-9_-]+)/g)).map((match) => match[1]);
}

function buildInitialEdges(wfNodes: WorkflowNode[]): Edge[] {
  const edges: Edge[] = [];
  const seen = new Set<string>();
  const endNodeId = wfNodes.find((node) => node.type === "End")?.id;

  const pushEdge = (source: string, target: string) => {
    const key = `${source}-${target}`;
    if (source === target || seen.has(key)) return;
    seen.add(key);
    edges.push({
      id: `e-${source}-${target}`,
      source,
      target,
      ...defaultEdgeOptions,
    });
  };

  wfNodes.forEach((node, index) => {
    if (node.type === "End") return;

    if (node.type === "Condition") {
      const targets = [...parseRuleTargets(node.conditionRulesText), node.defaultTargetNodeId]
        .filter((target): target is string => Boolean(target))
        .filter((target) => wfNodes.some((candidate) => candidate.id === target));

      if (targets.length > 0) {
        targets.forEach((target) => pushEdge(node.id, target));
        return;
      }
    }

    if ((node.type === "API" || node.type === "KB" || node.type === "Handover") && endNodeId) {
      pushEdge(node.id, endNodeId);
      return;
    }

    const next = wfNodes[index + 1];
    if (next) {
      pushEdge(node.id, next.id);
    }
  });
  return edges;
}

const defaultWfNodes: WorkflowNode[] = [
  {
    id: "node_start", type: "Start", label: "START", value: "Điểm bắt đầu của workflow",
    x: 250, y: 50, ttsText: "",
  },
  {
    id: "node_greeting", type: "Prompt", label: "LỜI CHÀO", value: "Xin chào anh/chị, em là AI Voicebot hỗ trợ thanh toán.",
    x: 250, y: 190, ttsText: "Xin chào anh chị, em là AI Voicebot hỗ trợ thanh toán.",
  },
  {
    id: "node_capture_intent", type: "Intent", label: "HỎI NHU CẦU", value: "Anh/chị cần em hỗ trợ kiểm tra thanh toán, giải thích phí hay gặp nhân viên ạ?",
    x: 250, y: 330,
    ttsText: "Anh chị cần em hỗ trợ kiểm tra thanh toán, giải thích phí hay gặp nhân viên ạ?",
    mainIntent: "payment_check",
    confidenceThreshold: 0.82,
    repromptText: "Anh/chị có thể nói rõ hơn nhu cầu giúp em được không ạ?",
    timeoutSec: 7,
    maxRetry: 2,
    intents: ["payment_check", "late_fee_policy", "handover_request", "other"],
  },
  {
    id: "node_route", type: "Condition", label: "PHÂN LUỒNG", value: "Điều hướng theo intent vừa nhận diện.",
    x: 250, y: 470,
    intents: ["payment_check", "late_fee_policy", "handover_request", "other"],
    conditionSource: "intent",
    conditionRulesText:
      "intent == payment_check -> node_api\nintent == late_fee_policy -> node_kb\nintent == handover_request -> node_handover",
    defaultTargetNodeId: "node_end",
    onRuleError: "fallback",
  },
  {
    id: "node_api", type: "API", label: "TRA DƯ NỢ", value: "Tra cứu số tiền cần thanh toán từ billing API.",
    x: 550, y: 610,
    ttsText: "Em đang tra cứu số tiền cần thanh toán của anh chị.",
    entities: ["customer_id"], apiRef: "tra_cuoc_api", apiMethod: "GET", apiUrl: "/billing/current",
    authProfile: "billing_service_token", successCondition: "status == 200",
  },
  {
    id: "node_kb", type: "KB", label: "TRA CỨU CHÍNH SÁCH", value: "Tra cứu tri thức về phí chậm thanh toán và quy trình hỗ trợ.",
    x: 550, y: 760,
    ttsText: "Em đang tra cứu thông tin về chính sách thanh toán trễ hạn cho anh chị.",
    retrievalMode: "hybrid", topK: 3, scoreThreshold: 0.75, rerank: true,
    citationEnabled: true, promptTemplate: "Tóm tắt chính sách ngắn gọn, dễ hiểu, không quá 2 câu.",
    noAnswerAction: "fallback_node",
  },
  {
    id: "node_handover", type: "Handover", label: "CHUYỂN TỔNG ĐÀI VIÊN", value: "Em chuyển cuộc gọi sang tổng đài viên để hỗ trợ tiếp cho anh/chị.",
    x: 550, y: 910,
    ttsText: "Em chuyển cuộc gọi sang tổng đài viên để hỗ trợ tiếp cho anh chị.",
    handoverTarget: "queue_payment",
    handoverMessage: "Chuyển máy sang hàng chờ hỗ trợ thanh toán.",
    onHandoverFail: "fallback_node",
  },
  {
    id: "node_end", type: "End", label: "KẾT THÚC", value: "Cảm ơn anh/chị, chúc anh/chị một ngày tốt lành.",
    x: 250, y: 1040,
    ttsText: "Cảm ơn anh chị, chúc anh chị một ngày tốt lành.",
    endReason: "completed",
  },
];

interface WorkflowBuilderPrefill {
  name?: string;
  description?: string;
  kind?: "Inbound" | "Outbound" | "Playground";
  returnTo?: string;
  sourceContext?: string;
}

export function WorkflowBuilder({ workflowId, prefill }: { workflowId?: string; prefill?: WorkflowBuilderPrefill }) {
  const isEditing = Boolean(workflowId);
  const workflowQuery = useQuery({
    queryKey: ["workflow", workflowId],
    queryFn: () => fetchWorkflow(workflowId!),
    enabled: isEditing,
  });

  if (isEditing && workflowQuery.isLoading) return <AsyncState state="loading" />;
  if (isEditing && (workflowQuery.isError || !workflowQuery.data?.data))
    return <AsyncState state="error" onRetry={() => workflowQuery.refetch()} />;

  return (
    <WorkflowBuilderEditor
      key={workflowId ?? `new-workflow-${prefill?.name ?? "default"}`}
      workflowId={workflowId}
      initialWorkflow={workflowQuery.data?.data}
      prefill={prefill}
    />
  );
}

function WorkflowBuilderEditor({
  workflowId,
  initialWorkflow,
  prefill,
}: {
  workflowId?: string;
  initialWorkflow?: Workflow;
  prefill?: WorkflowBuilderPrefill;
}) {
  const router = useRouter();
  const isEditing = Boolean(workflowId);

  const initialSourceNodes = initialWorkflow?.nodes ?? defaultWfNodes;
  const initFlowNodes = useMemo(() => initialSourceNodes.map((n, i) => workflowNodeToFlowNode(n, i)), [initialSourceNodes]);
  const initEdges = useMemo(() => buildInitialEdges(initialSourceNodes), [initialSourceNodes]);

  const [wfName, setWfName] = useState(initialWorkflow?.name ?? prefill?.name ?? "Workflow mới");
  const [status, setStatus] = useState<"Draft" | "Active">(initialWorkflow?.status ?? "Draft");
  const [kind, setKind] = useState<"Inbound" | "Outbound" | "Playground">(initialWorkflow?.kind ?? prefill?.kind ?? "Outbound");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(initFlowNodes[0]?.id ?? null);
  const [newIntent, setNewIntent] = useState("");
  const [newEntity, setNewEntity] = useState("");

  const [nodes, setNodes, onNodesChange] = useNodesState(initFlowNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initEdges);

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
      const nodeTemplate = createNodeDefaults(type, nodes.length);
      const newNode = workflowNodeToFlowNode(
        {
          ...nodeTemplate,
          x: type === "API" || type === "KB" || type === "Handover" ? 550 : 250,
          y: (nodes.length + 1) * 150,
        },
        nodes.length,
      );
      setNodes((nds) => [...nds, newNode]);
      setSelectedNodeId(nodeTemplate.id);
      toast.success(`Đã thêm node ${getWorkflowNodeTypeLabel(type)}`);
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
      if (!isEditing && prefill?.returnTo) {
        const params = new URLSearchParams({
          workflowId: result.data.id,
          workflowName: result.data.name,
          workflowVersion: result.data.version,
        });
        router.push(`${prefill.returnTo}?${params.toString()}`);
        return;
      }
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
        retrievalMode: d.retrievalMode as WorkflowNode["retrievalMode"],
        topK: d.topK,
        scoreThreshold: d.scoreThreshold,
        rerank: d.rerank,
        promptTemplate: d.promptTemplate,
        citationEnabled: d.citationEnabled,
        noAnswerAction: d.noAnswerAction as WorkflowNode["noAnswerAction"],
        handoverTarget: d.handoverTarget,
        handoverMessage: d.handoverMessage,
        onHandoverFail: d.onHandoverFail as WorkflowNode["onHandoverFail"],
        endReason: d.endReason,
      };
    });
    const allIntents = Array.from(new Set(nodes.flatMap((n) => ((n.data as WfNodeData).intents ?? []))));
    mutation.mutate({ name: wfName.trim(), kind, status, intents: allIntents, nodes: payloadNodes });
  };

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
          <Link href={isEditing && workflowId ? `/workflow/${workflowId}` : prefill?.returnTo || "/workflow"}>
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

      {!isEditing && (prefill?.sourceContext || prefill?.description) ? (
        <Card className="space-y-2 border-[var(--accent)] bg-[rgba(24,144,255,0.05)]">
          <p className="text-sm font-semibold">Đang tạo workflow từ luồng business</p>
          {prefill?.sourceContext === "outbound-create" ? (
            <p className="text-sm text-[var(--text-dim)]">
              Workflow này được khởi tạo từ màn tạo Outbound Campaign. Sau khi bấm Publish, hệ thống sẽ quay lại luồng tạo campaign và gắn workflow mới vào bước chọn workflow.
            </p>
          ) : null}
          {prefill?.sourceContext === "inbound-create" ? (
            <p className="text-sm text-[var(--text-dim)]">
              Workflow này được khởi tạo từ màn tạo Inbound Route. Sau khi bấm Publish, hệ thống sẽ quay lại luồng tạo route và gắn workflow mới vào bước chọn workflow.
            </p>
          ) : null}
          {prefill?.description ? (
            <div className="rounded-lg border border-[var(--line)] bg-white p-3 text-sm text-[var(--text-dim)]">
              <span className="font-medium text-[var(--text-main)]">Bối cảnh ban đầu:</span> {prefill.description}
            </div>
          ) : null}
        </Card>
      ) : null}

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
                  if (t === "Handover") return "#db2777";
                  if (t === "End") return "#64748b";
                  if (t === "Start") return "#0f766e";
                  return "#3b82f6";
                }}
                maskColor="rgba(0,0,0,0.08)"
                className="!bg-white/80 !border-[var(--line)]"
              />
              <Panel position="top-right" className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => addNode("Prompt")}>
                  <Plus className="h-3.5 w-3.5" /> Prompt
                </Button>
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
                <Button size="sm" variant="secondary" onClick={() => addNode("Handover")}>
                  <Plus className="h-3.5 w-3.5" /> Handover
                </Button>
                <Button size="sm" variant="secondary" onClick={() => addNode("End")}>
                  <Plus className="h-3.5 w-3.5" /> End
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
                    <Input value={getWorkflowNodeTypeLabel(selectedData.nodeType)} readOnly className="bg-[#f1f5f9]" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[var(--text-dim)]">
                      {getWorkflowNodeContentLabel(selectedData.nodeType)}
                    </label>
                    <Textarea value={String(selectedData.value)} onChange={(e) => updateSelectedData({ value: e.target.value })} />
                  </div>
                  <div className="rounded-lg border border-[#d7e2f0] bg-white p-3 text-sm text-[var(--text-dim)]">
                    {getWorkflowNodeDescription(selectedData.nodeType)}
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[var(--text-dim)]">TTS / Bot nói ra</label>
                    <Textarea value={selectedData.ttsText || ""} onChange={(e) => updateSelectedData({ ttsText: e.target.value })} />
                  </div>

                  {selectedData.nodeType === "Start" && (
                    <div className="space-y-3 rounded-xl border border-[var(--line)] bg-white/80 p-3">
                      <p className="text-xs font-semibold uppercase text-[var(--text-dim)]">Start Properties</p>
                      <p className="text-sm text-[var(--text-dim)]">
                        Start chỉ dùng để đánh dấu điểm vào của workflow. Không nên gán logic intent, KB hay API vào node này.
                      </p>
                    </div>
                  )}

                  {selectedData.nodeType === "Prompt" && (
                    <div className="space-y-3 rounded-xl border border-[var(--line)] bg-white/80 p-3">
                      <p className="text-xs font-semibold uppercase text-[var(--text-dim)]">Prompt Properties</p>
                      <p className="text-sm text-[var(--text-dim)]">
                        Dùng node này cho lời chào, thông báo trung gian hoặc câu nói tĩnh trước khi sang bước kế tiếp.
                      </p>
                    </div>
                  )}

                  {selectedData.nodeType === "Intent" && (
                    <div className="space-y-3 rounded-xl border border-[var(--line)] bg-white/80 p-3">
                      <p className="text-xs font-semibold uppercase text-[var(--text-dim)]">Intent Capture Properties</p>
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
                      <div className="rounded-lg border border-[#cfe3ff] bg-[#f3f8ff] p-3 text-sm text-[#3768b3]">
                        Node KB chỉ định cách tra cứu tri thức. KB cụ thể được chọn khi workflow được gắn vào Outbound Campaign hoặc Inbound Route.
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

                  {selectedData.nodeType === "Handover" && (
                    <div className="space-y-3 rounded-xl border border-[var(--line)] bg-white/80 p-3">
                      <p className="text-xs font-semibold uppercase text-[var(--text-dim)]">Handover Properties</p>
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-[var(--text-dim)]">Target queue / agent</label>
                        <Input value={selectedData.handoverTarget || ""} onChange={(e) => updateSelectedData({ handoverTarget: e.target.value })} />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-[var(--text-dim)]">Thông điệp chuyển máy</label>
                        <Textarea rows={3} value={selectedData.handoverMessage || ""} onChange={(e) => updateSelectedData({ handoverMessage: e.target.value })} />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-[var(--text-dim)]">Nếu chuyển máy thất bại</label>
                        <Select value={selectedData.onHandoverFail || "fallback_node"} onChange={(e) => updateSelectedData({ onHandoverFail: e.target.value })}>
                          <option value="fallback_node">Đi tới fallback node</option>
                          <option value="retry_transfer">Thử chuyển lại</option>
                          <option value="end_call">Kết thúc cuộc gọi</option>
                        </Select>
                      </div>
                    </div>
                  )}

                  {selectedData.nodeType === "End" && (
                    <div className="space-y-3 rounded-xl border border-[var(--line)] bg-white/80 p-3">
                      <p className="text-xs font-semibold uppercase text-[var(--text-dim)]">End Properties</p>
                      <div>
                        <label className="mb-1 block text-xs font-semibold text-[var(--text-dim)]">End reason</label>
                        <Input value={selectedData.endReason || ""} onChange={(e) => updateSelectedData({ endReason: e.target.value })} placeholder="completed / transferred / no_answer" />
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
