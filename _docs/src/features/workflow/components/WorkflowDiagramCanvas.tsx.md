<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/features/workflow/components/WorkflowDiagramCanvas.tsx",
  "source_hash": "3d6065c8a0ce0068b47b404cfe07991c4858ec30afb1622ebfebd53d36ba2462",
  "last_updated": "2026-03-10T04:19:54.038779+00:00",
  "git_sha": "f667c6cd8ed80d43d9369da3a2d15ef4f74752df",
  "tokens_used": 6653,
  "complexity_score": 3,
  "estimated_review_time_minutes": 15,
  "external_dependencies": [
    "react"
  ]
}
```

</details>

[Documentation Home](../../../../README.md) > [src](../../../README.md) > [features](../../README.md) > [workflow](../README.md) > [components](./README.md) > **WorkflowDiagramCanvas.mdx**

---

# WorkflowDiagramCanvas.tsx

> **File:** `src/features/workflow/components/WorkflowDiagramCanvas.tsx`

![Complexity: Low](https://img.shields.io/badge/Complexity-Low-green) ![Review Time: 15min](https://img.shields.io/badge/Review_Time-15min-blue)

## 📑 Table of Contents


- [Overview](#overview)
- [Dependencies](#dependencies)
- [Architecture Notes](#architecture-notes)
- [Usage Examples](#usage-examples)
- [Maintenance Notes](#maintenance-notes)
- [Functions and Classes](#functions-and-classes)

---

## Overview

This file exports a single React functional component WorkflowDiagramCanvas which receives an array of WorkflowNode items and renders a canvas-like area with absolutely positioned node cards and connector lines. It uses buildWorkflowDiagram to convert domain nodes into layouted diagramNodes, buildWorkflowConnectors to compute connector rectangles between nodes, and workflowToneStyles to derive per-node visual styles. The component memoizes derived values (diagramNodes, connectors, canvasHeight) with useMemo to avoid recomputations on unrelated renders.

The component is purely presentational: it accepts props (nodes, selectedId, onSelect, title, subtitle, activeNodeId) and renders a scrollable area with an optional title/subtitle header, connector elements as absolutely positioned rounded divs, and each diagram node as a button (click -> onSelect callback). Visual state such as selection and active highlighting is derived from selectedId and activeNodeId: connectors and node borders/shadows change appearance when highlighted. The canvas height is computed from the bottom of layouted nodes with a minimum fallback (Math.max(520, maxBottom + 70)). Styling relies on Tailwind CSS classes and the tone styles provided by workflowToneStyles; the active node also shows a Vietnamese label "Đang xem" when active.

## Dependencies

### External Dependencies

| Module | Usage |
| --- | --- |
| `react` | Imports the useMemo hook: used to memoize derived values diagramNodes, connectors, and canvasHeight inside the React functional component. The component itself is a client-side React component ("use client" directive). |

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/types/domain](../@/types/domain.md) | Imports the WorkflowNode type (TypeScript type-only import) which is used in the WorkflowDiagramCanvasProps interface to type the nodes prop. |
| [@/lib/workflow-diagram](../@/lib/workflow-diagram.md) | Imports buildWorkflowConnectors, buildWorkflowDiagram, and workflowToneStyles. buildWorkflowDiagram(nodes) is called to produce layouted diagramNodes. buildWorkflowConnectors(diagramNodes) is used to produce connector positions/sizes. workflowToneStyles is used to map a node's tone to CSS class fragments for header, chip, and border styling. |

## 📁 Directory

This file is part of the **components** directory. View the [directory index](_docs/src/features/workflow/components/README.md) to see all files in this module.

## Architecture Notes

- Implements a React functional component pattern with no internal React state; all stateful behavior is driven by props (nodes, selectedId, activeNodeId) and an onSelect callback.
- Uses useMemo to memoize expensive derived state: diagramNodes (from buildWorkflowDiagram), connectors (from buildWorkflowConnectors), and canvasHeight (computed from diagramNodes). Memoization keys are the direct dependencies: nodes and diagramNodes.
- Layout and rendering strategy: layout computation is delegated to external helpers (buildWorkflowDiagram and buildWorkflowConnectors). The component focuses on rendering absolute-positioned DOM elements (connectors as rounded divs and nodes as buttons) using computed x/y/width/height values.
- No error handling is present for malformed node data; the component assumes buildWorkflowDiagram returns items with numeric x/y/width/height and item.node fields. Visual highlighting logic combines selectedId and activeNodeId checks to apply CSS classes or inline boxShadow styles.

## Usage Examples

### Parent page renders a workflow and highlights a node on click

Parent supplies an array of WorkflowNode objects as the nodes prop. It keeps local state for selectedId and activeNodeId and passes a handler to onSelect that updates selectedId. WorkflowDiagramCanvas computes diagramNodes and connectors (via imported helpers) and renders them. When a node button is clicked, onSelect is invoked with the node id; the parent can then set selectedId to that id, causing the component to render the node with a ring highlight and connectors related to that node in a highlighted color. For active node highlighting, the parent sets activeNodeId (for example when the user focuses a node elsewhere), and the component shows an additional greenish shadow and an "Đang xem" badge on the active node.

## Maintenance Notes

- Performance: For large numbers of nodes, buildWorkflowDiagram/buildWorkflowConnectors performance becomes critical; memoization relies on shallow equality of nodes and diagramNodes. If nodes arrays are recreated frequently, consider stabilizing references or deep-memoizing inputs upstream.
- Accessibility: Nodes are rendered as button elements which is good for keyboard focus, but they lack aria-labels and other screen-reader metadata. Add aria-label or aria-describedby to convey node label/value/type for assistive tech.
- Internationalization: The active badge text is hard-coded as the Vietnamese string "Đang xem". Extract into a localization resource if the UI needs multiple languages.
- Styling/Responsive: The component uses a fixed minimum width (min-w-[760px]) and absolute positioning; embedding in narrow containers will require horizontal scrolling. Verify container sizing and consider responsive adjustments if embedding in smaller viewports.
- Testing: Unit tests should supply deterministic node arrays and assert that buildWorkflowDiagram/buildWorkflowConnectors are invoked and that DOM elements are positioned with expected inline styles (left/top/width/height), and that onSelect is called with correct id on click.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/features/workflow/components/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*
