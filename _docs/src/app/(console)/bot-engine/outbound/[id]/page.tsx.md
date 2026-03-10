<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/app/(console)/bot-engine/outbound/[id]/page.tsx",
  "source_hash": "b36de11f88647c4246b7db24af32690adf1cfa30346f331ce98263d941759435",
  "last_updated": "2026-03-10T03:51:34.903399+00:00",
  "tokens_used": 10288,
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

[Documentation Home](../../../../../../README.md) > [src](../../../../../README.md) > [app](../../../../README.md) > [(console)](../../../README.md) > [bot-engine](../../README.md) > [outbound](../README.md) > [[id]](./README.md) > **page.mdx**

---

# page.tsx

> **File:** `src/app/(console)/bot-engine/outbound/[id]/page.tsx`

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

This file implements a Next.js client component (directive: "use client") that renders a detailed view for an outbound campaign. It exports a default React component OutboundCampaignDetailPage which reads the route parameter id via useParams, looks up the campaign in outboundCampaignsMock, memoizes referenced workflow and knowledge information with getWorkflowRef and getKnowledgeRef, and renders a header and tabbed detail panels. There is also a small helper function toneByStatus(status: string) that maps Vietnamese campaign status strings to UI "tone" constants used by the Badge component.

The page is purely presentational and client-side: it uses useState to manage the currently selected detail tab and useMemo to avoid recomputing workflow/knowledge references when the campaign does not change. It conditionally renders four sections: Configure (shows id, createdAt formatted by formatDateTime, schedule, retryRule, description), Workflow (shows workflow reference link, version and summary), Knowledge (shows knowledge reference link, sourceType and summary), and Data source (shows data source, totalCalls, and successRate). The component expects campaign objects provided by outboundCampaignsMock to contain specific fields referenced in JSX: id, name, status, createdAt, schedule, retryRule, description, workflowId, kbId, dataSource, totalCalls, and successRate.

Important implementation/context notes: this file uses local project UI components (PageHeader, Badge, Button, Card) and utility helpers (formatDateTime, getWorkflowRef, getKnowledgeRef). It is built for a mock/demo environment (outboundCampaignsMock) — replacing the mock with a real API will require changing the lookup logic (outboundCampaignsMock.find) and likely converting some client-side logic to data fetching hooks or server-side fetching. Error handling is minimal: if no campaign matches the id, the page returns a Card with a "Không tìm thấy campaign." message.

## Dependencies

### External Dependencies

| Module | Usage |
| --- | --- |
| `next/link` | Imports Link to render client-side navigation links used for: returning to the campaigns list (Link href="/bot-engine/outbound") and linking to referenced workflow (`/workflow/${campaign.workflowId}`) and knowledge (`/kb/list/${campaign.kbId}`). |
| `react` | Imports React hooks useMemo and useState. useState manages the detail tab state (type DetailTab) and useMemo memoizes workflow and knowledge references derived from the selected campaign to avoid unnecessary recalculation. |
| `next/navigation` | Imports useParams to read the route parameter id (useParams<{ id: string }>()) which is used to find the campaign in outboundCampaignsMock. |
| `lucide-react` | Imports ArrowLeft icon which is rendered inside the secondary Button in the PageHeader actions to provide a back/navigation affordance. |

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/components/shared/page-header](../@/components/shared/page-header.md) | Imports PageHeader (internal UI component) used as the page's header; it receives title (campaign.name), description, and actions (Badge + Link/Button). |
| [@/components/ui/badge](../@/components/ui/badge.md) | Imports Badge (internal UI component) to display the campaign.status with a tone determined by toneByStatus(status). |
| [@/components/ui/button](../@/components/ui/button.md) | Imports Button (internal UI component) used for the 'Danh sách' back control inside the PageHeader actions. |
| [@/components/ui/card](../@/components/ui/card.md) | Imports Card (internal UI component) used repeatedly to group and style content panels (the not-found message, tab bar container, and each tab content panel). |
| [@/lib/utils](../@/lib/utils.md) | Imports formatDateTime, used to format campaign.createdAt for display in the Configure tab. |
| [@/features/bot-engine/mock](../@/features/bot-engine/mock.md) | Imports getKnowledgeRef, getWorkflowRef, and outboundCampaignsMock. outboundCampaignsMock is searched for the campaign by id (outboundCampaignsMock.find(item => item.id === params.id)). getWorkflowRef and getKnowledgeRef are called (memoized) to obtain referenced workflow and knowledge metadata displayed in those tabs. |

## 📁 Directory

This file is part of the **[id]** directory. View the [directory index](_docs/src/app/(console)/bot-engine/outbound/[id]/README.md) to see all files in this module.

