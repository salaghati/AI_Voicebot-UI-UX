<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/features/kb/components/KbFallbackDetailView.tsx",
  "source_hash": "bbf4d1a0437e4a9ab6498bf04d4138c12cec992f160f2e485304055811915251",
  "last_updated": "2026-03-10T04:15:30.100150+00:00",
  "git_sha": "b50fe0997d78ea89c000ee6bb23be847052f6972",
  "tokens_used": 6322,
  "complexity_score": 3,
  "estimated_review_time_minutes": 15,
  "external_dependencies": [
    "next/link",
    "react",
    "@tanstack/react-query",
    "lucide-react",
    "next/navigation",
    "sonner"
  ]
}
```

</details>

[Documentation Home](../../../../README.md) > [src](../../../README.md) > [features](../../README.md) > [kb](../README.md) > [components](./README.md) > **KbFallbackDetailView.mdx**

---

# KbFallbackDetailView.tsx

> **File:** `src/features/kb/components/KbFallbackDetailView.tsx`

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

This file exports a Next.js client React component KbFallbackDetailView that displays full details for a KB fallback rule identified by fallbackId. It uses @tanstack/react-query to fetch the rule (fetchKbFallbackRule), toggle its active state (toggleKbFallbackActive), and calls deleteKbFallbackRule for removal. The component shows loading/error/empty states via an AsyncState component and reports user actions with sonner toast notifications. The UI uses project primitives (KbShell, Card, Badge, Button, ToggleSwitch) and helper label functions from kb-fallback-meta to render enum-like fields.

In the application, this component is the detail page in the KB fallback admin area. Key behaviors: on mount it fetches and renders the rule; users can toggle active which runs a mutation and invalidates both the single-item and list queries; deleting asks for confirmation, calls deleteKbFallbackRule, marks the item as deleted locally and redirects back to the list. The component handles conditional displays for transfer configuration and play-error fail actions, and formats updatedAt with formatDateTime. All user-facing text is written in Vietnamese in the component.

## Dependencies

### External Dependencies

| Module | Usage |
| --- | --- |
| `next/link` | Used to render navigation links (<Link href="/kb/fallback"> and edit link). Provides client-side navigation wrappers for the back-to-list and edit buttons. |
| `react` | Imports useState for local component state (deleted flag). The file is a React functional component (KbFallbackDetailView) and uses React hooks. |
| `@tanstack/react-query` | Imports useMutation, useQuery, useQueryClient. useQuery fetches the fallback rule; useMutation is used for toggling active and invalidates queries on success. |
| `lucide-react` | Imports ArrowLeft, Pencil, Trash2 icon components and uses them inside Buttons for navigation, edit, and delete actions. |
| `next/navigation` | Imports useRouter and uses router.push('/kb/fallback') after a successful delete to navigate back to the list page. |
| `sonner` | Imports toast and calls toast.success and toast.error to display user notifications after toggle success/failure and after deletion. |

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/lib/api-client](../@/lib/api-client.md) | Imports deleteKbFallbackRule, fetchKbFallbackRule, toggleKbFallbackActive. fetchKbFallbackRule is used by useQuery; toggleKbFallbackActive by useMutation; deleteKbFallbackRule is called when the user confirms deletion. |
| [./KbShell](.././KbShell.md) | Imports the KbShell wrapper component which provides the page title, description and top-level actions slot. KbFallbackDetailView renders its entire UI inside <KbShell>. |
| [@/components/ui/badge](../@/components/ui/badge.md) | Imports Badge to show status badges (tone depends on item.status). |
| [@/components/ui/button](../@/components/ui/button.md) | Imports Button used for navigation, edit and delete actions. Buttons include icons and variant props are passed (secondary, danger). |
| [@/components/ui/card](../@/components/ui/card.md) | Imports Card used as the main container for the fallback detail content. |
| [@/components/ui/toggle-switch](../@/components/ui/toggle-switch.md) | Imports ToggleSwitch used in two places to toggle the item's active property. The component's checked/onChange/disabled props are wired to item.active and the toggle mutation. |
| [@/components/shared/async-state](../@/components/shared/async-state.md) | Imports AsyncState and uses it to render loading, error-with-retry, and empty states (including custom empty message when item is deleted or not found). |
| [@/lib/utils](../@/lib/utils.md) | Imports formatDateTime which is used to format item.updatedAt for display at the bottom of the card. |
| [./kb-fallback-meta](.././kb-fallback-meta.md) | Imports labelKbFallbackCategory, labelKbFallbackFailAction, labelKbFallbackNextAction which map internal enum-like values to human-friendly labels shown in the UI (category, fail action, next action). |

## 📁 Directory

This file is part of the **components** directory. View the [directory index](_docs/src/features/kb/components/README.md) to see all files in this module.

## Architecture Notes

- Client-side Next.js component with "use client" directive, using React hooks and @tanstack/react-query for server state and mutations.
- Pattern: useQuery to read an item, useMutation to perform changes and invalidate queries via useQueryClient to refresh both single-item and list caches.
- Local state is minimal (deleted flag). Deletion uses an explicit confirmation then calls delete API and navigates back to the list.

## Usage Examples

### Render the detail view for a fallback rule at route /kb/fallback/[id]

On mount KbFallbackDetailView receives fallbackId and uses useQuery with key ["kb-fallback", fallbackId] to fetch data. While fetching, it renders AsyncState in loading mode; once resolved it displays fields like name, id, status, category, responseText and updatedAt (formatted). If fetch errors, AsyncState provides a retry that triggers query.refetch().

### Toggle the active state of the fallback rule

User toggles the ToggleSwitch which calls toggleKbFallbackActive via a useMutation. On success the mutation invalidates ["kb-fallback", fallbackId] and ["kb-fallback-list"] and shows a toast.success. On error it shows toast.error. The ToggleSwitch is disabled while mutation is pending to prevent duplicate requests.

### Delete the fallback rule from the detail view

User clicks Delete which prompts window.confirm; if confirmed, the handler awaits deleteKbFallbackRule, sets deleted=true locally, shows a toast.success and calls router.push('/kb/fallback') to redirect to the list. When deleted or item missing, the view renders AsyncState in empty state.

## Maintenance Notes

- Consider replacing window.confirm with a styled, accessible modal for consistent UX and better accessibility.
- Add defensive typing or null checks for optional server fields (targetMode, targetQueue, maxWaitSec, onFailAction) to avoid runtime errors.
- For frequent toggles, consider optimistic updates in useMutation to reduce latency and extra refetches.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/features/kb/components/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*
