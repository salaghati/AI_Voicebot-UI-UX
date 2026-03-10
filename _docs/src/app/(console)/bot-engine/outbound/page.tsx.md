<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/app/(console)/bot-engine/outbound/page.tsx",
  "source_hash": "ffefc677b3a8bfae3bbf7ac164c3b7b4a9b0bc64f60bc17a04a5aab04d5f6a9e",
  "last_updated": "2026-03-10T03:53:28.186529+00:00",
  "tokens_used": 11700,
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

[Documentation Home](../../../../../README.md) > [src](../../../../README.md) > [app](../../../README.md) > [(console)](../../README.md) > [bot-engine](../README.md) > [outbound](./README.md) > **page.mdx**

---

# page.tsx

> **File:** `src/app/(console)/bot-engine/outbound/page.tsx`

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

This file exports a default React client component that implements the Outbound Campaigns list page for a Next.js application. It imports mock data and reference helpers from '@/features/bot-engine/mock', UI primitives (Card, Badge, Button, Input, Select) and a PageHeader from internal components, several icons from 'lucide-react', toast notifications from 'sonner', and a formatDateTime helper. Component-level state includes rows (the campaign list), query (search string), status (filter), sort (sort order), and menuId (which campaign menu is open). The displayed list is derived with useMemo: it filters by search query and status, then applies one of three sort orders (created-desc, success-desc, name-asc). A small helper toggleStatus(id: string) updates a campaign's status in the rows state and sets updatedAt to the current ISO timestamp.

The component is a purely client-side UI that uses mock data and demonstrates the user interactions developers will need to wire to real APIs later. It renders a PageHeader with an action button linking to the campaign creation route, filter controls (status Select, sort Select, and search Input), and a responsive grid of Card elements — one per campaign. Each card shows campaign metadata (status badge, name, description, workflow and knowledge links resolved via getWorkflowRef/getKnowledgeRef, totalCalls, successRate, and createdAt formatted with formatDateTime). Per-card menu actions are implemented inline: "Xem chi tiết" navigates to the detail route, "Nhân bản" shows a mock toast, the status toggle calls toggleStatus and shows a toast, and "Xóa" removes the row from state and shows a toast. Important design details: the file begins with "use client" to ensure client-side rendering, uses useMemo to avoid recomputing the filtered list unnecessarily, and manages the open menu using a single menuId string rather than per-card booleans.

## Dependencies

### External Dependencies

| Module | Usage |
| --- | --- |
| `next/link` | Uses the Link component for client-side navigation to: create page (/bot-engine/outbound/create), campaign detail pages (/bot-engine/outbound/{id}), workflow pages (/workflow/{workflowId}), and knowledge pages (/kb/list/{kbId}). |
| `react` | Imports useMemo and useState for component state and memoized derived data: useState manages rows, query, status, sort, menuId; useMemo computes the filtered + sorted list based on those state values. |
| `lucide-react` | Imports icon components Bot, MoreVertical, Plus, Search and renders them in the UI (card icon, menu button icon, create button icon, and search field icon). |
| `sonner` | Imports toast and uses toast.success(...) to show mock success notifications for clone, status toggle, and delete actions. |

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/components/shared/page-header](../@/components/shared/page-header.md) | Imports PageHeader and uses it at the top of the page to render title, description, and action button slot. |
| [@/components/ui/badge](../@/components/ui/badge.md) | Imports Badge and uses it to render campaign status with a visual tone determined by toneByStatus(status). |
| [@/components/ui/button](../@/components/ui/button.md) | Imports Button and uses it inside the PageHeader action to render the 'Tạo Campaign' (create) button with the Plus icon. |
| [@/components/ui/card](../@/components/ui/card.md) | Imports Card and uses it for the filter control container and each campaign card in the grid layout. |
| [@/components/ui/input](../@/components/ui/input.md) | Imports Input and uses it for the search box. Search icon is absolutely positioned; Input's value and onChange update the query state. |
| [@/components/ui/select](../@/components/ui/select.md) | Imports Select and uses two Select controls: one for status filtering and one for sort order. Both update component state on change. |
| [@/lib/utils](../@/lib/utils.md) | Imports formatDateTime and calls it to render the campaign createdAt timestamp in the card footer. |
| [@/features/bot-engine/mock](../@/features/bot-engine/mock.md) | Imports getKnowledgeRef, getWorkflowRef, outboundCampaignsMock and TypeScript types OutboundCampaignPreview and OutboundStatus. The mock dataset (outboundCampaignsMock) initializes rows state; getWorkflowRef and getKnowledgeRef are used to resolve display names for workflow and knowledge references when rendering cards. |

## 📁 Directory

This file is part of the **outbound** directory. View the [directory index](_docs/src/app/(console)/bot-engine/outbound/README.md) to see all files in this module.

