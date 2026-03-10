<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/features/workflow/components/WorkflowBuilder.tsx",
  "source_hash": "bb9c763d279d3bb7b1ee52cc035cf6bd19362b9de5e3ec830788477e16ac7b4f",
  "last_updated": "2026-03-10T04:19:19.509927+00:00",
  "tokens_used": 15250,
  "complexity_score": 5,
  "estimated_review_time_minutes": 20,
  "external_dependencies": [
    "react",
    "next/link",
    "@tanstack/react-query",
    "next/navigation",
    "lucide-react",
    "sonner"
  ]
}
```

</details>

[Documentation Home](../../../../README.md) > [src](../../../README.md) > [features](../../README.md) > [workflow](../README.md) > [components](./README.md) > **WorkflowBuilder.mdx**

---

# WorkflowBuilder.tsx

> **File:** `src/features/workflow/components/WorkflowBuilder.tsx`

![Complexity: Medium](https://img.shields.io/badge/Complexity-Medium-yellow) ![Review Time: 20min](https://img.shields.io/badge/Review_Time-20min-blue)

## 📑 Table of Contents


- [Overview](#overview)
- [Dependencies](#dependencies)
- [Architecture Notes](#architecture-notes)
- [Usage Examples](#usage-examples)
- [Maintenance Notes](#maintenance-notes)
- [Functions and Classes](#functions-and-classes)

---

## Overview

This file implements a single-page workflow editor as a React functional component (WorkflowBuilder) plus helper functions and constants. It defines TypeScript types/aliases and default node data, provides helpers to derive node tone and enforce node defaults, and integrates with react-query to fetch and persist workflows. The editor stores nodes with x/y coordinates, computes connectors for rendering links between nodes, and exposes node property editing in a side panel. Node dragging is implemented using pointer events with global listeners attached while dragging and cleaned up on pointerup.

The component supports both creating new workflows and editing existing ones. On mount it either initializes default nodes or hydrates fetched workflow nodes with UI defaults. Submitting the editor builds a payload that strips UI-only fields, deduplicates intents, and calls createWorkflow or updateWorkflow. Visual connectors are recomputed from node positions via a memoized helper so the diagram updates responsively while dragging. The UI surfaces AsyncState while fetching and uses toast notifications for user feedback.

## Dependencies

### External Dependencies

| Module | Usage |
| --- | --- |
| `react` | Imports hooks useEffect, useMemo, useRef, useState. They are used throughout WorkflowBuilder to manage component state, memoized computations (selectedNode, canvasNodes, connectors, canvasHeight), DOM refs for drag/canvas/scroll, and lifecycle effects for fetching or pointer event handling. |
| `next/link` | Imports Link (default export) and is used to create in-app navigation links for returning to the workflow list, opening version history, and the preview/session route in the top toolbar. |
| `@tanstack/react-query` | Imports useMutation and useQuery which are used to (1) fetch an existing workflow when workflowId is provided (useQuery with queryKey ['workflow', workflowId] and fetchWorkflow) and (2) create or update workflows on submit (useMutation calling createWorkflow or updateWorkflow). |
| `next/navigation` | Imports useRouter and uses router.push(...) after a successful create/update mutation to navigate to the saved workflow's page. |
| `lucide-react` | Imports icons ArrowLeft, Eye, Plus, Trash2 which are rendered in buttons (back navigation, preview, add node buttons, and delete buttons in property lists). |
| `sonner` | Imports toast to show user feedback (toast.success, toast.error) for actions like save success/failure, invalid actions (e.g., deleting last node), and blocking preview when workflow is not saved. |

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/lib/api-client](../@/lib/api-client.md) | Imports createWorkflow, fetchWorkflow, updateWorkflow. fetchWorkflow is used by useQuery to hydrate the editor when editing an existing workflow; createWorkflow/updateWorkflow are used by useMutation for persisting the edited or newly created workflow payload. |
| [@/components/ui/card](../@/components/ui/card.md) | Imports Card, used as a layout container for the top toolbar area (workflow metadata and action buttons). |
| [@/components/ui/input](../@/components/ui/input.md) | Imports Input component and uses it across the editor (workflow name, node name, numeric fields, single-line text inputs) to provide consistent UI input elements. |
| [@/components/ui/select](../@/components/ui/select.md) | Imports Select and uses it for dropdowns like workflow kind, node type-specific selections (fallback node, retrieval mode, on-fail actions, etc.). |
| [@/components/ui/textarea](../@/components/ui/textarea.md) | Imports Textarea and uses it for multi-line inputs (node value, TTS text, condition rules, request/response mappings, prompts). |
| [@/components/ui/button](../@/components/ui/button.md) | Imports Button and uses it for all clickable actions in the UI (add node, save/publish, delete node, add intent/entity controls, preview link buttons). |
| [@/types/domain](../@/types/domain.md) | Imports the TypeScript type WorkflowNode (import type { WorkflowNode }). This type is used throughout the file to type helper functions (withNodeDefaults accepts WorkflowNode) and to shape the nodes stored in component state and sent to the API. |
| [@/components/shared/async-state](../@/components/shared/async-state.md) | Imports AsyncState which is rendered when the initial workflow fetch is loading or errored (used to block the editor UI while useQuery is fetching or failed). |
| [@/lib/workflow-diagram](../@/lib/workflow-diagram.md) | Imports buildWorkflowConnectors which is called with canvasNodes (derived from nodes) to compute connector geometries (x,y,width,height,fromId,toId) used to render the visual connector lines on the canvas. |

## 📁 Directory

This file is part of the **components** directory. View the [directory index](_docs/src/features/workflow/components/README.md) to see all files in this module.

## Architecture Notes

- React functional component pattern with local state: The WorkflowBuilder component is a single functional component that uses React hooks for state (useState), refs (useRef), effects (useEffect) and derived memoized values (useMemo). There is no external global state; persistence is performed via react-query mutations.
- Server integration via react-query: useQuery(fetchWorkflow) hydrates the editor if workflowId is provided; useMutation(createWorkflow/updateWorkflow) persists the assembled payload. onSuccess handler navigates to the saved workflow page and shows toast notifications. Error handling surfaces via toast and AsyncState for fetch errors.
- Drag implementation: Node dragging uses pointer events captured on individual node buttons. Pointerdown stores an offset in dragRef and sets draggingId; a useEffect watches draggingId and attaches window-level pointermove and pointerup listeners to update node x/y while dragging. The effect cleans up listeners on pointerup or when draggingId changes to avoid leaks.
- Node model & hydration: The file defines a BuilderNode interface (extends WorkflowNode with x, y, tone and ensures many node-type-specific defaults). withNodeDefaults enforces UI defaults per node type (Intent/Condition/API/KB). initialNodes provides a default example layout. On fetch, nodes are rehydrated and positions are computed when missing.
- Connector rendering: buildWorkflowConnectors(canvasNodes) produces connector rectangles that are rendered as absolutely positioned <div> elements representing links between nodes. connectors are recomputed via useMemo when canvasNodes change, so UI updates are deterministic but can be recomputed each render when nodes move.

## Usage Examples

### Create a new workflow (no workflowId provided)

Mount WorkflowBuilder without workflowId. The component initializes state with initialNodes. User edits the workflow name and node properties in the right-hand panel. Adding nodes is done via the toolbar (Add Intent/Condition/API/KB) which appends a new BuilderNode with defaults to nodes and selects it. After edits, clicking Publish triggers submit(): it gathers payloadNodes by copying nodes and removing UI-only fields (tone), collects unique intents across nodes, and calls the createWorkflow mutation via react-query. OnSuccess shows a toast and navigates to the created workflow page.

### Edit an existing workflow (workflowId provided)

On mount, useQuery(['workflow', workflowId]) calls fetchWorkflow. When data arrives, effect hydrates workflow metadata (name/status/kind) and maps fetched WorkflowNode[] into BuilderNode[] via withNodeDefaults (filling missing x/y and type-specific defaults). The user can drag nodes (pointerdown -> pointermove updates node.x/node.y via global listeners) and edit properties. Clicking Update runs the mutate function which calls updateWorkflow(workflowId, payload) with the transformed nodes and intents set; success triggers toast and router.push to the workflow page.

### Drag nodes and update connectors

User presses pointerdown on a node; dragRef stores id and offsets, and draggingId is set. A useEffect attaches window pointermove/pointerup listeners. On pointermove, the handler calculates new x/y based on canvas bounding box and scroll offsets, clamps positions inside canvas dimensions, and updates the corresponding node in state (setNodes). Because connectors are derived via useMemo from canvasNodes, connector positions are recomputed and the visual connector <div> elements update in real time. On pointerup the global listeners are removed and dragging state is cleared.

## Maintenance Notes

- Performance: buildWorkflowConnectors runs inside a useMemo keyed to canvasNodes; with many nodes this can be CPU intensive. Consider throttling pointermove updates or debouncing connector recomputation when dragging many nodes or enabling requestAnimationFrame to limit re-renders.
- Event listener safety: The pointermove/pointerup listeners are attached to window from a useEffect. Ensure cleanup always runs; currently cleanup occurs on effect teardown but verify no early exit paths leave listeners attached. Also verify behavior when component unmounts while dragging.
- Data validation: submit() trims name and ensures at least one node exists but does not validate referential fields (e.g., fallbackNodeId, defaultTargetNodeId). Consider adding validation to prevent broken references or circular references before calling the API.
- Edge cases & UX: When nodes are removed the selectedId is updated naïvely to the first remaining node; ensure the selected node always exists. Preview link is blocked via onClick prevention if workflow is not saved — this relies on isEditing and workflowId; consider a clearer UI affordance for unsaved changes.
- Testing: Add tests for withNodeDefaults to validate default values per node type, for drag behavior (pointerdown->pointermove->pointerup sequence), and for submit payload transformation (tone removed, intents deduplicated). Also test useQuery error and loading states render AsyncState correctly.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/features/workflow/components/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*


---

## Functions and Classes


#### function toneByType

![Type: Sync](https://img.shields.io/badge/Type-Sync-green)

### Signature

```typescript
function toneByType(type: NodeType): NodeTone
```

### Description

Return a NodeTone string corresponding to the provided NodeType by matching specific type string values.


This is a small deterministic mapping function implemented in TypeScript. It inspects the input parameter 'type' and returns a color-coded tone (as a NodeTone) based on exact string comparisons: if 'type' equals "API" it returns "purple"; if "KB" it returns "green"; if "Condition" it returns "orange"; for any other value it returns "blue". There are no side effects, no external calls, and no branching beyond these comparisons.

### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `type` | `NodeType` | ✅ | The node type to map to a tone. The implementation performs exact equality checks against specific string values.
<br>**Constraints:** Compared against the literal strings "API", "KB", and "Condition", Any other value (including other NodeType values) will follow the fallback branch and return "blue" |

### Returns

**Type:** `NodeTone`

A string representing the tone/color associated with the given node type.


**Possible Values:**

- purple
- green
- orange
- blue

### Usage Examples

#### Map an API node to its tone

```typescript
const tone = toneByType("API");
```

Returns "purple" because the input exactly matches "API".

#### Fallback for unknown node types

```typescript
const tone = toneByType("Custom");
```

Returns "blue" because the input does not match any of the explicit cases.

#### Condition node mapping

```typescript
const tone = toneByType("Condition");
```

Returns "orange" for a "Condition" node type.

### Complexity

O(1) time and O(1) space: constant-time, constant-space execution independent of input size.

### Notes

- Function relies on exact string equality checks; if NodeType is a union type that includes differently-cased strings, those will not match unless they exactly equal the listed literals.
- The function provides a default/fallback tone of "blue" for any unrecognized type values.

---



#### function toneByNodeMeta

![Type: Sync](https://img.shields.io/badge/Type-Sync-green)

### Signature

```typescript
function toneByNodeMeta(node: WorkflowNode): NodeTone
```

### Description

Return a UI tone for a workflow node based on its label or, failing specific label matches, delegate to toneByType for the node's type.


The function reads the node.label string, converts it to lowercase, and checks for specific substrings or a specific node id. If the lowercased label contains "start" or the node.id equals "node_start", it returns the literal tone "teal". If the lowercased label contains the substring "kết" or "end", it returns the literal tone "slate". If none of those conditions match, it returns the value produced by calling toneByType(node.type). The function performs only these checks and a single delegation call; it does not perform I/O or mutate arguments.

### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `node` | `WorkflowNode` | ✅ | A workflow node object whose metadata (label, id, type) is used to determine the UI tone.
<br>**Constraints:** node.label is expected to be a string (so .toLowerCase() is valid), node.id and node.type should be present if downstream checks or toneByType require them |

### Returns

**Type:** `NodeTone`

A string-like tone value describing the visual tone for the node. It returns explicit tones for matched labels/ids, otherwise the tone produced by toneByType for the node type.


**Possible Values:**

- teal
- slate
- the value returned by toneByType(node.type)

### Usage Examples

#### Determine tone for a start node by label

```typescript
const tone = toneByNodeMeta({ id: 'n1', label: 'Start Process', type: 'task' } as WorkflowNode);
```

Because label contains 'start' (case-insensitive), the function returns 'teal'.

#### Delegate to toneByType when no label match

```typescript
const tone = toneByNodeMeta({ id: 'n2', label: 'Review', type: 'approval' } as WorkflowNode);
```

Label does not contain 'start', 'kết', or 'end', so the function returns toneByType('approval').

### Complexity

Time complexity: O(1) — a constant number of string checks and one function call; Space complexity: O(1).

### Related Functions

- `toneByType` - Called by this function to determine a fallback tone based on node.type

### Notes

- The function lowercases node.label and performs substring checks; if node.label is not a string this will throw a runtime error.
- The substring 'kết' is checked explicitly (likely to match a localized word such as 'kết thúc').
- Exact matches and order matter: the 'start' check (and node.id === 'node_start') is evaluated before the 'kết'/'end' checks.

---



#### function withNodeDefaults

![Type: Sync](https://img.shields.io/badge/Type-Sync-green)

### Signature

```typescript
function withNodeDefaults(node: WorkflowNode): BuilderNode
```

### Description

Creates and returns a new BuilderNode by applying default values to fields of the provided WorkflowNode based on its type.


The function takes a single WorkflowNode, builds a base BuilderNode by spreading the input node and normalizing several common properties (x, y, tone, ttsText, intents, entities). It calls toneByNodeMeta(node) to compute the tone field. After composing the base object it inspects base.type and, for specific node types ("Intent", "Condition", "API", "KB"), returns an extended object that fills in additional type-specific default properties using the nullish coalescing operator (??). If the node type does not match any of the handled types, the function returns the base object unchanged. The function does not perform I/O, mutations of external state, or throw errors in its implementation.

### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `node` | `WorkflowNode` | ✅ | Input node whose properties are used to build a BuilderNode; may be partially populated and will receive defaults for missing/undefined fields.
<br>**Constraints:** Should be an object conforming to the WorkflowNode shape expected by the codebase., node.type may be one of the recognized types: "Intent", "Condition", "API", "KB" or others; only the listed types trigger additional defaults., Properties that are undefined or null will be replaced by defaults via the nullish coalescing operator (??) or typeof checks. |

### Returns

**Type:** `BuilderNode`

A new BuilderNode object produced by merging the input node with default values for common fields and additional defaults depending on node.type.


**Possible Values:**

- A BuilderNode with common defaults applied (x: 36, y: 34, tone: toneByNodeMeta(node), ttsText from node.ttsText or node.value, intents/entities arrays).
- If base.type === "Intent": BuilderNode with Intent-specific defaults (mainIntent, confidenceThreshold, fallbackNodeId, repromptText, timeoutSec, maxRetry).
- If base.type === "Condition": BuilderNode with Condition-specific defaults (conditionSource, conditionRulesText, defaultTargetNodeId, onRuleError).
- If base.type === "API": BuilderNode with API-specific defaults (apiRef, apiMethod, apiUrl, authProfile, apiTimeoutMs, apiRetry, successCondition, requestMapping, responseMapping, onFailAction).
- If base.type === "KB": BuilderNode with KB-specific defaults (kbRefId, retrievalMode, topK, scoreThreshold, rerank, promptTemplate, citationEnabled, noAnswerAction).

### Usage Examples

#### Normalize a partially populated intent node to a BuilderNode with defaults

```typescript
const intentNode: WorkflowNode = { id: 'n1', type: 'Intent', value: 'Check balance', intents: ['tra_cuoc'] };
const builderNode = withNodeDefaults(intentNode);
```

Demonstrates converting an Intent WorkflowNode with minimal fields into a BuilderNode where fields like x/y, tone, mainIntent, confidenceThreshold, and repromptText will be filled with defaults.

#### Ensure API node has all required API defaults

```typescript
const apiNode: WorkflowNode = { id: 'api1', type: 'API', apiRef: undefined };
const builderApi = withNodeDefaults(apiNode);
```

Shows that API-specific defaults such as apiRef, apiMethod, apiUrl, and timeout will be applied when those properties are missing or null.

### Complexity

Time: O(1) — the function performs a fixed number of property checks and assignments independent of input size. Space: O(1) additional allocation beyond the returned object (creates a new object based on the input).

### Related Functions

- `toneByNodeMeta` - Called by withNodeDefaults to compute the tone field for the base BuilderNode.

### Notes

- The function uses nullish coalescing (??) and typeof checks to decide when to apply defaults; values like 0 or empty string on the incoming node will be preserved unless null or undefined.
- The returned object is a shallow merge; nested objects or arrays from the input are not deep-cloned.
- No errors are thrown by this implementation; callers should ensure the input conforms to expected shapes if other parts of the system expect certain fields to be present.

---


