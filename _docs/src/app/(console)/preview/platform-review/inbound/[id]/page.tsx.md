<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/app/(console)/preview/platform-review/inbound/[id]/page.tsx",
  "source_hash": "ae8cc9c2c3f66eb17fcd44f5c09417783c21a0aac282e26c4378dbb138eb24e2",
  "last_updated": "2026-03-10T03:56:19.658063+00:00",
  "tokens_used": 10404,
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

[Documentation Home](../../../../../../../README.md) > [src](../../../../../../README.md) > [app](../../../../../README.md) > [(console)](../../../../README.md) > [preview](../../../README.md) > [platform-review](../../README.md) > [inbound](../README.md) > [[id]](./README.md) > **page.mdx**

---

# page.tsx

> **File:** `src/app/(console)/preview/platform-review/inbound/[id]/page.tsx`

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

This file exports a default React functional component InboundRouteDetailPreviewPage (a client component indicated by the "use client" directive). It reads a route id from the Next.js route parameters via useParams, looks up a route object in a local mock data array inboundRoutesMock, and then conditionally renders a tabbed UI that shows: configuration fields (id, update time, queue/extension, entry point, description), a referenced workflow summary, a referenced knowledge base summary, and data-source tiles. The simple helper toneByStatus maps a route.status string to a Badge tone used in the header. The component uses useState to manage the currently selected tab and useMemo to memoize references resolved by getWorkflowRef and getKnowledgeRef for the selected route.

This file is UI-only and uses internal mock data and helper functions (inboundRoutesMock, getWorkflowRef, getKnowledgeRef, formatDateTime) rather than network calls or database access. It composes small UI primitives (PageHeader, Badge, Button, Card) and Next.js Link for navigation; it does not perform asynchronous fetching. Error handling is minimal and explicit: if no route matches the route parameter, the component returns a Card with a "Không tìm thấy inbound route." message. Design decisions visible in the file include client-side rendering via "use client", local state for tab selection, and memoization of derived references to avoid re-computation on re-renders.

## Dependencies

### External Dependencies

| Module | Usage |
| --- | --- |
| `next/link` | Uses the default Link component to render navigation anchors in the UI (two usages: back to the inbound list and links to referenced workflow/kb pages). is_external: true |
| `react` | Imports useMemo and useState (import { useMemo, useState } from "react"). useState manages the current tab selection (DetailTab) and useMemo memoizes derived workflow and knowledge references to avoid recomputation when route changes. is_external: true |
| `next/navigation` | Imports useParams (import { useParams } from "next/navigation"). useParams is used to read the dynamic route parameter id (params.id) to locate the inbound route from inboundRoutesMock. is_external: true |
| `lucide-react` | Imports ArrowLeft icon (import { ArrowLeft } from "lucide-react"). ArrowLeft is rendered within the back button to the inbound list. is_external: true |

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/components/shared/page-header](../@/components/shared/page-header.md) | Imports PageHeader component and uses it to render the page title, description, and action area (Badge + back Link button). This is an internal UI composition component. is_external: false |
| [@/components/ui/badge](../@/components/ui/badge.md) | Imports Badge and uses it to display route.status with a tone determined by toneByStatus. This is an internal UI primitive. is_external: false |
| [@/components/ui/button](../@/components/ui/button.md) | Imports Button and uses it to render the back action button (wrapped by Link). This is an internal UI primitive. is_external: false |
| [@/components/ui/card](../@/components/ui/card.md) | Imports Card and uses Card as the primary container for multiple UI sections (error message, tab list, details panels). This is an internal UI primitive. is_external: false |
| [@/lib/utils](../@/lib/utils.md) | Imports formatDateTime (import { formatDateTime } from "@/lib/utils"). formatDateTime is used to render route.updatedAt in a human-readable form inside the Configure tab. is_external: false |
| [@/features/platform-review/mock](../@/features/platform-review/mock.md) | Imports getKnowledgeRef, getWorkflowRef, and inboundRoutesMock (import { getKnowledgeRef, getWorkflowRef, inboundRoutesMock } from "@/features/platform-review/mock"). inboundRoutesMock is the local data source used to find the route by id; getWorkflowRef and getKnowledgeRef resolve referenced workflow/knowledge metadata for display. All are internal mock helpers. is_external: false |

## 📁 Directory

This file is part of the **[id]** directory. View the [directory index](_docs/src/app/(console)/preview/platform-review/inbound/[id]/README.md) to see all files in this module.

