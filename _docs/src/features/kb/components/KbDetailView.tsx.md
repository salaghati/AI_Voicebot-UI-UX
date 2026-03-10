<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/features/kb/components/KbDetailView.tsx",
  "source_hash": "6f1e8bc31feb5c84d4a392198745beee20460061ed3db524b11f3540e5cabca2",
  "last_updated": "2026-03-10T04:14:52.813446+00:00",
  "git_sha": "93b9b90b280e0bb3a1b1628fcfb712c67370f922",
  "tokens_used": 9111,
  "complexity_score": 3,
  "estimated_review_time_minutes": 15,
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

[Documentation Home](../../../../README.md) > [src](../../../README.md) > [features](../../README.md) > [kb](../README.md) > [components](./README.md) > **KbDetailView.mdx**

---

# KbDetailView.tsx

> **File:** `src/features/kb/components/KbDetailView.tsx`

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

This file exports a single React functional component KbDetailView({ kbId }: { kbId: string }) which is a client-side component ("use client"). Its primary responsibilities are: fetch a KB document by id using react-query, render different UI sections depending on the KB's sourceType (url, article, or uploaded file), show document metadata (id, source, status, version, updatedAt), and provide action buttons for navigating back, editing (conditionally), and deleting the KB. The component uses shared UI primitives (KbShell, Card, Badge, Button, AsyncState) and project API helpers (fetchKbDoc, deleteKbDoc). It also uses formatDateTime to render timestamps and sonner toast to surface mutation results to users.

In the larger application this component is a detail view for KB items (likely reachable from a KB list). Data flow: useQuery with queryKey ["kb-doc", kbId] calls fetchKbDoc(kbId) to load the document; the UI shows loading/error/empty states via AsyncState; on successful load the document is rendered. The delete flow uses useMutation which calls deleteKbDoc(kbId), and on success invalidates the ["kb-list"] cache entry via queryClient.invalidateQueries, displays a success toast and navigates back to "/kb/list". The component intentionally runs on the client because it uses browser APIs (window.confirm) and client navigation (useRouter from next/navigation). The UI contains conditional rendering logic for three source types: "url" (shows URL, crawl mode, page limit, patterns), "article" (title, content, tags rendered as Badge components), and file uploads (fileName, fileTypes, chunkingMode). Status is shown via Badge with a small mapping from Vietnamese status strings to UI tones.

## Dependencies

### External Dependencies

| Module | Usage |
| --- | --- |
| `next/link` | Default import Link: used to wrap Button components to navigate back to /kb/list and to the edit page (/kb/list/{item.id}/edit). Provides client-side link navigation in the UI. |
| `@tanstack/react-query` | Named imports useMutation, useQuery, useQueryClient: useQuery loads the KB document via fetchKbDoc with queryKey ["kb-doc", kbId]; useMutation performs deleteKbDoc(kbId) and relies on useQueryClient to invalidate the ["kb-list"] cache on success. |
| `lucide-react` | Named imports ArrowLeft, Pencil, Trash2: icon components rendered inside Buttons for visual affordances (back, edit, delete actions). |
| `next/navigation` | Named import useRouter: used to obtain router and call router.push('/kb/list') after a successful delete to navigate the user back to the KB list. |
| `sonner` | Named import toast: used to display toast.success on successful deletion and toast.error when deletion fails. |

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/lib/api-client](../@/lib/api-client.md) | Named imports deleteKbDoc and fetchKbDoc: fetchKbDoc(kbId) is the queryFn for useQuery to retrieve the KB document; deleteKbDoc(kbId) is used as the mutationFn for useMutation to remove the KB on user action. |
| [./KbShell](.././KbShell.md) | Named import KbShell: wraps the entire detail view; supplies page title, description and an actions slot where navigation/edit/delete Buttons are rendered. |
| [@/components/ui/badge](../@/components/ui/badge.md) | Named import Badge: used to show the KB status with visual tone mapping and to render article tags (each tag rendered as a Badge). |
| [@/components/ui/card](../@/components/ui/card.md) | Named import Card: used as layout containers for both the main source content and the metadata card. |
| [@/components/ui/button](../@/components/ui/button.md) | Named import Button: used for action controls (Back, Edit, Delete) inside the KbShell actions area. The delete Button uses disabled state bound to removeMutation.isPending and an onClick handler that triggers a confirmation prompt and the mutation. |
| [@/components/shared/async-state](../@/components/shared/async-state.md) | Named import AsyncState: used to render consistent UI for loading (state='loading'), error (state='error' with retry hook), and empty (state='empty' with message) scenarios while fetching the KB document. |
| [@/lib/utils](../@/lib/utils.md) | Named import formatDateTime: used to format item.updatedAt for display in the metadata Card. |

