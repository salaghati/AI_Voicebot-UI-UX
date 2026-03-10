<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/components/modules/entity-list-page.tsx",
  "source_hash": "087735a6577f843eea5334ddb2940a911c6372f5e74deacff08df14a767106be",
  "last_updated": "2026-03-10T04:10:48.602484+00:00",
  "tokens_used": 13409,
  "complexity_score": 5,
  "estimated_review_time_minutes": 20,
  "external_dependencies": [
    "next/link",
    "react",
    "next/navigation",
    "@tanstack/react-query",
    "lucide-react",
    "sonner"
  ]
}
```

</details>

[Documentation Home](../../../README.md) > [src](../../README.md) > [components](../README.md) > [modules](./README.md) > **entity-list-page.mdx**

---

# entity-list-page.tsx

> **File:** `src/components/modules/entity-list-page.tsx`

![Complexity: Medium](https://img.shields.io/badge/Complexity-Medium-yellow) ![Review Time: 20min](https://img.shields.io/badge/Review_Time-20min-blue)

## 📑 Table of Contents


- [Overview](#overview)
- [Dependencies](#dependencies)
- [Architecture Notes](#architecture-notes)
- [Usage Examples](#usage-examples)
- [Maintenance Notes](#maintenance-notes)
- [Functions and Classes](#functions-and-classes)

---

## Overview

This file implements a client-side React component that displays a configurable list page for entities with id and optional status fields. It declares two helper functions (readParams and toMessage) and a generic exported component EntityListPage<T extends { id: string; status?: string }> together with the TypeScript interfaces EntityColumn<T> and EntityListPageProps<T>. The component reads URL search parameters (search, status, type, sort, page, pageSize, state) via Next.js navigation hooks, passes them to a provided fetcher function (via react-query's useQuery) and renders common UI pieces: a header with optional create/export actions, optional tabs, list controls, state switcher, async states (loading/empty/error/forbidden), a table built from a columns array, status badges (mapping status -> tone via mapStatusTone), row action buttons (view/edit/copy/delete) and a pagination control.

EntityListPage is designed as a composition wrapper: the consumer supplies the fetcher (fetcher: (params: FilterParams) => Promise<ApiResult<Paginated<T>>>), column definitions (columns: EntityColumn<T>[]), optional routes (createHref, detailHref), and optional UI toggles (showCreate, showRowActions). It relies on react-query for data fetching lifecycle (isLoading/isError/isFetching) and handles error messaging via toMessage() and a Sonner toast used for immediate UI feedback on mock actions. Important design decisions: the component is client-only ("use client" pragma), it is generic over the entity type T but enforces id:string (and optional status), and it defers actual data fetching logic to the provided fetcher so it can be reused across many entity types without coupling to a particular API implementation.

## Dependencies

### External Dependencies

| Module | Usage |
| --- | --- |
| `next/link` | Imports the Link component to render client-side navigation anchors (used for create action, tabs, and linking each row to a detail page). |
| `react` | Imports useMemo from React to memoize reading URL search params into FilterParams to avoid recalculating on every render. |
| `next/navigation` | Imports usePathname and useSearchParams to access the current path and URLSearchParams from Next.js client navigation; used to determine active tab and build fetch parameters. |
| `@tanstack/react-query` | Imports useQuery to perform and cache the asynchronous fetch (queryKey is [queryKey, params], queryFn calls the provided fetcher(params)). React Query state (isLoading, isError, isFetching, data, error, refetch) drives UI states and retry behavior. |
| `lucide-react` | Imports icon components (Download, Pencil, Plus, Trash2, Copy, Eye) used as inline SVG icons for action buttons in the header and row actions. |
| `sonner` | Imports toast to show small success messages for mock actions (export, edit open, copy, delete), used directly in click handlers for buttons. |

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/types/domain](../@/types/domain.md) | Imports TypeScript types ApiResult, FilterParams, Paginated which describe the expected shapes for fetcher input and response (FilterParams fields: search,status,type,sort,page,pageSize,state; ApiResult/ Paginated used to type the data returned by the fetcher). This is an internal project alias import. |
| [@/components/shared/page-header](../@/components/shared/page-header.md) | Imports PageHeader UI component used at the top of the page to show title, description and action buttons (Export and optional Create). |
| [@/components/ui/card](../@/components/ui/card.md) | Imports Card component used as a visual container for controls and the table area. |
| [@/components/ui/button](../@/components/ui/button.md) | Imports Button UI component used for header actions and per-row action buttons (variants: secondary, ghost, sizes: sm). |
| [@/components/shared/list-controls](../@/components/shared/list-controls.md) | Imports ListControls component which is rendered inside the Card and receives statuses and types props to drive filters (this file passes statuses and types from props). |
| [@/components/shared/state-switcher](../@/components/shared/state-switcher.md) | Imports StateSwitcher component which is rendered to allow toggling global state (rendered after ListControls). |
| [@/components/shared/async-state](../@/components/shared/async-state.md) | Imports AsyncState component used to render loading, empty, error, and forbidden screens. The component is invoked with appropriate 'state' strings and optional message and onRetry handler. |
| [@/components/shared/pagination](../@/components/shared/pagination.md) | Imports Pagination component used at the bottom of the table; it receives total, page, and pageSize derived from the paginated response (query.data?.data.total / page / pageSize). |
| [@/components/ui/badge](../@/components/ui/badge.md) | Imports Badge UI component to display the item's status column; if item.status is present the code renders <Badge tone={mapStatusTone(item.status)}>{item.status}</Badge> else a placeholder Badge. |
| [@/components/ui/table](../@/components/ui/table.md) | Imports table primitives Table, TBody, TD, TH, THead used to construct the table markup, headers (from columns plus status and actions) and rows rendered from query.data?.data.items. |
| [@/lib/mappers](../@/lib/mappers.md) | Imports mapStatusTone to convert an item's status string into a badge tone (visual mapping) used when rendering the status Badge for each row. |
| [@/lib/utils](../@/lib/utils.md) | Imports cn (className helper) to conditionally compose class names for tab rendering (active vs inactive styles). |

## 📁 Directory

This file is part of the **modules** directory. View the [directory index](_docs/src/components/modules/README.md) to see all files in this module.

## Architecture Notes

- This is a client-only React functional component (file begins with "use client") and relies on Next.js client-side navigation hooks (usePathname, useSearchParams). It delegates data retrieval to a consumer-provided fetcher and uses react-query (useQuery) for async state, caching and refetch behavior.
- The component uses TypeScript generics (EntityListPage<T extends { id: string; status?: string }>) to remain reusable across entity types while enforcing each entity has an id and optionally a status. It composes many internal UI primitives (Card, Table, Button, Badge) rather than implementing styling directly.
- Error and loading states are surfaced via a centralized AsyncState component and toast messages for immediate feedback. URL search parameters are parsed into a typed FilterParams object by readParams(), which is memoized to avoid unnecessary refetch triggers.
- Row actions are optimistic/mock interactions: edit/copy/export show toast messages; delete asks window.confirm and then shows a mock toast. This indicates the component presents a UI contract but expects real CRUD operations to be wired by the consumer (the fetcher handles read; no mutation logic is provided).

## Usage Examples

### Render a paginated list of projects

Provide a fetcher that accepts FilterParams and returns ApiResult<Paginated<Project>>; create an array of columns implementing EntityColumn<Project> where each column.render returns JSX for the cell. Call <EntityListPage<Project> title="Projects" description="All projects" queryKey="projects" fetcher={fetchProjects} columns={projectColumns} createHref="/projects/new" detailHref={(p) => `/projects/${p.id}`} />. The component will read URL params (page, pageSize, search, status, type, sort, state), fetch data, render the table, and display pagination controls. Error states are shown via AsyncState; you can call query.refetch() through the AsyncState retry handler (wired internally).

### Use custom status mapping and hide create action

Pass statuses prop to allow the ListControls to present status filters and set showCreate={false} to hide the create button. Ensure your fetcher reads and applies the status and type values from FilterParams so server filtering matches the UI. The status Badge tone is determined by mapStatusTone; if your status vocabulary differs, update mapStatusTone implementation (in @/lib/mappers) to reflect your statuses.

## Maintenance Notes

- Performance: react-query caches responses keyed by [queryKey, params]; ensure queryKey is stable and params only change when relevant (readParams uses useMemo). Large tables rely on server-side pagination (page/pageSize) - avoid fetching very large pageSize values.
- Accessibility & i18n: Several user-facing strings are hard-coded in Vietnamese (e.g., 'Có lỗi xảy ra', button titles). Extract strings to i18n resources if localization is required. Ensure button titles and aria attributes are added if needed for a11y.
- Testing: Unit-test readParams to ensure URLSearchParams mapping is correct, and test EntityListPage by mocking the fetcher to return various paginated shapes (empty, error, forbidden-like messages containing 'quyền' or '403'). Integration tests should verify correct query keys and that pagination and tab active state respond to pathname/search params.
- Future enhancements: Provide hooks or props for real mutation handlers (onEdit, onDelete, onCopy) rather than in-component toast mocks. Allow customization of the row actions set or injection of additional per-row menus. Consider extracting the row rendering into a renderRow prop for more complex rows.
- Dependencies: Keep @tanstack/react-query and next at compatible versions with Next.js App Router client components. If updating UI primitives, verify prop shapes (Button variants, Table primitives) remain the same.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/components/modules/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*


---

## Functions and Classes


#### function readParams

![Type: Sync](https://img.shields.io/badge/Type-Sync-green)

### Signature

```typescript (tsx)
function readParams(searchParams: URLSearchParams): FilterParams
```

### Description

Constructs and returns a FilterParams object by reading specific keys from a URLSearchParams instance and converting page/pageSize to numbers.


The function reads a fixed set of query parameter names from the provided URLSearchParams: 'search', 'status', 'type', 'sort', 'page', 'pageSize', and 'state'. For each string-valued parameter except 'page' and 'pageSize', it returns the parameter's value or undefined when the parameter is absent or empty. For 'page' and 'pageSize', it converts the parameter (or a fallback string) to a Number and returns numeric values; defaults are '1' for page and '10' for pageSize if the parameters are missing. The returned object shape matches the FilterParams type.

### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `searchParams` | `URLSearchParams` | ✅ | The URLSearchParams instance to read query parameters from.
<br>**Constraints:** Should be a valid URLSearchParams object, Function does not validate parameter value formats beyond converting 'page' and 'pageSize' to numbers |

### Returns

**Type:** `FilterParams`

An object containing keys: search, status, type, sort, page, pageSize, and state. String parameters are returned as string or undefined; page and pageSize are returned as numbers (with defaults if absent).


**Possible Values:**

- search: string | undefined
- status: string | undefined
- type: string | undefined
- sort: string | undefined
- page: number (defaults to 1 if missing or empty)
- pageSize: number (defaults to 10 if missing or empty)
- state: string | undefined

### Usage Examples

#### Read filter params from the current window location's query string

```typescript (tsx)
const params = new URLSearchParams(window.location.search);
const filters = readParams(params);
```

Creates a URLSearchParams from the current URL and uses readParams to produce a FilterParams object with converted page and pageSize.

#### Read params from an explicit query string

```typescript (tsx)
const params = new URLSearchParams('search=foo&page=2&pageSize=20&status=active');
const filters = readParams(params); // { search: 'foo', status: 'active', type: undefined, sort: undefined, page: 2, pageSize: 20, state: undefined }
```

Demonstrates how missing keys become undefined and numeric strings are converted to numbers.

### Complexity

Time complexity O(1) — constant number of URLSearchParams.get calls; Space complexity O(1) — returns a small object with a fixed number of properties.

### Notes

- The function does not perform validation beyond Number(...) conversion for page and pageSize; invalid numeric strings will produce NaN.
- For absent string parameters it intentionally returns undefined rather than an empty string to make presence checks straightforward.
- FilterParams type must be defined elsewhere in the codebase; this function assumes that shape.

---



#### function toMessage

![Type: Sync](https://img.shields.io/badge/Type-Sync-green)

### Signature

```typescript (tsx file)
function toMessage(error: unknown): string
```

### Description

Return a human-readable message extracted from an Error object, or a fallback Vietnamese message if the input is not an Error.


The function accepts a single argument of type unknown. It checks whether the provided value is an instance of the built-in Error class using the instanceof operator. If the check succeeds, it returns the Error object's message property. If the check fails, it returns the fixed Vietnamese string "Có lỗi xảy ra" (which means "An error occurred"). The implementation has no side effects and performs only this conditional check and return.

### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `error` | `unknown` | ✅ | The value to inspect for an error message. If this is an Error instance, its message will be returned.
<br>**Constraints:** Can be any value; only instances of Error will yield a specific message, If error is an Error, its message property is returned (may be empty string) |

### Returns

**Type:** `string`

Either the message property from the provided Error instance, or a fallback Vietnamese string when the input is not an Error.


**Possible Values:**

- error.message (when error is an instance of Error)
- "Có lỗi xảy ra" (when error is not an Error instance)

### Usage Examples

#### When you have an Error object and want its message

```typescript (tsx file)
const msg = toMessage(new Error('Network failed'))
```

Returns 'Network failed' because the input is an Error instance.

#### When the input is not an Error (e.g., null, string, object)

```typescript (tsx file)
const msg = toMessage(null)
```

Returns 'Có lỗi xảy ra' as the fallback message.

### Complexity

O(1) time and O(1) space — performs a single instanceof check and returns a string.

### Related Functions

- `N/A` - No other functions are called by this implementation; can be used as a helper where error-to-message conversion is needed.

### Notes

- The fallback message is a hard-coded Vietnamese string: "Có lỗi xảy ra".
- The function does not inspect non-Error objects for message-like properties (e.g., it will not return a 'message' property from plain objects).
- Because the parameter type is unknown, callers may pass any value; only Error instances produce their message.

---