## Architecture Notes

- Client-only React component: file starts with "use client" so it runs entirely in the browser (no server-side rendering or server actions).
- State management: local component state (useState) holds the authoritative list (rows) and UI controls (query, status, sort, menuId). State updates are performed immutably (setRows with map or filter).
- Derived data: useMemo is used to compute a filtered & sorted array (filtered) from rows + UI control state. Sorting and filtering each create shallow copies where needed, so large lists will allocate on each change.
- UI composition: page composes internal UI primitives (Card, Badge, Input, Select, Button) and icon components to form the page. Per-card contextual menu is positioned absolutely and toggled via a single menuId string; this is simple but not tied to the DOM (no portal/Popper).
- Error handling and external integration: current actions are mocked (toast notifications and local state changes). There are no network calls or persistence; real integration would replace setRows calls with API calls and optimistic updates or refetches.

## Usage Examples

### Search and filter campaigns, then pause one

User selects a status from the status Select (this updates status state) and types into the search Input (updates query). The useMemo-derived filtered array recomputes to only include campaigns matching the query and status, then applies the chosen sort. The user clicks the MoreVertical button on a campaign card to set menuId to that campaign's id; that opens the inline menu. Clicking the toggle action calls toggleStatus(item.id): toggleStatus maps over rows, finds the matching id, flips status between 'Đang chạy' and 'Tạm dừng', sets updatedAt to new Date().toISOString(), and setRows updates state. A toast.success notif is shown. The UI updates because rows changed and filtered is recomputed.

### Delete a campaign from the list (mock)

User opens the per-card menu and clicks 'Xóa'. The inline handler calls setRows(prev => prev.filter(row => row.id !== item.id)) to remove the campaign from local state and then calls toast.success to show a mock confirmation. No API call is made; to connect to a backend, replace this filter with an API delete call and either optimistically update rows or refetch the list after success/failure handling.

## Maintenance Notes

- Performance: useMemo reduces unnecessary recomputation but filtering/sorting create new arrays and may be expensive for large datasets. Add pagination or virtualization (e.g., react-window) when rows length grows beyond a few hundred.
- Accessibility: menu buttons and custom menu lack ARIA attributes and keyboard handling. Consider using a well-tested dropdown/Popover component (portal-based) to handle focus trap and better accessibility.
- Testing: unit tests should cover filter/sort/search behavior (useMemo logic) and toggleStatus behavior (status flip and updatedAt update). Snapshot tests for rendering cards with various statuses and missing workflow/knowledge refs are recommended.
- Edge cases: getWorkflowRef/getKnowledgeRef may return undefined; the code currently falls back to IDs. Ensure formatDateTime handles invalid or missing createdAt values (it assumes an ISO string).
- Future work: replace mock imports with real API layer, add confirmation dialogs for destructive actions, add server-side pagination and error handling for network failures, and extract the per-card menu into a reusable component.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/app/(console)/bot-engine/outbound/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*


---

## Functions and Classes


#### function toneByStatus

![Type: Sync](https://img.shields.io/badge/Type-Sync-green)

### Signature

```typescript (tsx file)
function toneByStatus(status: OutboundStatus)
```

### Description

Return a UI tone string based on the provided OutboundStatus value by comparing the status to specific Vietnamese status strings.


The function performs a sequence of strict equality checks (===) against the input status value. If status equals "Đang chạy" it returns the literal "success"; if "Nháp" it returns "warning"; if "Tạm dừng" it returns "muted". For any other status value it returns the literal "info". Each return uses a const assertion in the original TypeScript implementation to preserve the exact string literal type.

### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `status` | `OutboundStatus` | ✅ | The outbound status to evaluate; compared against specific string values in Vietnamese.
<br>**Constraints:** Must be a value of the OutboundStatus type, Comparisons are exact and case-sensitive, Function explicitly checks for: "Đang chạy", "Nháp", "Tạm dừng"; any other value yields the default |

### Returns

**Type:** `"success" | "warning" | "muted" | "info"`

A string literal representing a UI tone corresponding to the provided status.


**Possible Values:**

- success
- warning
- muted
- info

### Usage Examples

#### Map a running outbound status to its tone

```typescript (tsx file)
toneByStatus("Đang chạy")
```

Returns "success" because status strictly equals "Đang chạy".

#### Map an unknown status to a default tone

```typescript (tsx file)
toneByStatus("Không rõ")
```

Returns "info" because the status does not match any of the explicitly checked values.

### Complexity

O(1) time complexity (constant number of equality checks) and O(1) space complexity.

### Notes

- Comparisons use strict equality and are case-sensitive; input must exactly match the checked Vietnamese strings to produce the corresponding tone.
- The original code uses TypeScript const assertions on returned strings to preserve literal types.
- The function is pure and has no side effects.

---


