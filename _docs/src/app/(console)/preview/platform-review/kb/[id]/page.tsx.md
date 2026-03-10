<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/app/(console)/preview/platform-review/kb/[id]/page.tsx",
  "source_hash": "014fe559fb1425c1042b56ce219783e51df345d4cc40cb027299840c8a547841",
  "last_updated": "2026-03-10T03:58:00.315605+00:00",
  "tokens_used": 7528,
  "complexity_score": 2,
  "estimated_review_time_minutes": 10,
  "external_dependencies": [
    "next/link",
    "next/navigation",
    "lucide-react"
  ]
}
```

</details>

[Documentation Home](../../../../../../../README.md) > [src](../../../../../../README.md) > [app](../../../../../README.md) > [(console)](../../../../README.md) > [preview](../../../README.md) > [platform-review](../../README.md) > [kb](../README.md) > [[id]](./README.md) > **page.mdx**

---

# page.tsx

> **File:** `src/app/(console)/preview/platform-review/kb/[id]/page.tsx`


✅ **Validation Confidence:** 85%

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

This file exports a client-side React component for previewing a single Knowledge Base reference identified by a route parameter. It is a Next.js client component ("use client") that reads the route parameter via useParams and resolves the KB entry synchronously using an internal mock helper getKnowledgeRef(params.id). The component renders a PageHeader with a back action and a details Card showing fields from the kb object: id, status (rendered in a Badge), sourceType, updatedAt (formatted with formatDateTime), and summary.

A small helper function toneByStatus(status: string) maps Vietnamese status strings to Badge tones ("Đã học" -> "success", "Đang học" -> "info", otherwise -> "warning"). If getKnowledgeRef returns undefined the component renders a Card with the message "Không tìm thấy knowledge reference.". There is no asynchronous fetching, loading state, or advanced error handling in this file because the data provider is a synchronous mock.

## Dependencies

### External Dependencies

| Module | Usage |
| --- | --- |
| `next/link` | Imports Link (import Link from "next/link"); used to render a client-side navigation link wrapping the back Button: <Link href="/preview/platform-review/outbound">...</Link>. |
| `next/navigation` | Imports useParams (import { useParams } from "next/navigation"); used to read the route parameter id: const params = useParams<{ id: string }>(); which is passed to getKnowledgeRef(params.id) to select the KB entry to display. |
| `lucide-react` | Imports ArrowLeft (import { ArrowLeft } from "lucide-react"); used as an inline icon inside the back Button: <ArrowLeft className="h-4 w-4" />. |

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/components/shared/page-header](../@/components/shared/page-header.md) | Imports PageHeader (import { PageHeader } from "@/components/shared/page-header"); used to render the top title and description area of the page with actions prop containing the back Link/Button. |
| [@/components/ui/badge](../@/components/ui/badge.md) | Imports Badge (import { Badge } from "@/components/ui/badge"); used to display the KB status visually. The tone prop is set from the toneByStatus helper and the child is kb.status. |
| [@/components/ui/button](../@/components/ui/button.md) | Imports Button (import { Button } from "@/components/ui/button"); used to render the actionable back button inside the PageHeader actions prop; classes and variant are applied (<Button variant="secondary" className="gap-2">...). |
| [@/components/ui/card](../@/components/ui/card.md) | Imports Card (import { Card } from "@/components/ui/card"); used as the container for both the not-found message and the KB detail grid. The detail Card uses a CSS grid layout (className="grid gap-3 md:grid-cols-2"). |
| [@/lib/utils](../@/lib/utils.md) | Imports formatDateTime (import { formatDateTime } from "@/lib/utils"); used to format the kb.updatedAt value for display: {formatDateTime(kb.updatedAt)}. |
| [@/features/platform-review/mock](../@/features/platform-review/mock.md) | Imports getKnowledgeRef (import { getKnowledgeRef } from "@/features/platform-review/mock"); used as the synchronous data provider to fetch the KB entry by id: const kb = getKnowledgeRef(params.id). This file relies on that mock rather than a network call. |

## 📁 Directory

This file is part of the **[id]** directory. View the [directory index](_docs/src/app/(console)/preview/platform-review/kb/[id]/README.md) to see all files in this module.

## Architecture Notes

- Client component pattern: The file begins with the "use client" directive, enabling useParams and client-only UI interactions.
- Simple helper for presentation: toneByStatus maps localized status strings to Badge tones used for visual feedback.
- Synchronous mock data: getKnowledgeRef is used synchronously, so the component has no loading states or async error handling.

## Usage Examples

### Render a preview page for a knowledge reference with id from the URL

When the route contains a parameter id, Next.js client routing provides it via useParams(). The component calls getKnowledgeRef(params.id) synchronously. If a KB object is returned, the PageHeader displays kb.title and a back action linking to /preview/platform-review/outbound. The details Card renders: KB ID (kb.id), Status (Badge with tone determined by toneByStatus(kb.status)), Source type (kb.sourceType), Updated (formatDateTime(kb.updatedAt)), and Summary (kb.summary). If getKnowledgeRef returns undefined, the component instead renders a Card with the message 'Không tìm thấy knowledge reference.'.

## Maintenance Notes

- Replacing the synchronous mock with a real API will require converting to async data handling and adding loading/error states.
- toneByStatus uses hard-coded Vietnamese strings; consider normalizing status values or extracting localization responsibilities elsewhere.
- Ensure Badge API and other shared UI component contracts remain compatible (e.g., prop names like tone).

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/app/(console)/preview/platform-review/kb/[id]/README.md)

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

Returns a literal tone string ('success', 'info', or 'warning') based on the provided status string.


This function inspects the input status string and returns one of three TypeScript string literals. If status strictly equals "Đã học" it returns "success" (with an explicit 'as const' assertion). If status strictly equals "Đang học" it returns "info" (as const). For any other input it returns "warning" (as const). The function performs simple equality checks and does not mutate inputs or interact with external systems.

### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `status` | `string` | ✅ | A status label to map to a tone. The implementation checks for exact matches of specific Vietnamese status strings.
<br>**Constraints:** Must be a string, Comparisons are strict equality checks (case- and diacritic-sensitive) |

### Returns

**Type:** `"success" | "info" | "warning" (string literal, asserted with 'as const')`

A string literal representing the tone corresponding to the input status.


**Possible Values:**

- success
- info
- warning

### Usage Examples

#### Mapping a completed learning status to a success tone

```typescript
const tone = toneByStatus("Đã học"); // returns "success"
```

Demonstrates exact-match mapping for the "Đã học" status.

#### Mapping an in-progress learning status to an info tone

```typescript
const tone = toneByStatus("Đang học"); // returns "info"
```

Demonstrates exact-match mapping for the "Đang học" status.

#### Mapping an unknown or other status

```typescript
const tone = toneByStatus("Chưa bắt đầu"); // returns "warning"
```

Any status not matched by the two explicit checks yields the default "warning" tone.

### Complexity

O(1) time complexity and O(1) space complexity

### Notes

- Comparisons are exact string equality checks; different casing or minor differences in the string will result in the default "warning" value.
- The function returns string literals asserted with 'as const' to preserve literal types in TypeScript.
- No localization or normalization is performed on the input; caller should ensure the status string matches expected values.

---


