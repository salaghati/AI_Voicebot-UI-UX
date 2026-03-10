<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/components/shared/list-controls.tsx",
  "source_hash": "1ac3edc71d4ddc3c5197836aef29f03c21357e45a25b05f51cba415d56195df3",
  "last_updated": "2026-03-10T04:11:22.769342+00:00",
  "git_sha": "1b28b2a94756313a230ad681a6cccd88bf954367",
  "tokens_used": 6154,
  "complexity_score": 2,
  "estimated_review_time_minutes": 10,
  "external_dependencies": [
    "react",
    "next/navigation"
  ]
}
```

</details>

[Documentation Home](../../../README.md) > [src](../../README.md) > [components](../README.md) > [shared](./README.md) > **list-controls.mdx**

---

# list-controls.tsx

> **File:** `src/components/shared/list-controls.tsx`

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

This file exports a single React functional component ListControls which renders an input for free-text search and three select controls for status, type, and sort order. It reads current query parameters from Next.js navigation hooks, builds a small model object (search, status, type, sort) memoized with useMemo, and updates the URL query string when controls change so the UI state is encoded in the URL.

The component is designed to be used in list or table pages where filters and sort order should be shareable via URL and persistent across navigation. It uses next/navigation hooks (usePathname, useRouter, useSearchParams) to read and push URL changes and two internal UI primitives (Input and Select) for rendering controls. Important behavior: when any of the filter or sort keys (search, status, type, sort) are changed, the component resets the page query parameter to "1" to ensure navigation returns to the first page of results.

## Dependencies

### External Dependencies

| Module | Usage |
| --- | --- |
| `react` | Imports useMemo from "react" to memoize the derived model object that contains search, status, type, and sort values based on URL search params to avoid recomputing on every render. |
| `next/navigation` | Imports usePathname, useRouter, and useSearchParams from "next/navigation". useSearchParams is used to read current URL query parameters; usePathname provides the current path to build the push target; useRouter provides router.push to navigate to the updated URL when controls change. |

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/components/ui/input](../@/components/ui/input.md) | Imports Input — an internal UI component used to render the text search field. It is bound to model.search and its onChange handler calls update("search", event.target.value) to synchronize the search query parameter. |
| [@/components/ui/select](../@/components/ui/select.md) | Imports Select — an internal UI component used to render dropdowns for status, type, and sort. Each Select's value is bound to the corresponding model property and its onChange handler calls update with the respective key to update URL parameters. |

## 📁 Directory

This file is part of the **shared** directory. View the [directory index](_docs/src/components/shared/README.md) to see all files in this module.

## Architecture Notes

- This is a client-side ("use client") React component intended to run in the browser; it relies on Next.js client navigation hooks and does not hold React state beyond the memoized model derived from URL params.
- State is encoded entirely in the URL search parameters (search, status, type, sort). The component reads from useSearchParams and writes updates by constructing a new URLSearchParams instance and calling router.push with `${pathname}?${next.toString()}`.
- When a filter or sort changes (keys: search, status, type, sort), the implementation explicitly resets the `page` query parameter to "1" to ensure result pagination returns to the first page. There is no debounce on the search input, so each change triggers router.push immediately.
- Error handling is minimal; update() deletes a param when given an empty value and sets others as strings. The code assumes pathname and params are available from next/navigation; callers should ensure the component is rendered in a Next.js client page context.

## Usage Examples

### Rendering the controls on a list page with known statuses and types

Import and render <ListControls statuses={["Open","Closed"]} types={["Bug","Feature"]} /> on a Next.js page. When the user types in the search Input, update("search", ...) is called which updates the `search` query parameter and also sets `page=1`. When the user selects a status or type, the corresponding query parameter (`status` or `type`) is set and `page` is reset to "1". Selecting a sort option sets `sort` (e.g., `updatedAt:desc`) and also resets `page`.

### Deep-linking and restoring UI state from URL

If the user visits /items?search=alpha&status=Open&type=Bug&sort=updatedAt:desc, useSearchParams will provide these values. The memoized model populates the Input and Select controls with these values so the UI reflects the query parameters immediately. Changing any control updates the URL so that the current filter/sort can be bookmarked or shared.

## Maintenance Notes

- Performance: The search input triggers router.push on every change; consider debouncing input updates or only updating on Enter to reduce navigation churn and improve UX.
- Edge cases: Ensure pathname returned by usePathname is defined in all contexts where this component is used. If pathname can be null/undefined, guard or fallback before calling router.push to avoid constructing an invalid URL.
- Compatibility: The component expects Input and Select to accept value and onChange props with event.target.value semantics. If those internal primitives change API, this component will need updating.
- Testing: Add unit tests that mock useSearchParams/useRouter/usePathname to verify that update() sets, deletes, and resets `page` correctly and that router.push is called with the expected URL string.
- Enhancements: Add localization support for the Vietnamese labels, make sort options data-driven, add keyboard accessibility improvements, and consider preserving other unrelated query params when updating filters.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/components/shared/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*
