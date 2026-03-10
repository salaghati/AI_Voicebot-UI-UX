<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/app/(console)/kb/usage/[id]/page.tsx",
  "source_hash": "aa946486d83334d643c1eeb6f38b33d2d5278cf8347106984eb4184ecc4a334d",
  "last_updated": "2026-03-10T03:54:57.189035+00:00",
  "git_sha": "aa34259e3ac69e3cb4ab12d95c776fb28e5b4736",
  "tokens_used": 6946,
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

[Documentation Home](../../../../../../README.md) > [src](../../../../../README.md) > [app](../../../../README.md) > [(console)](../../../README.md) > [kb](../../README.md) > [usage](../README.md) > [[id]](./README.md) > **page.mdx**

---

# page.tsx

> **File:** `src/app/(console)/kb/usage/[id]/page.tsx`

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

This file exports a single React client component KbUsageDetailPage (a default export) that is designed to run in the browser (note the "use client" directive). The component uses Next.js routing to read the dynamic route parameter id (via useParams), then issues two react-query queries: one to load KB usage records (fetchKbUsage) and one to load KB documents metadata (fetchKbDocs). It derives a single usage record by matching the route id against usageQuery.data?.data and derives a human-readable KB title by matching record.kbId against kbQuery.data?.data. The UI is composed using the project's KbShell wrapper and Card components, and it uses the AsyncState component to render loading, error, and empty states.

The component's responsibilities are: (1) orchestrate data fetching via react-query using internal API client helpers (fetchKbUsage and fetchKbDocs), (2) compute derived values (record and kbTitle) with useMemo to avoid unnecessary recomputation, and (3) render the detail view including session metadata fields observed in the code (kbId, workflow, calls, topIntent) and two static sample conversation bubbles. Error handling is explicit: isLoading and isError are computed by OR-ing the corresponding flags from both queries, and AsyncState's onRetry triggers both usageQuery.refetch() and kbQuery.refetch(). The file intentionally uses a static queryKey for each list fetch ("kb-usage-detail" and "kb-list") and resolves the detail record client-side by searching the arrays returned by those queries.

## Dependencies

### External Dependencies

| Module | Usage |
| --- | --- |
| `react` | Imports useMemo: used to memoize derived values (record and kbTitle) to prevent recomputation across renders when their dependencies haven't changed. |
| `next/navigation` | Imports useParams: used to read the dynamic route parameter id (typed as { id: string }) for finding the relevant KB usage record. |
| `@tanstack/react-query` | Imports useQuery: used to declare two queries (one keyed ['kb-usage-detail'] with queryFn fetchKbUsage, the other keyed ['kb-list'] with queryFn fetchKbDocs). The returned query objects provide data, isLoading, isError, and refetch methods used by the component. |

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/lib/api-client](../@/lib/api-client.md) | Imports fetchKbDocs and fetchKbUsage: these internal API client functions are supplied as queryFn to useQuery to load the list of KB documents and the list of KB usage records respectively. The component relies on the shape of returned data arrays (usage items containing id, kbId, workflow, calls, topIntent; doc items containing id and title). |
| [@/features/kb](../@/features/kb.md) | Imports KbShell: an internal presentational/container component used to wrap the page content and supply the page title and description props for layout/styling. |
| [@/components/ui/card](../@/components/ui/card.md) | Imports Card: an internal UI primitive used to render grouped information panels (session information, sample conversation) with consistent styling. |
| [@/components/shared/async-state](../@/components/shared/async-state.md) | Imports AsyncState: an internal component used to render three UI states—loading, error (with an onRetry handler that calls usageQuery.refetch() and kbQuery.refetch()), and empty—based on isLoading/isError/record presence. |

## 📁 Directory

This file is part of the **[id]** directory. View the [directory index](_docs/src/app/(console)/kb/usage/[id]/README.md) to see all files in this module.

## Architecture Notes

- This is a React client component (file begins with "use client") and relies on React hooks and react-query for data fetching and local derived state. It is designed as a pure UI layer: fetching is delegated to react-query and internal API helpers (fetchKbUsage/fetchKbDocs).
- Derived state uses useMemo to compute the detail record and the KB title from arrays returned by the list queries. The component combines isLoading/isError flags from both queries using logical OR to decide which AsyncState to render.
- Error handling uses AsyncState with a retry callback that explicitly calls refetch() on both queries. The component performs client-side filtering (Array.find) to locate the specific record; this implies the server-side queries return full lists rather than a single item by id.
- State management is intentionally lightweight: react-query holds fetched data and status; the component does not introduce additional local state beyond memoized derived values. UI composition follows presentational patterns (KbShell -> Cards -> content).

## Usage Examples

### Render KB usage detail for route /kb/usage/[id]

When the page is mounted at a route that supplies an id parameter, useParams() reads { id }. Two useQuery hooks run in parallel: one fetching usage records (fetchKbUsage) and one fetching KB documents (fetchKbDocs). While either query is loading, AsyncState with state="loading" renders. If either query errors, AsyncState with state="error" renders and provides an onRetry callback that calls usageQuery.refetch() and kbQuery.refetch(). Once both queries succeed, the component computes record = usageQuery.data?.data.find(item => item.id === params.id). If record is not found, AsyncState with state="empty" renders. If record exists, the UI renders two Card components: one listing session metadata (KB title resolved from kbQuery.data?.data, KB ID, workflow, calls, topIntent) and another showing two static sample conversation messages. This flow expects the query responses to contain arrays under data and items with properties id, kbId, workflow, calls, topIntent for usage items and id, title for KB docs.

## Maintenance Notes

- Performance: the component uses Array.find over arrays returned from list queries. If the lists can grow large, consider adding server-side endpoint(s) to fetch a single usage record and/or fetch the KB title by id to avoid transferring and searching large arrays on the client.
- Query keys are static arrays (['kb-usage-detail'] and ['kb-list']). For more granular cache and refetch control, include parameters (for example the record id) in the key so react-query can cache per-ID and fetch only what is needed.
- Testing: component should be tested with mocked react-query providers and mocked fetchKbDocs/fetchKbUsage functions; test cases should cover loading, error, empty (record not found), and success states. Verify that onRetry calls refetch() on both queries.
- Edge cases: code assumes usageQuery.data and kbQuery.data have a .data array property. If API client changes shape (e.g., returns array directly), adjust the accessors. The UI shows static sample conversation text; if dynamic conversation content is later added, ensure message content is sanitized/escaped if inserted from external sources.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/app/(console)/kb/usage/[id]/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*
