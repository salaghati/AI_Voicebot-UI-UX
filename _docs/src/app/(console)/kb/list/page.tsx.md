<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/app/(console)/kb/list/page.tsx",
  "source_hash": "a0103f87941a52d4849d637cbf1faa112ba14f4432a6ca2ef884d1a12554758d",
  "last_updated": "2026-03-10T03:55:21.348489+00:00",
  "tokens_used": 11521,
  "complexity_score": 4,
  "estimated_review_time_minutes": 15,
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

[Documentation Home](../../../../../README.md) > [src](../../../../README.md) > [app](../../../README.md) > [(console)](../../README.md) > [kb](../README.md) > [list](./README.md) > **page.mdx**

---

# page.tsx

> **File:** `src/app/(console)/kb/list/page.tsx`

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

This file exports a React functional component KbListPage that renders a full-screen KB listing inside a KbShell layout. It uses React Query (useQuery) to fetch the KB list from fetchKbDocs, and two useMutation hooks to (1) mark an item as learned by calling updateKbDoc and (2) delete an item via deleteKbDoc. The component maintains local state learningIds (useState<string[]>) to represent items in the transient "learning" state and uses useMemo to derive visibleItems from the query response. UI pieces (Badge, Card, Table, Button, icons from lucide-react) render a table with columns for id, title, source, status, version, updatedAt, and actions.

The file is a client component ("use client" directive) intended to run in the browser. It integrates tightly with: local API client functions in @/lib/api-client, KbShell layout from @/features/kb, and shared UI components under @/components. It uses sonner.toast to surface success/error notifications and formatDateTime (from @/lib/utils) to display updated timestamps. The component uses React Query's query invalidation pattern (queryClient.invalidateQueries) after successful mutations to refresh the KB list instead of applying optimistic updates. Status strings and UI labels are in Vietnamese (e.g., "Đã học", "Đang học", "Chưa học"), which affects UX and text comparisons used in conditional rendering.

## Dependencies

### External Dependencies

| Module | Usage |
| --- | --- |
| `next/link` | Used to produce client-side navigational links. The Link component wraps buttons/rows to navigate to /kb/add and /kb/list/{id}. Imported exactly as: import Link from "next/link". |
| `react` | Provides React hooks used in this file: useMemo and useState are imported from 'react' and used to manage local component state (learningIds) and memoize visibleItems. Imported exactly as: import { useMemo, useState } from "react". |
| `@tanstack/react-query` | Provides hooks for data fetching and mutations: useQuery is used to fetch the KB list (queryKey: ['kb-list'] and queryFn: fetchKbDocs), useMutation is used for both learnMutation and deleteMutation, and useQueryClient is used to call queryClient.invalidateQueries after successful mutations. Imported exactly as: import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query". |
| `lucide-react` | Supplies SVG icon components used in the UI: Brain, Download, Eye, LoaderCircle, Plus, Trash2. Icons are placed in Buttons and Badges for visual cues. Imported exactly as: import { Brain, Download, Eye, LoaderCircle, Plus, Trash2 } from "lucide-react". |
| `sonner` | Provides toast notifications (toast) used to show success/error messages after mutation results (e.g., toast.success(`Đã học xong ${variables.id}`) and toast.error(...)). Imported exactly as: import { toast } from "sonner". |

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/lib/api-client](../@/lib/api-client.md) | Internal API client with functions used by React Query hooks: fetchKbDocs (queryFn for useQuery), updateKbDoc (used by learnMutation.mutationFn to mark KB as learned and bump version), deleteKbDoc (used by deleteMutation.mutationFn to remove KB by id). Imported exactly as: import { deleteKbDoc, fetchKbDocs, updateKbDoc } from "@/lib/api-client". |
| [@/features/kb](../@/features/kb.md) | Provides the KbShell layout component that wraps the entire page and receives title, description, and actions props. Imported exactly as: import { KbShell } from "@/features/kb". |
| [@/components/ui/badge](../@/components/ui/badge.md) | Badge UI component used to render the item's status with tones (success/info/warning) and optional loader icon for the "Đang học" state. Imported exactly as: import { Badge } from "@/components/ui/badge". |
| [@/components/ui/card](../@/components/ui/card.md) | Card UI container used to hold the table when there are visible items. Imported exactly as: import { Card } from "@/components/ui/card". |
| [@/components/ui/table](../@/components/ui/table.md) | Table building blocks used to render the KB table: Table, TBody, TD, TH, THead. The file composes these components to create the column headers and rows. Imported exactly as: import { Table, TBody, TD, TH, THead } from "@/components/ui/table". |
| [@/components/ui/button](../@/components/ui/button.md) | Button component used widely for action controls (Export, Create, View, Learn, Delete) with props variant, size and title. Imported exactly as: import { Button } from "@/components/ui/button". |
| [@/components/shared/async-state](../@/components/shared/async-state.md) | AsyncState component used to render loading, error (with retry callback), and empty states depending on the query lifecycle (query.isLoading, query.isError, visibleItems.length === 0). Imported exactly as: import { AsyncState } from "@/components/shared/async-state". |
| [@/lib/utils](../@/lib/utils.md) | Provides formatDateTime used to render item.updatedAt into a human-readable timestamp in the table. Imported exactly as: import { formatDateTime } from "@/lib/utils". |

