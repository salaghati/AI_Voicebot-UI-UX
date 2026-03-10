<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/app/(console)/workflow/page.tsx",
  "source_hash": "c274c681f07863d7798fb43cbe24b9090ca96537e20333f73c4a0d9b2e681d43",
  "last_updated": "2026-03-10T04:06:11.605247+00:00",
  "git_sha": "2b9a21440fd42826fc0cc8eaebd53c041af3f51a",
  "tokens_used": 6663,
  "complexity_score": 3,
  "estimated_review_time_minutes": 15,
  "external_dependencies": [
    "next/link",
    "react",
    "lucide-react",
    "@tanstack/react-query",
    "sonner"
  ]
}
```

</details>

[Documentation Home](../../../../README.md) > [src](../../../README.md) > [app](../../README.md) > [(console)](../README.md) > [workflow](./README.md) > **page.mdx**

---

# page.tsx

> **File:** `src/app/(console)/workflow/page.tsx`

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

This file exports a single React functional component (annotated with "use client") that renders a workflows index page. It fetches a single page of workflows from the backend (fetchWorkflows with page=1, pageSize=50), displays filter controls (status, type, free-text search), and shows a grid of workflow cards including badges, version/timestamp, and an action menu for each item. Users can navigate to create, view, edit, or preview workflows via Next.js Link components.

Data loading and mutations use @tanstack/react-query: useQuery loads the list and useMutation toggles a workflow's active status via toggleWorkflowStatus. On successful toggle the workflows query is invalidated and a sonner toast notifies the user; errors are surfaced with error toasts. Filtering is performed client-side against the fetched page using useMemo. Local UI state (search query, status/type filters, open menuId) is managed with useState.

The UI presents explicit states using a shared AsyncState component for loading and error with retry, and a Card is shown for empty results. There are a few unused imports (Button, mapStatusTone) noted for removal to satisfy linters. The per-item menu contains view/edit/preview links and a mock delete that triggers a toast.

## Dependencies

### External Dependencies

| Module | Usage |
| --- | --- |
| `next/link` | Imports Link and uses it to navigate to the create page (/workflow/new) and per-workflow pages (/workflow/{id}, /workflow/{id}/edit, /workflow/{id}/preview/session). Used for client-side routing in the Next.js app. |
| `react` | Imports useMemo and useState from React to manage local component state (query, statusFilter, typeFilter, menuId) and memoize the filtered workflows list computed from the fetched items. |
| `lucide-react` | Imports icon components FileCode2, MoreVertical, Plus, Search and uses them as visual UI elements inside cards and the create-new card (e.g., <Plus />, <Search />). |
| `@tanstack/react-query` | Imports useQuery to fetch workflows (queryKey ["workflows", { page: 1, pageSize: 50 }], queryFn fetchWorkflows), useMutation to toggle workflow status (mutationFn toggleWorkflowStatus), and useQueryClient to invalidate the "workflows" cache after a successful mutation. |
| `sonner` | Imports toast and uses toast.success and toast.error to display user-facing notifications on mutation success/failure and on a mock delete action in the per-item menu. |

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/lib/api-client](../@/lib/api-client.md) | Imports fetchWorkflows and toggleWorkflowStatus. fetchWorkflows is called in the useQuery queryFn with parameters { page: 1, pageSize: 50 } and the component expects the response to have shape data.items. toggleWorkflowStatus is passed to useMutation to change the status of a workflow by id. |
| [@/components/shared/page-header](../@/components/shared/page-header.md) | Imports PageHeader and uses it to render the page title "Workflows" and a short description near the top of the page. |
| [@/components/ui/badge](../@/components/ui/badge.md) | Imports Badge and uses it to display the workflow publication state (PUBLIC for Active, DRAFT otherwise) on each workflow card. |
| [@/components/ui/button](../@/components/ui/button.md) | Button is imported but not used anywhere in the file. This import appears redundant and can be removed to satisfy linters. |
| [@/components/ui/card](../@/components/ui/card.md) | Imports Card and uses it extensively to render the filter controls container, each workflow tile, the create-new card, and the empty-results placeholder. |
| [@/components/ui/input](../@/components/ui/input.md) | Imports Input and uses it for the free-text search field; the Input's onChange updates the local query state. |
| [@/components/ui/select](../@/components/ui/select.md) | Imports Select and uses two Select components to control statusFilter and typeFilter. onChange handlers cast e.target.value to the specific union types used for state. |
| [@/components/shared/async-state](../@/components/shared/async-state.md) | Imports AsyncState and uses it to present standardized loading and error UI: AsyncState state="loading" while useQuery.isLoading, and AsyncState state="error" with an onRetry handler to call listQuery.refetch(). |
| [@/lib/utils](../@/lib/utils.md) | Imports formatDateTime and uses it to format item.updatedAt for display on each card (inside the card footer: formatDateTime(item.updatedAt)). |
| [@/lib/mappers](../@/lib/mappers.md) | Imports mapStatusTone but the imported symbol is not used anywhere in this file (unused import). Consider removing if not needed. |
| [@/components/ui/toggle-switch](../@/components/ui/toggle-switch.md) | Imports ToggleSwitch and uses it to render the Active/Draft toggle per workflow. The ToggleSwitch checked prop is derived from item.status === 'Active' and its onChange triggers toggleMutation.mutate(item.id). |
| [@/types/domain](../@/types/domain.md) | Type-only import: imports the Workflow type (import type { Workflow } from "@/types/domain"). The Workflow type is used for TypeScript annotations (e.g., workflow items typed as Workflow in the filtered.map and filter callbacks). |

## 📁 Directory

This file is part of the **workflow** directory. View the [directory index](_docs/src/app/(console)/workflow/README.md) to see all files in this module.

## Architecture Notes

- The component is a client-side React functional component ("use client") and relies on @tanstack/react-query for data fetching, caching, and mutation. useQuery fetches data once (page=1,pageSize=50) and useMutation handles status toggle requests; onSuccess the mutation invalidates the "workflows" query to refresh the list.
- State management is local to the component: useState holds the search query, status and type filters, and menuId for the currently-open per-item menu. useMemo computes a client-side filtered list from the single page of fetched items, so filtering is performed in-memory rather than server-side.
- Error and loading UIs are centralized via AsyncState; user notifications use sonner.toast. The component relies on a consistent API response shape: listQuery.data?.data.items is expected to be an array of Workflow objects that include id, name, status, kind, version, and updatedAt. The toggle mutation expects a result with result.data.status on success to display the new status in the toast.

## Usage Examples

### Load workflows page and toggle a workflow's status

When the page mounts, useQuery() executes fetchWorkflows({ page: 1, pageSize: 50 }). The component shows AsyncState state="loading" while fetching. After the data arrives the component computes filtered via useMemo. The user finds a workflow card and flips the ToggleSwitch; ToggleSwitch's onChange calls toggleMutation.mutate(item.id). The mutation calls toggleWorkflowStatus(api) and onSuccess runs queryClient.invalidateQueries({ queryKey: ["workflows"] }) and shows toast.success with result.data.status, causing the useQuery to refetch and the UI to update the card status. On mutation error the component shows toast.error("Không thể đổi trạng thái workflow").

### Search and filter workflows

The user types into the Input; onChange updates the query state. useMemo re-evaluates filtered by trimming and lowercasing the query and matching it against item.name or item.id. Status and type Select components filter by item.status and item.kind respectively (with a 'Tất cả' option to disable that filter). If filtered is empty and the listQuery succeeded, an empty-state Card displays the message: "Không có workflow phù hợp bộ lọc."

## Maintenance Notes

- Client-side filtering is performed on a single page of results (pageSize is hard-coded to 50). For larger datasets consider adding server-side filtering and pagination to avoid loading large lists into memory and to allow consistent search across all workflows.
- There are unused imports (Button and mapStatusTone). Remove these to satisfy linters and keep imports explicit.
- The toggle mutation currently invalidates the workflows query on success. Consider adding optimistic updates or disabling the toggle while the mutation is in-flight to improve perceived responsiveness and avoid flicker.
- Per-item delete action in the menu is a mock (only shows a success toast). If delete functionality will be implemented, add a delete mutation with error-handling and a confirmation prompt.
- Testing: unit tests should mock fetchWorkflows and toggleWorkflowStatus, assert render states (loading/error/normal/empty), and simulate toggling to ensure onSuccess invalidation and toast behavior are triggered. Edge cases: API returns unexpected shape (missing data.items), items missing fields (updatedAt), and network errors on mutation.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/app/(console)/workflow/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*
