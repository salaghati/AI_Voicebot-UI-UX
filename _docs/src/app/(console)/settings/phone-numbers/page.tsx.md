<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/app/(console)/settings/phone-numbers/page.tsx",
  "source_hash": "69aef1a45067b286f6f2ab3f324cdbcd37c5ce1afc9e521beaa007c4ffcc2c79",
  "last_updated": "2026-03-10T04:01:54.781838+00:00",
  "git_sha": "cc42489e0e06e2e6018d1362238cafaf8c79bfd8",
  "tokens_used": 8197,
  "complexity_score": 3,
  "estimated_review_time_minutes": 10,
  "external_dependencies": [
    "react",
    "lucide-react",
    "@tanstack/react-query",
    "sonner"
  ]
}
```

</details>

[Documentation Home](../../../../../README.md) > [src](../../../../README.md) > [app](../../../README.md) > [(console)](../../README.md) > [settings](../README.md) > [phone-numbers](./README.md) > **page.mdx**

---

# page.tsx

> **File:** `src/app/(console)/settings/phone-numbers/page.tsx`

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

This file exports a single React component SettingsPhoneNumbersPage which is a client-side page ("use client" directive) used inside the settings area of the application. It fetches phone number data with a react-query query (fetchPhoneNumbers), stores UI state with React hooks (selected context, newNumber input, searchQuery, pagination page and pageSize), derives filtered and paginated result sets with useMemo, and renders controls (Select, Input, Buttons) and a Table of numbers. The component uses toast notifications for user feedback and relies on local project UI components (SettingsShell, Card, Button, Input, Select, Table, AsyncState) for layout and consistent styling.

The component's primary responsibilities are: (1) fetching phone numbers from an API client and mapping that data into a filtered/paginated view, (2) providing UI controls for context switching (three contexts), searching by number substring, page size selection and page navigation, and (3) offering mock actions such as Add, Import, Export, Apply Config and Delete which currently produce toasts instead of performing server-side mutations. Important implementation details: query.data is expected to hold an object with a data array (the code uses query.data?.data ?? []); items are filtered by item.context === context and by item.number.includes(q) where q is the trimmed/lowercased searchQuery; pagination uses Math.ceil(filtered.length / pageSize) and Array.slice for current page results; loading and error states are handled by rendering an AsyncState component and exposing query.refetch for retry.

## Dependencies

### External Dependencies

| Module | Usage |
| --- | --- |
| `react` | Imports useMemo and useState to manage component state and derive memoized filtered lists. is_external: true |
| `lucide-react` | Imports icon components (Download, RefreshCw, Search, Trash2, Upload) used inline in buttons and inputs to provide visual affordances. is_external: true |
| `@tanstack/react-query` | Imports useQuery to fetch phone numbers (queryKey: ['settings-phone-numbers'] with queryFn: fetchPhoneNumbers) and useQueryClient to invalidate queries when the refresh button is clicked. is_external: true |
| `sonner` | Imports toast which is used for all user-facing notifications in the component: success and error toasts for add/import/export/apply/delete actions. is_external: true |

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/lib/api-client](../@/lib/api-client.md) | Imports fetchPhoneNumbers which is passed as the queryFn to useQuery and is the single source of phone number data for the page. This is an internal API client module. is_external: false |
| [@/features/settings](../@/features/settings.md) | Imports SettingsShell, used as the page-level layout wrapper providing title, description and section metadata for the settings area. is_external: false |
| [@/components/ui/card](../@/components/ui/card.md) | Imports Card to contain the settings controls and table; used as the main panel element. is_external: false |
| [@/components/ui/input](../@/components/ui/input.md) | Imports Input used for the new number input and the search field. is_external: false |
| [@/components/ui/select](../@/components/ui/select.md) | Imports Select used for choosing context and selecting pageSize. is_external: false |
| [@/components/ui/button](../@/components/ui/button.md) | Imports Button used for Add, Import, Export, Refresh, pagination controls and Apply Config actions. is_external: false |
| [@/components/ui/table](../@/components/ui/table.md) | Imports Table, TBody, TD, TH, THead to render the phone numbers list, headers, and rows. is_external: false |
| [@/components/shared/async-state](../@/components/shared/async-state.md) | Imports AsyncState to render loading and error states for the react-query fetch; error state provides an onRetry handler wired to query.refetch(). is_external: false |

## 📁 Directory

This file is part of the **phone-numbers** directory. View the [directory index](_docs/src/app/(console)/settings/phone-numbers/README.md) to see all files in this module.

## Architecture Notes

- This is a client-only React page (Next.js "use client" directive) that relies on hooks for local state (useState) and derived computed state (useMemo) to avoid unnecessary recalculation of the filtered list on unrelated renders.
- Data fetching is delegated to react-query (useQuery) with a single queryKey ['settings-phone-numbers'] and queryFn fetchPhoneNumbers. The component does not perform mutations against the API; add/delete/import/export/apply-config actions are currently mocked via toast notifications. Refresh triggers queryClient.invalidateQueries to reload data.
- State management: UI state is fully local (context, newNumber, searchQuery, page, pageSize). Derived state: filtered (based on allNumbers, context, searchQuery) and paginated (slice of filtered) are computed with useMemo and simple arithmetic for totalPages. This keeps server cache separate from view state.
- Error handling: query.isLoading and query.isError gate rendering of AsyncState. The AsyncState error rendering exposes a retry callback to call query.refetch(), allowing simple recoverability. Confirmation dialogs for deletion use window.confirm synchronously and then show a toast on confirmation (mock behavior).

## Usage Examples

### View and paginate phone numbers for a specific context

User selects a context from the Select (e.g., 'from-outbound-main'). The component filters the fetched allNumbers array by matching item.context and the current searchQuery. Pagination controls use page and pageSize state: totalPages = Math.ceil(filtered.length / pageSize). Clicking 'Sau' increments page (bounded by totalPages), and the table shows the slice filtered.slice((page-1)*pageSize, page*pageSize). Loading or fetch errors show AsyncState and the retry button triggers query.refetch().

### Search for a phone number substring

User types into the search Input; onChange updates searchQuery and resets page to 1. The useMemo filter trims and lowercases the query (q) and filters items where item.number.includes(q) (note: includes is case-sensitive for numbers but searchQuery is lowercased—this implementation is acceptable for numeric strings). The filtered results update immediately without refetching from the server.

### Add and delete phone numbers (mocked)

To add, the user types a new number into the newNumber Input and clicks '+ Add'. If newNumber is empty, the component calls toast.error('Nhập số điện thoại trước.'); otherwise it shows a success toast and clears the input. To delete, the user clicks the trash button for a row, a window.confirm is shown; if confirmed, a success toast is shown. Note these actions are mocked and do not persist changes to the server.

## Maintenance Notes

- Performance: For large datasets the client-side filtering and slicing may become slow. Consider server-side filtering/pagination (add query parameters to fetchPhoneNumbers) or virtualization for the table if dataset size grows beyond a few hundred items.
- Search behavior: The code lowercases the trimmed searchQuery but then compares it to item.number using item.number.includes(q). If item.number can contain letters or mixed case, either toLowerCase() should be applied to item.number for a case-insensitive search or the lowering of query should be removed for purely numeric data. Decide based on data shape.
- Testing: Unit tests should cover filtering logic (context and searchQuery combinations), pagination math (totalPages and slice boundaries), and UI flows (add empty/newNumber, delete confirmation, refresh invalidation). Mock fetchPhoneNumbers in tests to return consistent shapes: an object whose data property is an array of items with id, number, context.
- Future improvements: Implement real mutation endpoints for add/delete/import/export/apply-config, replace window.confirm with a styled modal for consistency, add optimistic updates or refetch after successful mutations, and add proper error handling for mutation failures (display toasts with actionable messages).
- Dependencies: Keep react-query and sonner up to date; breaking API changes in react-query may require update of useQuery and queryClient usage patterns.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/app/(console)/settings/phone-numbers/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*