## 📁 Directory

This file is part of the **list** directory. View the [directory index](_docs/src/app/(console)/kb/list/README.md) to see all files in this module.

## Architecture Notes

- Pattern: React functional component (client) using React Query for remote data fetching and stateful mutations. The page relies on query invalidation (queryClient.invalidateQueries) to refresh server state after mutations rather than optimistic updates.
- State management: local component state learningIds (string[]) tracks items that are in a local transient "learning" state to show a spinner while a mutation is in flight. Mutation results clear learningIds and invalidate queries to fetch canonical state.
- Error handling: mutations surface errors via sonner.toast (toast.error) and success via toast.success. UI deletion flows use window.confirm for user confirmation before calling deleteMutation.
- UI composition: small, composable UI primitives (Badge, Card, Table, Button) and icon components are composed declaratively. Text comparisons against Vietnamese status strings ("Đã học", "Đang học", "Chưa học") determine which action buttons appear.
- Synchronous scheduling detail: learn action intentionally delays mutation start by window.setTimeout(..., 1600) after adding the id to learningIds — this appears to be a UI/UX throttle or simulated processing delay.

## Usage Examples

### Render KB list and navigate to KB details

When the page mounts it calls useQuery with queryKey ['kb-list'] and fetchKbDocs as queryFn. While loading, AsyncState(state='loading') is shown; on error, AsyncState(state='error') with a retry prop (which calls query.refetch()) is shown. After successful fetch, the returned items are rendered in a Table inside a Card. Clicking the title link or the Eye button uses next/link to navigate the user to /kb/list/{item.id}.

### Mark item as learned and refresh list

User clicks the 'Học KB' (Brain icon) button on a row whose status is "Chưa học". The onClick handler adds the id to learningIds and schedules a learnMutation.mutate call after 1600ms with payload { id: item.id, version: item.version }. learnMutation.mutationFn calls updateKbDoc(id, { status: 'Đã học', version: bumpVersion(version) }). On success the mutation removes the id from learningIds, invalidates ['kb-list'] via queryClient.invalidateQueries to fetch fresh data, and shows a success toast. On error it also removes the id from learningIds and shows an error toast.

### Delete KB entry with confirmation

User clicks a Trash button (visible for 'Chưa học', 'Đang học', and 'Đã học' as applicable). The click handler first calls window.confirm(`Xóa KB ${item.id}?`). If confirmed, deleteMutation.mutate(item.id) is invoked which calls deleteKbDoc(id). On success deleteMutation invalidates ['kb-list'] and shows a success toast; on error it shows an error toast. Buttons check deleteMutation.isPending to disable multiple deletion attempts while the deletion is in progress.

