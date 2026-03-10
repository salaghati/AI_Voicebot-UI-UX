<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/app/(console)/kb/usage/page.tsx",
  "source_hash": "3d9145624f54f8ff9bceac23dfe62006e09b093ec3a888062b1bdc06e11a4631",
  "last_updated": "2026-03-10T03:56:02.445273+00:00",
  "git_sha": "9aa9e034759b5ee45eaceb53c24cfa8308fef780",
  "tokens_used": 6807,
  "complexity_score": 3,
  "estimated_review_time_minutes": 10,
  "external_dependencies": [
    "next/link",
    "react",
    "@tanstack/react-query"
  ]
}
```

</details>

[Documentation Home](../../../../../README.md) > [src](../../../../README.md) > [app](../../../README.md) > [(console)](../../README.md) > [kb](../README.md) > [usage](./README.md) > **page.mdx**

---

# page.tsx

> **File:** `src/app/(console)/kb/usage/page.tsx`

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

This file implements a client-side React page component (export default function KbUsagePage()) that queries two data sources: KB usage records and KB documents. It uses react-query (useQuery) to fetch usage data via fetchKbUsage and KB metadata via fetchKbDocs. The component derives a Map (kbMap) from the KB documents to resolve KB titles by id, and renders a table of usage rows (id, kbId, workflow, calls, topIntent) inside a Card UI when data is available. Loading and error states are rendered via the AsyncState component; a retry in the error state triggers usageQuery.refetch() and kbQuery.refetch(). A KbShell wrapper provides page title/description and an actions slot containing a Next.js Link to a filter page.

From an architectural perspective, this is a purely client-side UI page (file contains the "use client" directive). It relies on React hooks (useMemo) for memoizing the id→title Map and react-query for declarative data fetching/caching. The component composes several internal UI primitives (Card, Table/THead/TBody/TH/TD, Button, AsyncState) and navigation via next/link. The code expects the API helpers (fetchKbUsage, fetchKbDocs) to return an object with a .data array (the code accesses kbQuery.data?.data and usageQuery.data?.data). The rendering logic maps usage items and uses item properties as seen in the JSX: item.id, item.kbId, item.workflow, item.calls, item.topIntent. Error handling is minimal and delegated to AsyncState; retry behavior simply refetches both queries.

## Dependencies

### External Dependencies

| Module | Usage |
| --- | --- |
| `next/link` | Uses the default export Link to create client-side navigation links: one to '/kb/usage/filter' wrapping a Button and one per-row linking to `/kb/usage/${item.id}` for the detail view. |
| `react` | Imports useMemo from React to compute and memoize kbMap: new Map((kbQuery.data?.data ?? []).map((item) => [item.id, item.title])). |
| `@tanstack/react-query` | Imports useQuery to perform two data-fetching queries: useQuery({ queryKey: ['kb-usage-list'], queryFn: () => fetchKbUsage() }) and useQuery({ queryKey: ['kb-list'], queryFn: () => fetchKbDocs() }). The component reads isLoading/isError and calls refetch() on retry. |

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/lib/api-client](../@/lib/api-client.md) | Imports fetchKbDocs and fetchKbUsage. These are invoked as the queryFn for the two useQuery calls to retrieve KB documents (kbQuery) and KB usage stats (usageQuery). The code expects each to return an object with a .data array accessed as kbQuery.data?.data and usageQuery.data?.data. |
| [@/features/kb](../@/features/kb.md) | Imports KbShell, used as the top-level layout wrapper for the page. KbShell receives title, description, and actions props and wraps the page content. |
| [@/components/ui/card](../@/components/ui/card.md) | Imports Card which is used to visually contain the table when data is available: <Card>...</Card>. |
| [@/components/ui/table](../@/components/ui/table.md) | Imports Table, TBody, TD, TH, THead and composes the tabular UI. The component builds the table header columns (KB, Workflow, Calls, Top intent, Chi tiết) and maps usageQuery.data?.data to table rows rendering item fields into TD cells. |
| [@/components/ui/button](../@/components/ui/button.md) | Imports Button and uses it inside a Link for the page-level action: <Button variant="secondary">Mở màn filter</Button>. |
| [@/components/shared/async-state](../@/components/shared/async-state.md) | Imports AsyncState and uses it to render loading and error states. For loading the code renders <AsyncState state="loading" />; for errors it renders <AsyncState state="error" onRetry={...} /> and the onRetry handler calls usageQuery.refetch() and kbQuery.refetch(). |

## 📁 Directory

This file is part of the **usage** directory. View the [directory index](_docs/src/app/(console)/kb/usage/README.md) to see all files in this module.

## Architecture Notes

- This file is a Next.js client component as indicated by the "use client" directive; it must run in the browser and cannot be server-side rendered. All data fetching is performed client-side via react-query.
- Data fetching pattern: two parallel useQuery hooks (one for KB usage, one for KB documents). The UI combines their isLoading/isError flags into local isLoading/isError booleans and shows conditional UI (AsyncState for loading/error, Card+Table when data is loaded).
- State derivation: useMemo constructs kbMap with new Map((kbQuery.data?.data ?? []).map((item) => [item.id, item.title])). This avoids recomputing the id→title mapping on every render unless kbQuery.data?.data changes.
- Error handling: delegated to AsyncState. The error retry simply calls refetch() on both queries; there is no granular per-query retry UI or backoff logic in this component.
- Rendering: the component expects usageQuery.data?.data to be an array of items with properties accessed in JSX (id, kbId, workflow, calls, topIntent). It maps these to table rows and uses kbMap.get(item.kbId) ?? item.kbId to display the KB title when available.

## Usage Examples

### Render KB usage list page in the web app

When a user navigates to the KB usage page, the component mounts and triggers two react-query fetches: fetchKbUsage() (queryKey: ['kb-usage-list']) and fetchKbDocs() (queryKey: ['kb-list']). While either query is loading, the page shows <AsyncState state="loading" />. Once both queries succeed, kbQuery.data?.data is converted into kbMap (id→title) and usageQuery.data?.data is mapped to table rows. Each row displays the KB title (kbMap.get(item.kbId) or the raw kbId fallback), workflow, calls, and top intent. Clicking the per-row link navigates via next/link to /kb/usage/{item.id}. If either query errors, AsyncState with state="error" is shown; clicking the retry UI calls usageQuery.refetch() and kbQuery.refetch().

### Open filter UI from the page actions

The KbShell's actions prop contains a Link to '/kb/usage/filter' wrapping a Button. When the user clicks 'Mở màn filter', Next.js client navigation occurs to the filter route without a full page reload. The button uses variant="secondary" as provided by the imported Button component.

## Maintenance Notes

- Performance: kbMap is memoized with useMemo, but mapping usageQuery.data?.data directly into table rows may become slow for large datasets. Consider adding pagination, server-side paging, or virtualization for long lists.
- Data shape assumptions: the component assumes fetchKbDocs() and fetchKbUsage() return objects with a .data array. If the API shape changes (e.g., returns items directly or wraps differently), the component will fail to render. Add type checks or transform functions in the API client to ensure consistent shapes.
- Testing: unit tests should mock react-query hooks or the fetch functions to validate loading/error/success UI states and verify that kbMap resolution fallback (kbMap.get(item.kbId) ?? item.kbId) behaves correctly when metadata is missing.
- Error handling: retry simply refetches both queries; if finer-grained retry behavior or user feedback is required, extend AsyncState or add separate retry controls per query.
- Future enhancements: add accessible table semantics, i18n (strings in Vietnamese are currently hard-coded), and route protection if KB data is sensitive.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/app/(console)/kb/usage/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*