## Architecture Notes

- This file implements a client-side React functional component ("use client") that relies on Next.js routing to obtain the dynamic route parameter (useParams). It follows a composition pattern: small presentational UI components (PageHeader, Badge, Button, Card) are assembled into a page layout.
- State management is local to the component using useState for the tab selection (DetailTab union type). Derived data (workflow and knowledge references) are memoized with useMemo and depend on the route object. There are no side-effect hooks (no useEffect) and no asynchronous data fetching—data comes from inboundRoutesMock and resolver helpers.
- Error handling is an early-return pattern: if the route is not found in inboundRoutesMock, the component renders a simple Card with a not-found message and stops. Conditional rendering is used to show the selected tab panel (configure, workflow, knowledge, data-source).

## Usage Examples

### Preview inbound-route detail page in development using mock data

When a developer navigates to the Next.js route /preview/platform-review/inbound/[id], Next.js provides the id via useParams. The component finds the route by calling inboundRoutesMock.find((item) => item.id === params.id). If found, the page header shows the route.name and a Badge with tone from toneByStatus(route.status); the developer can click the tab buttons to switch between 'Configure', 'Workflow', 'Knowledge', and 'Data source'. The Workflow and Knowledge panels link to their respective preview pages using Link with route.workflowId and route.kbId. If the id is missing or not present in inboundRoutesMock, the component renders a Card with the message "Không tìm thấy inbound route.".

## Maintenance Notes

- If this UI is migrated from mock data to real data, replace inboundRoutesMock with an async fetch (e.g., fetch or SWR). Because the component is a client component, add loading and error states and possibly memoize fetched results; move data fetching into a useEffect or higher-level data loader.
- Because "use client" forces client-side rendering, any attempt to perform server-side data access must be refactored. Consider making a server component or using Next.js data fetching if SEO or initial render is important.
- Strings are inline and include Vietnamese text; extract UI strings to a localization solution if multi-language support is required. Also add ARIA attributes and keyboard focus styles for accessibility on tab buttons.
- Unit-testable pieces: toneByStatus is a pure function and should have small unit tests for mapping statuses to tones. Component behavior to test: rendering when route exists, when it does not exist, tab switching behavior, and that links contain expected href values (workflow/kb IDs).

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/app/(console)/preview/platform-review/inbound/[id]/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*


---

## Functions and Classes


#### function toneByStatus

![Type: Sync](https://img.shields.io/badge/Type-Sync-green)

### Signature

```typescript (tsx file)
function toneByStatus(status: string): "success" | "warning" | "muted"
```

### Description

Return a literal tone string based on the exact status input (maps specific Vietnamese status strings to tone tokens).


This function checks the provided status string and returns one of three literal tone tokens. If status is exactly "Hoạt động" it returns the literal "success". If status is exactly "Nháp" it returns the literal "warning". For any other input it returns the literal "muted". The implementation uses simple sequential equality checks and returns string literals asserted as const to preserve their literal types.

### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `status` | `string` | ✅ | A status string to map to a tone token. Comparison is exact and case-sensitive.
<br>**Constraints:** Exact match against "Hoạt động" and "Nháp" is used, Case-sensitive comparison; other variations will fall through to the default |

### Returns

**Type:** `"success" | "warning" | "muted"`

A literal tone string corresponding to the input status: "success" for "Hoạt động", "warning" for "Nháp", and "muted" for any other status.


**Possible Values:**

- success
- warning
- muted

### Usage Examples

#### Map an active status to its tone

```typescript (tsx file)
const tone = toneByStatus("Hoạt động"); // returns "success"
```

Demonstrates the mapping from the exact "Hoạt động" status to the "success" tone.

#### Map a draft status to its tone

```typescript (tsx file)
const tone = toneByStatus("Nháp"); // returns "warning"
```

Demonstrates the mapping from the exact "Nháp" status to the "warning" tone.

#### Unknown or different status

```typescript (tsx file)
const tone = toneByStatus("Disabled"); // returns "muted"
```

Any status not matched by the explicit checks returns the default "muted" tone.

### Complexity

O(1) time complexity and O(1) space complexity (constant-time string comparisons and constant additional space).

### Notes

- Comparisons are exact and case-sensitive; inputs must match the specific Vietnamese strings to return the non-default tones.
- The function uses literal type assertions (as const) in the original implementation to preserve literal return types in TypeScript.

---