## 📁 Directory

This file is part of the **components** directory. View the [directory index](_docs/src/features/kb/components/README.md) to see all files in this module.

## Architecture Notes

- This is a client-side React functional component ("use client") because it uses browser APIs (window.confirm) and client navigation (useRouter).
- Data fetching and state are managed via @tanstack/react-query: useQuery for loading the KB document and useMutation for deletes. The delete mutation does not perform an optimistic update; instead it invalidates the ["kb-list"] cache on success to refresh the list.
- Error and loading states are centralized into the AsyncState component; mutation success/failure surface user feedback via sonner toast messages.
- UI is composed from small reusable primitives (KbShell, Card, Badge, Button). Conditional rendering is used to display source-specific fields (url, article, file) so the component logic maps data->view explicitly rather than trying to generalize content rendering.

## Usage Examples

### Render the details page for a KB item

Pass KbDetailView a kbId string from the page/router. The component calls useQuery with queryKey ["kb-doc", kbId] and queryFn fetchKbDoc(kbId). While loading, AsyncState(state='loading') is rendered. On success, the component renders source-specific fields: for sourceType 'url' it shows URL, crawl mode, page limit, patterns; for 'article' it shows articleTitle/articleContent/articleTags; otherwise it shows uploaded fileName, fileTypes and chunkingMode. Metadata such as id, source, status, version and formatted updatedAt are shown in a side Card. There are action Buttons for navigating back, editing (if status !== 'Đã học'), and deleting.

### Delete a KB from the detail view

User clicks the delete Button; the onClick handler calls window.confirm with `Xóa KB ${item.id}?`. If confirmed, removeMutation.mutate() is invoked; mutationFn calls deleteKbDoc(kbId). On success the onSuccess callback invalidates the ['kb-list'] query via queryClient.invalidateQueries, displays toast.success(`Đã xóa ${kbId}`), and navigates to '/kb/list' via router.push. On error, toast.error('Không thể xóa KB') is shown. The delete Button is disabled while removeMutation.isPending is true to prevent duplicate submits.

## Maintenance Notes

- Performance: articleContent is rendered directly in a scrollable Card; very large articleContent blocks could impact render performance. Consider virtualization or truncation for very large documents.
- i18n: All visible strings are in Vietnamese in this component; if the app requires localization, extract static strings into i18n resource files.
- Error handling: query errors render AsyncState(state='error') and allow retry via query.refetch(). Delete failures surface a toast but do not provide retry UI — consider exposing a retry or more descriptive error when backend returns structured errors.
- Safety: articleContent is inserted as plain text inside a div (no dangerouslySetInnerHTML), which prevents injecting HTML. If rendering HTML is required, ensure content is sanitized first.
- Testing: unit tests should cover conditional rendering for each sourceType, the status->Badge tone mapping, and the delete flow (confirmation, mutation call, invalidation and navigation). Mock react-query and API client functions for deterministic tests.
- Dependency updates: this file relies on @tanstack/react-query, next (Link/useRouter), and sonner; keep major versions compatible with Next and React to avoid breaking changes in useRouter behavior or react-query cache APIs.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/features/kb/components/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*
