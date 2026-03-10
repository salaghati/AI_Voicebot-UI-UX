<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/app/(console)/preview/platform-review/outbound/[id]/page.tsx",
  "source_hash": "196f6543989c8455c706b1887f3f0649762331c0e96f1f30d543a7b2e9b90903",
  "last_updated": "2026-03-10T03:58:10.804971+00:00",
  "tokens_used": 8640,
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

[Documentation Home](../../../../../../../README.md) > [src](../../../../../../README.md) > [app](../../../../../README.md) > [(console)](../../../../README.md) > [preview](../../../README.md) > [platform-review](../../README.md) > [outbound](../README.md) > [[id]](./README.md) > **page.mdx**

---

# page.tsx

> **File:** `src/app/(console)/preview/platform-review/outbound/[id]/page.tsx`

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

This file is a client-side Next.js React component that renders a read-only preview page for an outbound campaign using local mock data. It exports a default component OutboundCampaignDetailPreviewPage and a helper toneByStatus(status: string) which maps Vietnamese campaign status strings to Badge tone literals used by the UI. The component reads the dynamic route id via useParams, finds the campaign in outboundCampaignsMock, and memoizes referenced workflow and knowledge metadata via getWorkflowRef/getKnowledgeRef. Local state (useState) controls which of four tabs (configure, workflow, knowledge, data-source) is visible. If no campaign matches the id it returns a Card with a not-found message; otherwise it renders a PageHeader (title, description) with a status Badge and back Link, a row of tab buttons, and four tab content sections that display campaign fields, referenced workflow/knowledge summaries, and data-source metrics. The file contains no async network calls and relies entirely on imported mocks; it is intended as a presentational preview and should be adapted for production to add real data fetching, loading/error states, and accessibility improvements.

## Dependencies

### External Dependencies

| Module | Usage |
| --- | --- |
| `next/link` | Uses the Link component to create client-side navigation to the outbound list and to linked workflow/knowledge detail pages (e.g., Link href={`/preview/platform-review/workflows/${campaign.workflowId}`} and Link href={`/preview/platform-review/kb/${campaign.kbId}`). |
| `react` | Imports React hooks useMemo and useState to manage derived values (workflow, knowledge) and local UI state (tab selection) inside the component. |
| `next/navigation` | Imports useParams to read the route parameter object and extract the campaign id (useParams<{ id: string }>()). The id is used to look up a campaign in the mock list. |
| `lucide-react` | Imports the ArrowLeft icon component and renders it inside the back button used in the PageHeader actions. |

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/components/shared/page-header](../@/components/shared/page-header.md) | Imports PageHeader (internal UI composition) to render the page's top title, description, and actions (Badge + back button). |
| [@/components/ui/badge](../@/components/ui/badge.md) | Imports Badge (internal UI component). The Badge is rendered with a tone computed by toneByStatus(campaign.status) and displays the campaign.status string. |
| [@/components/ui/button](../@/components/ui/button.md) | Imports Button (internal UI component) used for the back button inside the PageHeader actions and for the tab buttons (wrapped buttons use native button but Button used for the back link). |
| [@/components/ui/card](../@/components/ui/card.md) | Imports Card (internal UI wrapper) and uses it repeatedly as the primary block container for the not-found message, the tabs container, and each tab content area. |
| [@/lib/utils](../@/lib/utils.md) | Imports formatDateTime to format campaign.createdAt for display in the Configure tab. |
| [@/features/platform-review/mock](../@/features/platform-review/mock.md) | Imports getKnowledgeRef, getWorkflowRef, and outboundCampaignsMock. outboundCampaignsMock is searched for the campaign by id; getWorkflowRef/getKnowledgeRef are called with campaign.workflowId / campaign.kbId (wrapped in useMemo) to produce referenced workflow/knowledge metadata (name, version, summary, sourceType) used in the workflow and knowledge sections. |

## 📁 Directory

This file is part of the **[id]** directory. View the [directory index](_docs/src/app/(console)/preview/platform-review/outbound/[id]/README.md) to see all files in this module.

## Architecture Notes

- This is a client-side Next.js React component (file begins with "use client") designed for read-only preview within a platform-review console. It is component-based and purely presentational; there are no async data fetches—data is provided by local mocks imported from '@/features/platform-review/mock'.
- State management is local: useState('configure') controls which tab's content is visible. Derived values (workflow and knowledge references) are memoized with useMemo to avoid recomputing when the campaign object hasn't changed.
- Routing integration: useParams from next/navigation extracts the dynamic route id. Next.js Link components are used for navigation to both the list page and referenced workflow/knowledge detail pages. There is minimal error handling: if no campaign matches the id, the component returns a Card containing a plain not-found message.
- UI/Styling: Uses project UI atoms (PageHeader, Badge, Button, Card) and inline Tailwind-like utility classes for layout and visual states. toneByStatus centralizes mapping of Vietnamese status strings to Badge tones, which ensures consistent visual semantics across the page.

