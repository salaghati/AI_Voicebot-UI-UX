<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/app/(console)/settings/users/page.tsx",
  "source_hash": "6f233a7152044e621aad59e351cd8157deb9fefcdf2bef17c2980a1f73fec74b",
  "last_updated": "2026-03-10T04:03:45.026675+00:00",
  "git_sha": "55b6e9f2454c41ac23e32d52d0a39459c87b0bb4",
  "tokens_used": 8821,
  "complexity_score": 3,
  "estimated_review_time_minutes": 15,
  "external_dependencies": [
    "react",
    "react-hook-form",
    "@tanstack/react-query",
    "lucide-react",
    "sonner"
  ]
}
```

</details>

[Documentation Home](../../../../../README.md) > [src](../../../../README.md) > [app](../../../README.md) > [(console)](../../README.md) > [settings](../README.md) > [users](./README.md) > **page.mdx**

---

# page.tsx

> **File:** `src/app/(console)/settings/users/page.tsx`

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

This file exports a single React client component (SettingsUsersPage) that implements the Users settings screen. It uses react-query (useQuery, useMutation) to fetch and mutate user data via functions imported from '@/lib/api-client' (fetchUsers, createUser, deleteUser). Local UI state is managed with useState (modal open/close) and react-hook-form (useForm) for the create-user form. Rows shown in the table are derived using useMemo from query.data?.data and augmented with derived properties (status and lastLogin) for display purposes.

The component composes multiple internal UI primitives (SettingsShell, Card, Table, THead/TBody/TH/TD, Button, Input, Select, AsyncState) and third-party libraries (lucide-react icons, sonner toast notifications). Key workflows: loading state and error state are rendered via AsyncState; the create-user modal validates password confirmation client-side and calls createMutation.mutate(values) on submit, which on success closes the modal, resets the form, shows a toast, and refetches the users query; the delete action prompts window.confirm and calls deleteMutation.mutate() (currently invoked without an ID, indicating a mocked or incomplete delete integration). The UI contains some hard-coded/display-only bits (e.g., the total users message shows a fixed total of 12, and lastLogin/status derive from index rather than server data).

## Dependencies

### External Dependencies

| Module | Usage |
| --- | --- |
| `react` | Imports useMemo and useState: useState manages local UI state (openCreateModal); useMemo constructs the rows array derived from query.data?.data to avoid recomputing on every render. |
| `react-hook-form` | Imports useForm: manages the create-user form state, registers inputs (name, email, password, confirmPassword, role, status), provides handleSubmit, reset, and defaultValues for the form. |
| `@tanstack/react-query` | Imports useQuery and useMutation: useQuery({ queryKey: ['settings-users'], queryFn: fetchUsers }) fetches the users; useMutation is used twice—one for deleteUser and one for createUser, with onSuccess and onError handlers wired to show toast notifications and refetch data after creation. |
| `lucide-react` | Imports icon components Pencil, Trash2, X and renders them in-line in the UI for edit, delete, and modal close actions. |
| `sonner` | Imports toast and uses it to show user-facing success/error notifications for create and delete mutation outcomes and other UI actions (e.g., on edit click shows a mock toast). |

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/lib/api-client](../@/lib/api-client.md) | Imports createUser, deleteUser, fetchUsers. fetchUsers is passed as the queryFn to useQuery; createUser is used with a createMutation to POST new user data (called with form values); deleteUser is used with deleteMutation for user deletion (note: deleteMutation.mutate() is invoked without arguments in this file). |
| [@/features/settings](../@/features/settings.md) | Imports SettingsShell which is the page layout wrapper used to provide page title, description, section, and actions where the '+ Thêm user' button is rendered. |
| [@/components/ui/card](../@/components/ui/card.md) | Imports Card used as a container for the main table and the modal dialog content (modal uses a fixed overlay plus Card for the modal body). |
| [@/components/ui/table](../@/components/ui/table.md) | Imports Table, TBody, TD, TH, THead to render the users list in a semantic table layout. |
| [@/components/ui/button](../@/components/ui/button.md) | Imports Button used for primary actions: opening modal, row actions (edit/delete), cancel/submit in modal. Buttons pass variants and disabled state (create mutation pending). |
| [@/components/ui/input](../@/components/ui/input.md) | Imports Input for text, email, and password inputs inside the create-user form; inputs are registered with react-hook-form. |
| [@/components/ui/select](../@/components/ui/select.md) | Imports Select for the role selector inside the create-user form; the select is registered with react-hook-form and includes options 'Super Admin', 'Admin', 'Editor', 'Viewer'. |
| [@/components/shared/async-state](../@/components/shared/async-state.md) | Imports AsyncState to render loading and error states for the users fetch: shows a loading indicator while query.isLoading and an error component with a retry handler when query.isError. |

## 📁 Directory

This file is part of the **users** directory. View the [directory index](_docs/src/app/(console)/settings/users/README.md) to see all files in this module.

## Architecture Notes

- Client component: The file begins with 'use client' and uses React hooks (useState/useMemo) and react-hook-form; it is designed to run on the client and relies on client-side interactivity (modals, window.confirm, toasts).
- React Query for data flow: useQuery is used to fetch users (query key ['settings-users']) and is refetched after successful create; useMutation instances encapsulate createUser and deleteUser operations with onSuccess/onError callbacks. No optimistic updates or caching policies are defined beyond a simple refetch on create success.
- UI composition and state management: Local UI state is minimal—modal visibility via useState and form state via useForm. The rows displayed are a memoized mapping of query.data?.data with derived attributes (status and lastLogin) computed client-side. Error handling surfaces both via AsyncState (fetch errors) and sonner toast notifications (mutation outcomes and simple client-side validation).
- Notable implementation decisions: The delete mutation is invoked without passing an identifier (deleteMutation.mutate()), indicating a mocked deletion or a bug; several display values (total count '12' and lastLogin/status values) are derived client-side rather than coming directly from the API response.

## Usage Examples

### Fetching and displaying users list

On mount, useQuery with key ['settings-users'] calls fetchUsers. While loading, AsyncState with state='loading' renders. On success, the component uses useMemo to map query.data?.data to rows, adding a status property (Active for first three rows) and lastLogin strings based on index. The Table component iterates rows to show name, email, role, status, lastLogin and action buttons. On error, AsyncState with state='error' is shown and its onRetry triggers query.refetch().

### Creating a new user via modal

User clicks '+ Thêm user' which sets openCreateModal=true. The create form (managed by useForm) has defaultValues and registers fields: name, email, password, confirmPassword, role, status. On submit, handleSubmit checks password === confirmPassword; if not equal it shows a toast error. If validation passes, createMutation.mutate(values) calls createUser (from '@/lib/api-client'). On success the onSuccess handler shows a success toast, closes the modal (setOpenCreateModal(false)), resets the form, and calls query.refetch() to refresh the users list. The submit button is disabled while createMutation.isPending and label toggles to 'Đang tạo...'.

### Deleting a user (mocked in file)

Each row has a delete Button. On click, the code calls window.confirm with the user's name; if confirmed it executes deleteMutation.mutate(). The deleteMutation is wired to deleteUser and displays success/error toasts. Important: the current implementation calls deleteMutation.mutate() without passing the target user's id, so deletion is likely mocked or incomplete; to properly delete a specific user, mutate should be called with an identifier (e.g., deleteMutation.mutate(item.id)).

## Maintenance Notes

- Bug to fix: deleteMutation.mutate() is invoked without an argument—pass the specific user id (deleteMutation.mutate(item.id)) so the API client can delete the correct user.
- Form validation: password confirmation is checked client-side only. Consider adding react-hook-form validation rules with specific error messages and server-side validation handling for createUser errors (currently only generic toast error is shown).
- Accessibility: modal overlay lacks focus management and ARIA roles; add focus trapping, initial focus on the first input, and aria-modal/role attributes for better accessibility.
- Performance: useMemo is used to compute rows; ensure fetchUsers returns predictable shapes (data.data) to avoid undefined edge cases. For large lists, consider server-side pagination instead of mapping all items client-side and showing a static total of 12.
- Testing: add unit tests for the form submission flow (including password mismatch branch), integration tests for createMutation success and failure, and an end-to-end test verifying the modal open/close, registration of inputs, and the refetch after creation.
- Enhancements: implement optimistic UI updates for create/delete to reduce perceived latency, replace hard-coded lastLogin/status derivation with server-provided fields, and make total count dynamic from API response for accurate display.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/app/(console)/settings/users/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*
