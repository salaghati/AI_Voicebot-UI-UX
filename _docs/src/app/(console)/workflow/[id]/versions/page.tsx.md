<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/app/(console)/workflow/[id]/versions/page.tsx",
  "source_hash": "23340a54ad13a5fc8364b962b10e1c03ecbe2d266653221749448ab354f74eb4",
  "last_updated": "2026-03-10T04:04:59.549287+00:00",
  "tokens_used": 13679,
  "complexity_score": 3,
  "estimated_review_time_minutes": 15,
  "external_dependencies": [
    "next/link",
    "react",
    "next/navigation",
    "@tanstack/react-query",
    "lucide-react"
  ]
}
```

</details>

[Documentation Home](../../../../../../README.md) > [src](../../../../../README.md) > [app](../../../../README.md) > [(console)](../../../README.md) > [workflow](../../README.md) > [[id]](../README.md) > [versions](./README.md) > **page.mdx**

---

# page.tsx

> **File:** `src/app/(console)/workflow/[id]/versions/page.tsx`

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

This file implements a client-side React page component (default export: WorkflowVersionHistoryPage) used in a Next.js app route to show a workflow's version history. It reads the route parameter id via useParams, fetches the workflow data using useQuery with fetchWorkflow(workflowId), shows loading and error states with the AsyncState component, and when data is available it builds a synthetic version history via buildVersionHistory and renders it as an HTML table inside a Card. The table includes version label, status (rendered with Badge and a tone mapped by mapStatusTone), main changes, notes, updated-by, formatted timestamp (formatDateTime), and actions linking to the workflow diagram and a preview session (query param version).

Implementation notes: parseVersion(version: string) extracts a numeric value from a version string that is expected to start with "v" and falls back to 1 when parsing fails. buildVersionHistory(version: string, status: "Active" | "Draft", updatedAt: string) constructs an array of 6 synthetic history entries using the numeric base version, subtracting 0.1 per step and shifting updatedAt backward by whole-day offsets (86400000 ms). The function also uses a hard-coded owners list and Vietnamese text for notes/changes, so the history produced is deterministic mock data derived from the fetched workflow rather than a real backend version-history endpoint. The page is a client component ("use client") and relies on several shared UI components and utilities from the project (PageHeader, Button, Card, Badge, AsyncState, formatDateTime, mapStatusTone).

## Dependencies

### External Dependencies

| Module | Usage |
| --- | --- |
| `next/link` | Imports Link to create client-side navigable anchor elements used for 'Quay lại workflow', 'Diagram' and 'Preview' buttons linking to workflow pages and preview sessions. |
| `react` | Imports useMemo to memoize the computed history array (buildVersionHistory result) so it is only recomputed when the workflow changes. |
| `next/navigation` | Imports useParams to read the dynamic route parameter { id: string } from the Next.js route and pass that id into the data fetch (fetchWorkflow). |
| `@tanstack/react-query` | Imports useQuery to perform the asynchronous fetch of a workflow by id (queryKey: ["workflow-version-history", workflowId]; queryFn: () => fetchWorkflow(workflowId)), and to expose isLoading/isError/data/refetch used by the page. |
| `lucide-react` | Imports ArrowLeft and Eye icon components used inside Buttons for the back action and the diagram button respectively. |

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/lib/api-client](../@/lib/api-client.md) | Imports fetchWorkflow (internal API client) which is called by useQuery to fetch the workflow object for the given id. The page expects fetchWorkflow(workflowId) to return an object where the workflow is available at query.data.data. |
| [@/components/shared/page-header](../@/components/shared/page-header.md) | Imports PageHeader (internal UI component) used to render the page title, description, and action buttons area at the top of the page. |
| [@/components/ui/button](../@/components/ui/button.md) | Imports Button (internal UI primitive) used throughout the page for secondary and small size actions (back, diagram, preview). |
| [@/components/ui/card](../@/components/ui/card.md) | Imports Card (internal UI container) used to wrap the table and provide consistent styling/overflow behavior. |
| [@/components/ui/badge](../@/components/ui/badge.md) | Imports Badge (internal UI primitive) used to display the version status with a tone determined by mapStatusTone(item.status). |
| [@/components/shared/async-state](../@/components/shared/async-state.md) | Imports AsyncState (internal component) to render consistent loading and error states for the query: <AsyncState state="loading" /> and <AsyncState state="error" onRetry={...} />. |
| [@/lib/utils](../@/lib/utils.md) | Imports formatDateTime (internal utility) to format item.updatedAt ISO timestamps for display in the table. |
| [@/lib/mappers](../@/lib/mappers.md) | Imports mapStatusTone (internal mapper) to convert the item's status string into a Badge tone prop. |

## 📁 Directory

This file is part of the **versions** directory. View the [directory index](_docs/src/app/(console)/workflow/[id]/versions/README.md) to see all files in this module.

## Architecture Notes

- This is a Next.js client component ("use client") that uses the React + react-query pattern: useParams -> useQuery(fetch) -> conditional render based on isLoading/isError -> render UI. Data fetching is isolated to useQuery which provides refetch and state booleans used by AsyncState.
- buildVersionHistory and parseVersion are pure helper functions executed inside useMemo to produce synthetic/mock history data. The generated history uses deterministic logic (numeric parsing, index-based status toggles, day offsets using 86400000 ms) and hard-coded owners and messages, so this file intentionally synthesizes version entries instead of requesting a dedicated backend history endpoint.
- UI is composition-based: shared primitives (Card, Button, Badge) and icons (lucide-react) are used to keep styling/interaction consistent. Navigation uses Next.js Link for client-side transitions and query parameters are used for the preview route (e.g., /workflow/{id}/preview/session?version={version}).

## Usage Examples

### Developer opens the workflow version history page

When a developer navigates to the route that mounts this page (route parameter id present), useParams retrieves the workflowId. useQuery calls fetchWorkflow(workflowId). While the fetch is in progress, <AsyncState state="loading" /> is rendered. If the fetch errors or no workflow is returned, <AsyncState state="error" onRetry={() => query.refetch()} /> is rendered. On success, the workflow object (expected at query.data.data) is passed into useMemo which calls buildVersionHistory(workflow.version, workflow.status, workflow.updatedAt) to create 6 synthetic history entries. The table is rendered with each row including version, status (Badge with tone from mapStatusTone), changes, note, updatedBy, formatted time (formatDateTime), and action buttons: Diagram (links to /workflow/{workflow.id}) and Preview (links to /workflow/{workflow.id}/preview/session?version={item.version}).

## Maintenance Notes

- buildVersionHistory produces mock/simulated history. If a real version-history API becomes available, replace or augment this function to accept server-provided history entries and remove hard-coded owners/messages.
- parseVersion expects a version string prefixed with 'v' (e.g., 'v1.2'). If workflow.version can be in other formats, add stricter parsing and validation to avoid fallback to 1 which may misrepresent history.
- Time offsets use Date(updatedAt).getTime() minus multiples of 86400000 (1 day in ms). Ensure updatedAt is a valid ISO timestamp; timezone differences could affect displayed dates. Consider using a robust date library if more complex formatting/timezone handling is required.
- Large table width is enforced with min-w-[980px]; on smaller viewports the table scrolls horizontally. If accessibility or responsiveness issues appear, consider responsive table patterns or pagination for long histories.
- Testing: cover scenarios where fetchWorkflow returns null/undefined, where workflow.version is malformed, and where statuses other than 'Active'/'Draft' appear (mapStatusTone must handle such values).

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/app/(console)/workflow/[id]/versions/README.md)

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

Parses a version string by removing a leading 'v', converting the remainder to a floating-point number, and returning that number or 1 if the conversion is not a finite number.


The function takes a single string input, removes any literal character 'v' (only the first occurrence as used by String.prototype.replace), attempts to parse the resulting string to a floating-point number using Number.parseFloat, and returns the parsed numeric value if it is finite. If the parsed result is not a finite number (e.g., NaN or Infinity), the function returns the fallback value 1. The implementation uses built-in Number and String methods and performs no side effects.

### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `version` | `string` | ✅ | The version string to parse (commonly formatted like 'v1.2' or '1.2').
<br>**Constraints:** Expected to be a string, If the string does not represent a finite number after removing a single 'v', the function will return 1 |

### Returns

**Type:** `number`

A finite numeric representation of the version string, or the fallback 1 when parsing fails or yields a non-finite value.


**Possible Values:**

- Any finite number parsed from the input (e.g., 1, 1.2, 2.0)
- 1 (returned when parsing results in NaN or a non-finite value)

### Usage Examples

#### Parsing a version string prefixed with 'v'

```typescript
parseVersion('v2.5')
```

Removes the 'v', parses '2.5' to 2.5 and returns 2.5.

#### Parsing a numeric version string without 'v'

```typescript
parseVersion('3.0')
```

Parses '3.0' to 3 and returns 3.

#### Parsing an invalid or non-numeric string

```typescript
parseVersion('version')
```

parseFloat yields NaN, Number.isFinite is false, so the function returns the fallback 1.

### Complexity

Time complexity O(n) where n is the length of the input string (due to replace and parseFloat scanning the string). Space complexity O(1) additional space (ignoring input/output string storage).

### Related Functions

- `Number.parseFloat` - Called by this function to convert the cleaned string to a floating-point number
- `Number.isFinite` - Called by this function to check whether the parsed numeric value is finite
- `String.prototype.replace` - Called by this function to remove a leading 'v' character from the input string

### Notes

- The replace call uses a string literal "v", which replaces only the first occurrence of 'v'. Inputs with uppercase 'V' or multiple 'v' characters will not be fully normalized.
- The function does not trim whitespace; an input like ' v1.2' may result in NaN and thus return 1.
- The function does not validate semantic versioning; it only extracts a single floating-point number from the string after removing the first 'v'.

---



#### function buildVersionHistory

![Type: Sync](https://img.shields.io/badge/Type-Sync-green)

### Signature

```typescript
function buildVersionHistory(version: string, status: "Active" | "Draft", updatedAt: string)
```

### Description

Generate an array of six synthetic version-history objects derived from the given version and timestamp, alternating status and producing localized notes/changes strings.


The function parses the provided version (by calling parseVersion), converts the updatedAt timestamp to a base time, and builds an array of six objects representing version history entries. For each index 0..5 it computes a nextVersion by subtracting 0.1 * index from the parsed base (with a floor of 1), formats the version as 'vX.Y' with one decimal place, computes an updatedAt timestamp offset by index days (86400000 ms per day) backwards from the base time, and assigns an id, version, status, updatedBy (rotating through a fixed owners list), note and changes fields. The status for index 0 is the provided status; for subsequent indexes it alternates: even indexes become 'Draft' and odd indexes become 'Active' (relative to those indices). The function returns the constructed array; it does not perform I/O or mutate external state. The function calls parseVersion and uses the Date constructor and toISOString internally.

### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `version` | `string` | ✅ | A version identifier string to be parsed by parseVersion to obtain a numeric base version.
<br>**Constraints:** Must be acceptable input for the external parseVersion function, parseVersion should return a numeric value usable in arithmetic |
| `status` | `"Active" | "Draft"` | ✅ | The status to assign to the most recent entry (index 0). Subsequent entries alternate between 'Draft' and 'Active' based on their index.
<br>**Constraints:** Must be either 'Active' or 'Draft' |
| `updatedAt` | `string` | ✅ | A timestamp string (parseable by new Date(updatedAt)) used as the base updated time for index 0; subsequent entries are set to earlier dates by subtracting whole days.
<br>**Constraints:** Should be a string recognized by the JavaScript Date constructor (e.g., ISO 8601) |

### Returns

**Type:** `Array<{ id: string; version: string; status: "Active" | "Draft"; updatedAt: string; updatedBy: string; note: string; changes: string }>`

An array of six objects representing version history entries. Each object contains id, version (formatted as 'vX.Y'), status, ISO timestamp updatedAt, updatedBy email/system identifier, a note string (Vietnamese), and a changes string (Vietnamese/short description).


**Possible Values:**

- Array with exactly 6 items (length === 6)
- Each item's status is either 'Active' or 'Draft'
- version values are formatted with one decimal place like 'v1.0', 'v0.9', etc.
- updatedAt values are ISO strings representing base date minus index days

### Usage Examples

#### Generate displayable version history for a workflow page

```typescript
const history = buildVersionHistory('1.5', 'Active', '2026-03-10T12:00:00.000Z');
```

Produces an array of six version entries starting from parsed base (parseVersion('1.5')), with index 0 having status 'Active' and updatedAt '2026-03-10T12:00:00.000Z', subsequent entries moved back one day each.

### Complexity

Time: O(k) where k is the number of generated entries (here k === 6, effectively O(1) for this implementation). Space: O(k) for the returned array (again k === 6 here).

### Related Functions

- `parseVersion` - Called by this function to convert the input version string into a numeric base for generating subsequent version numbers.

### Notes

- The function uses a fixed owners list: ['admin@voicebot.vn','ops@voicebot.vn','qa@voicebot.vn','system'] and rotates through it based on index.
- Version arithmetic enforces a minimum numeric version of 1 via Math.max(1, base - index * 0.1).
- Version formatting uses toFixed(1), so versions are represented with a single decimal place like 'v1.0'.
- The function builds localized (Vietnamese) note and changes strings depending on index and parity.
- If parseVersion throws or returns a non-numeric value, the result may be NaN or cause unexpected version strings; this function does not validate parseVersion's output.
- No external I/O or mutation is performed. The function is deterministic given identical inputs and parseVersion behavior.

---


