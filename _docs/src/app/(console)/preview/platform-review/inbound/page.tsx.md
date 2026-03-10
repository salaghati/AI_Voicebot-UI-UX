<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/app/(console)/preview/platform-review/inbound/page.tsx",
  "source_hash": "08ccbfa88cdc2dfa593af8af8452e7e50f713c90a8df2070265fc62964ce4f87",
  "last_updated": "2026-03-10T03:57:28.666678+00:00",
  "tokens_used": 10885,
  "complexity_score": 3,
  "estimated_review_time_minutes": 15,
  "external_dependencies": [
    "next/link",
    "react",
    "lucide-react",
    "sonner"
  ]
}
```

</details>

[Documentation Home](../../../../../../README.md) > [src](../../../../../README.md) > [app](../../../../README.md) > [(console)](../../../README.md) > [preview](../../README.md) > [platform-review](../README.md) > [inbound](./README.md) > **page.mdx**

---

# page.tsx

> **File:** `src/app/(console)/preview/platform-review/inbound/page.tsx`

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

This file implements a client-side React page ("use client") that displays a card grid of inbound route previews using mock data imported from the platform-review feature. It manages local UI state (rows, search query, status filter, sort order, and an open menu id) via useState, computes a filtered/sorted list with useMemo, and renders each route as a Card with metadata (workflow, knowledge base, queue, extension) and actions (view details, toggle status, delete). The page uses internal shared UI components (PageHeader, Badge, Button, Card, Input, Select) and icon components from lucide-react for visual composition, plus sonner.toast for lightweight user feedback on mock actions.

## Dependencies

### External Dependencies

| Module | Usage |
| --- | --- |
| `next/link` | Uses the default Link component to navigate to create, inbound detail, workflow detail, and knowledge base detail routes (examples: Link href="/preview/platform-review/inbound/create", Link href={`/preview/platform-review/inbound/${item.id}`}). |
| `react` | Imports useMemo and useState to manage component state and compute a memoized filtered/sorted list of inbound routes. Both hooks are used directly in the InboundReviewPage component: const [rows, setRows] = useState<InboundRoutePreview[]>(inboundRoutesMock); and const filtered = useMemo(() => { ... }, [rows, query, sort, status]); |
| `lucide-react` | Imports icon components Bot, MoreVertical, Plus, Search and uses them in the UI: Bot for route icon, MoreVertical for the per-card menu button, Plus inside the Create New Inbound button, and Search as a decorative icon inside the search input. |
| `sonner` | Imports toast and calls toast.success(...) after mock actions: when toggling a route status and when deleting a route to show immediate user feedback. |

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/components/shared/page-header](../@/components/shared/page-header.md) | Imports PageHeader to render the page title ('Inbound Routes'), description, and an actions slot that contains a Link+Button to create a new inbound route. |
| [@/components/ui/badge](../@/components/ui/badge.md) | Imports Badge to render the route status badge; tone is determined by toneByStatus(item.status) which maps InboundStatus to UI tone strings ('success'|'warning'|'muted'). |
| [@/components/ui/button](../@/components/ui/button.md) | Imports Button to render the Create New Inbound button shown in the PageHeader actions slot. |
| [@/components/ui/card](../@/components/ui/card.md) | Imports Card and uses it to wrap the filter controls and each inbound route preview item. Card components provide layout and styling for the grid and individual route cards. |
| [@/components/ui/input](../@/components/ui/input.md) | Imports Input and uses it for the search field that binds to query state; the Search icon sits absolutely inside the same container for visual affordance. |
| [@/components/ui/select](../@/components/ui/select.md) | Imports Select and uses two select inputs: one for status filter (statusOptions) and one for sort order. Both update component state via onChange handlers. |
| [@/lib/utils](../@/lib/utils.md) | Imports formatDateTime and uses it to render a human-friendly updated timestamp for each route: Updated: {formatDateTime(item.updatedAt)}. |
| [@/features/platform-review/mock](../@/features/platform-review/mock.md) | Imports multiple items: getKnowledgeRef, getWorkflowRef, inboundRoutesMock, and types 'InboundRoutePreview' and 'InboundStatus'. inboundRoutesMock initializes rows state; getWorkflowRef/getKnowledgeRef resolve display names for workflow and knowledge base references used in filtering and rendering; the imported types are used in state generics and the toneByStatus signature. |

## 📁 Directory

This file is part of the **inbound** directory. View the [directory index](_docs/src/app/(console)/preview/platform-review/inbound/README.md) to see all files in this module.

## Architecture Notes

- Framework and rendering model: The file is a client-side React functional component (Next.js page) indicated by the "use client" directive. It uses local React state (useState) for mutable UI state and useMemo to compute a filtered+sorted view derived from that state.
- UI composition pattern: The page composes small presentational components (PageHeader, Card, Badge, Button, Input, Select) rather than implementing raw HTML styling. Each inbound route is displayed as a Card with a controlled context menu whose visibility is managed by a single menuId state (string | null) that identifies which card's menu is open.
- Data flow and side effects: Data originates from inboundRoutesMock and lives entirely in memory (rows). Filtering uses getWorkflowRef and getKnowledgeRef to match query text against related entity names. Actions are mock-only: toggleStatus updates the in-memory rows array (mutating status and updatedAt) and delete filters the rows array to remove an item. Both actions call toast.success for immediate UI feedback. There are no network calls or persistence hooks in this implementation; integrating a backend would require replacing these in-memory updates with API calls and adding error handling and loading states.

## Usage Examples

### Display and filter inbound routes

When the page mounts, rows are initialized from inboundRoutesMock. The user can type into the search Input (bound to query) and select a status filter or sort option. On every change, useMemo recomputes filtered by checking name, id, queue, and related workflow/knowledge titles (resolved via getWorkflowRef/getKnowledgeRef). The visible grid immediately updates to show only matching Card components. No network requests occur; all filtering and sorting are performed client-side on the in-memory rows array.

### Toggle status from card menu

Click the MoreVertical button on a card to set menuId to that route's id and open the menu. Clicking the toggle action inside the menu calls toggleStatus(item.id), which maps over rows and flips status between 'Hoạt động' and 'Tạm dừng' (leaving 'Nháp' unchanged) and sets updatedAt to new Date().toISOString(). The menu handler then calls toast.success('Đã đổi trạng thái route (mock)') and clears menuId. The UI reflects the new status via the Badge tone and updated timestamp.

### Delete a route (mock)

Open a card's menu and click 'Xóa'. The handler updates rows by filtering out the route with the clicked id, calls toast.success('Đã xóa route (mock)'), and clears menuId. The grid re-renders without the removed item. In a production integration this should be replaced with a confirm dialog and an API call with optimistic UI updates and error rollback.

## Maintenance Notes

- Performance: Filtering and sorting are done in-memory each render; useMemo reduces unnecessary work but for large datasets you should move filtering/sorting to the server or implement pagination/virtualization. Consider debouncing search input to reduce recompute frequency.
- Edge cases and safety: getWorkflowRef/getKnowledgeRef may return undefined; the code handles this by falling back to item.workflowId / item.kbId when rendering. Ensure formatDateTime accepts the updatedAt format (ISO string); if updatedAt is missing or malformed, formatDateTime may error—add defensive checks.
- Accessibility and UX: The menu is controlled via menuId but lacks explicit ARIA attributes and keyboard handling (Escape to close, focus trap). Add aria-labels, role attributes and keyboard handlers for better accessibility. Also add a confirmation step for destructive actions like delete.
- Internationalization and copy: Text content mixes English and Vietnamese (e.g., 'Create New Inbound' vs 'Đã xóa route (mock)'). Centralize strings for i18n if this UI will be localized.
- Testing: Add unit tests for the filtering logic (matching across name, id, queue, workflow name, knowledge title), for sort order behaviors, and for toggleStatus behavior (ensure updatedAt is changed and status transitions are correct). Component tests should assert that menu visibility toggles and that toast is called on actions.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/app/(console)/preview/platform-review/inbound/README.md)

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

Return a literal tone string based on the provided InboundStatus value.


This function checks the input status (of type InboundStatus) against two specific string values. If status strictly equals "Hoạt động" it returns the literal "success"; if status strictly equals "Nháp" it returns the literal "warning"; for any other status it returns the literal "muted". The returned values are asserted as const literal types.

### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `status` | `InboundStatus` | ✅ | The inbound status to map to a tone. The implementation compares this value against the Vietnamese strings "Hoạt động" and "Nháp".
<br>**Constraints:** Function performs strict equality checks against the exact strings "Hoạt động" and "Nháp"., Any value not equal to those two strings will yield the fallback "muted". |

### Returns

**Type:** `"success" | "warning" | "muted"`

A string literal representing the tone associated with the provided status.


**Possible Values:**

- success
- warning
- muted

### Usage Examples

#### Map an active inbound status to a success tone

```typescript (tsx)
toneByStatus("Hoạt động")
```

Returns "success" because the status strictly equals "Hoạt động".

#### Map a draft inbound status to a warning tone

```typescript (tsx)
toneByStatus("Nháp")
```

Returns "warning" because the status strictly equals "Nháp".

#### Handle any other status value

```typescript (tsx)
toneByStatus("Đã xóa")
```

Returns "muted" as the default fallback for statuses other than the two checked values.

### Complexity

O(1) time complexity and O(1) space complexity

### Notes

- The function relies on exact string comparisons; it does not perform case normalization or handle localized variants beyond the two explicit checks.
- InboundStatus type definition is not shown here; the function expects values (likely strings) compatible with the comparisons performed.
- Return values are asserted with 'as const' in the implementation to preserve literal types for TypeScript consumers.

---