## Usage Examples

### Render a campaign preview page for campaign id from route

On route /preview/platform-review/outbound/[id], next/navigation's useParams returns { id } which the component uses to find the campaign in outboundCampaignsMock (outboundCampaignsMock.find(item => item.id === params.id)). If found, the component memoizes workflow and knowledge references (getWorkflowRef, getKnowledgeRef). The PageHeader shows the campaign name and a Badge with tone determined by toneByStatus(campaign.status). The tab row allows the user to switch between 'Configure', 'Workflow', 'Knowledge', and 'Data source' by calling setTab. Each tab renders specific read-only fields: Configure shows id, createdAt (formatted via formatDateTime), schedule, retry rule, and description; Workflow and Knowledge show reference cards with Link to their respective preview pages; Data source shows dataSource, totalCalls and successRate. If the campaign isn't found, the component returns a Card with the text "Không tìm thấy campaign."

### User clicks the back button in PageHeader

The back button wraps a Button in a Next.js Link pointing to '/preview/platform-review/outbound'. Clicking it triggers a client-side navigation back to the outbound campaigns list. The ArrowLeft icon from lucide-react is rendered inside the Button for affordance.

## Maintenance Notes

- Performance: Current data comes from outboundCampaignsMock and local getWorkflowRef/getKnowledgeRef functions; when swapping to real data fetching, ensure asynchronous data-loading patterns (loading/error states) are implemented. useMemo helps but is only useful when campaign objects are potentially expensive to derive; review memoization once real fetch logic is added.
- Accessibility & semantics: Tab selectors are implemented with plain <button> elements styled visually as tabs. Consider adding role attributes (role="tablist"/role="tab"), aria-selected, and focus styles to improve accessibility and keyboard navigation.
- Internationalization: UI strings are hard-coded in Vietnamese and English (e.g., 'Configure', 'Campaign ID', 'Không tìm thấy campaign.'). If the app needs localization, extract strings to i18n resources.
- Robustness: toneByStatus only handles a small set of Vietnamese statuses ('Đang chạy','Nháp','Tạm dừng'). If backend introduces other statuses, they will fall through to 'info'. Consider an explicit default mapping strategy or enum types to surface unhandled statuses during development.
- Testing: Add unit tests for: (1) toneByStatus mapping expected inputs to outputs, (2) rendering fallback state when campaign is not found, (3) each tab's conditional rendering and content (Configure/workflow/knowledge/data-source) using mocked outboundCampaignsMock, and (4) correct Link href values for workflow and knowledge references.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/app/(console)/preview/platform-review/outbound/[id]/README.md)

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

Return a literal tone string based on exact Vietnamese status input.


The function checks the provided status string against three exact Vietnamese phrases and returns a corresponding literal tone string: "Đang chạy" -> "success", "Nháp" -> "warning", "Tạm dừng" -> "muted". If the input does not match any of those exact strings, it returns "info". All comparisons are strict (===) and case-sensitive. The returns use TypeScript literal types (via 'as const' in the implementation) to narrow the result to one of four specific string literals.

### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `status` | `string` | ✅ | A status label string to map to a tone. Expected to be one of specific Vietnamese phrases to get a non-default tone.
<br>**Constraints:** Must be a string, Comparisons are exact and case-sensitive, Recognized exact inputs: "Đang chạy", "Nháp", "Tạm dừng" (other values yield the default) |

### Returns

**Type:** `"success" | "warning" | "muted" | "info"`

A literal string representing a UI tone corresponding to the input status.


**Possible Values:**

- success
- warning
- muted
- info

### Usage Examples

#### Map a running status to a tone for UI styling

```typescript
const tone = toneByStatus("Đang chạy"); // returns "success"
```

Demonstrates mapping the exact Vietnamese status "Đang chạy" to the "success" tone.

#### Handle an unknown or other status value

```typescript
const tone = toneByStatus("Unknown"); // returns "info"
```

Shows that any status not matching the three specific phrases results in the default "info" tone.

### Complexity

O(1) time complexity and O(1) space complexity (constant-time conditional checks, constant extra space).

### Related Functions

- `None` - No direct call relationships are visible in the provided implementation; this is a small pure mapping helper.

### Notes

- String comparisons are exact and case-sensitive; any variation (whitespace, case, different accents) will not match the explicit cases and will produce the default "info".
- The implementation returns TypeScript literal types (via 'as const'), narrowing the return to one of the four literal strings.

---


