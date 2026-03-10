<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/app/(console)/kb/add/page.tsx",
  "source_hash": "9feefefe688c9f2fe4bd1ff3027620b91a005c0cdc791143f2951992abce48e5",
  "last_updated": "2026-03-10T03:53:05.257869+00:00",
  "git_sha": "5b71f93a9e59264b1aa20033708d1d0e8d2bb819",
  "tokens_used": 7627,
  "complexity_score": 3,
  "estimated_review_time_minutes": 10,
  "external_dependencies": [
    "react",
    "@tanstack/react-query",
    "lucide-react",
    "next/navigation",
    "sonner"
  ]
}
```

</details>

[Documentation Home](../../../../../README.md) > [src](../../../../README.md) > [app](../../../README.md) > [(console)](../../README.md) > [kb](../README.md) > [add](./README.md) > **page.mdx**

---

# page.tsx

> **File:** `src/app/(console)/kb/add/page.tsx`

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

This file exports a single default React functional component KbAddPage that renders a selection grid of KB source types (URL, Article, File) and conditionally displays a KbSourceForm in a modal layout when the user selects a source. A small constant sourceCards contains metadata (type, title, description, icon) for each selectable source. Local UI state is managed via useState for the currently selected source type (activeType) and useMemo for resolving the active source metadata (activeMeta). The component uses lucide-react icons for visual representation and composition components Card and Button for layout and actions.

The component integrates with application-level services: it uses a React Query mutation (useMutation) configured with createKbDoc as the mutation function to create the KB on submit, and useQueryClient to invalidate the cached list of KBs (queryKey ["kb-list"]) on success. It also uses next/navigation's useRouter to navigate back to the KB list after successful creation and sonner's toast to display success/error messages (the messages in this file are in Vietnamese). The KbShell component is used as the page frame, providing a title, description, and a secondary action button that navigates back to the KB list. The KbSourceForm receives props including the chosen sourceType, mode, layout, submitting state (from the mutation), and handlers for cancel and submit; onSubmit forwards the form payload to mutation.mutate(payload).

## Dependencies

### External Dependencies

| Module | Usage |
| --- | --- |
| `react` | Imports useMemo and useState from 'react' to manage component state (activeType) and compute memoized derived value (activeMeta) based on activeType. Marked as external (npm). |
| `@tanstack/react-query` | Imports useMutation and useQueryClient from '@tanstack/react-query'. useMutation is used to call createKbDoc and track mutation state (mutation.isPending and mutation.mutate). useQueryClient is used to call queryClient.invalidateQueries({ queryKey: ['kb-list'] }) on successful creation to refresh the KB list cache. Marked as external (npm). |
| `lucide-react` | Imports FileText, Files, Globe2 icon components which are used in the sourceCards array to render per-source icons inside each Card. Marked as external (npm). |
| `next/navigation` | Imports useRouter from 'next/navigation' to programmatically navigate the user (router.push('/kb/list')) both when clicking the 'Về danh sách KB' button and after successful KB creation. Marked as external (next.js). |
| `sonner` | Imports toast from 'sonner' to display user feedback: toast.success('Đã thêm KB mới vào danh sách') on successful creation and toast.error('Không thể tạo KB') on error. Marked as external (npm). |

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/lib/api-client](../@/lib/api-client.md) | Imports createKbDoc from '@/lib/api-client' and passes it as the mutationFn to useMutation; this is the API client call that actually creates the KB document on submit. Marked as internal to the repository. |
| [@/features/kb](../@/features/kb.md) | Imports KbShell from '@/features/kb' which is used as the page container component providing title, description and actions UI for this KB creation page. Marked as internal to the repository. |
| [@/components/ui/button](../@/components/ui/button.md) | Imports Button from '@/components/ui/button' to render action buttons (primary/secondary) used both in the card list and in the KbShell actions. Marked as internal to the repository. |
| [@/components/ui/card](../@/components/ui/card.md) | Imports Card from '@/components/ui/card' used to render each selectable source card with consistent styling. Marked as internal to the repository. |
| [@/features/kb/components/KbSourceForm](../@/features/kb/components/KbSourceForm.md) | Imports KbSourceForm from '@/features/kb/components/KbSourceForm' which is rendered as a modal form when a source type is active. Props passed include sourceType, mode='create', layout='modal', submitting (mutation.isPending), onCancel, and onSubmit (which calls mutation.mutate). Marked as internal to the repository. |
| [@/types/domain](../@/types/domain.md) | Imports the TypeScript type KbSourceType (import type { KbSourceType } from '@/types/domain') used to type the sourceCards array and the activeType state to ensure only valid source types are used. Marked as internal to the repository. |

## 📁 Directory

This file is part of the **add** directory. View the [directory index](_docs/src/app/(console)/kb/add/README.md) to see all files in this module.

## Architecture Notes

- This is a single React functional page component using hooks (useState, useMemo) and React Query for mutation and cache invalidation. The component is primarily a UI orchestration layer — it does not implement the API call itself but delegates to createKbDoc from the internal API client.
- State management: local UI state (activeType) is handled with useState. Server-side mutation state and cache management are delegated to @tanstack/react-query via useMutation and useQueryClient. The UI disables cancel when mutation.isPending (prevents closing the form mid-request).
- Error handling and user feedback: mutation onSuccess/onError callbacks display toast notifications (sonner) and perform cache invalidation + navigation on success. The code assumes createKbDoc will throw or return a rejected promise on failure so onError will trigger.
- Rendering pattern: sourceCards is a module-level constant array of metadata objects (type, title, description, icon). The component maps over this constant to render uniform Card entries; selecting an entry sets activeType, which triggers conditional rendering of KbSourceForm in 'modal' layout.

## Usage Examples

### User creates a KB from a URL source

User clicks the 'URL Source' card's 'Mở form URL Source' button which calls setActiveType('url'). The component resolves activeMeta via useMemo and renders KbSourceForm with sourceType='url', mode='create', layout='modal'. When the user submits the form, onSubmit calls mutation.mutate(payload) where payload is whatever the KbSourceForm passes. The mutation runs createKbDoc(payload). While the mutation is in-flight, KbSourceForm receives submitting={mutation.isPending}, and onCancel becomes a no-op if mutation.isPending to prevent closing. If createKbDoc succeeds, the onSuccess callback invalidates the 'kb-list' cache, shows toast.success('Đã thêm KB mới vào danh sách'), clears activeType, and navigates to '/kb/list'. If it fails, toast.error('Không thể tạo KB') is shown.

## Maintenance Notes

- Verify React Query version compatibility: this code references mutation.isPending. Confirm the installed @tanstack/react-query version exposes isPending (or adjust to isLoading/isMutating depending on version to ensure correct submit/cancel behavior).
- Ensure createKbDoc payload contract: KbSourceForm must produce the expected payload shape for createKbDoc. Add type assertions/tests that KbSourceForm outputs align with createKbDoc's expected input to avoid runtime errors.
- Internationalization: user-facing strings are hard-coded in Vietnamese inside this file ('Đã thêm KB mới vào danh sách', 'Không thể tạo KB', button labels). If multi-language support is required, refactor to use the application's i18n solution.
- Testing: add integration/UI tests that cover selecting each source card, opening the form, submitting a payload, and verifying the mutation callbacks (success path should call invalidateQueries and router.push). Add a test to ensure the onCancel guard blocks while mutation.isPending.
- Performance: sourceCards is a small static array so no performance concerns. Keep the rendering of icons and cards simple; avoid heavy synchronous logic during render.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/app/(console)/kb/add/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*
