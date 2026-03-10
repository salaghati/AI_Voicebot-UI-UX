"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";

const toneMap: Record<string, { header: string; border: string; ring: string }> = {
  Intent: { header: "bg-[#3b82f6]", border: "border-[#8db8ff]", ring: "ring-[#3b82f6]/30" },
  Condition: { header: "bg-[#f59e0b]", border: "border-[#f3d291]", ring: "ring-[#f59e0b]/30" },
  API: { header: "bg-[#8b5cf6]", border: "border-[#cab5ff]", ring: "ring-[#8b5cf6]/30" },
  KB: { header: "bg-[#10b981]", border: "border-[#8ee5c9]", ring: "ring-[#10b981]/30" },
  Start: { header: "bg-[#0f766e]", border: "border-[#88d8d1]", ring: "ring-[#0f766e]/30" },
  End: { header: "bg-[#64748b]", border: "border-[#b2bed0]", ring: "ring-[#64748b]/30" },
};

function resolveTone(data: Record<string, unknown>) {
  const label = String(data.label ?? "").toLowerCase();
  if (label.includes("start") || data.nodeId === "node_start") return toneMap.Start;
  if (label.includes("kết") || label.includes("end")) return toneMap.End;
  return toneMap[String(data.nodeType)] ?? toneMap.Intent;
}

function WorkflowNodeInner({ data, selected }: NodeProps) {
  const tone = resolveTone(data as Record<string, unknown>);
  const intents = (data.intents as string[]) ?? [];
  const nodeType = String(data.nodeType ?? "Intent");

  return (
    <div
      className={`w-[220px] overflow-hidden rounded-xl border bg-white shadow-sm transition-shadow ${tone.border} ${selected ? `ring-2 ${tone.ring}` : ""}`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-[#94a3b8] !border-2 !border-white hover:!bg-[#3b82f6] !-top-1.5"
      />
      <div className={`px-3 py-1.5 text-xs font-bold text-white ${tone.header}`}>
        {String(data.label)}
      </div>
      <div className="p-3 text-sm text-[var(--text-main)]">
        <p className="break-words line-clamp-2">{String(data.value ?? "")}</p>
        {intents.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {intents.slice(0, 3).map((i: string) => (
              <span key={i} className="rounded-full bg-[#eef4ff] px-2 py-0.5 text-xs text-[#3565b3]">
                {i}
              </span>
            ))}
            {intents.length > 3 && (
              <span className="text-xs text-[var(--text-dim)]">+{intents.length - 3}</span>
            )}
          </div>
        )}
        <div className="mt-1.5 flex items-center justify-between">
          <span className="rounded-full bg-[#f1f5f9] px-2 py-0.5 text-[10px] font-semibold text-[#546273]">
            {nodeType}
          </span>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-[#94a3b8] !border-2 !border-white hover:!bg-[#3b82f6] !-bottom-1.5"
      />
    </div>
  );
}

export const WorkflowFlowNode = memo(WorkflowNodeInner);
