<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/app/(console)/settings/roles/page.tsx",
  "source_hash": "fa0ea01a9c95c65a23aba607b03b47078c8023e6bf1c57694ef1aaa6f05a1be5",
  "last_updated": "2026-03-10T04:01:57.624364+00:00",
  "git_sha": "4e5799ff20ff9137370b5bd876d878827d04b546",
  "tokens_used": 7074,
  "complexity_score": 2,
  "estimated_review_time_minutes": 10,
  "external_dependencies": [
    "next/link",
    "@tanstack/react-query",
    "sonner"
  ]
}
```

</details>

[Documentation Home](../../../../../README.md) > [src](../../../../README.md) > [app](../../../README.md) > [(console)](../../README.md) > [settings](../README.md) > [roles](./README.md) > **page.mdx**

---

# page.tsx

> **File:** `src/app/(console)/settings/roles/page.tsx`

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

This file exports a default React functional component named SettingsRolesPage which is a client-side page (file includes the "use client" directive). Its primary responsibility is to fetch a list of roles from the backend via fetchRoles, render the list inside a SettingsShell layout, and provide UI controls to add, edit, or delete individual roles. Data fetching is handled with react-query's useQuery (queryKey: ["settings-roles"]) and role deletions are performed via useMutation with deleteRole as the mutation function. Toast notifications (sonner) are used to surface success and error outcomes for deletions.

The component maps over query.data?.data (an expected array of role objects) and renders each role inside a Card with its roleName and a summary of permissions. It checks role.permissions for a '*' value to render a full-access message or otherwise shows the number of enabled permissions. Navigation links use next/link to route to a role editor path (for adding a new role or editing by id). The delete button confirms via window.confirm and then calls deleteMutation.mutate(). The component conditionally renders an AsyncState component for loading and error states and exposes a retry path via query.refetch(). Important implementation details visible in the code: (1) the mutation's onSuccess only shows a toast but does not invalidate or refetch the "settings-roles" query (so the UI won't automatically refresh the list), and (2) deleteMutation.mutate() is invoked without passing the role id, meaning deleteRole will be called with undefined unless deleteRole closes over a different context — this is likely a bug or missing implementation detail to fix (pass role.id to mutate and/or invalidate the query).

## Dependencies

### External Dependencies

| Module | Usage |
| --- | --- |
| `next/link` | Uses the Link component to navigate to '/settings/roles/editor' for creating a new role and to '/settings/roles/editor?role={role.id}' for editing a role. Imported exactly as: import Link from "next/link" |
| `@tanstack/react-query` | Uses useQuery to fetch the roles list with queryKey ["settings-roles"] and queryFn fetchRoles; uses useMutation with mutationFn deleteRole and onSuccess/onError callbacks. Imported exactly as: import { useMutation, useQuery } from "@tanstack/react-query" |
| `sonner` | Uses the toast function to show a success message on mutation success and an error message on mutation failure. Imported exactly as: import { toast } from "sonner" |

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/lib/api-client](../@/lib/api-client.md) | Imports two functions: fetchRoles (used as the useQuery queryFn to load the roles list) and deleteRole (used as the useMutation mutationFn to delete a role). Imported exactly as: import { deleteRole, fetchRoles } from "@/lib/api-client" |
| [@/features/settings](../@/features/settings.md) | Uses SettingsShell (a layout/wrapper component) to render the page title, description, section label, and an actions slot that contains the 'Thêm mới phân quyền' button. Imported exactly as: import { SettingsShell } from "@/features/settings" |
| [@/components/ui/card](../@/components/ui/card.md) | Uses Card to render each role item visually as a grouped block. Imported exactly as: import { Card } from "@/components/ui/card" |
| [@/components/ui/button](../@/components/ui/button.md) | Uses Button for primary CTA (add new role) and for per-role actions (Edit 'Sửa' and Delete 'Xóa') with variants and sizes. Imported exactly as: import { Button } from "@/components/ui/button" |
| [@/components/shared/async-state](../@/components/shared/async-state.md) | Uses AsyncState to render UX states: loading (state="loading") and error (state="error" with onRetry calling query.refetch()). Imported exactly as: import { AsyncState } from "@/components/shared/async-state" |

## 📁 Directory

This file is part of the **roles** directory. View the [directory index](_docs/src/app/(console)/settings/roles/README.md) to see all files in this module.

## Architecture Notes

- Client component: The file begins with the "use client" directive, so the exported SettingsRolesPage runs entirely on the client and can use browser APIs (e.g., window.confirm).
- React-query for data and mutation: useQuery is used to load role data keyed by ["settings-roles"], and useMutation is used to perform deletions. However, the mutation does not call query invalidation or refetch on success, so the UI list will not automatically update after a deletion.
- UI composition: The page composes a SettingsShell layout around a grid of Card components. Each Card contains textual role metadata and Buttons for edit/delete; navigation uses next/link which performs client-side transitions.
- Error and loading handling: Conditional rendering is used to show AsyncState components for loading and error states. Error state exposes a retry via query.refetch().
- Data assumptions: The code expects query.data?.data to be an array of role objects with at least the keys id (used as React key), roleName (string), and permissions (array of strings). It specifically checks for the wildcard '*' within permissions to indicate full access.

## Usage Examples

### Render the list of roles when visiting the settings roles page

When SettingsRolesPage mounts, useQuery runs fetchRoles with the key ["settings-roles"] to retrieve a response object whose .data property is iterated. The component renders an AsyncState with state="loading" while query.isLoading is true. Once data is available the component maps query.data.data to Card nodes where each card shows role.roleName and either a 'full access' message if role.permissions includes '*' or the count role.permissions.length. If fetchRoles fails, AsyncState with state="error" is shown and clicking retry calls query.refetch() to attempt fetching again.

### Delete a role via the UI

User clicks the 'Xóa' (Delete) Button for a role. The onClick handler opens a browser confirm dialog via window.confirm(`Xóa role ${role.roleName}?`). If the user confirms, deleteMutation.mutate() is called which triggers the deleteRole mutationFn. On successful mutation, the onSuccess callback shows a toast.success('Đã xóa phân quyền (mock)'); on error it shows toast.error('Không thể xóa phân quyền'). Note: as implemented the mutation is invoked without a role id argument and there is no react-query invalidation/refetch in onSuccess, so the list will not automatically update to remove the deleted item — a developer should pass role.id to mutate and call queryClient.invalidateQueries(["settings-roles"]) or call query.refetch().

## Maintenance Notes

- Bug/risk: deleteMutation.mutate() is invoked without the role id or payload. If deleteRole expects an id, the current implementation will call it with undefined. Fix by passing role.id to mutate (e.g., deleteMutation.mutate(role.id)) or adapt deleteRole accordingly.
- UI sync: After a successful deletion the code only shows a toast but does not refresh the roles list. Add cache invalidation (queryClient.invalidateQueries(["settings-roles"])) or call query.refetch() in onSuccess to keep UI consistent.
- Scalability: The component appears to render all roles returned in query.data.data. If the dataset grows, consider adding pagination at fetchRoles or server-side pagination with parameters passed via useQuery.
- Testing: Unit tests should cover the loading/error states, that fetchRoles is called with the correct queryKey, that the edit Link includes the correct role id query parameter, and that the delete button calls mutate only after user confirmation. Add an integration/e2e test to ensure toast messages are shown and the list refreshes after deletion when invalidation is implemented.
- Accessibility/i18n: Confirm modal uses window.confirm (browser native) — consider replacing with an accessible dialog component. Text strings are in Vietnamese; if the app supports multiple locales, move strings to localization resources.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/app/(console)/settings/roles/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*
