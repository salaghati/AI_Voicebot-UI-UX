<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/components/shared/pagination.tsx",
  "source_hash": "5e6ff97ac31e497ac39db7069cca7ff91824ff9c50d2edd2725ac981d757a5dd",
  "last_updated": "2026-03-10T04:11:19.554017+00:00",
  "git_sha": "ab447fe7a9575d8bf60804ecdd149d8e8c5fb488",
  "tokens_used": 5672,
  "complexity_score": 2,
  "estimated_review_time_minutes": 10,
  "external_dependencies": [
    "next/navigation"
  ]
}
```

</details>

[Documentation Home](../../../README.md) > [src](../../README.md) > [components](../README.md) > [shared](./README.md) > **pagination.mdx**

---

# pagination.tsx

> **File:** `src/components/shared/pagination.tsx`

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

This file defines a single exported React function component used on the client (note the "use client" directive). The component signature is exactly: export function Pagination({ total, page, pageSize }: { total: number; page: number; pageSize: number }) { ... }. It accepts numeric props describing the total number of items, the current page index, and the page size, computes the total number of pages with Math.max(1, Math.ceil(total / pageSize)), and renders previous/next buttons and a text summary (the labels are hard-coded in Vietnamese).

Internally the component uses Next.js navigation hooks to drive client-side navigation: usePathname to get the current path, useSearchParams to read existing query parameters, and useRouter to push a new URL when the page changes. The setPage function clones the current URLSearchParams, sets the "page" parameter to the requested page number, and calls router.push(`${pathname}?${q.toString()}`). It relies on an internal UI Button component (imported from "@/components/ui/button") for the interactive controls and disables the previous/next buttons when the page is at the first or last page. There is no local React state other than using the provided props and navigation hooks; the component performs navigation side-effects via router.push.

## Dependencies

### External Dependencies

| Module | Usage |
| --- | --- |
| `next/navigation` | Imports the hooks usePathname, useRouter, and useSearchParams. usePathname is read to determine the current path used when constructing the new URL; useSearchParams is read and converted to a URLSearchParams instance to preserve existing query parameters while updating the 'page' parameter; useRouter is used to call router.push(...) to navigate client-side to the updated URL. |

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/components/ui/button](../@/components/ui/button.md) | Imports the Button React component which is used to render the 'Trước' (previous) and 'Sau' (next) controls. Buttons receive variant="secondary", size="sm", disabled state based on page bounds, and onClick handlers that call the component's setPage function. |

## 📁 Directory

This file is part of the **shared** directory. View the [directory index](_docs/src/components/shared/README.md) to see all files in this module.

## Architecture Notes

- Client-only functional React component ("use client") using Next.js app-router navigation hooks for client-side URL updates.
- Stateless with respect to React local state: relies entirely on props and Next.js navigation hooks; side effects are navigation pushes via router.push.
- Query parameter management uses URLSearchParams created from useSearchParams().toString() to preserve existing query parameters while updating the 'page' key.
- No explicit error handling or validation for pathname or params; the implementation assumes usePathname and useSearchParams return usable values.

## Usage Examples

### Navigating between pages of a paginated list

Render <Pagination total={100} page={2} pageSize={10} /> inside a page component that reads and passes the current page and pageSize. When the user clicks the 'Sau' button, the onClick handler calls setPage(page + 1), which creates a URLSearchParams copy from the current params, sets 'page' to the new value, and calls router.push(`${pathname}?${q.toString()}`). Expected outcome: the browser navigates client-side to the same pathname with updated query string (e.g., /items?page=3), preserving other existing query parameters. Buttons are disabled when page is <= 1 (previous) or page >= totalPages (next).

## Maintenance Notes

- Edge cases: the code assumes pathname and params are defined. If usePathname() or useSearchParams() can return null/undefined in some app-router states, consider guarding or normalizing those values before constructing the URL.
- Internationalization: UI text is hard-coded in Vietnamese. Externalization or localization might be needed if the app supports multiple languages.
- Testing: unit tests should assert correct totalPages calculation (Math.max(1, Math.ceil(total / pageSize))), disabled states for boundary pages, and that router.push is called with the expected URL when setPage is invoked.
- Potential enhancements: add first/last page buttons, an input to jump to a specific page, or aria attributes for improved accessibility. Also consider replacing router.push with router.replace if navigation history behavior should not accumulate page changes.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/components/shared/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*
