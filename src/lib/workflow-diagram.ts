import type { WorkflowNode } from "@/types/domain";

export type WorkflowDiagramTone = "blue" | "green" | "orange" | "purple" | "rose" | "slate" | "teal";

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
  if (node.type === "Start") {
    return "teal";
  }
  if (node.type === "End") {
    return "slate";
  }
  if (node.type === "Prompt" || node.type === "Intent") {
    return "blue";
  }
  if (node.type === "API") {
    return "purple";
  }
  if (node.type === "KB") {
    return "green";
  }
  if (node.type === "Handover") {
    return "rose";
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
    const isTerminal = node.type === "End" || (index === nodes.length - 1 && node.label.toLowerCase().includes("end"));

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
    } else if (node.type === "KB" || node.type === "Handover") {
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
  const byId = new Map(diagramNodes.map((item) => [item.node.id, item]));
  const endNode = diagramNodes.find((item) => item.node.type === "End");
  const seen = new Set<string>();

  const parseRuleTargets = (conditionRulesText?: string) =>
    conditionRulesText
      ? Array.from(conditionRulesText.matchAll(/->\s*([A-Za-z0-9_-]+)/g)).map((match) => match[1])
      : [];

  const pushConnector = (current: WorkflowDiagramNode, next: WorkflowDiagramNode) => {
    const key = `${current.node.id}-${next.node.id}`;
    if (current.node.id === next.node.id || seen.has(key)) return;
    seen.add(key);

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
      return;
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
  };

  diagramNodes.forEach((current, index) => {
    if (current.node.type === "End") return;

    if (current.node.type === "Condition") {
      const targets = [...parseRuleTargets(current.node.conditionRulesText), current.node.defaultTargetNodeId]
        .filter((target): target is string => Boolean(target))
        .map((target) => byId.get(target))
        .filter((target): target is WorkflowDiagramNode => Boolean(target));

      if (targets.length > 0) {
        targets.forEach((target) => pushConnector(current, target));
        return;
      }
    }

    if ((current.node.type === "API" || current.node.type === "KB" || current.node.type === "Handover") && endNode) {
      pushConnector(current, endNode);
      return;
    }

    const next = diagramNodes[index + 1];
    if (next) {
      pushConnector(current, next);
    }
  });

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
  rose: {
    header: "bg-[#db2777]",
    border: "border-[#f2a7cc]",
    chip: "bg-[#ffe7f2] text-[#aa1f5a]",
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
