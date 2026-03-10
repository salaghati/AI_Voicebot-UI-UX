<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/app/(console)/preview/platform-review/outbound/page.tsx",
  "source_hash": "aaf57aaeeea86c49639845a778d0e5fc6bbb33d0e7bc1e8d8d085c89e30de3cb",
  "last_updated": "2026-03-10T03:58:20.761774+00:00",
  "tokens_used": 8678,
  "complexity_score": 3,
  "estimated_review_time_minutes": 10,
  "external_dependencies": [
    "next/link",
    "react",
    "lucide-react",
    "sonner"
  ]
}
```

</details>

[Documentation Home](../../../../../../README.md) > [src](../../../../../README.md) > [app](../../../../README.md) > [(console)](../../../README.md) > [preview](../../README.md) > [platform-review](../README.md) > [outbound](./README.md) > **page.mdx**

---

# page.tsx

> **File:** `src/app/(console)/preview/platform-review/outbound/page.tsx`

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

This file exports a default React functional component OutboundReviewPage ("use client") that renders an interactive card-grid UI for previewing outbound campaigns from an in-memory mock dataset. It imports outboundCampaignsMock and helper lookups (getWorkflowRef, getKnowledgeRef), initializes local state (rows, query, status, sort, menuId), and computes a filtered list with useMemo. Filtering applies a case-insensitive text query across several fields, a status filter, and one of three sorts (created desc, successRate desc, name asc). The component uses internal UI primitives (PageHeader, Card, Badge, Button, Input, Select) and Next.js Link for navigation, and shows ephemeral toasts for clone/toggle/delete actions.

Important developer notes: all operations are client-side against the mock data so there is no persistence. The search logic currently assumes workflow/knowledge lookups return defined objects (calls toLowerCase() need guarding to avoid runtime errors). Filtering and sorting run synchronously in useMemo and may not scale for large datasets; consider server-side pagination or virtualization for production.

## Dependencies

### External Dependencies

| Module | Usage |
| --- | --- |
| `next/link` | Used to render navigation links within the UI (Link component). Specific uses: linking the Create New Campaign button to '/preview/platform-review/outbound/create', linking card titles to `/preview/platform-review/outbound/${item.id}`, linking workflow and knowledge names to their respective preview pages. Marked as external because it is a Next.js package (npm). |
| `react` | Imports useMemo and useState from React to manage component state (rows, query, status, sort, menuId) and compute the derived filtered list of campaigns. The component exported is a React functional component (OutboundReviewPage). Marked external (npm). |
| `lucide-react` | Imports icon components Bot, MoreVertical, Plus, Search used for visual affordances in the UI (card icon, menu button icon, create button icon, and search input icon). Marked external (npm). |
| `sonner` | Imports toast from sonner and uses it to show ephemeral success notifications for mock actions: clone, toggle status, and delete. Marked external (npm). |

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/components/shared/page-header](../@/components/shared/page-header.md) | Imports PageHeader used to show the page title, description and the Create New Campaign action. This is an internal project component (path uses alias '@'). |
| [@/components/ui/badge](../@/components/ui/badge.md) | Imports Badge used to display the campaign status with a visual tone (tone is derived by toneByStatus helper). Internal UI component. |
| [@/components/ui/button](../@/components/ui/button.md) | Imports Button used for the Create New Campaign primary action in the PageHeader. Internal UI component. |
| [@/components/ui/card](../@/components/ui/card.md) | Imports Card used for layout container of the filter controls and each campaign item card. Internal UI component. |
| [@/components/ui/input](../@/components/ui/input.md) | Imports Input used for the search field; paired with a Search icon to allow querying campaigns. Internal UI component. |
| [@/components/ui/select](../@/components/ui/select.md) | Imports Select used for the status and sort dropdown controls that drive filtering and sorting. Internal UI component. |
| [@/lib/utils](../@/lib/utils.md) | Imports formatDateTime used to display the Created timestamp for each campaign in a human-readable format. Internal utility module. |
| [@/features/platform-review/mock](../@/features/platform-review/mock.md) | Imports getKnowledgeRef, getWorkflowRef, outboundCampaignsMock and TypeScript types OutboundCampaignPreview and OutboundStatus. outboundCampaignsMock provides the initial rows state; getWorkflowRef/getKnowledgeRef are used in search and to display friendly names/titles for workflow/knowledge references. The types describe the shape of mock data (used in component state types). Internal project mock module. |

## 📁 Directory

This file is part of the **outbound** directory. View the [directory index](_docs/src/app/(console)/preview/platform-review/outbound/README.md) to see all files in this module.

## Architecture Notes

- Component type: React functional client component ("use client"). Uses useState for local mutable state and useMemo to derive filtered and sorted results from that state. All data operations are performed client-side against an in-memory mock dataset.
- State management: rows holds the current set of campaigns (initialized from outboundCampaignsMock). query, status, sort and menuId control UI and filtering. toggleStatus mutates rows by mapping and updating the status and updatedAt fields for a single item. Deletion mutates rows by filtering out the target item.
- Data flow: Initial data flows from the imported mock (outboundCampaignsMock) into rows. UI interactions update rows and other state; filtered is recomputed by useMemo. UI components read from filtered to render cards. Navigation uses Next.js Link; toasts provide user feedback for mock actions.

## Usage Examples

### Search and filter campaigns in the preview UI

When the page mounts, rows is initialized from outboundCampaignsMock and the UI displays all campaigns. Typing into the Search input updates query state; useMemo recomputes filtered by checking the query against item.name, item.id, item.dataSource, workflow?.name, and knowledge?.title (case-insensitive), and also respecting the selected status filter. Changing the Status dropdown updates status state, which narrows results to items with a matching item.status (unless 'Tất cả' is selected). Changing the Sort dropdown switches between created date descending, success rate descending, and name ascending ordering.

### Toggle campaign status from the card menu

Click the per-card MoreVertical button to set menuId and open the card's contextual menu. Selecting the toggle action calls toggleStatus(item.id): this maps over rows, updates the matching item's status between 'Đang chạy' and 'Tạm dừng' (other statuses remain unchanged), sets updatedAt to the current ISO timestamp, and updates the rows state. A toast.success message is shown. The UI re-renders using the updated rows, and the Badge tone is recomputed using toneByStatus.

### Delete a campaign from the UI (mock)

Open the card menu and click 'Xóa'. The onClick handler filters out the target item from rows (setRows(prev => prev.filter(row => row.id !== item.id))), shows a success toast, and closes the menu (setMenuId(null)). Because the underlying dataset is in-memory mock data, deletion is ephemeral and only affects the current client session.

## Maintenance Notes

- Bug/edge-case to fix: In the search logic, workflow?.name.toLowerCase() and kb?.title.toLowerCase() are called even when workflow or kb may be undefined; wrap these references correctly (e.g., workflow?.name?.toLowerCase()) to avoid runtime TypeError.
- Performance: For larger datasets, move filtering/sorting to server-side endpoints or add pagination/virtual scrolling. The current useMemo approach recomputes on any change to rows, query, sort, or status and performs array copies for sorting which may be expensive.
- Testing: Unit tests should cover filtered logic (search, status filter, sorts), toggleStatus behavior (including updatedAt mutation), and menu actions (delete removes item, clone triggers toast). Tests should also assert that UI navigation Links contain expected hrefs.
- Localization & strings: Some action labels and toast messages are in Vietnamese. Centralize UI strings for translation/localization if required. Also standardize casing and text around status values to avoid string mismatches.
- Future enhancements: Add confirmation modals for destructive actions, undo for delete, optimistic persistence to an API, and error handling for promises if network calls are added. Consider defensive programming for getWorkflowRef/getKnowledgeRef and signal loading/empty states more explicitly.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/app/(console)/preview/platform-review/outbound/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*


---

## Functions and Classes


#### function toneByStatus

![Type: Sync](https://img.shields.io/badge/Type-Sync-green)

### Signature

```typescript
function toneByStatus(status: OutboundStatus)
```

### Description

Return a string literal tone identifier based on the provided OutboundStatus value.


This small pure function inspects the input status (of type OutboundStatus) and returns one of four string literal tones. It checks the status against three specific Vietnamese status strings: "Đang chạy", "Nháp", and "Tạm dừng" and returns "success", "warning", or "muted" respectively. If the status does not match any of those three values, the function returns "info" as a default. Each returned value is asserted as a const literal in the implementation.

### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `status` | `OutboundStatus` | ✅ | The outbound status value to map to a tone. Expected to be one of the status values used in the application (this implementation checks for the exact strings "Đang chạy", "Nháp", and "Tạm dừng").
<br>**Constraints:** The function performs strict equality checks against the exact strings "Đang chạy", "Nháp", and "Tạm dừng"., Any value not equal to those three strings will produce the default tone "info". |

### Returns

**Type:** `"success" | "warning" | "muted" | "info"`

A string literal representing a UI tone corresponding to the provided status.


**Possible Values:**

- success
- warning
- muted
- info

### Usage Examples

#### Map a running status to a success tone

```typescript
toneByStatus("Đang chạy")
```

Returns "success" because the input matches the first equality branch.

#### Map an unknown or other status to the default tone

```typescript
toneByStatus("Kết thúc")
```

Returns "info" because the input does not match any of the explicit branches.

#### Map a paused status to muted tone

```typescript
toneByStatus("Tạm dừng")
```

Returns "muted" due to exact match with the third branch.

### Complexity

Time: O(1) — constant number of comparisons. Space: O(1) — returns a small string literal.

### Notes

- The implementation uses strict equality checks against literal strings in Vietnamese; if OutboundStatus is a broader union type, only these specific string values are treated specially.
- The function asserts returned strings as const in the implementation, indicating literal return types.
- If OutboundStatus is an enum or different representation elsewhere, callers must ensure they pass matching string values for the desired mapping.

---


