<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/app/(console)/kb/usage/filter/page.tsx",
  "source_hash": "f16956604bea6cf32f36d6ad3788f89f36f71bdadf219d02cf29cda419da3ba1",
  "last_updated": "2026-03-10T03:55:03.186983+00:00",
  "git_sha": "916ddc02a873a77a923ad02cf20e14b6e1d6abc2",
  "tokens_used": 7325,
  "complexity_score": 3,
  "estimated_review_time_minutes": 10,
  "external_dependencies": [
    "react",
    "next/navigation",
    "@tanstack/react-query"
  ]
}
```

</details>

[Documentation Home](../../../../../../README.md) > [src](../../../../../README.md) > [app](../../../../README.md) > [(console)](../../../README.md) > [kb](../../README.md) > [usage](../README.md) > [filter](./README.md) > **page.mdx**

---

# page.tsx

> **File:** `src/app/(console)/kb/usage/filter/page.tsx`

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

This file exports a single React component (export default function KbUsageFilterPage()) intended to run on the client ("use client"). Its responsibilities are: (1) fetch KB usage data using the fetchKbUsage function via useQuery from @tanstack/react-query, (2) read filter values (kb, wf, search) from Next.js useSearchParams and expose setters that update the URL using useRouter/usePathname, and (3) perform an in-memory filter of the fetched results and render them as UI cards inside a KbShell layout. The component uses project UI primitives (Card, Input, Select) and a KbShell wrapper to provide title/description and consistent layout.

The component treats the browser URL as the single source of truth for filter state: filters are constructed with useMemo from params.get("kb"), params.get("wf"), and params.get("search") (returning empty strings when absent). Updates call a local setParam helper which creates a new URLSearchParams from the current params, deletes the key when value is empty or sets it otherwise, and pushes the updated query string via router.push(`${pathname}?${next.toString()}`). Data fetching is done client-side with react-query (query key ["kb-usage-filter"]) and the filter is applied against query.data?.data (falling back to []). Items are filtered by exact matches for kbId and workflow, and a case-insensitive substring match across id, kbId, workflow, and topIntent when a search term is present. The UI provides two Selects (hard-coded options for KB and workflow) and an Input for the free-text filter; results are rendered as Cards showing id, kbId, workflow, calls, and topIntent.

## Dependencies

### External Dependencies

| Module | Usage |
| --- | --- |
| `react` | Imports useMemo to memoize the filters object derived from search params to avoid recalculation on every render. |
| `next/navigation` | Imports usePathname, useRouter, and useSearchParams. useSearchParams is used to read current query parameters (kb, wf, search). usePathname and useRouter are used by setParam to build and push the next URL when a filter changes. |
| `@tanstack/react-query` | Imports useQuery to run a client-side asynchronous fetch keyed by ["kb-usage-filter"]. The query's queryFn is an arrow function that calls fetchKbUsage(). The component reads query.data to access fetched results. |

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/lib/api-client](../@/lib/api-client.md) | Imports fetchKbUsage which is called indirectly by useQuery's queryFn; the component expects query.data?.data to be an array of usage items. (This is an internal project module.) |
| [@/features/kb](../@/features/kb.md) | Imports KbShell which is used as the top-level layout wrapper for the page. The component passes title and description props to KbShell to render page metadata and layout. |
| [@/components/ui/card](../@/components/ui/card.md) | Imports Card UI primitive used to contain the filter controls (as a grid) and to render each result item as a card showing id, kbId, workflow, calls, and topIntent. |
| [@/components/ui/input](../@/components/ui/input.md) | Imports Input UI primitive used for the free-text search field. Its value is bound to filters.search and onChange updates the 'search' URL parameter via setParam. |
| [@/components/ui/select](../@/components/ui/select.md) | Imports Select UI primitive used for the two dropdown filters (kb and workflow). Each Select's value binds to filters.kb or filters.wf and onChange calls setParam to update the corresponding URL parameter. |

## 📁 Directory

This file is part of the **filter** directory. View the [directory index](_docs/src/app/(console)/kb/usage/filter/README.md) to see all files in this module.

## Architecture Notes

- This is a client component ("use client"). It uses React Query (useQuery) for client-side data fetching and caches results under the static key ["kb-usage-filter"].
- Filters are managed via the browser URL search parameters. The component reads parameters with useSearchParams and updates them with router.push, making filter state bookmarkable and shareable via URL.
- Filtering happens in memory on the client: the code expects query.data?.data to be an array and applies exact matches for kb/workflow and a case-insensitive substring match across id, kbId, workflow, and topIntent for the search term.
- The UI relies on internal shared primitives (KbShell, Card, Input, Select) rather than local state-driven components; this keeps the page presentational and delegates layout/styling to shared components.

## Usage Examples

### User filters KB usage by KB ID and workflow

A user selects "KB-100" in the KB Select and "WF_ThuNo_A" in the Workflow Select. Each Select's onChange calls setParam('kb', value) or setParam('wf', value). setParam constructs a new URLSearchParams from the current params, sets or deletes the given key, and performs router.push(`${pathname}?${next.toString()}`). The page re-renders: useSearchParams returns the updated params, useMemo recomputes filters, the in-memory items filter applies kb and workflow exact matches against query.data?.data, and the UI shows only cards that match both selections. The URL now contains ?kb=KB-100&wf=WF_ThuNo_A so the filter state is shareable/bookmarkable.

### User performs free-text search across results

A user types a keyword into the Input bound to filters.search. onChange calls setParam('search', value). When a non-empty search value exists, the items filter computes q = filters.search.toLowerCase() and returns items where any of item.id, item.kbId, item.workflow, or item.topIntent includes q (case-insensitive). Clearing the input deletes the 'search' query param and the full list (subject to kb/wf filters) is shown again.

## Maintenance Notes

- Performance: The entire dataset (query.data?.data) is filtered client-side. If fetchKbUsage returns a large array, consider server-side filtering or paginated fetching to avoid rendering and memory bottlenecks.
- Missing loading/error UI: The component does not handle query.isLoading or query.isError states. Add UI feedback for loading and error cases to improve UX and avoid rendering empty/inconsistent lists while fetching.
- URL push behavior: setParam always uses router.push with `${pathname}?${next.toString()}`. If next.toString() is empty this yields a trailing '?' — consider using conditional logic to avoid appending '?' when there are no params.
- Debounce input: The Input updates the URL on every keystroke. Consider debouncing updates to reduce navigation frequency and improve performance.
- Test cases: Add unit/integration tests to ensure filter synchronization between URL and UI, correct deletion of params when values are empty, and correct case-insensitive search behavior across id, kbId, workflow, and topIntent.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/app/(console)/kb/usage/filter/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*
