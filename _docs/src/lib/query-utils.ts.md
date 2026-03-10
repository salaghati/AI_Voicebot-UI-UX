<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/lib/query-utils.ts",
  "source_hash": "d4e6e15d1306d5abcc2fee014d9ccc992fd0dcce7ef98de74106d58582e0ef71",
  "last_updated": "2026-03-10T04:22:31.824896+00:00",
  "git_sha": "7f7f4959528e43955d83e22fa42cca803cf657bc",
  "tokens_used": 6200,
  "complexity_score": 3,
  "estimated_review_time_minutes": 10,
  "external_dependencies": []
}
```

</details>

[Documentation Home](../../README.md) > [src](../README.md) > [lib](./README.md) > **query-utils**

---

# query-utils.ts

> **File:** `src/lib/query-utils.ts`

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

This file implements a set of pure utility functions focused on list/query manipulation: parseFilterParams converts a URLSearchParams instance into a typed FilterParams object (using the imported FilterParams type), applyFilter performs case-insensitive text search across specified fields and exact-match filtering for status and type, applySort performs a lexicographic sort on a specified field and direction, paginate slices an array into pages and returns paging metadata, and preserveQuery appends the current query string to a base path when needed. All functions are implemented to operate on in-memory arrays and primitives, with generic typing used for applyFilter and applySort to preserve input item shapes.

These utilities are intended for UI components or lightweight server-side list handlers that need consistent behavior for user-facing list interactions (search, filter, sort, paginate). parseFilterParams reads query parameters 'page' and 'pageSize' and falls back to sensible defaults (1 and 10) when parsing fails (NaN), and maps optional string parameters directly; applyFilter expects the caller to pass the set of keys (searchFields) to search over, and it casts property values to strings for matching; applySort uses simple string comparisons and returns a new array (non-mutating) so callers won't see side effects from sorting. The module does not perform network or database IO and only depends on the project's FilterParams type for typing.

## Dependencies

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/types/domain](../@/types/domain.md) | Imports the FilterParams TypeScript type (import type { FilterParams } from "@/types/domain"). FilterParams is used as the return type of parseFilterParams and as the type for the params argument in applyFilter to ensure callers supply/expect the same query shape. |

## 📁 Directory

This file is part of the **lib** directory. View the [directory index](_docs/src/lib/README.md) to see all files in this module.

## Architecture Notes

- Pure functional utilities: functions accept inputs and return results without mutating the provided arrays (applySort returns a shallow copy before sorting).
- Type-driven design: uses a project-internal FilterParams type for consistent query parameter shapes and generics (T extends object) plus Array<keyof T> to allow typed search over specified fields.
- In-memory processing pipeline intended for small-to-moderate datasets. Typical usage is sequential: parseFilterParams -> applyFilter -> applySort -> paginate -> preserveQuery for link generation.
- Error handling: lightweight fallback strategy for numeric parsing (page and pageSize default to 1 and 10 on NaN) and graceful handling of missing properties by casting values to String(... ?? "").
- Sorting and comparison use simple lexicographic string comparison (String(...) coerced), so numeric or date semantics are not honored and should be handled upstream or extended if needed.

## Usage Examples

### Rendering a paginated, searchable list in a client UI

1) Call parseFilterParams(location.searchParams) to get a FilterParams object from the current URL. 2) Pass your full items array, the FilterParams result, and a list of fields to search (e.g., ['name', 'description']) into applyFilter(items, params, ['name','description']) to produce a filtered array. 3) Optionally pass that array and params.sort into applySort(filteredItems, params.sort) to order results. 4) Use paginate(sortedOrFilteredItems, params.page, params.pageSize) to get a page of items and metadata ({ items, total, page, pageSize }). 5) Use preserveQuery('/items', location.searchParams) to build links that keep current query state when navigating.

## Maintenance Notes

- Performance: All filtering and sorting are done in-memory; for large datasets this can be slow. Consider moving filtering/sorting/pagination to the server or using indexed data structures if lists grow large.
- Sorting semantics: applySort uses String coercion and lexicographic comparison. Numeric, boolean, or date fields will not sort as expected; add type-aware comparators if required (e.g., parse numbers/dates before comparison).
- Search limitations: applyFilter lowercases values for case-insensitive substring search but coerces target fields with String(...). It does not support nested/path fields (like 'owner.name') or fuzzy matching. Caller must supply correct keys in searchFields and ensure they map to primitive values or override behavior.
- Edge cases to test: missing or malformed 'page'/'pageSize' query values (NaN fallback), empty searchFields array, sort strings missing a direction (e.g., 'name' yields undefined direction), properties that are undefined/null on items, and very large arrays for paginate behavior.
- Possible enhancements: support multi-field/multi-criteria sorting, type-aware sort comparators (number/date), nested property access, debounce helpers for search usage in UI, and an option to do stable sorting.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/lib/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*
