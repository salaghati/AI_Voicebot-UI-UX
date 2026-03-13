"use client";

import { useMemo } from "react";
import type { WorkflowNode } from "@/types/domain";
import { getWorkflowNodeTypeLabel } from "@/lib/workflow-node-meta";
import {
  buildWorkflowConnectors,
  buildWorkflowDiagram,
  workflowToneStyles,
} from "@/lib/workflow-diagram";

interface WorkflowDiagramCanvasProps {
  nodes: WorkflowNode[];
  selectedId?: string;
  onSelect?: (nodeId: string) => void;
  title?: string;
  subtitle?: string;
  activeNodeId?: string;
}

export function WorkflowDiagramCanvas({
  nodes,
  selectedId,
  onSelect,
  title,
  subtitle,
  activeNodeId,
}: WorkflowDiagramCanvasProps) {
  const diagramNodes = useMemo(() => buildWorkflowDiagram(nodes), [nodes]);
  const connectors = useMemo(() => buildWorkflowConnectors(diagramNodes), [diagramNodes]);
  const canvasHeight = useMemo(() => {
    const maxBottom = diagramNodes.reduce((max, item) => Math.max(max, item.y + item.height), 0);
    return Math.max(520, maxBottom + 70);
  }, [diagramNodes]);

  return (
    <section className="relative overflow-auto bg-[radial-gradient(circle,#e6ebf2_1px,transparent_1px)] [background-size:18px_18px] p-6">
      {title || subtitle ? (
        <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
          <div>
            {title ? <h3 className="text-lg font-bold text-[var(--text-main)]">{title}</h3> : null}
            {subtitle ? <p className="text-sm text-[var(--text-dim)]">{subtitle}</p> : null}
          </div>
        </div>
      ) : null}

      <div className="relative min-w-[760px]" style={{ height: canvasHeight }}>
        {connectors.map((connector, index) => {
          const highlighted = Boolean(
            (activeNodeId && (connector.fromId === activeNodeId || connector.toId === activeNodeId)) ||
              (selectedId && (connector.fromId === selectedId || connector.toId === selectedId)),
          );

          return (
            <div
              key={`line-${index}`}
              className={`absolute rounded-full ${highlighted ? "bg-[#58a6ff]" : "bg-[#c8d3e1]"}`}
              style={{
                left: connector.x,
                top: connector.y,
                width: connector.w,
                height: connector.h,
                boxShadow: highlighted ? "0 0 0 1px rgba(88,166,255,0.22)" : undefined,
              }}
            />
          );
        })}

        {diagramNodes.map((item) => {
          const tone = workflowToneStyles[item.tone];
          const isSelected = selectedId ? selectedId === item.node.id : false;
          const isActive = activeNodeId ? activeNodeId === item.node.id : false;

          return (
            <button
              key={item.node.id}
              type="button"
              className={`absolute overflow-hidden rounded-xl border bg-white text-left shadow-sm transition ${tone.border} ${
                isSelected ? "ring-2 ring-[#5ea9ff]" : ""
              } ${isActive ? "shadow-[0_0_0_3px_rgba(16,185,129,0.18)]" : ""}`}
              style={{ left: item.x, top: item.y, width: item.width }}
              onClick={() => onSelect?.(item.node.id)}
            >
              <div className={`px-3 py-1.5 text-xs font-bold text-white ${tone.header}`}>
                {item.node.label}
              </div>
              <div className="p-3 text-sm text-[var(--text-main)]">
                <p className="break-words">{item.node.value}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${tone.chip}`}>
                    {getWorkflowNodeTypeLabel(item.node.type)}
                  </span>
                  {isActive ? (
                    <span className="rounded-full bg-[#e7fbf3] px-2 py-0.5 text-[11px] font-semibold text-[#117a5b]">
                      Đang xem
                    </span>
                  ) : null}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
