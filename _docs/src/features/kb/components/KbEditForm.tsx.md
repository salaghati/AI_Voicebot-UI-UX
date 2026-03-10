<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/features/kb/components/KbEditForm.tsx",
  "source_hash": "58b912e651a45a252f81a110bec7bacabd04a68a6619a11e2b2a4f6c3f42875c",
  "last_updated": "2026-03-10T04:15:32.307839+00:00",
  "git_sha": "dcdf43e9788dfda843ecb1395d412c7a4ea1f6d5",
  "tokens_used": 5843,
  "complexity_score": 3,
  "estimated_review_time_minutes": 10,
  "external_dependencies": [
    "next/link",
    "@tanstack/react-query",
    "lucide-react",
    "next/navigation",
    "sonner"
  ]
}
```

</details>

[Documentation Home](../../../../README.md) > [src](../../../README.md) > [features](../../README.md) > [kb](../README.md) > [components](./README.md) > **KbEditForm.mdx**

---

# KbEditForm.tsx

> **File:** `src/features/kb/components/KbEditForm.tsx`

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

KbEditForm is a client-side React component that loads a KB document by ID and renders a source-aware edit form. It uses React Query's useQuery to fetch the document (query key ['kb-doc', kbId]) and renders standardized loading, error, and empty states via an AsyncState component. When the document is available it wraps the editor in a KbShell and renders KbSourceForm, passing the item's sourceType and the fetched document as initial values.

Updates are handled with useMutation: on submit the component calls updateKbDoc(kbId, payload). On success it invalidates the ['kb-list'] and ['kb-doc', kbId] cache entries, shows a success toast, and navigates back to the KB detail page. On error it displays an error toast. The component assumes the API client returns the document at response.data and delegates actual form fields and validation to KbSourceForm.

## Dependencies

### External Dependencies

| Module | Usage |
| --- | --- |
| `next/link` | Imports Link for client-side navigation anchor elements. Used to wrap the "Về chi tiết" Button that links back to the KB detail page (`/kb/list/${kbId}`). |
| `@tanstack/react-query` | Imports useMutation, useQuery, and useQueryClient. useQuery executes fetchKbDoc(kbId) with queryKey ['kb-doc', kbId]; useMutation defines a mutation that calls updateKbDoc(kbId, payload) and supplies onSuccess and onError handlers; useQueryClient is used to invalidate queries (['kb-list'] and ['kb-doc', kbId]) after a successful update. |
| `lucide-react` | Imports ArrowLeft icon component used inside the Button to indicate a back action in the KbShell actions area. |
| `next/navigation` | Imports useRouter for imperative navigation. Used to push the user to `/kb/list/${kbId}` both after successful update and when cancelling. |
| `sonner` | Imports toast to display feedback messages. Used to show toast.success(`Đã cập nhật ${kbId}`) on mutation success and toast.error("Không thể cập nhật KB") on mutation error. |

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/lib/api-client](../@/lib/api-client.md) | Imports fetchKbDoc and updateKbDoc from the project's API client. fetchKbDoc(kbId) is called by useQuery to load the document; updateKbDoc(kbId, payload) is called by the mutation function to persist edits. |
| [./KbShell](.././KbShell.md) | Imports KbShell, a local component used to provide a titled container (title and description) and an actions slot for the edit form UI. The edit form and navigation button are rendered within KbShell. |
| [@/components/ui/button](../@/components/ui/button.md) | Imports Button component used for the "Về chi tiết" back button inside the shell's actions. |
| [@/components/shared/async-state](../@/components/shared/async-state.md) | Imports AsyncState, a local UI component used to render standardized loading, error, and empty states. The file renders <AsyncState state="loading" /> when the query is loading, <AsyncState state="error" onRetry={() => query.refetch()} /> on error, and <AsyncState state="empty" message="Không tìm thấy KB để chỉnh sửa." /> when no item is found. |
| [./KbSourceForm](.././KbSourceForm.md) | Imports KbSourceForm, the source-aware form component that actually renders inputs for the KB based on item.sourceType. KbEditForm passes sourceType, initialDoc (item), mode="edit", submitting={mutation.isPending}, onCancel, and onSubmit which calls mutation.mutate(payload). |

## 📁 Directory

This file is part of the **components** directory. View the [directory index](_docs/src/features/kb/components/README.md) to see all files in this module.

## Architecture Notes

- Client-side React component with the "use client" directive—this ensures the component runs in the browser and can use hooks like useRouter and React Query hooks.
- Uses React Query (useQuery/useMutation/useQueryClient) for remote data fetching and mutation; no optimistic updates are implemented—onSuccess invalidates cache keys to ensure fresh reads.
- Error and loading UI are centralized through AsyncState; success/error feedback uses toast notifications from sonner. Navigation uses Next.js useRouter push and Link for back navigation.
- The file assumes the API response shape contains the document under response.data (accessed as query.data?.data). The mutation function signature expects a payload: Record<string, unknown> and calls updateKbDoc(kbId, payload).

## Usage Examples

### Edit an existing KB document

KbEditForm receives a kbId prop and mounts. It calls useQuery with queryKey ['kb-doc', kbId] and queryFn () => fetchKbDoc(kbId). While the query is loading, <AsyncState state="loading" /> is shown. If the query errors, <AsyncState state="error" onRetry={() => query.refetch()} /> is displayed so the user can retry. If fetch returns no document, <AsyncState state="empty" message="Không tìm thấy KB để chỉnh sửa." /> is shown. When the document is available (item = query.data?.data), the component renders KbShell containing KbSourceForm. The form receives initialDoc=item and sourceType=item.sourceType so it can render fields appropriate to the KB's source. On submit, KbSourceForm calls onSubmit(payload) which triggers mutation.mutate(payload). The mutation calls updateKbDoc(kbId, payload). On success the code invalidates ['kb-list'] and ['kb-doc', kbId], shows toast.success and navigates to /kb/list/${kbId}. On error it shows toast.error.

### User cancels editing

When the user activates the cancel flow in KbSourceForm, onCancel is called which invokes router.push(`/kb/list/${kbId}`). Alternatively, the user can use the "Về chi tiết" Link/Button in the KbShell actions to navigate back without submitting.

## Maintenance Notes

- The component relies on the API client returning the document at response.data. If the API contract changes (e.g., document moved to response.payload), code must be updated where item = query.data?.data ?? null.
- React Query cache invalidation uses exact query keys ['kb-list'] and ['kb-doc', kbId]; ensure other parts of the app use the same keys for consistent cache behavior.
- mutation.isPending is passed to the form as the submitting flag. Verify compatibility with the installed React Query version (isPending is available in newer versions; some codebases use isLoading or isMutating).
- Testing should cover the four render paths: loading, error (and retry), empty (no item), and successful initial load + submit success and submit error flows. Mock fetchKbDoc and updateKbDoc accordingly.
- Potential enhancement: add optimistic updates or a more explicit form-level validation layer in KbSourceForm. Consider setting staleTime or cacheTime on useQuery if frequent re-fetches are unnecessary.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/features/kb/components/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*
