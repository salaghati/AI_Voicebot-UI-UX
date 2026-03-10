<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/app/(console)/settings/roles/editor/page.tsx",
  "source_hash": "4cf0903820d63bb863f26bb9e35493699129080e7de8b09e62dbacba4bbb6347",
  "last_updated": "2026-03-10T04:02:56.129053+00:00",
  "tokens_used": 9653,
  "complexity_score": 4,
  "estimated_review_time_minutes": 15,
  "external_dependencies": [
    "react",
    "next/navigation",
    "react-hook-form",
    "@tanstack/react-query",
    "sonner"
  ]
}
```

</details>

[Documentation Home](../../../../../../README.md) > [src](../../../../../README.md) > [app](../../../../README.md) > [(console)](../../../README.md) > [settings](../../README.md) > [roles](../README.md) > [editor](./README.md) > **page.mdx**

---

# page.tsx

> **File:** `src/app/(console)/settings/roles/editor/page.tsx`

![Complexity: Medium](https://img.shields.io/badge/Complexity-Medium-yellow) ![Review Time: 15min](https://img.shields.io/badge/Review_Time-15min-blue)

## 📑 Table of Contents


- [Overview](#overview)
- [Dependencies](#dependencies)
- [Architecture Notes](#architecture-notes)
- [Usage Examples](#usage-examples)
- [Maintenance Notes](#maintenance-notes)
- [Functions and Classes](#functions-and-classes)

---

## Overview

This file exports a default React client component SettingsRoleEditorPage that implements a role editor used in application settings. It fetches available roles with react-query, selects a role using the URL search param "role", and populates a react-hook-form with roleName and permissions. Permissions are represented as dotted strings (e.g. "kb.list.view") and a helper normalizePermissions expands a wildcard "*" to all available codes.

The component renders a settings shell and Card with the editable form, shows AsyncState for loading/error query states, and keeps form state synchronized with the selected role via useEffect(form.reset(...)). Checkbox selection is driven by a permissions array observed with useWatch; togglePermission updates that array using form.setValue. On submit the form calls either createRole or updateRole via react-query mutations and surfaces results with sonner toasts. Navigation for cancel/close uses Next.js router.push to return to /settings/roles.

## Dependencies

### External Dependencies

| Module | Usage |
| --- | --- |
| `react` | Imports useEffect and useMemo hooks to synchronize form state with the selected role and to memoize derived values (selectedPermissions, selectedSet). |
| `next/navigation` | Imports useRouter to navigate back to /settings/roles for close/cancel actions and useSearchParams to read the 'role' search parameter from the URL. |
| `react-hook-form` | Imports useForm to manage the form state (roleName, permissions) and useWatch to observe the permissions field so checkbox UI reflects current form state. |
| `@tanstack/react-query` | Imports useMutation and useQuery; useQuery fetches roles and useMutation wraps createRole and updateRole API calls to perform create/update operations. |
| `sonner` | Imports toast to show user feedback: toast.success on successful create/update and toast.error on mutation failures. |

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/lib/api-client](../@/lib/api-client.md) | Imports createRole, fetchRoles, updateRole functions used directly by react-query: fetchRoles is the query function and createRole/updateRole are used by mutations. |
| [@/features/settings](../@/features/settings.md) | Imports SettingsShell which wraps the page content and provides title/description/section UI for settings pages. |
| [@/components/ui/card](../@/components/ui/card.md) | Imports Card used as the container for the form UI. |
| [@/components/ui/input](../@/components/ui/input.md) | Imports Input component which is wired to react-hook-form to edit roleName. |
| [@/components/ui/button](../@/components/ui/button.md) | Imports Button used for both the secondary (Cancel) and primary (Save) actions in the form footer. |
| [@/components/shared/async-state](../@/components/shared/async-state.md) | Imports AsyncState to show standardized loading and error states for the roles query; on error it supplies an onRetry handler calling query.refetch(). |
| [@/lib/utils](../@/lib/utils.md) | Imports cn (className utility) for conditional className composition used in row rendering and checkbox SVG visibility. |

## 📁 Directory

This file is part of the **editor** directory. View the [directory index](_docs/src/app/(console)/settings/roles/editor/README.md) to see all files in this module.

## Architecture Notes

- Client-side React functional component pattern: The file is a Next.js client page ("use client") and uses React hooks, react-hook-form for form state, and react-query for async data operations.
- Form state & derived data: react-hook-form is authoritative for roleName and permissions. useWatch observes permissions and useMemo builds a Set for O(1) membership checks when rendering many checkboxes.
- Error handling & UX: Loading and query errors render AsyncState. create/update mutations use onSuccess/onError callbacks to show toasts. The UI disables save while a mutation is pending.

## Usage Examples

### Edit an existing role from the roles list

Open the editor with ?role=<roleId>. The component loads roles, selects the matching role, and resets the form with its name and permissions (normalizePermissions expands '*' to all codes). Toggling checkboxes updates the form. On submit updateRole is called with { id, roleName: trimmedName, permissions } and results are shown with toasts. The user can close/cancel using router.push('/settings/roles').

### Create a new role

Open the editor without a 'role' param. The form starts empty. After setting a name and permissions, submit calls createRole with payload { id: 'NEW', roleName: trimmedName, permissions }. Success and errors are surfaced with toasts. The Save button is disabled while the mutation is pending.

## Maintenance Notes

- Rendering many permission checkboxes can be expensive; use a Set for membership checks and consider memoizing or virtualizing rows for very large lists.
- Add visible validation feedback for roleName and consider disabling save when roleName is empty to avoid invalid payloads.
- Unit-test normalizePermissions (empty/undefined input and '*' expansion) and togglePermission to ensure no duplicate permissions are introduced.
- Confirm the API contract for fetchRoles (expects data property with an array of role objects). If that shape changes, selection logic must be updated.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/app/(console)/settings/roles/editor/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*


---

## Functions and Classes


#### function normalizePermissions

![Type: Sync](https://img.shields.io/badge/Type-Sync-green)

### Signature

```typescript (tsx)
function normalizePermissions(permissions?: string[]): string[]
```

### Description

Normalize an optional array of permission codes: return an empty array for missing/empty input, return allPermissionCodes if '*' is present, otherwise return the original array.


This function accepts an optional array of strings (permissions). It first checks whether the input is falsy (undefined/null) or has zero length; in that case it returns a new empty array. Next, it checks whether the array includes the string '*' using Array.prototype.includes; if so, it returns the value of the external identifier allPermissionCodes. If neither condition matches, it returns the provided permissions array unchanged. The function does not clone the input when returning it, so the original array reference is preserved in that case.

### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `permissions` = `undefined` | `string[] | undefined` | ❌ | Optional array of permission code strings to normalize. May be undefined or an empty array.
<br>**Constraints:** Elements are expected to be strings, The function looks specifically for the string '*' to indicate all permissions |

### Returns

**Type:** `string[]`

Returns an array of permission codes: an empty array for missing/empty input, the external allPermissionCodes when '*' is present in the input, or the original permissions array otherwise.


**Possible Values:**

- [] — when permissions is undefined or an empty array
- allPermissionCodes — when permissions includes the string '*' (returns that external value as-is)
- permissions — the same array passed in when it is non-empty and does not include '*'

### Usage Examples

#### Input is undefined (no permissions provided)

```typescript (tsx)
normalizePermissions(undefined)
```

Returns an empty array because the input is missing.

#### Input explicitly requests all permissions using wildcard

```typescript (tsx)
normalizePermissions(['read', '*', 'write'])
```

Returns the external allPermissionCodes value because '*' is present in the array.

#### Input is a normal list of permissions

```typescript (tsx)
const p = ['read','write']; normalizePermissions(p)
```

Returns the same array reference p because it is non-empty and does not include '*'.

### Complexity

Time complexity O(n) in the length of the permissions array due to the includes() check; space complexity O(1) additional space (returns references to existing arrays, except when returning a new empty array literal).

### Related Functions

- `allPermissionCodes` - Referenced external value: returned as the canonical full-permissions list when the '*' wildcard is present

### Notes

- The function returns the original permissions array reference when it does not replace it with [] or allPermissionCodes; callers should be aware of potential mutation of that array elsewhere.
- allPermissionCodes is referenced but not defined in this snippet; its type is expected to be a string[] available in the surrounding module scope.

---


