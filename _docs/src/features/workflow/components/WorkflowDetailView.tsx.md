<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/features/workflow/components/WorkflowDetailView.tsx",
  "source_hash": "b55715df0e83ec18e5f7edec06f6236e5216f925233969e470f494706f6adabc",
  "last_updated": "2026-03-10T04:21:08.981796+00:00",
  "tokens_used": 12879,
  "complexity_score": 4,
  "estimated_review_time_minutes": 15,
  "external_dependencies": [
    "next/link",
    "react",
    "@tanstack/react-query",
    "lucide-react"
  ]
}
```

</details>

[Documentation Home](../../../../README.md) > [src](../../../README.md) > [features](../../README.md) > [workflow](../README.md) > [components](./README.md) > **WorkflowDetailView.mdx**

---

# WorkflowDetailView.tsx

> **File:** `src/features/workflow/components/WorkflowDetailView.tsx`

![Complexity: Medium](https://img.shields.io/badge/Complexity-Medium-yellow) ![Review Time: 15min](https://img.shields.io/badge/Review_Time-15min-blue)

## 📑 Table of Contents


- [Overview](#overview)
- [Dependencies](#dependencies)
- [Architecture Notes](#architecture-notes)
- [Usage Examples](#usage-examples)
- [Maintenance Notes](#maintenance-notes)
- [Functions and Classes](#functions-and-classes)

---

## Overview

This file exports a React client component WorkflowDetailView that displays a workflow diagram, a right-hand properties panel, header actions (edit, preview, version history), and a synthetic version-history overlay. It fetches workflow data with @tanstack/react-query (query key ["workflow", workflowId] and queryFn fetchWorkflow), and renders AsyncState for loading and error states. Local UI state includes selectedId and showVersions; selectedNode and versionHistory are memoized. The component registers a document mousedown listener to close the version overlay when clicking outside and cleans it up on unmount. Node-type-specific property blocks are rendered conditionally for Intent, Condition, API, and KB nodes, reading expected fields and showing fallbacks when values are missing. Version history is generated client-side via buildVersionHistory and each entry links to a preview/session route.

## Dependencies

### External Dependencies

| Module | Usage |
| --- | --- |
| `next/link` | Used as Link to render client-side navigation links for editing, previewing, and viewing specific version/session routes (e.g., <Link href={`/workflow/${currentWorkflow.id}/edit`}> and links in version history). |
| `react` | Imports React hooks useCallback, useEffect, useMemo, useRef, useState which the component uses for local state (selectedId, showVersions), memoized values (selectedNode, versionHistory), ref to the version popup container (versionRef), and registering/cleaning up the document mousedown listener (closeVersions). |
| `@tanstack/react-query` | Imports useQuery to run the asynchronous fetchWorkflow call with queryKey ['workflow', workflowId] and manage loading/error/refresh state within the component. useQuery's returned query object is used to read data, isLoading/isError flags, and to call query.refetch() on retry. |
| `lucide-react` | Provides icon components ArrowRight, History, Pencil, X used in buttons and the version history overlay for visual affordances. |

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/lib/api-client](../@/lib/api-client.md) | Provides fetchWorkflow which is invoked as the useQuery queryFn: () => fetchWorkflow(workflowId). The component expects fetchWorkflow to return a response object containing data.data with the workflow model. |
| [@/components/shared/page-header](../@/components/shared/page-header.md) | Uses PageHeader to display the page title, description, and action controls (badges, buttons, version history control) at the top of the view. |
| [@/components/ui/card](../@/components/ui/card.md) | Uses Card to render grouped summary sections (e.g., configuration summary and status cards) in the lower portion of the page. |
| [@/components/ui/badge](../@/components/ui/badge.md) | Uses Badge to render status, kind, and per-version status markers in the header and properties panel (e.g., <Badge tone={mapStatusTone(currentWorkflow.status)}>{currentWorkflow.status}</Badge>). |
| [@/components/ui/button](../@/components/ui/button.md) | Uses Button for actions: toggling version history, editing the workflow, and showing preview. Icons are placed inside these buttons. |
| [@/components/shared/async-state](../@/components/shared/async-state.md) | Renders AsyncState for loading and error states returned by useQuery: <AsyncState state="loading" /> and <AsyncState state="error" onRetry={() => query.refetch()} />. |
| [@/lib/utils](../@/lib/utils.md) | Uses formatDateTime to format ISO timestamp strings for display in the version history list and workflow updatedAt field. |
| [@/lib/mappers](../@/lib/mappers.md) | Uses mapStatusTone to map workflow/node statuses to UI tones for Badge components (e.g., mapStatusTone(currentWorkflow.status)). |
| [./WorkflowDiagramCanvas](.././WorkflowDiagramCanvas.md) | Uses the WorkflowDiagramCanvas component to render the visual diagram of workflow nodes, passing nodes, selectedId, onSelect, title, and subtitle props. |

## 📁 Directory

This file is part of the **components** directory. View the [directory index](_docs/src/features/workflow/components/README.md) to see all files in this module.

## Architecture Notes

- React functional component with hooks: The component uses useState for local UI state (selected node and version popup visibility), useRef for the popup container element, useCallback to memoize the outside-click handler, and useEffect to register/unregister a document-level mousedown listener when the version popup is visible.
- Data fetching and caching: Uses @tanstack/react-query's useQuery keyed by ["workflow", workflowId] and queryFn () => fetchWorkflow(workflowId). The component branches on query.isLoading and query.isError and uses query.refetch() for retry behavior.
- Computed/memoized values: selectedNode is computed with useMemo from workflow nodes and selectedId to avoid recalculating on unrelated renders; versionHistory is also memoized and generated client-side via buildVersionHistory. This suggests the version list shown is synthetic (client-side generated) rather than authoritative from the API.
- UI composition: The component composes small presentational UI components (PageHeader, Badge, Button, Card, AsyncState) and an encapsulated WorkflowDiagramCanvas. Node-type-specific blocks are rendered conditionally (Intent, Condition, API, KB) and expect precise node fields; the component directly reads those fields and renders fallback placeholders ('--') when values are missing.
- Error handling and UX: Error and loading states are surfaced via AsyncState. The version history overlay uses an explicit outside-click listener to close, and each version entry links to a preview/session route for that version.

## Usage Examples

### Open the workflow detail page in the UI

Component is mounted with a workflowId prop. useQuery runs fetchWorkflow(workflowId). While fetching, the component renders <AsyncState state="loading" />. After fetch resolves, the PageHeader is rendered (showing workflow name, status Badge, kind Badge), WorkflowDiagramCanvas is rendered with nodes from currentWorkflow.nodes, and the right-hand properties panel displays details for either the selected node (selectedId) or the first node. Clicking a node in the diagram should call the onSelect handler (setSelectedId) and update the properties panel. Clicking 'Show Preview' navigates to /workflow/{id}/preview/session. If the query errors, <AsyncState state="error" onRetry={() => query.refetch()} /> is shown and retry triggers another fetch.

### Inspect version history and open a version preview

User clicks the 'Version history' Button which toggles showVersions. The component builds a synthetic version history via buildVersionHistory(currentWorkflow.version, currentWorkflow.status, currentWorkflow.updatedAt) and renders an overlay listing versions. Each entry is a Link to /workflow/{id}/preview/session?version={versionText}. Clicking an entry closes the overlay (onClick sets setShowVersions(false)) and navigates to the preview route. Clicking outside the overlay triggers the document mousedown handler closeVersions to setShowVersions(false).

### View properties for different node types

When selectedNode.type === 'Intent', the properties panel shows fields such as selectedNode.mainIntent, selectedNode.confidenceThreshold, fallbackNodeId, timeoutSec, maxRetry, intents (joined), and entities (joined). For 'Condition', it shows conditionSource, defaultTargetNodeId, onRuleError, and conditionRulesText. For 'API', it shows apiRef, apiMethod and apiUrl, authProfile, apiTimeoutMs/apiRetry, successCondition, and onFailAction. For 'KB', it shows kbRefId, retrievalMode, topK/scoreThreshold, rerank/citationEnabled flags, and noAnswerAction. Missing fields are shown as '--' or appropriate fallbacks.

## Maintenance Notes

- Performance: WorkflowDiagramCanvas may have to render many nodes; ensure that canvas component is optimized (virtualization or clustered rendering) for large node sets. The parent memoization (selectedNode) prevents unnecessary recalculation but does not prevent re-renders of the canvas itself if parent props change.
- Version history: buildVersionHistory synthesizes historical entries client-side. If server-side authoritative version history is required, replace this synthetic generator with an API endpoint and adjust the overlay to use real data (and remove the artificial time offsets).
- Event listener cleanup: closeVersions is registered on document mousedown when showVersions is true; ensure the listener is removed in all code paths. The current code cleans up in the effect return and when showVersions toggles off, but if behavior changes, verify no leak occurs.
- Type safety and props: The component expects the workflow and node shapes to contain specific fields (id, name, version, status, kind, updatedAt, nodes array, intents array). If the API returns a different shape, TypeScript typing and runtime checks should be updated. Consider adding explicit TypeScript interfaces for Workflow and Node models to make field contracts clear and to enable compile-time checks.
- Accessibility & i18n: Some visible strings are in Vietnamese and hard-coded. If multi-language support is required, extract strings to an i18n/resource file and ensure interactive elements (buttons, links) have accessible labels and focus management (especially the version overlay).
- Testing: Add unit tests for parseVersion and buildVersionHistory to assert parsing/formatting behavior and boundary cases (non-numeric version strings). Add integration tests to assert that selection updates the properties panel and that version overlay opens/closes correctly.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/features/workflow/components/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*


---

## Functions and Classes


#### function parseVersion

![Type: Sync](https://img.shields.io/badge/Type-Sync-green)

### Signature

```typescript
function parseVersion(version: string): number
```

### Description

Removes the first literal 'v' from the input string, parses the remainder as a floating-point number, and returns that number if finite; otherwise returns 1.


The function accepts a string, calls version.replace("v", "") to remove the first occurrence of the lowercase character 'v', then uses Number.parseFloat on the resulting string to produce a numeric value. It checks the parsed value with Number.isFinite; if the parsed value is a finite number it returns that number, otherwise it returns the fallback value 1. No errors are thrown by the function itself.

### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `version` | `string` | ✅ | A version identifier string that may contain a leading 'v' (for example 'v1.2' or '1.2').
<br>**Constraints:** Should be a string, If the string does not contain a parseable numeric portion, function will return 1, Only the first occurrence of lowercase 'v' is removed because String.replace is used without a global flag |

### Returns

**Type:** `number`

A finite number parsed from the version string, or 1 if parsing does not produce a finite number.


**Possible Values:**

- Any finite number resulting from Number.parseFloat after removing the first 'v' (e.g., 1, 1.2, 2.0)
- 1 — returned when parsing fails or results in NaN/Infinity/-Infinity

### Usage Examples

#### Typical usage with a leading 'v'

```typescript
parseVersion('v2.3')
```

Removes the first 'v', parses '2.3' to 2.3 and returns 2.3.

#### Input without 'v'

```typescript
parseVersion('3')
```

Parses '3' to 3 and returns 3.

#### Non-parseable input

```typescript
parseVersion('version')
```

parseFloat yields NaN, Number.isFinite fails, so the function returns the fallback value 1.

### Complexity

Time complexity: O(n) where n is the length of the input string (due to replace/parse operations). Space complexity: O(1) additional space (a small temporary string from replace).

### Related Functions

- `Number.parseFloat` - Called by parseVersion to convert a string to a floating-point number.
- `Number.isFinite` - Called by parseVersion to verify that the parsed numeric value is finite.

### Notes

- String.replace("v","") removes only the first occurrence of the lowercase 'v'. Uppercase 'V' will not be removed.
- If callers expect to handle versions with multiple 'v' characters or uppercase 'V', they should preprocess the string (for example using a global or case-insensitive replacement) before calling this function.
- The function does not trim whitespace; leading/trailing spaces will be passed to parseFloat which tolerates leading whitespace but trailing non-numeric characters may affect parsing.
- The function intentionally returns 1 as a fallback for any non-finite parse result (NaN, Infinity, -Infinity).

---



#### function buildVersionHistory

![Type: Sync](https://img.shields.io/badge/Type-Sync-green)

### Signature

```typescript
function buildVersionHistory(version: string, status: "Active" | "Draft", updatedAt: string)
```

### Description

Generates an array of six version history objects derived from the given version, status, and updatedAt timestamp.


Parses a numeric base version using parseVersion(version), converts the provided updatedAt string to a millisecond timestamp, and then creates an array of six entries. For each index from 0 to 5 it computes a version number by decrementing the base by 0.1 per index (floored at 1.0), formats it as 'vX.Y' with one decimal place, computes an updatedAt ISO timestamp offset by index days (86400000 ms per day) backwards from the base time, and assigns an id, version, status, and updatedAt. The status for index 0 is the input status; for other indices it alternates between "Draft" (even indices) and "Active" (odd indices).

### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `version` | `string` | ✅ | A version string that will be parsed by parseVersion to obtain a numeric base version.
<br>**Constraints:** Must be a string acceptable to parseVersion, parseVersion should return a numeric value |
| `status` | `"Active" | "Draft"` | ✅ | The status to assign to the most recent (index 0) version entry.
<br>**Constraints:** Must be exactly either "Active" or "Draft" |
| `updatedAt` | `string` | ✅ | A date-time string that will be parsed into a Date to establish the base timestamp for entry updatedAt values.
<br>**Constraints:** Must be a string recognized by Date constructor, If invalid, Date operations may throw a RangeError |

### Returns

**Type:** `Array<{ id: string; version: string; status: "Active" | "Draft"; updatedAt: string }>`

An array of six objects representing version history entries. Each object includes an id ("vX.Y-index"), a version string formatted as 'vX.Y', a status (either 'Active' or 'Draft'), and an updatedAt ISO timestamp.


**Possible Values:**

- An array with exactly 6 entries
- Each entry.version is a string like 'v1.0', 'v1.1', etc., with one decimal place
- Each entry.status is either 'Active' or 'Draft' (index 0 uses input status; others alternate)

### Raises

| Exception | Condition |
| --- | --- |
| `RangeError` | If updatedAt is not a valid date string, new Date(...).toISOString() may throw a RangeError ('Invalid time value'). |
| `Any thrown by parseVersion` | If parseVersion(version) throws (for invalid version format or implementation-specific reasons), that exception will propagate. |

### Usage Examples

#### Generate a small version history for display

```typescript
buildVersionHistory('1.3', 'Active', '2026-03-10T12:00:00Z')
```

Returns six entries starting from parsed base version (e.g., 1.3) with timestamps at 0,1,2... days earlier; index 0 uses status 'Active', subsequent entries alternate status.

### Complexity

Time: O(k) where k is the number of entries generated (here k = 6, so effectively O(1)). Space: O(k) to hold the returned array (effectively O(1) for fixed k).

### Related Functions

- `parseVersion` - Called by this function to obtain the numeric base version from the input version string.

### Notes

- The function clamps computed version numbers to a minimum of 1 using Math.max(1, ...).
- Version strings are formatted with one decimal place via toFixed(1) and prefixed with 'v'.
- Timestamps for entries are computed by subtracting index * 86400000 ms (one day) from the base updatedAt time.
- Because the function uses new Date(...).toISOString(), invalid date input will cause a runtime RangeError.

---


