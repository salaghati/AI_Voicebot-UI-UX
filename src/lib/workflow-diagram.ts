import type { WorkflowNode } from "@/types/domain";

export type WorkflowDiagramTone = "blue" | "green" | "orange" | "purple" | "slate" | "teal";

export interface WorkflowDiagramNode {
  node: WorkflowNode;
  x: number;
  y: number;
  width: number;
  height: number;
  tone: WorkflowDiagramTone;
}

export interface WorkflowDiagramConnector {
  x: number;
  y: number;
  w: number;
  h: number;
  fromId: string;
  toId: string;
}

const NODE_WIDTH = 220;
const NODE_HEIGHT = 76;

function toneByNode(node: WorkflowNode, index: number, total: number): WorkflowDiagramTone {
  const label = node.label.toLowerCase();
  if (label.includes("start") || node.id === "node_start") {
    return "teal";
  }
  if (label.includes("kết thúc") || label.includes("end")) {
    return "slate";
  }
  if (node.type === "API") {
    return "purple";
  }
  if (node.type === "KB") {
    return "green";
  }
  if (node.type === "Condition") {
    return index === total - 1 ? "slate" : "orange";
  }
  return "blue";
}

export function buildWorkflowDiagram(nodes: WorkflowNode[]): WorkflowDiagramNode[] {
  const leftX = 36;
  const branchX = 330;
  const endX = 84;
  const topY = 34;
  const gapY = 120;
  const branchBaseY = 520;
  const diagramNodes: WorkflowDiagramNode[] = [];
  let leftIndex = 0;
  let branchIndex = 0;

  nodes.forEach((node, index) => {
    const isTerminal =
      index === nodes.length - 1 &&
      (node.label.toLowerCase().includes("kết") || node.label.toLowerCase().includes("end"));

    let x = leftX;
    let y = topY + leftIndex * gapY;

    if (typeof node.x === "number" && typeof node.y === "number") {
      x = node.x;
      y = node.y;
      diagramNodes.push({
        node,
        x,
        y,
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
        tone: toneByNode(node, index, nodes.length),
      });
      return;
    }

    if (node.type === "API") {
      x = branchX;
      y = branchBaseY + branchIndex * gapY;
      branchIndex += 1;
    } else if (isTerminal) {
      x = endX;
      y = branchBaseY + Math.max(branchIndex, 1) * gapY;
      leftIndex += 1;
    } else {
      leftIndex += 1;
    }

    diagramNodes.push({
      node,
      x,
      y,
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
      tone: toneByNode(node, index, nodes.length),
    });
  });

  return diagramNodes;
}

export function buildWorkflowConnectors(diagramNodes: WorkflowDiagramNode[]): WorkflowDiagramConnector[] {
  const connectors: WorkflowDiagramConnector[] = [];

  for (let index = 0; index < diagramNodes.length - 1; index += 1) {
    const current = diagramNodes[index];
    const next = diagramNodes[index + 1];
    const fromX = current.x + current.width / 2;
    const fromBottom = current.y + current.height;
    const toX = next.x + next.width / 2;
    const toTop = next.y;

    if (Math.abs(fromX - toX) < 4) {
      connectors.push({
        x: Math.round(fromX),
        y: fromBottom,
        w: 2,
        h: Math.max(18, toTop - fromBottom),
        fromId: current.node.id,
        toId: next.node.id,
      });
      continue;
    }

    const midY = Math.max(fromBottom + 26, toTop - 26);
    connectors.push({
      x: Math.round(fromX),
      y: fromBottom,
      w: 2,
      h: Math.max(20, midY - fromBottom),
      fromId: current.node.id,
      toId: next.node.id,
    });
    connectors.push({
      x: Math.min(fromX, toX),
      y: midY,
      w: Math.abs(toX - fromX),
      h: 2,
      fromId: current.node.id,
      toId: next.node.id,
    });
    connectors.push({
      x: Math.round(toX),
      y: midY,
      w: 2,
      h: Math.max(20, toTop - midY),
      fromId: current.node.id,
      toId: next.node.id,
    });
  }

  return connectors;
}

export const workflowToneStyles: Record<
  WorkflowDiagramTone,
  { header: string; border: string; chip: string }
> = {
  blue: {
    header: "bg-[#3b82f6]",
    border: "border-[#8db8ff]",
    chip: "bg-[#eef4ff] text-[#3565b3]",
  },
  green: {
    header: "bg-[#10b981]",
    border: "border-[#8ee5c9]",
    chip: "bg-[#e7fbf3] text-[#117a5b]",
  },
  orange: {
    header: "bg-[#f59e0b]",
    border: "border-[#f3d291]",
    chip: "bg-[#fff4dd] text-[#a56a06]",
  },
  purple: {
    header: "bg-[#8b5cf6]",
    border: "border-[#cab5ff]",
    chip: "bg-[#f3ecff] text-[#6544b0]",
  },
  slate: {
    header: "bg-[#64748b]",
    border: "border-[#b2bed0]",
    chip: "bg-[#f1f5f9] text-[#546273]",
  },
  teal: {
    header: "bg-[#0f766e]",
    border: "border-[#88d8d1]",
    chip: "bg-[#e6fffb] text-[#0f766e]",
  },
};
