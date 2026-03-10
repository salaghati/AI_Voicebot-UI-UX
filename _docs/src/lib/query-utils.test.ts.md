<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/lib/query-utils.test.ts",
  "source_hash": "ef203df1612ed3c53823f7412b4570a244cf9e06a637410458748e9b0f948658",
  "last_updated": "2026-03-10T04:22:39.027091+00:00",
  "git_sha": "36a356e69df290793d4b2efd36128bcea74519a3",
  "tokens_used": 5924,
  "complexity_score": 2,
  "estimated_review_time_minutes": 5,
  "external_dependencies": []
}
```

</details>

[Documentation Home](../../README.md) > [src](../README.md) > [lib](./README.md) > **query-utils.test**

---

# query-utils.test.ts

> **File:** `src/lib/query-utils.test.ts`

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

This file is a Jest-style test suite that verifies a small set of helper functions imported from @/lib/query-utils. It contains three test cases: one that asserts parseFilterParams correctly converts URLSearchParams into a typed filter object (including numeric conversion for page and pageSize), one that checks applyFilter, applySort and paginate together against a small in-memory array of items, and one that ensures preserveQuery appends an existing URLSearchParams instance to a given path.

The tests are small and focused: parseFilterParams is exercised with a URLSearchParams string that includes search, page, pageSize and a non-ASCII status value; the filter/sort/pagination flow uses an array of plain objects with keys id, name, status, and type to assert basic search-by-key behavior, sort-by-field with direction token ("name:asc"), and pagination returning an object with items and total. The preserveQuery test demonstrates how a URLSearchParams containing multiple keys is serialized and appended to a path. There are no external network, file, or database interactions in this file — it operates purely on in-memory objects and the built-in URLSearchParams API.

## Dependencies

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/lib/query-utils](../@/lib/query-utils.md) | Imports the named exports applyFilter, applySort, paginate, parseFilterParams, preserveQuery which are exercised by the tests to validate parsing of URLSearchParams, filtering by search across specified keys, sorting by a "field:direction" token, paginating results (returning items and total), and producing a path with serialized query string. |

## 📁 Directory

This file is part of the **lib** directory. View the [directory index](_docs/src/lib/README.md) to see all files in this module.

## Architecture Notes

- This file implements unit tests using the Jest BDD-style API (describe/it/expect). The tests exercise pure functions from an internal module without side effects.
- Test inputs are small in-memory arrays and URLSearchParams instances, which keeps tests deterministic and fast; no asynchronous behavior or external integrations are present.
- Error handling and edge cases are not covered here (e.g., invalid page/pageSize values, empty inputs, sort tokens with unexpected formats), so the tests document only the expected happy-path behaviors.

## Usage Examples

### Validate parsing of URL query params into typed filter object

Construct a URLSearchParams from a query string like "search=abc&page=2&pageSize=5&status=Nháp" and pass it to parseFilterParams. The test asserts the returned object contains search: "abc", page: 2, pageSize: 5, and status: "Nháp". This demonstrates that parseFilterParams is expected to map string parameters to appropriate typed fields (numbers for page/pageSize).

### Filter, sort and paginate a small dataset

Given an array of items [{id,name,status,type}, ...], call applyFilter(items, {search: 'a'}, ['name']) to produce a filtered array (the test expects length 1). Then sort the original items with applySort(items, 'name:asc') and assert the first element is the item with name 'A'. Finally call paginate(sorted, 1, 2) and assert the returned object has items length 2 and total equal to 3. This sequence validates the integration of filter/sort/paginate behaviors on in-memory data.

### Preserve and append query when switching routes

Create a URLSearchParams with keys like search=WF and state=error, then call preserveQuery('/workflow/.../session', query). The test asserts the result is '/workflow/.../session?search=WF&state=error', showing preserveQuery serializes and appends the query string to a path.

## Maintenance Notes

- Add tests for edge cases: non-numeric page/pageSize values, missing parameters, empty search, case-sensitivity of applyFilter, and sort tokens with unexpected formats (e.g., missing direction).
- Consider adding tests for preserveQuery when the input path already contains a query string or a fragment identifier to ensure correct merging/encoding behavior.
- Be mindful of Unicode and percent-encoding behavior in URLSearchParams when status or search contain non-ASCII characters; current test covers a non-ASCII status but not percent-encoding round-trips.
- If the implementation of the utilities changes (e.g., different sort token format or multi-field search), update these tests to reflect the new contract to avoid false positives.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/lib/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*