## Maintenance Notes

- bumpVersion implementation caveat: bumpVersion(version: string) strips all non-digit characters and converts the remaining string to a Number, falling back to 1 if falsy, then returns `v${current + 1}`. This will produce unexpected results for dotted or multi-part versions (e.g., 'v1.2' -> digits '12' -> new version 'v13'). Consider parsing semantic versions properly or using a library if semantic versioning is required.
- Scalability: The current implementation renders all items in-memory. If the KB list can grow large, add pagination, server-side paging, or virtualization to avoid rendering performance issues.
- Localization: UI text and status comparisons are in Vietnamese. If the app will support multiple locales, extract status strings to a central i18n resource and avoid direct string comparisons for behavior branching.
- Testing: Unit tests should mock fetchKbDocs, updateKbDoc, and deleteKbDoc. Tests should assert query invalidation behavior, the learningIds transient state, and that confirmation modals prevent unintended deletes.
- Edge cases: ensure updatedAt exists and formatDateTime handles undefined/invalid dates. Also verify the react-query mutation state properties used (e.g., deleteMutation.isPending) match the project's react-query version API.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/app/(console)/kb/list/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*


---

## Functions and Classes


#### function bumpVersion

![Type: Sync](https://img.shields.io/badge/Type-Sync-green)

### Signature

```typescript
function bumpVersion(version: string)
```

### Description

Given a version string, extract all digits, interpret them as a number (defaulting to 1 when falsy), increment that number by one, and return it prefixed with 'v'.


This TypeScript function takes a single string parameter named version. It removes all non-digit characters from the input using a regular expression (version.replace(/[^\d]/g, "")), converts the resulting digit-only string to a Number, and falls back to 1 when the numeric result is falsy (using the || operator). It then increments that numeric value by 1 and returns a string prefixed with 'v' using a template literal (e.g., `v${current + 1}`). The implementation calls String.prototype.replace and the global Number constructor and performs no I/O or mutation.

### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `version` | `string` | ✅ | An input version string from which digit characters are extracted to form the numeric portion used for incrementing.
<br>**Constraints:** Any characters are accepted; non-digit characters are removed before numeric conversion, If the extracted digits produce a falsy numeric value (e.g., empty string or 0), the function treats the current number as 1 |

### Returns

**Type:** `string`

A new version string in the form 'vN' where N is the extracted numeric value (or 1 if falsy) plus one.


**Possible Values:**

- Strings matching the pattern 'v' followed by an integer (e.g. 'v2', 'v3', ...)
- Always returns at least 'v2' given the fallback behavior (empty or zero input results in 'v2')

### Usage Examples

#### Typical semantic version-like input

```typescript
bumpVersion('v3')
```

Removes non-digits -> '3', Number('3') -> 3, increments to 4, returns 'v4'.

#### Input contains multiple non-digit characters

```typescript
bumpVersion('version-12.4')
```

Removes non-digits -> '124', Number('124') -> 124, increments to 125, returns 'v125'.

#### Input with no digits or zero

```typescript
bumpVersion('abc')
```

Removes non-digits -> '', Number('') -> 0 (falsy), fallback to 1, increments to 2, returns 'v2'.

### Complexity

Time complexity O(n) where n is the length of the input string due to the replace operation; space complexity O(n) for the intermediate string produced by replace.

### Related Functions

- `Any other version helpers` - Potential alternative or complementary functions in the codebase that parse, format, or compare version strings; this function specifically extracts digits and increments a single numeric component.

### Notes

- The function strips all non-digit characters, so multi-component semantic versions (e.g., '1.2.3') become a concatenated number ('123') before incrementing.
- Because of the fallback (Number(...) || 1), an input that yields numeric 0 will be treated as 1, so the smallest returned version is 'v2'.
- Negative signs and other non-digit characters are removed rather than parsed; '-1' becomes '1'.

---


