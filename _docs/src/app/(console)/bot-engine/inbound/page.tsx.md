<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/app/(console)/bot-engine/inbound/page.tsx",
  "source_hash": "3debaceaa284800fb95efda44cc627e8aca8bffb3da61ac440954eadc6876c3a",
  "last_updated": "2026-03-10T03:50:45.548927+00:00",
  "tokens_used": 11367,
  "complexity_score": 3,
  "estimated_review_time_minutes": 12,
  "external_dependencies": [
    "next/link",
    "react",
    "lucide-react",
    "sonner"
  ]
}
```

</details>

[Documentation Home](../../../../../README.md) > [src](../../../../README.md) > [app](../../../README.md) > [(console)](../../README.md) > [bot-engine](../README.md) > [inbound](./README.md) > **page.mdx**

---

# page.tsx

> **File:** `src/app/(console)/bot-engine/inbound/page.tsx`

![Complexity: Low](https://img.shields.io/badge/Complexity-Low-green) ![Review Time: 12min](https://img.shields.io/badge/Review_Time-12min-blue)

## 📑 Table of Contents


- [Overview](#overview)
- [Dependencies](#dependencies)
- [Architecture Notes](#architecture-notes)
- [Usage Examples](#usage-examples)
- [Maintenance Notes](#maintenance-notes)
- [Functions and Classes](#functions-and-classes)

---

## Overview

This file exports a default React functional component InboundListPage which implements a client-side page ("use client") that displays inbound route previews using mocked data from the project's bot-engine feature. It imports UI building blocks (Card, Badge, Button, Input, Select, PageHeader) and icons, keeps its own local state (rows, query, status, sort, menuId) via useState, and computes a derived filtered list using useMemo. The component renders filter controls (status select, sort select, search input), a grid of cards (one per inbound route), and an action menu per card that allows viewing details, toggling active/pause status, or deleting the mock item. UI navigation uses next/link Link components to client-side routes, and toast notifications (sonner.toast) indicate mock actions.

Implementation details and data handling are specific and synchronous: rows is initialized from inboundRoutesMock (imported), getWorkflowRef and getKnowledgeRef are used to resolve referenced workflow and knowledge metadata for display, and formatDateTime formats updatedAt timestamps. Filtering logic (inside useMemo) performs case-insensitive substring matching across name, id, queue, workflow name and knowledge title, and honors a status filter; sorting supports updated-desc (date desc) and name-asc. Actions modify local rows state only (toggleStatus updates status and updatedAt, delete filters out the row), with no network or persistent side effects in this file — it is intentionally a mock UI backed by in-memory data.

## Dependencies

### External Dependencies

| Module | Usage |
| --- | --- |
| `next/link` | Imports Link (import Link from "next/link") and uses it to wrap navigation targets: the create route action (href="/bot-engine/inbound/create"), per-route detail links (href={`/bot-engine/inbound/${item.id}`}), workflow links (href={`/workflow/${item.workflowId}`}) and knowledge links (href={`/kb/list/${item.kbId}`}). |
| `react` | Imports useMemo and useState (import { useMemo, useState } from "react"). useState holds component-local state: rows (InboundRoutePreview[]), query (string), status (filter), sort, and menuId. useMemo computes the filtered and sorted list derived from rows, query, status and sort to avoid recomputing on every render. |
| `lucide-react` | Imports icons Bot, MoreVertical, Plus, Search (import { Bot, MoreVertical, Plus, Search } from "lucide-react") and uses them in the UI: Bot as card icon, MoreVertical for per-card menu button, Plus in the create button, and Search icon in the search input. |
| `sonner` | Imports toast (import { toast } from "sonner"). toast.success is called after mock actions: when toggling status ("Đã đổi trạng thái route (mock)") and when deleting a route ("Đã xóa route (mock)"). |

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/components/shared/page-header](../@/components/shared/page-header.md) | Imports PageHeader (import { PageHeader } from "@/components/shared/page-header") and uses it as the page title/description header with an action element that links to the inbound route creation page. |
| [@/components/ui/badge](../@/components/ui/badge.md) | Imports Badge (import { Badge } from "@/components/ui/badge") and uses it to display the inbound route status badge on each card. The tone prop is computed by toneByStatus(status) to map statuses to visual tones. |
| [@/components/ui/button](../@/components/ui/button.md) | Imports Button (import { Button } from "@/components/ui/button") and renders the primary action button in the header (Create Inbound) wrapped by Link. |
| [@/components/ui/card](../@/components/ui/card.md) | Imports Card (import { Card } from "@/components/ui/card") and uses it for the filter controls container and for each inbound route preview card in the grid. |
| [@/components/ui/input](../@/components/ui/input.md) | Imports Input (import { Input } from "@/components/ui/input") and uses it as the search text input bound to query state with onChange updating setQuery. |
| [@/components/ui/select](../@/components/ui/select.md) | Imports Select (import { Select } from "@/components/ui/select") and uses two Select components: one bound to status state to filter by inbound status, and one bound to sort state to change sort order. |
| [@/lib/utils](../@/lib/utils.md) | Imports formatDateTime (import { formatDateTime } from "@/lib/utils") and uses it to format the updatedAt timestamp displayed in each card: Cập nhật: {formatDateTime(item.updatedAt)}. |
| [@/features/bot-engine/mock](../@/features/bot-engine/mock.md) | Imports getKnowledgeRef, getWorkflowRef, inboundRoutesMock, and TypeScript types InboundRoutePreview and InboundStatus (import { getKnowledgeRef, getWorkflowRef, inboundRoutesMock, type InboundRoutePreview, type InboundStatus } from "@/features/bot-engine/mock"). inboundRoutesMock initializes rows state; getWorkflowRef and getKnowledgeRef resolve display names/titles for workflow and knowledge references used during filtering and rendering. The type imports are used in local state typings (rows: InboundRoutePreview[] and InboundStatus references). |

## 📁 Directory

This file is part of the **inbound** directory. View the [directory index](_docs/src/app/(console)/bot-engine/inbound/README.md) to see all files in this module.

## Architecture Notes

- This is a client-side React functional component for a Next.js route (file contains "use client"), so it runs in the browser and manages all state locally using React hooks (useState/useMemo). There are no network calls here — data is read from inboundRoutesMock and mutated in-memory.
- Filtering and sorting are implemented inside a useMemo that depends on rows, query, sort, and status. The algorithm performs a case-insensitive substring match across multiple fields and then sorts by either updatedAt (descending) or name (ascending) by creating shallow copies before sorting to avoid mutating original arrays.
- UI is composed from small presentational components (Card, Badge, Button, Input, Select, PageHeader) and uses next/link for client-side navigation. Interaction patterns: per-card action menu toggles via menuId state, and actions (toggle status, delete) update rows and show toast notifications. No optimistic network updates or server integration are present.
- Error handling is minimal: there is no try/catch because the file doesn't make external requests. State mutations assume the mock data shape, so type safety relies on imported TypeScript types (InboundRoutePreview, InboundStatus).

## Usage Examples

### Filter and open an inbound route detail

User selects a status from the status Select (bound to `status` state) and/or types into the search Input (`query` state). The useMemo recalculates `filtered` applying substring matching and status filtering. The UI shows matching Card components. Clicking the route title (Link href={`/bot-engine/inbound/${item.id}`}) navigates to the inbound route detail page for that route.

### Pause an active route from the per-card menu

User clicks the MoreVertical button which sets menuId to the item.id and renders the floating action menu. Clicking the toggle action triggers the inline toggleStatus function which maps the row by id and flips status between 'Hoạt động' and 'Tạm dừng' (leaving 'Nháp' unchanged), updates updatedAt to new Date().toISOString(), updates rows via setRows, then calls toast.success("Đã đổi trạng thái route (mock)") and closes the menu (setMenuId(null)). The UI immediately reflects the new status badge tone and updated time because state changed locally.

### Delete a mocked inbound route

From the action menu the user clicks the Xóa button; onClick runs setRows(prev => prev.filter(row => row.id !== item.id)), removing the item from local state, calls toast.success("Đã xóa route (mock)"), and closes the menu. Because the component reads rows state directly, the list updates immediately. There is no undo or server-side deletion in this file.

## Maintenance Notes

- Performance: useMemo avoids unnecessary recalculation but the implementation copies arrays for sorting which has O(n log n) cost. For large datasets consider server-side filtering, pagination or virtualization (e.g., react-window) and debouncing the search input.
- UX/edge cases: the floating menu is controlled only by menuId and does not close on outside click or Escape — consider adding a global click listener or a FocusTrap to close the menu for better accessibility. Deletion has no confirmation; add a modal for destructive actions.
- Testing: unit tests should cover filter logic (case-insensitive matching across fields), sort results (updated-desc and name-asc), toggleStatus behavior (status transitions and updatedAt change), and deletion (row removed). Mock functions getWorkflowRef/getKnowledgeRef should be stubbed to return predictable values during tests.
- Future integration: replace inboundRoutesMock with an API data source and convert toggleStatus/delete into API requests with optimistic updates and error rollback. Ensure consistent type mapping if backend shapes differ (updatedAt string format, possible null fields).
- Type safety: the component uses imported TypeScript types for rows state but inline functions like toggleStatus are un-exported. When integrating with backend, add more robust validation for missing workflow/knowledge references (workflow?.name may be undefined).

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/app/(console)/bot-engine/inbound/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*


---

## Functions and Classes


#### function toneByStatus

![Type: Sync](https://img.shields.io/badge/Type-Sync-green)

### Signature

```typescript (tsx)
function toneByStatus(status: InboundStatus): "success" | "warning" | "muted"
```

### Description

Returns a literal tone string based on the provided InboundStatus value by matching exact status strings present in the implementation.


This is a small synchronous utility that maps an InboundStatus input to one of three specific string literals used as tone identifiers. It tests the input status against two exact string values: "Hoạt động" and "Nháp". If status strictly equals "Hoạt động" it returns the literal "success"; if it strictly equals "Nháp" it returns "warning"; for any other value it returns "muted". The function uses TypeScript's const assertions to produce literal return types.

### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `status` | `InboundStatus` | ✅ | The inbound status value to evaluate; compared by strict equality against specific string literals in the function body.
<br>**Constraints:** Function checks for exact string values "Hoạt động" and "Nháp"; any other value will follow the default branch., Type is InboundStatus (definition not shown here); the implementation expects that values may be string-literal-like so strict equality comparisons are meaningful. |

### Returns

**Type:** `"success" | "warning" | "muted"`

A string literal indicating the tone corresponding to the provided status.


**Possible Values:**

- success
- warning
- muted

### Usage Examples

#### Status is active

```typescript (tsx)
toneByStatus("Hoạt động")
```

Returns "success" because the input matches the first conditional branch.

#### Status is draft

```typescript (tsx)
toneByStatus("Nháp")
```

Returns "warning" because the input matches the second conditional branch.

#### Status is any other value

```typescript (tsx)
toneByStatus("Bị khóa")
```

Returns "muted" because the input does not match the two explicit checks and falls through to the default.

### Complexity

O(1) time complexity (constant-time string comparisons) and O(1) space complexity (no additional allocations beyond the return).

### Notes

- The function relies on exact string matches for "Hoạt động" and "Nháp"; changes to status string values elsewhere in the codebase will require updating this function.
- Return types use const assertions in the implementation to ensure literal type inference in TypeScript.
- InboundStatus type definition was not provided in the visible implementation; documentation uses the declared parameter type as-is.

---


