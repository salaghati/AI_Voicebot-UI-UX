<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/app/(console)/preview/platform-review/workflows/[id]/page.tsx",
  "source_hash": "ffa3a3438ab48ce2401a70c26c8fc587a133e930ba7eed19c2fbfc787e20007b",
  "last_updated": "2026-03-10T03:59:06.044882+00:00",
  "git_sha": "59a0cbed74b52a684d854ddc3f3002e6c2116d66",
  "tokens_used": 6425,
  "complexity_score": 2,
  "estimated_review_time_minutes": 5,
  "external_dependencies": [
    "next/link",
    "next/navigation",
    "lucide-react"
  ]
}
```

</details>

[Documentation Home](../../../../../../../README.md) > [src](../../../../../../README.md) > [app](../../../../../README.md) > [(console)](../../../../README.md) > [preview](../../../README.md) > [platform-review](../../README.md) > [workflows](../README.md) > [[id]](./README.md) > **page.mdx**

---

# page.tsx

> **File:** `src/app/(console)/preview/platform-review/workflows/[id]/page.tsx`

![Complexity: Low](https://img.shields.io/badge/Complexity-Low-green) ![Review Time: 5min](https://img.shields.io/badge/Review_Time-5min-blue)

## 📑 Table of Contents


- [Overview](#overview)
- [Dependencies](#dependencies)
- [Architecture Notes](#architecture-notes)
- [Usage Examples](#usage-examples)
- [Maintenance Notes](#maintenance-notes)
- [Functions and Classes](#functions-and-classes)

---

## Overview

This file exports a single React functional component WorkflowReferencePreviewPage that runs on the client ("use client"). It reads the route parameter id via useParams, looks up a workflow reference using getWorkflowRef(params.id) from a mock module, and conditionally renders either a brief "not found" Card or a detailed preview Card with fields (ID, kind, version, updated timestamp, summary). The header is rendered with PageHeader and includes a secondary Button wrapped by Next.js Link to navigate back to the outbound list.

The component is purely presentational: it performs a synchronous lookup against an internal mock provider (no async/await or network calls in this file), formats the updatedAt timestamp with formatDateTime, and composes UI primitives (Card, Badge, Button, PageHeader). Text content includes Vietnamese strings for user-facing labels. Because it is a client component it uses Next.js client-side navigation primitives (Link, useParams) and an icon from lucide-react for the back button. The file is intended for preview/testing scenarios (preview mode) and therefore relies on mock data rather than server fetching or API integration.

## Dependencies

### External Dependencies

| Module | Usage |
| --- | --- |
| `next/link` | Uses the Link component to create a client-side navigation link to '/preview/platform-review/outbound' that wraps the Button for the back action. |
| `next/navigation` | Imports useParams to read route parameters (params.id) inside the client component to select which workflow reference to display. |
| `lucide-react` | Imports the ArrowLeft icon component and embeds it inside the Button used as the back action in the PageHeader actions. |

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/components/shared/page-header](../@/components/shared/page-header.md) | Uses PageHeader to render the page title, description, and actions area (which contains the back Link/Button). |
| [@/components/ui/badge](../@/components/ui/badge.md) | Uses Badge to display the workflow.kind value with an informational tone in the details Card. |
| [@/components/ui/button](../@/components/ui/button.md) | Uses Button to render the back action button with variant="secondary" and an icon + label layout. |
| [@/components/ui/card](../@/components/ui/card.md) | Uses Card as a layout wrapper for the not-found message and for the grid of workflow details. |
| [@/lib/utils](../@/lib/utils.md) | Uses formatDateTime to render workflow.updatedAt into a human-readable timestamp in the details Card. |
| [@/features/platform-review/mock](../@/features/platform-review/mock.md) | Calls getWorkflowRef(params.id) to retrieve a mock workflow reference object synchronously for preview rendering. |

## 📁 Directory

This file is part of the **[id]** directory. View the [directory index](_docs/src/app/(console)/preview/platform-review/workflows/[id]/README.md) to see all files in this module.

## Architecture Notes

- This is a client-side React functional component indicated by the 'use client' directive; it uses Next.js client navigation (Link and useParams) and therefore runs in the browser.
- Pattern: Simple presentational composition — no hooks besides useParams, no local state, no side effects, and no async logic. Error handling is a straightforward null/undefined check on the workflow value.
- Data flows: route parameter id -> getWorkflowRef(id) -> component render. The component depends on an internal mock data provider rather than network/APIs, so it is isolated from back-end concerns.
- UI composition uses small, reusable primitives (PageHeader, Card, Badge, Button) to keep layout and styling consistent. formatDateTime centralizes timestamp formatting for the updatedAt field.

## Usage Examples

### Render a preview for a workflow id route

When the page route includes an id parameter, Next's useParams provides that id to WorkflowReferencePreviewPage. The component calls getWorkflowRef(id). If getWorkflowRef returns null/undefined, the component renders a Card containing the message 'Không tìm thấy workflow reference.'. If a workflow object is returned, the PageHeader shows workflow.name and a back action; a Card grid displays workflow.id, workflow.kind (inside Badge), workflow.version, formatted workflow.updatedAt (via formatDateTime), and workflow.summary. The back button (Link) navigates to '/preview/platform-review/outbound'.

### Developer preview/testing with mock data

A developer can modify the mock implementation returned by '@/features/platform-review/mock' and reload the client page to verify rendering of different workflow shapes (e.g., missing summary or different kinds). Because the component reads from a synchronous mock provider and does not depend on server APIs, tests or storybook previews can mount the component and assert rendered text for present and not-found cases.

## Maintenance Notes

- Performance: small and inexpensive; it's purely presentational. Keep the client bundle small by avoiding heavy logic here. Icon and UI primitives contribute to bundle size — consider lazy-loading large icons if needed.
- Common pitfalls: getWorkflowRef must be available on the client. If the mock provider becomes async or server-only, this component will need to be updated (useEffect/async) or moved to a server component.
- Testing: add unit tests for both branches (workflow found vs not found), and snapshot tests for the Card layout. Verify formatDateTime is stable for timezone-sensitive tests.
- Future enhancements: replace mock provider with a real data fetch (API call) and add loading and error states; add i18n for the hardcoded Vietnamese strings; improve accessibility (aria-label on back Button, semantic landmarks).
- Dependencies: monitor Next.js and lucide-react versions as they affect SSR/CSR behavior and icon rendering.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/app/(console)/preview/platform-review/workflows/[id]/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*
