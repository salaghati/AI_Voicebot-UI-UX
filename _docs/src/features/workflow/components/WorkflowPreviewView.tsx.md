<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/features/workflow/components/WorkflowPreviewView.tsx",
  "source_hash": "f80ec7f69eb0f71a33f7cceac7e277c9930b352e42b876ef0bb329533d2a84e3",
  "last_updated": "2026-03-10T04:20:17.191379+00:00",
  "git_sha": "ce0439056db4460a35a2855296568d2b69c48912",
  "tokens_used": 10349,
  "complexity_score": 4,
  "estimated_review_time_minutes": 20,
  "external_dependencies": [
    "next/link",
    "react",
    "next/navigation",
    "@tanstack/react-query"
  ]
}
```

</details>

[Documentation Home](../../../../README.md) > [src](../../../README.md) > [features](../../README.md) > [workflow](../README.md) > [components](./README.md) > **WorkflowPreviewView.mdx**

---

# WorkflowPreviewView.tsx

> **File:** `src/features/workflow/components/WorkflowPreviewView.tsx`

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

This file exports a single React functional component: export function WorkflowPreviewView({ workflowId, tab }: { workflowId: string; tab: keyof typeof tabMap }). The component is responsible for fetching workflow metadata (via fetchWorkflow) and runtime preview items (via fetchWorkflowPreview) using react-query, deriving the active node and state from URL search parameters (useSearchParams), and rendering a two-column layout: a WorkflowDiagramCanvas on the left and a right-hand preview/controls panel with tabs, state switcher, summary badges, and a paginated-like list of preview items. The component uses several UI primitives (PageHeader, Card, Badge, Button, TabsNav, AsyncState) and utility helpers (preserveQuery, formatDateTime). The tabMap constant maps route tab keys to the user-facing labels shown in the UI.

The component's data flow and responsibilities are explicit: it reads nodeId and state from URL search params; computes activeNodeId with a fallback to the first workflow node; builds a queryState object ({ state: params.get("state") || undefined, nodeId: activeNodeId }) that is embedded into the react-query cache key for the preview query; and conditionally enables the preview fetch only when activeNodeId is truthy. User interactions change the URL via router.replace (selectNode writes nodeId into the search params) so the URL is the single source of truth for which node is being filtered. Rendering logic includes guarded states: while workflow is loading or errored the component shows AsyncState; preview also shows loading/error/empty states and then maps preview items to small cards that display speaker, time, content, nodeLabel and confidence. Visual state (badges and labels) is derived from runtime data: e.g., currentOutcome is computed as "Success" for api-log tab, otherwise "Running" when preview items exist, else "Idle".

## Dependencies

### External Dependencies

| Module | Usage |
| --- | --- |
| `next/link` | Imports Link (import Link from "next/link"). Used to render a link to `/workflow/${workflowId}` that wraps a ghost Button labeled "Về workflow". |
| `react` | Imports useMemo (import { useMemo } from "react"). useMemo is used to memoize computed values: activeNodeId, queryState, and selectedNode to avoid unnecessary recomputation between renders. |
| `next/navigation` | Imports usePathname, useRouter, useSearchParams (import { usePathname, useRouter, useSearchParams } from "next/navigation"). useSearchParams reads URL search params (nodeId, state); usePathname and useRouter are used when updating the URL (router.replace) to set nodeId without scrolling. |
| `@tanstack/react-query` | Imports useQuery (import { useQuery } from "@tanstack/react-query"). useQuery is used to fetch and cache two resources: workflow metadata (queryKey ["workflow", workflowId], queryFn fetchWorkflow) and workflow preview items (queryKey ["workflow-preview", workflowId, tab, queryState], queryFn fetchWorkflowPreview). The preview query uses the enabled option to wait until activeNodeId is available; refetch() is passed to AsyncState retry handlers. |

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/lib/api-client](../@/lib/api-client.md) | Imports fetchWorkflow and fetchWorkflowPreview (import { fetchWorkflow, fetchWorkflowPreview } from "@/lib/api-client"). These functions are called as the queryFn for the two useQuery calls to retrieve workflow metadata and runtime preview items respectively. |
| [@/lib/query-utils](../@/lib/query-utils.md) | Imports preserveQuery (import { preserveQuery } from "@/lib/query-utils"). preserveQuery is used to build tab hrefs that preserve current URL search params when switching between preview tabs in TabsNav. |
| [@/components/ui/card](../@/components/ui/card.md) | Imports Card (import { Card } from "@/components/ui/card"). Card is used as a layout wrapper for grouped UI blocks such as the tabs/state-switcher area and the session summary. |
| [@/components/shared/page-header](../@/components/shared/page-header.md) | Imports PageHeader (import { PageHeader } from "@/components/shared/page-header"). PageHeader is rendered at the top with title `Preview - ${wf.name}`, description, and action buttons/badges for workflow status and controls. |
| [@/components/ui/tabs](../@/components/ui/tabs.md) | Imports TabsNav (import { TabsNav } from "@/components/ui/tabs"). TabsNav renders four tab items (Phiên, Hội thoại, KB, API/Call Log) with hrefs produced by preserveQuery and active flags driven by the component's tab prop. |
| [@/components/shared/state-switcher](../@/components/shared/state-switcher.md) | Imports StateSwitcher (import { StateSwitcher } from "@/components/shared/state-switcher"). StateSwitcher is included in the UI under the tabs; it likely allows toggling the 'state' search parameter, though its implementation is external to this file. |
| [@/components/shared/async-state](../@/components/shared/async-state.md) | Imports AsyncState (import { AsyncState } from "@/components/shared/async-state"). AsyncState is used to render loading, error, and empty states for both workflow and preview fetches. The component forwards refetch handlers returned by useQuery for retry behavior. |
| [@/components/ui/badge](../@/components/ui/badge.md) | Imports Badge (import { Badge } from "@/components/ui/badge"). Badge components are used to surface workflow status, kind, node types, outcomes, and node labels in the preview items. |
| [./WorkflowDiagramCanvas](.././WorkflowDiagramCanvas.md) | Imports WorkflowDiagramCanvas (import { WorkflowDiagramCanvas } from "./WorkflowDiagramCanvas"). This component is rendered with props nodes={wf.nodes}, selectedId and activeNodeId, onSelect callback (selectNode), and title/subtitle text. It is the left-hand visual diagram used for selecting nodes. |
| [@/components/ui/button](../@/components/ui/button.md) | Imports Button (import { Button } from "@/components/ui/button"). Button is used throughout the UI (Reset, Bắt đầu, Xuất trace, Copy Log, Báo lỗi, and the link-wrapped button). |
| [@/lib/utils](../@/lib/utils.md) | Imports formatDateTime (import { formatDateTime } from "@/lib/utils"). formatDateTime is used to render wf.updatedAt in a human-readable form in the session summary card. |

## 📁 Directory

This file is part of the **components** directory. View the [directory index](_docs/src/features/workflow/components/README.md) to see all files in this module.

## Architecture Notes

- Pattern: Single React functional component using hooks (useMemo, useQuery, next/navigation hooks) as the control plane; URL search parameters are used as the single source of truth for selected node and state.
- Data fetching: Uses @tanstack/react-query for caching and lifecycle management. Two queries: one for workflow metadata (key ["workflow", workflowId]) and one for preview items (key ["workflow-preview", workflowId, tab, queryState]). The preview query is gated by enabled: Boolean(activeNodeId) so it waits for a node selection before fetching.
- State & routing: Selection state is two-way bound to the URL. selectNode writes nodeId into the search params via router.replace(pathname + '?' + params) with scroll: false to avoid forcing page scroll on selection change.
- Error handling: Presents AsyncState components for loading/error/empty UI paths and wires query.refetch to retry actions. The component does not implement inline retry logic beyond passing refetch to AsyncState.
- Rendering decisions: Computations like activeNodeId, queryState, and selectedNode are memoized with useMemo to avoid repeated calculations on re-render. Preview items are rendered as a list of small cards, keyed by a combination of item.time and index (key={`${item.time}-${index}`}).

## Usage Examples

### Render the preview page for a workflow and interactively select nodes

Mount <WorkflowPreviewView workflowId="abcd1234" tab="conversation" /> on a Next.js route. On mount the component calls fetchWorkflow(workflowId) via useQuery to obtain wf.nodes and metadata. activeNodeId is derived from URL search param nodeId or defaults to the first node id; once activeNodeId is available, the preview query runs fetchWorkflowPreview(workflowId, tab, queryState) where queryState = { state: params.get('state') || undefined, nodeId: activeNodeId }. Clicking a node in WorkflowDiagramCanvas triggers selectNode(nodeId) which updates the URL search param nodeId via router.replace(pathname + '?' + nextParams) (scroll: false), causing the preview query to re-run with the new queryState and update the log list on the right. If the workflow query fails, AsyncState displays an error and its retry handler calls workflow.refetch().

### Switch preview tabs while preserving query params

When the user clicks a tab in TabsNav, the href is produced by preserveQuery(`/workflow/${workflowId}/preview/<tab>`, search) so the current search params (including nodeId and state) are kept. This triggers Next.js navigation to the new tab route and WorkflowPreviewView receives the new tab prop; because the react-query preview key includes tab and queryState, changing tab will fetch preview data for that tab while keeping the node/state filter intact.

## Maintenance Notes

- Performance: For very large workflows (many nodes) or very long preview logs, rendering both the diagram and the full preview list could be expensive. Consider virtualization for the preview list or pagination on the preview API.
- Edge cases: The code assumes wf.nodes exists and uses wf.nodes[0] as fallback in multiple places; if nodes is empty or undefined the component may set activeNodeId to undefined and the preview query will not run. Add defensive checks if workflows without nodes are possible.
- Keys: Preview list keys use `${item.time}-${index}` which can cause collisions if time is not unique. Prefer a unique ID from the backend if available.
- Testing: Unit/integration tests should mock next/navigation hooks (useRouter, useSearchParams) and react-query (or mock fetchWorkflow/fetchWorkflowPreview). Test cases should cover: workflow loading/error states, preview empty/loading/error states, node selection updating the URL, and tab switches preserving params.
- Future enhancements: Wire up the Reset, Bắt đầu, and Xuất trace buttons to real handlers; add debounce/throttle to preview fetches if state changes rapidly; expose pagination or limit on preview fetch to reduce payload size.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/features/workflow/components/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*
