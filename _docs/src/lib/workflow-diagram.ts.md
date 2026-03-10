<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/lib/workflow-diagram.ts",
  "source_hash": "4353e6eac9ec93fdf3591f4eeb0e6d685789dbcc3cb2c2a88a648a522f72f5b9",
  "last_updated": "2026-03-10T04:24:06.257796+00:00",
  "tokens_used": 7234,
  "complexity_score": 3,
  "estimated_review_time_minutes": 10,
  "external_dependencies": []
}
```

</details>

[Documentation Home](../../README.md) > [src](../README.md) > [lib](./README.md) > **workflow-diagram**

---

# workflow-diagram.ts

> **File:** `src/lib/workflow-diagram.ts`

![Complexity: Low](https://img.shields.io/badge/Complexity-Low-green) ![Review Time: 10min](https://img.shields.io/badge/Review_Time-10min-blue)

## 📑 Table of Contents


- [Overview](#overview)
- [Dependencies](#dependencies)
- [Architecture Notes](#architecture-notes)
- [Usage Examples](#usage-examples)
- [Maintenance Notes](#maintenance-notes)
- [Functions and Classes](#functions-and-classes)

---

## Overview

This module defines TypeScript types and pure helper functions to convert a list of WorkflowNode objects into positioned diagram nodes and a set of rectangular connector segments suitable for rendering in a canvas or DOM-based diagram. It exports types and interfaces for diagram nodes and connectors, numeric layout constants (NODE_WIDTH, NODE_HEIGHT), a decision helper for tone selection, a layout builder (buildWorkflowDiagram), a connector builder (buildWorkflowConnectors), and a mapping of tone names to style class strings (workflowToneStyles).

The layout builder applies a deterministic, column-based strategy: left-aligned nodes form the main column, API-type nodes are placed on a branch column, and terminal nodes are moved to an end column. Nodes with explicit numeric x/y are preserved. Each generated diagram node contains the original node reference, calculated x/y, fixed width/height, and an assigned tone. The connector builder produces axis-aligned rectangular segments between successive nodes; when columns differ, it composes three segments (vertical → horizontal → vertical). Both builders are pure and side-effect free, returning plain data structures for rendering code to consume.

## Dependencies

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/types/domain](../@/types/domain.md) | Imports the WorkflowNode type (import type { WorkflowNode } from "@/types/domain"). This type is used as the element type for input arrays to buildWorkflowDiagram(nodes: WorkflowNode[]) and as the node property type in the exported WorkflowDiagramNode interface. Marked as internal (is_external=false). |

## 📁 Directory

This file is part of the **lib** directory. View the [directory index](_docs/src/lib/README.md) to see all files in this module.

## Architecture Notes

- Stateless, pure functions: buildWorkflowDiagram and buildWorkflowConnectors operate without side effects and return plain objects; suitable for unit testing and predictable rendering pipelines.
- Layout strategy: Simple column-based layout with three columns (left, branch for API nodes, end for terminal nodes). Constants control column X positions and vertical spacing.
- Connector generation: Connectors are represented as axis-aligned rectangles. When columns differ, connectors are decomposed into three segments (vertical -> horizontal -> vertical).
- Locale-sensitive detection: Terminal node detection and tone assignment inspect node.label for substrings (Vietnamese 'kết' and English 'end'); this pragmatic rule may need localization improvements.
- No explicit error handling: Functions assume inputs conform to expected shapes; callers should validate malformed WorkflowNode inputs.

## Usage Examples

### Render a workflow diagram from a list of nodes

Call buildWorkflowDiagram(nodes) with an array of WorkflowNode instances to receive positioned WorkflowDiagramNode objects (x, y, width, height, tone, original node). Pass these to a renderer to draw node boxes. Then call buildWorkflowConnectors(diagramNodes) to obtain rectangular connector segments (x, y, w, h) and fromId/toId to draw connectors. Nodes with numeric x/y are preserved.

### Customizing visual styles per node tone

Use the tone field on each WorkflowDiagramNode to look up style strings in workflowToneStyles. Each tone maps to header, border, and chip class strings. Apply header for title bars, border for outlines, and chip for small labels to ensure consistent color/tone across nodes.

## Maintenance Notes

- Performance: Both builders are O(n); buildWorkflowConnectors may append up to three segments per edge. Very large graphs may require renderer-side virtualization.
- Edge cases: If nodes is empty, buildWorkflowDiagram returns an empty array; buildWorkflowConnectors returns an empty array when diagramNodes.length < 2.
- Localization and detection rules: Consider adding explicit properties (e.g., node.isTerminal) instead of relying on substring checks for labels.
- Visual tuning: Expose layout constants as parameters if a responsive or dynamic layout is required.
- Testing: Unit tests should cover explicit coordinates preservation, API branching placement, terminal detection, and connector composition for aligned and non-aligned centers.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/lib/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*


---

## Functions and Classes


#### function toneByNode

![Type: Sync](https://img.shields.io/badge/Type-Sync-green)

### Signature

```typescript
function toneByNode(node: WorkflowNode, index: number, total: number): WorkflowDiagramTone
```

### Description

Determine and return a visual tone (color name) for a workflow node based on the node's label, id, and type, and the node's position within a sequence.


The function inspects the provided WorkflowNode's label (converted to lowercase), id, and type to decide which WorkflowDiagramTone string to return. It checks for specific label substrings ('start', 'kết thúc', 'end'), a specific id ('node_start'), and node.type values ('API', 'KB', 'Condition'). For 'Condition' nodes it uses the position (index and total) to return 'slate' when the node is the last in the sequence; otherwise it returns 'orange'. If none of the checks match, it returns 'blue'. The function performs simple string checks and equality comparisons and returns immediately on the first matching rule.

### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `node` | `WorkflowNode` | ✅ | The workflow node to evaluate. The function uses node.label (converted to lowercase), node.id, and node.type to determine the tone.
<br>**Constraints:** node.label should be a string (function calls node.label.toLowerCase()), node.id expected to be a string when compared to 'node_start', node.type is compared against 'API', 'KB', 'Condition' (string) |
| `index` | `number` | ✅ | Zero-based position of this node within a sequence (used only for Condition nodes to decide if it is the last one).
<br>**Constraints:** index is expected to be a non-negative integer, index is used in comparison with total - 1 when node.type === 'Condition' |
| `total` | `number` | ✅ | Total number of nodes in the sequence (used to determine whether a Condition node is the last one).
<br>**Constraints:** total should be a positive integer, total - 1 is computed and compared against index when node.type === 'Condition' |

### Returns

**Type:** `WorkflowDiagramTone`

A string literal representing the chosen tone/color for the node.


**Possible Values:**

- teal
- slate
- purple
- green
- orange
- blue

### Usage Examples

#### Determine tone for a start node by label

```typescript
toneByNode({ label: 'Start flow', id: 'n1', type: 'SomeType' }, 0, 3)
```

Returns 'teal' because the label includes 'start' (case-insensitive).

#### Determine tone for an API node

```typescript
toneByNode({ label: 'Call external', id: 'n2', type: 'API' }, 1, 3)
```

Returns 'purple' because node.type === 'API'.

#### Determine tone for the last Condition node

```typescript
toneByNode({ label: 'Check', id: 'n3', type: 'Condition' }, 2, 3)
```

Returns 'slate' because node.type === 'Condition' and index === total - 1.

#### Default fallback tone

```typescript
toneByNode({ label: 'Unknown', id: 'n4', type: 'Other' }, 0, 1)
```

Returns 'blue' because none of the specific rules matched.

### Complexity

Time: O(1) — a fixed sequence of string checks and comparisons. Space: O(1) — constant additional space.

### Related Functions

- `none detected in provided implementation` - No direct calls to or from other functions are present within this function body.

### Notes

- The function converts node.label to lowercase once and uses includes() to perform substring checks; non-string node.label will cause a runtime error because toLowerCase() is called.
- The check for node.id === 'node_start' is an explicit id-based override for the teal tone.
- For Condition nodes, only the final position (index === total - 1) results in 'slate'; all other Condition nodes return 'orange'.
- No validation is performed on index/total values; if total <= 0 or index is out of range the Condition branch comparison still executes but may be logically incorrect for the caller's intent.

---


