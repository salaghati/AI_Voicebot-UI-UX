<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/app/(console)/bot-engine/inbound/[id]/page.tsx",
  "source_hash": "393fab62bea903ebacc4bafdeed6b6570ecfbf012779dce02071957d38ad74b4",
  "last_updated": "2026-03-10T03:49:36.217439+00:00",
  "tokens_used": 10186,
  "complexity_score": 3,
  "estimated_review_time_minutes": 10,
  "external_dependencies": [
    "next/link",
    "react",
    "next/navigation",
    "lucide-react"
  ]
}
```

</details>

[Documentation Home](../../../../../../README.md) > [src](../../../../../README.md) > [app](../../../../README.md) > [(console)](../../../README.md) > [bot-engine](../../README.md) > [inbound](../README.md) > [[id]](./README.md) > **page.mdx**

---

# page.tsx

> **File:** `src/app/(console)/bot-engine/inbound/[id]/page.tsx`

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

This file exports a client-side React functional component (default export) that displays detailed information about a single inbound route. It reads the route id from Next.js route parameters (useParams), finds the route in a mock dataset (inboundRoutesMock) and renders a header with status, a set of tab buttons, and tab-specific content blocks (configure, workflow, knowledge, data-source). The UI is constructed from small presentational components (PageHeader, Badge, Button, Card) and uses useState for tab state and useMemo to memoize lookups for workflow and knowledge reference objects. The component also contains a small helper function toneByStatus(status: string) which maps Vietnamese status strings to UI tone tokens used by the Badge component.

The component relies entirely on local mock data and utility helpers: inboundRoutesMock to lookup the route by id, getWorkflowRef and getKnowledgeRef to resolve referenced workflow and knowledge base metadata, and formatDateTime to format the updatedAt value. It conditionally renders a simple not-found Card when the id does not match any route in the mock. The tabs are implemented with conditional rendering: each tab renders a Card with fields read directly from the route object (fields observed in the code: id, name, status, updatedAt, queue, extension, entryPoint, description, workflowId, kbId). The file is marked "use client" so it runs as a client component and uses client-only hooks like useState and useMemo as well as Next.js client navigation helpers (useParams and Link).

## Dependencies

### External Dependencies

| Module | Usage |
| --- | --- |
| `next/link` | Imports default Link and is used to navigate (client-side) to the inbound routes list and to link to referenced workflow and knowledge pages (e.g., <Link href="/bot-engine/inbound"> and <Link href={`/workflow/${route.workflowId}`}>). |
| `react` | Imports named hooks useMemo and useState. useState manages the current tab (DetailTab union). useMemo memoizes derived values: workflow = getWorkflowRef(route.workflowId) and knowledge = getKnowledgeRef(route.kbId) so these lookups only re-run when the route changes. |
| `next/navigation` | Imports useParams; used to read the id param from the URL (const params = useParams<{ id: string }>();) which is used to find the matching route in inboundRoutesMock. |
| `lucide-react` | Imports the ArrowLeft icon component and renders it inside the secondary Button for returning to the list view (<ArrowLeft className="h-4 w-4" />). |

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/components/shared/page-header](../@/components/shared/page-header.md) | Imports PageHeader and uses it as the top header of the page to display the route name, description, and action controls (Badge + back button). |
| [@/components/ui/badge](../@/components/ui/badge.md) | Imports Badge and uses it to display the route status with a tone mapped by the toneByStatus helper (success, warning, muted). |
| [@/components/ui/button](../@/components/ui/button.md) | Imports Button and uses it for the "Danh sách" (List) back action; Button wraps the ArrowLeft icon and Link to navigate back to the inbound list. |
| [@/components/ui/card](../@/components/ui/card.md) | Imports Card and uses it extensively to group sections of the page: not-found message, tab container, each tab's content block (configure, workflow, knowledge, data-source). |
| [@/lib/utils](../@/lib/utils.md) | Imports formatDateTime and calls it to render the route.updatedAt value in the configure tab (formatDateTime(route.updatedAt)). |
| [@/features/bot-engine/mock](../@/features/bot-engine/mock.md) | Imports getKnowledgeRef, getWorkflowRef, and inboundRoutesMock. inboundRoutesMock is searched for the route with the id from useParams. getWorkflowRef(route.workflowId) and getKnowledgeRef(route.kbId) are used (via useMemo) to obtain metadata shown in the workflow and knowledge tabs (e.g., name, version, summary, title, sourceType). |

## 📁 Directory

This file is part of the **[id]** directory. View the [directory index](_docs/src/app/(console)/bot-engine/inbound/[id]/README.md) to see all files in this module.

## Architecture Notes

- This is a presentational React functional component designed as a Next.js client component (directive: "use client"). It uses useState for simple UI state (active tab) and useMemo to avoid recomputing referenced metadata when the route object is stable.
- The component uses conditional rendering for tab content (ternary checks like tab === "configure" ? <Card>... : null). There is no async data fetching in this file; it relies on a synchronous mock module for route and reference resolution, so no loading states or error boundaries are implemented.
- Error handling is minimal: when no matching route is found inboundRoutesMock, the component returns a Card with a single not-found message. The file assumes the route object shape contains fields used directly (id, name, status, updatedAt, queue, extension, entryPoint, description, workflowId, kbId).

## Usage Examples

### Viewing details for an inbound route in the console

When a developer or tester navigates to the route page with a URL param id (for example /bot-engine/inbound/route-123), Next.js provides that id via useParams. The component locates the route by calling inboundRoutesMock.find(item => item.id === params.id). If found, the PageHeader displays route.name and route.status (Badge uses toneByStatus to choose visual tone). The default tab is "configure"; switching to the "workflow" tab triggers the useMemo-provided workflow lookup (getWorkflowRef(route.workflowId)) and displays the referenced workflow name, version, and summary. Similarly the "knowledge" tab displays the knowledge reference (getKnowledgeRef(route.kbId)). If the id does not match any mock route, the component renders a Card with "Không tìm thấy inbound route."

## Maintenance Notes

- Because the file uses mock data (inboundRoutesMock) and synchronous lookups, replacing the mock with real asynchronous API calls will require adding loading and error states and converting the useMemo lookups to async data fetching (useEffect or server-side data fetching).
- The toneByStatus helper maps Vietnamese status strings to UI tone tokens; if status values expand, update toneByStatus to handle new statuses or migrate to a configuration-driven mapping.
- All displayed route properties are referenced directly; ensure the route shape is validated upstream or add defensive guards before reading nested fields (e.g., route.updatedAt may be null).
- Tests: add unit tests for toneByStatus and snapshot tests for the component in each tab state and for the not-found case. Edge cases: missing workflow or knowledge references (workflow or knowledge can be null) are already handled by fallback texts like workflow?.name || route.workflowId.
- Accessibility: interactive tab buttons are implemented as <button> elements — ensure keyboard focus styles and ARIA roles/labels are added if accessibility requirements demand it.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/app/(console)/bot-engine/inbound/[id]/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*


---

## Functions and Classes


#### function toneByStatus

![Type: Sync](https://img.shields.io/badge/Type-Sync-green)

### Signature

```typescript
function toneByStatus(status: string)
```

### Description

Return a literal tone string based on the provided status string.


This small utility function inspects the provided status string and returns one of three literal tone values. If status strictly equals the Vietnamese string "Hoạt động" it returns the literal "success". If status strictly equals the Vietnamese string "Nháp" it returns the literal "warning". For any other status value it returns the literal "muted". The implementation uses strict equality checks and returns string literals asserted as const.

### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `status` | `string` | ✅ | A status label to map to a tone. The function compares this value to specific Vietnamese status strings.
<br>**Constraints:** Compared using strict equality (===), The function only checks for exact matches to "Hoạt động" and "Nháp"; all other inputs result in "muted" |

### Returns

**Type:** `"success" | "warning" | "muted"`

A literal string representing a tone corresponding to the input status.


**Possible Values:**

- success
- warning
- muted

### Usage Examples

#### Map known active status to success tone

```typescript
const tone = toneByStatus("Hoạt động"); // "success"
```

When the status is exactly "Hoạt động", the function returns "success".

#### Map draft status to warning tone

```typescript
const tone = toneByStatus("Nháp"); // "warning"
```

When the status is exactly "Nháp", the function returns "warning".

#### Unknown status defaults to muted

```typescript
const tone = toneByStatus("Archived"); // "muted"
```

Any status value other than the two checked strings results in "muted".

### Complexity

O(1) time complexity and O(1) space complexity

### Notes

- Comparisons are exact and case-sensitive; e.g., "hoạt động" or additional whitespace will not match.
- The function returns string literal values asserted with 'as const' in the implementation to preserve literal types.
- Status strings checked are in Vietnamese: "Hoạt động" and "Nháp".

---


