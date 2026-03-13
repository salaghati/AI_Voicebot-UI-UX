"use client";

import { useEffect, useMemo } from "react";
import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import type { WorkflowNode } from "@/types/domain";
import { WorkflowFlowNode } from "./flow-nodes";

const nodeTypes = { workflowNode: WorkflowFlowNode };

const defaultEdgeOptions = {
  animated: true,
  style: { stroke: "#94a3b8", strokeWidth: 2 },
};

interface FlowNodeData extends Record<string, unknown> {
  label: string;
  value: string;
  nodeType: WorkflowNode["type"];
  nodeId: string;
}

function toFlowNode(node: WorkflowNode, index: number): Node<FlowNodeData> {
  const leftX = 250;
  const branchX = 550;
  const gapY = 140;

  return {
    id: node.id,
    type: "workflowNode",
    position: {
      x: node.x ?? (node.type === "API" || node.type === "KB" || node.type === "Handover" ? branchX : leftX),
      y: node.y ?? 50 + index * gapY,
    },
    data: {
      label: node.label,
      value: node.value,
      nodeType: node.type,
      nodeId: node.id,
    },
  };
}

function parseRuleTargets(conditionRulesText?: string) {
  if (!conditionRulesText) return [];
  return Array.from(conditionRulesText.matchAll(/->\s*([A-Za-z0-9_-]+)/g)).map((match) => match[1]);
}

function buildEdges(nodes: WorkflowNode[]): Edge[] {
  const edges: Edge[] = [];
  const seen = new Set<string>();
  const endNodeId = nodes.find((node) => node.type === "End")?.id;

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

  nodes.forEach((node, index) => {
    if (node.type === "End") return;

    if (node.type === "Condition") {
      const targets = [...parseRuleTargets(node.conditionRulesText), node.defaultTargetNodeId]
        .filter((target): target is string => Boolean(target))
        .filter((target) => nodes.some((candidate) => candidate.id === target));

      if (targets.length > 0) {
        targets.forEach((target) => pushEdge(node.id, target));
        return;
      }
    }

    if ((node.type === "API" || node.type === "KB" || node.type === "Handover") && endNodeId) {
      pushEdge(node.id, endNodeId);
      return;
    }

    const next = nodes[index + 1];
    if (next) pushEdge(node.id, next.id);
  });

  return edges;
}

export function WorkflowInteractiveCanvas({
  workflowNodes,
  selectedId,
  onSelect,
  title,
  subtitle,
}: {
  workflowNodes: WorkflowNode[];
  selectedId?: string;
  onSelect?: (nodeId: string) => void;
  title?: string;
  subtitle?: string;
}) {
  const initialFlowNodes = useMemo(
    () => workflowNodes.map((node, index) => toFlowNode(node, index)),
    [workflowNodes],
  );
  const initialEdges = useMemo(() => buildEdges(workflowNodes), [workflowNodes]);
  const resetKey = useMemo(
    () => workflowNodes.map((node) => `${node.id}:${node.x ?? ""}:${node.y ?? ""}`).join("|"),
    [workflowNodes],
  );
  const [nodes, setNodes, onNodesChange] = useNodesState(initialFlowNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    setNodes(workflowNodes.map((node, index) => toFlowNode(node, index)));
    setEdges(buildEdges(workflowNodes));
  }, [resetKey, setEdges, setNodes, workflowNodes]);

  useEffect(() => {
    setNodes((current) =>
      current.map((node) => ({
        ...node,
        selected: selectedId === node.id,
      })),
    );
  }, [selectedId, setNodes]);

  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle,#e6ebf2_1px,transparent_1px)] [background-size:18px_18px] p-6">
      {title || subtitle ? (
        <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
          <div>
            {title ? <h3 className="text-lg font-bold text-[var(--text-main)]">{title}</h3> : null}
            {subtitle ? <p className="text-sm text-[var(--text-dim)]">{subtitle}</p> : null}
          </div>
        </div>
      ) : null}

      <div style={{ height: 720 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={(_, node) => onSelect?.(node.id)}
          nodeTypes={nodeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          fitView
          snapToGrid
          snapGrid={[20, 20]}
          nodesDraggable
          nodesConnectable={false}
          elementsSelectable
          panOnDrag={false}
          proOptions={{ hideAttribution: true }}
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#d1d5db" />
          <Controls showInteractive={false} />
          <MiniMap
            nodeColor={(node) => {
              const type = String((node.data as FlowNodeData)?.nodeType ?? "Prompt");
              if (type === "API") return "#8b5cf6";
              if (type === "KB") return "#10b981";
              if (type === "Condition") return "#f59e0b";
              if (type === "Handover") return "#db2777";
              if (type === "End") return "#64748b";
              if (type === "Start") return "#0f766e";
              return "#3b82f6";
            }}
            maskColor="rgba(0,0,0,0.08)"
            className="!bg-white/85 !border-[var(--line)]"
          />
        </ReactFlow>
      </div>
    </section>
  );
}
