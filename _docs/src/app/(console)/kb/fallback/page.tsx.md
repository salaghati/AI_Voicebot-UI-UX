<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/app/(console)/kb/fallback/page.tsx",
  "source_hash": "58c83172de48387f424b8aeb8fbaecd0001357ff6341b43abaabede7c1812c5c",
  "last_updated": "2026-03-10T03:54:18.542464+00:00",
  "git_sha": "8dc18b7422fe6380c39467ca07ed23a79ff808be",
  "tokens_used": 8049,
  "complexity_score": 3,
  "estimated_review_time_minutes": 10,
  "external_dependencies": [
    "next/link",
    "react",
    "@tanstack/react-query",
    "lucide-react",
    "sonner"
  ]
}
```

</details>

[Documentation Home](../../../../../README.md) > [src](../../../../README.md) > [app](../../../README.md) > [(console)](../../README.md) > [kb](../README.md) > [fallback](./README.md) > **page.mdx**

---

# page.tsx

> **File:** `src/app/(console)/kb/fallback/page.tsx`

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

This file exports a single React functional component (KbFallbackPage) that renders a management UI for KB fallback rules. It uses @tanstack/react-query to fetch the list of rules (fetchKbFallbackRules) and to perform a toggle mutation (toggleKbFallbackActive). The component renders different AsyncState states for loading/error/empty, and displays results in a table with columns for ID, name, category, next action, learning status, active toggle, last-updated timestamp, and row-level actions (view, edit, delete). Local UI state hiddenIds is used to temporarily hide rows after the user confirms a mock delete.

The component is a client-side page ("use client" directive) and integrates with multiple internal UI primitives (KbShell, Button, Card, Table, Badge, ToggleSwitch, AsyncState) and internal helper functions (labelKbFallbackCategory, labelKbFallbackNextAction, formatDateTime). It interacts with two API client functions from @/lib/api-client: fetchKbFallbackRules (used as the react-query queryFn) and toggleKbFallbackActive (used as the mutation function). On mutation success the component invalidates the react-query cache for the list and shows a toast message; on error it shows an error toast. The mocked delete simply appends the item id to hiddenIds and shows a success toast without calling any delete endpoint.

## Dependencies

### External Dependencies

| Module | Usage |
| --- | --- |
| `next/link` | Provides the Link component used for client-side navigation: wrapping the 'Thêm fallback' action and linking each table row's 'view' and 'edit' buttons to routes such as `/kb/fallback/${item.id}`. |
| `react` | Imports the hooks useMemo and useState to manage component local state (hiddenIds) and to memoize the filtered items array derived from query.data?.data. |
| `@tanstack/react-query` | Imports useQuery to fetch the list of fallback rules (queryKey ['kb-fallback-list'], queryFn fetchKbFallbackRules), useMutation to toggle active state (mutationFn toggleKbFallbackActive) with onSuccess/onError handlers, and useQueryClient to invalidate the list query after a successful mutation. |
| `lucide-react` | Imports icon components Eye, Pencil, Plus, Trash2 used as visual icons in the action buttons (view, edit, add, delete) inside the table and the add action. |
| `sonner` | Imports toast used to show transient user notifications: success messages (on toggle success, mock delete) and error messages (toggle failure). |

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/lib/api-client](../@/lib/api-client.md) | Imports fetchKbFallbackRules and toggleKbFallbackActive. fetchKbFallbackRules is used as the queryFn for useQuery with queryKey ['kb-fallback-list']; toggleKbFallbackActive is used as the mutation function for toggling an item's active state. Both functions are expected to return shapes used by the component (query.data?.data array and a response with a message on mutation success). |
| [@/features/kb](../@/features/kb.md) | Imports KbShell (page frame wrapper) and two label helpers: labelKbFallbackCategory and labelKbFallbackNextAction which are used to render human-readable category and next-action text for each item in the table. |
| [@/components/ui/button](../@/components/ui/button.md) | Imports Button UI primitive used across the page for actions: add new fallback, view/edit/delete action buttons, and for ghost-styled row operations. |
| [@/components/ui/card](../@/components/ui/card.md) | Imports Card used as a container for the table when items are present. |
| [@/components/shared/async-state](../@/components/shared/async-state.md) | Imports AsyncState used to render standardized UI states: loading, error (with retry handler calling query.refetch()), and empty (when no items). |
| [@/components/ui/table](../@/components/ui/table.md) | Imports table primitives Table, TBody, TD, TH, THead used to construct the tabular layout for the fallback list (header cells, rows, and columns). |
| [@/components/ui/badge](../@/components/ui/badge.md) | Imports Badge used to render the 'status' column with conditional tone mapping (success/info/warning) based on item.status values ('Đã học', 'Đang học', otherwise warning). |
| [@/components/ui/toggle-switch](../@/components/ui/toggle-switch.md) | Imports ToggleSwitch used to render the active on/off control per row. Its checked prop maps to item.active and onChange triggers the toggleMutation.mutate(item.id) call. The control is disabled while toggleMutation.isPending. |
| [@/lib/utils](../@/lib/utils.md) | Imports formatDateTime used to render item.updatedAt into a human-readable timestamp string in the 'Cập nhật' column. |

## 📁 Directory

This file is part of the **fallback** directory. View the [directory index](_docs/src/app/(console)/kb/fallback/README.md) to see all files in this module.

## Architecture Notes

- Implements a client-side React functional page component ("use client") using hooks (useState, useMemo) and react-query (useQuery/useMutation/useQueryClient) for data fetching, caching, mutation, and cache invalidation.
- Data flow: fetchKbFallbackRules → useQuery stores response as query.data; items are computed via useMemo filtering out IDs in local hiddenIds; toggle action calls toggleKbFallbackActive via useMutation, which on success invalidates ['kb-fallback-list'] and shows a toast. Mock-delete updates local state hiddenIds and does not call any API.
- Error handling: UI-level error state rendered via AsyncState for query errors and toast notifications for mutation errors; the toggle mutation does not implement optimistic updates (it invalidates on success).
- State management: ephemeral UI state (hiddenIds) stored with useState; server-derived state handled by react-query cache. The component disables the ToggleSwitch while a mutation is pending to prevent concurrent toggles.

## Usage Examples

### Page load and list rendering

On mounting, useQuery with queryKey ['kb-fallback-list'] calls fetchKbFallbackRules. While loading, AsyncState state='loading' is shown. If fetch returns data with a data array, useMemo filters out any ids in hiddenIds and the table is rendered inside a Card with one row per item. Each row shows id, name (linking to /kb/fallback/:id), category and next action labels, status badge, active toggle, formatted updatedAt, and action buttons.

### Toggling an item's active state

User clicks the ToggleSwitch for a row: the ToggleSwitch onChange triggers toggleMutation.mutate(item.id) which calls toggleKbFallbackActive. While the mutation is pending the toggle is disabled (toggleMutation.isPending). On success, the mutation's onSuccess invalidates the ['kb-fallback-list'] query to refresh the list and shows a success toast with res.message or a default Vietnamese message. On error, a toast.error is shown with a Vietnamese error string.

### Mock deleting an item from the UI

User clicks the 'Xóa' button; the click handler prompts window.confirm with `Xóa fallback ${item.id}?`. If confirmed, the item id is appended to hiddenIds via setHiddenIds, which causes the item to be excluded from the memoized items array and disappear from the table. A success toast is shown indicating a mock delete. Note: no delete API is called; this is a client-only hide action.

## Maintenance Notes

- Performance: For large lists, consider adding pagination or virtualized rendering. useMemo filters the full data array each render; that is fine for small lists but may be costly for large sets.
- Concurrency: toggleMutation uses a single mutation instance; it disables all toggles when any mutation is pending (toggleMutation.isPending). If per-row mutation concurrency is required, create per-row mutation instances or track pending IDs separately.
- Data contracts: The component expects fetchKbFallbackRules to return an object where query.data?.data is an array of items with fields: id (string), name (string), category (used by labelKbFallbackCategory), nextAction (used by labelKbFallbackNextAction), status (string), active (boolean), updatedAt (timestamp/ISO string consumable by formatDateTime). Tests should validate these shapes and null-safe handling.
- Mock delete: The current delete behavior is a UI-only hide. To implement permanent deletion, replace the onClick handler with a delete API call and update react-query cache (optimistically or via invalidation) accordingly.
- I18n & accessibility: The file contains Vietnamese strings inline (labels, toast messages, confirm dialog). If internationalization is required, extract strings to a localization system. Buttons have title attributes but consider adding aria-labels and keyboard focus handling for accessibility.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/app/(console)/kb/fallback/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*