## Architecture Notes

- This is a client-side Next.js React component ("use client") that relies on React hooks (useState/useMemo) and route params from next/navigation; it does not perform network requests itself and pulls data synchronously from the imported mock dataset.
- State management is local to the component: tab selection is stored with useState<DetailTab>. Derived values (workflow and knowledge references) are computed with useMemo and depend on the presence of campaign to avoid unnecessary recompute.
- Rendering uses conditional JSX for each tab (tab === 'configure' ? ...), and maps a constant array of tab descriptors to render the tab buttons. The toneByStatus helper maps Vietnamese status strings to UI tone tokens used by the Badge component.
- Error handling is minimal and explicit: if the campaign is not found (campaign === undefined), the component returns early with a Card showing a not-found message. There are no try/catch blocks or async flows in this file.

## Usage Examples

### Developer view of a campaign detail page using mock data

When a developer navigates to the route whose id param matches a campaign in outboundCampaignsMock, useParams provides the id. The component finds the campaign with outboundCampaignsMock.find(item => item.id === params.id). useMemo calls getWorkflowRef(campaign.workflowId) and getKnowledgeRef(campaign.kbId) once per campaign change. The PageHeader shows campaign.name and a Badge whose tone comes from toneByStatus(campaign.status). The user can switch tabs (Configure, Workflow, Knowledge, Data source) which toggles local state via setTab and conditionally renders the relevant Card content. If no campaign matches the id, a Card with "Không tìm thấy campaign." is displayed.

## Maintenance Notes

- Replace outboundCampaignsMock with a real data-fetching layer when moving to production: consider using Next.js data fetching (server props) or a client-side fetch hook; update useMemo logic accordingly and handle loading/error states.
- Strings are hard-coded in Vietnamese; if internationalization is required, extract text into i18n resource files and avoid inline strings in JSX.
- Accessibility: tab buttons are rendered as plain <button> elements — ensure keyboard focus styles, ARIA attributes (role, aria-selected), and semantic grouping are added if this component must meet accessibility standards.
- Performance: useMemo is correctly applied to avoid recomputing references, but if workflow/knowledge lookups become async or expensive, move to deduplicated fetching (useSWR or React Query) and show loading states.
- Testing: unit tests should cover tab switching, toneByStatus mapping for expected status strings ("Đang chạy", "Nháp", "Tạm dừng"), behavior when campaign is not found, and that correct fields from the campaign object are displayed.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/app/(console)/bot-engine/outbound/[id]/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*


---

## Functions and Classes


#### function toneByStatus

![Type: Sync](https://img.shields.io/badge/Type-Sync-green)

### Signature

```typescript
function toneByStatus(status: string): "success" | "warning" | "muted" | "info"
```

### Description

Return a literal tone string based on the exact input status string by comparing against four specific Vietnamese status values.


This small utility maps specific Vietnamese status labels to a corresponding tone literal. It checks the provided status string against three explicit values in order: "Đang chạy", "Nháp", and "Tạm dừng". If the status matches one of those, it returns the corresponding literal ("success", "warning", or "muted"). If none match, it returns the default literal "info". The implementation uses strict equality comparisons and returns TypeScript literal types via 'as const' in the source.

### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `status` | `string` | ✅ | A status label to evaluate; expected to be one of specific Vietnamese strings or any other string.
<br>**Constraints:** Function performs strict equality checks against exact strings: "Đang chạy", "Nháp", and "Tạm dừng"., Comparison is case- and whitespace-sensitive; inputs must match exactly to select the mapped tone. |

### Returns

**Type:** `"success" | "warning" | "muted" | "info"`

A literal string representing a tone corresponding to the input status. Returns one of four literal values.


**Possible Values:**

- success
- warning
- muted
- info

### Usage Examples

#### Map a running status to its tone

```typescript
const tone = toneByStatus("Đang chạy"); // "success"
```

When status exactly equals "Đang chạy", the function returns "success".

#### Fallback for unknown statuses

```typescript
const tone = toneByStatus("Unknown"); // "info"
```

If the input does not match any of the three checked values, it returns the default "info".

### Complexity

O(1) time complexity (a fixed number of string comparisons) and O(1) space complexity (constant extra space).

### Related Functions

- `None in this file excerpt` - No calls to other functions are present; this is a standalone mapping utility in the provided implementation.

### Notes

- The function relies on exact string matches in Vietnamese; if status localization or alternative spellings are possible, callers must normalize or map them before calling.
- The source returns literal types using 'as const' which narrows the return type to specific string literals in TypeScript.

---


