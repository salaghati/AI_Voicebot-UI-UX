<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/app/(console)/settings/extensions/page.tsx",
  "source_hash": "21ad4229f4eb3e2e4b49f43cd475f8790febf50b4aa1b7106caf7e7ed68e0a2e",
  "last_updated": "2026-03-10T04:00:36.830539+00:00",
  "git_sha": "3891a980c00519d7714b0c1d11117c2394d626a9",
  "tokens_used": 7712,
  "complexity_score": 3,
  "estimated_review_time_minutes": 15,
  "external_dependencies": [
    "react",
    "lucide-react",
    "@tanstack/react-query",
    "sonner"
  ]
}
```

</details>

[Documentation Home](../../../../../README.md) > [src](../../../../README.md) > [app](../../../README.md) > [(console)](../../README.md) > [settings](../README.md) > [extensions](./README.md) > **page.mdx**

---

# page.tsx

> **File:** `src/app/(console)/settings/extensions/page.tsx`

![Complexity: Low](https://img.shields.io/badge/Complexity-Low-green) ![Review Time: 15min](https://img.shields.io/badge/Review_Time-15min-blue)

## 📑 Table of Contents


- [Overview](#overview)
- [Dependencies](#dependencies)
- [Architecture Notes](#architecture-notes)
- [Usage Examples](#usage-examples)
- [Maintenance Notes](#maintenance-notes)
- [Functions and Classes](#functions-and-classes)

---

## Overview

This file exports a single React functional component SettingsExtensionsPage which is a client-side page ("use client"). Its responsibilities are: fetching the list of extensions via the fetchExtensions API client using @tanstack/react-query, rendering the results in a table using the project's UI components, providing client-side pagination and page-size selection, toggling visibility of stored passwords, and exposing a mock "edit" action that shows a toast. The component maintains local state for the current page number (page), the selected page size (pageSize), and a Set of extension IDs whose passwords are visible (visiblePasswords). It computes totalPages from the full array returned by the query and slices the array to produce a paginated page displayed in the table.

The page integrates with several internal UI building blocks: SettingsShell wraps the whole content providing title/description/section metadata, Card groups the content, Table/THead/TBody/TH/TD compose the grid, Input components display outbound CID and password values (in read-only mode), Select controls page-size, and Button components drive pagination. It also uses AsyncState to show loading and error states and the sonner toast utility to show a mock success message when the edit button is clicked. Data expected from fetchExtensions is read from query.data?.data and treated as an array of extension objects with at least these keys referenced in the component: id (string), extension (string), outboundCid (string), and password (string). Important design decisions: passwords are rendered into read-only Input fields using defaultValue and toggled between type="password" and type="text" by local state (visiblePasswords), and pagination is performed client-side by slicing the full dataset — this is simple but may be unsuitable for large datasets and would need server-side pagination for scalability.

## Dependencies

### External Dependencies

| Module | Usage |
| --- | --- |
| `react` | Imports useState from 'react' and uses it to manage component-local state: page (number), pageSize (number), and visiblePasswords (Set<string>) for UI interaction. is_external: true |
| `lucide-react` | Imports Eye, EyeOff, Pencil icon components and uses them as inline SVG icon components in action buttons to represent show/hide password and edit. is_external: true |
| `@tanstack/react-query` | Imports useQuery and uses it to perform data fetching: useQuery({ queryKey: ['settings-extensions'], queryFn: fetchExtensions }). The query object is used for isLoading, isError, data and refetch. is_external: true |
| `sonner` | Imports toast from 'sonner' and calls toast.success(...) when the edit button is clicked to show a mock success notification. is_external: true |

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/lib/api-client](../@/lib/api-client.md) | Imports fetchExtensions from '@/lib/api-client' and passes it directly as the queryFn to useQuery to retrieve the extensions list. This is an internal project API client. is_external: false |
| [@/features/settings](../@/features/settings.md) | Imports SettingsShell (internal) and uses it to wrap the page, providing title="Quản lý Extension", description, and section props to the page layout. is_external: false |
| [@/components/ui/card](../@/components/ui/card.md) | Imports Card and uses it as the primary container for the table and pagination controls. is_external: false |
| [@/components/ui/input](../@/components/ui/input.md) | Imports Input and uses it to display outboundCid and password values in read-only inputs; password visibility is toggled by changing the Input's type between 'password' and 'text'. is_external: false |
| [@/components/ui/select](../@/components/ui/select.md) | Imports Select and uses it to allow the user to pick page size (10, 25, 50). The onChange handler sets pageSize and resets page to 1. is_external: false |
| [@/components/ui/button](../@/components/ui/button.md) | Imports Button and uses it for pagination controls (first, previous, next, last) with variant="secondary" and size="sm". is_external: false |
| [@/components/ui/table](../@/components/ui/table.md) | Imports Table, TBody, TD, TH, THead and uses these components to render the tabular layout of extension rows and headers. is_external: false |
| [@/components/shared/async-state](../@/components/shared/async-state.md) | Imports AsyncState and uses it to render loading and error UI: <AsyncState state="loading" /> when query.isLoading and <AsyncState state="error" onRetry={() => query.refetch()} /> when query.isError. is_external: false |

## 📁 Directory

This file is part of the **extensions** directory. View the [directory index](_docs/src/app/(console)/settings/extensions/README.md) to see all files in this module.

## Architecture Notes

- This is a client-side React functional component ("use client") that uses React Query (useQuery) for data fetching and local useState hooks for UI state (pagination and password-visibility tracking).
- Pagination is implemented client-side by reading the full array from query.data?.data, computing totalPages and slicing the array to create 'paginated'. This is straightforward but not scalable for very large datasets — server-side pagination would be preferable for large result sets.
- Password visibility is tracked with a Set<string> (visiblePasswords) stored in component state. togglePassword(id: string) immutably updates the Set by copying it and adding/removing the id, which prevents mutation bugs and works well with React state updates.
- Error and loading states are surfaced via a shared AsyncState component and the query.refetch() method is wired to the error state's retry action. The edit action is mocked and does not persist changes — it triggers a toast only.

## Usage Examples

### Rendering the settings extensions list in the console

When the page mounts, useQuery calls fetchExtensions. While loading, <AsyncState state="loading" /> is rendered. After data is returned, query.data?.data (an array of extension objects) is assigned to allExtensions. The component computes totalPages = Math.max(1, Math.ceil(allExtensions.length / pageSize)) and derives paginated = allExtensions.slice((page - 1) * pageSize, page * pageSize). Each paginated item is rendered as a table row with read-only Input fields showing outboundCid and password. Clicking the eye button toggles visibility by calling togglePassword(item.id) which adds/removes the id from visiblePasswords, switching the Input type between 'password' and 'text'. The edit button triggers toast.success with a mock message. Pagination controls update page and pageSize state and enable navigation across slices of the full array.

## Maintenance Notes

- Scalability: Current implementation fetches the entire extensions array and paginates client-side. If the server returns thousands of records, switch to server-side pagination (pass page and pageSize to fetchExtensions and use queryKey to include pagination params).
- Security: Passwords are rendered in the DOM (Input defaultValue) even when masked; avoid returning plaintext passwords to the client in production. Prefer not to include password values in the API response or use a separate endpoint to reveal them with proper authorization and auditing.
- Controlled vs uncontrolled inputs: Inputs use defaultValue in read-only mode. If editing functionality is implemented later, convert Inputs to controlled components and wire up save/cancel flows with validation and API calls.
- Testing: Unit tests should verify pagination math, visibility toggle (visiblePasswords Set behavior), loading/error rendering, and that the edit button triggers the toast. End-to-end tests should verify that page-size selection resets page to 1 and that boundary pagination buttons disable appropriately.
- Dependencies: Keep @tanstack/react-query, sonner, and lucide-react up to date and verify breaking changes across major versions when upgrading.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/app/(console)/settings/extensions/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*
