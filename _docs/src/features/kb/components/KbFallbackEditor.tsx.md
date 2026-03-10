<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/features/kb/components/KbFallbackEditor.tsx",
  "source_hash": "9a75c246415c689d7556c944ef60d46c3eced64eddca7e07ffe5984fdfa8fcb6",
  "last_updated": "2026-03-10T04:17:05.998470+00:00",
  "git_sha": "10707b7a5d10f5ad2969fe1bb43978be09aeec19",
  "tokens_used": 6365,
  "complexity_score": 4,
  "estimated_review_time_minutes": 15,
  "external_dependencies": [
    "next/link",
    "react",
    "@tanstack/react-query",
    "react-hook-form",
    "lucide-react",
    "next/navigation",
    "sonner"
  ]
}
```

</details>

[Documentation Home](../../../../README.md) > [src](../../../README.md) > [features](../../README.md) > [kb](../README.md) > [components](./README.md) > **KbFallbackEditor.mdx**

---

# KbFallbackEditor.tsx

> **File:** `src/features/kb/components/KbFallbackEditor.tsx`

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

This file exports a React functional component KbFallbackEditor that renders a form-driven editor for knowledge-base fallback rules used to create and edit rules. It uses react-hook-form for local form state and useWatch to observe fields that drive conditional UI, and @tanstack/react-query to fetch an existing rule when editing and to perform create/update mutations. Next.js navigation and sonner toasts handle post-save navigation and user feedback.

The component initializes defaultValues, resets the form when fetched data arrives, and conditionally shows transfer-agent override controls when nextAction === "TRANSFER_AGENT". API calls are delegated to createKbFallbackRule, fetchKbFallbackRule, and updateKbFallbackRule. Client-side validation is minimal (valueAsNumber on maxWaitSec); server-side validation is expected for production robustness.

## Dependencies

### External Dependencies

| Module | Usage |
| --- | --- |
| `next/link` | Uses the Link component to wrap navigation targets for 'Back/Cancel' buttons and the action button in the KbShell header (e.g., <Link href={...}><Button>...</Button></Link>). |
| `react` | Imports useEffect and useMemo. useEffect resets form values when fetched data arrives; useMemo computes a previewId from fallbackId to avoid recalculation on each render. |
| `@tanstack/react-query` | Imports useMutation and useQuery. useQuery fetches an existing KB fallback rule when editing (queryKey ['kb-fallback', fallbackId]), and useMutation performs create or update requests and handles onSuccess/onError callbacks. |
| `react-hook-form` | Imports useForm and useWatch. useForm initializes the form with defaultValues and provides register/handleSubmit/reset/setValue; useWatch observes nextAction, onFailAction, status, and active to conditionally render parts of the UI. |
| `lucide-react` | Imports the ArrowLeft icon used inside the back button rendered in the header action area. |
| `next/navigation` | Imports useRouter to programmatically navigate after successful create/update (router.push to the new/updated rule detail page). |
| `sonner` | Imports toast to display user-visible success and error messages when create/update mutations succeed or fail (toast.success, toast.error). |

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/lib/api-client](../@/lib/api-client.md) | Imports createKbFallbackRule, fetchKbFallbackRule, updateKbFallbackRule. fetchKbFallbackRule is used as the query function when editing; createKbFallbackRule/updateKbFallbackRule are used by the mutation function to persist form data to the server. |
| [./KbShell](.././KbShell.md) | Imports the KbShell layout/wrapper component used as the outer container providing title, description, and header action slot for the editor page. |
| [@/components/ui/button](../@/components/ui/button.md) | Imports Button component used for form submission, cancel action, and header navigation button. |
| [@/components/ui/card](../@/components/ui/card.md) | Imports Card component used as the main container for the form content. |
| [@/components/ui/input](../@/components/ui/input.md) | Imports Input used for single-line inputs such as 'name' and numeric 'maxWaitSec'. |
| [@/components/ui/select](../@/components/ui/select.md) | Imports Select used for 'category', 'targetQueue', and 'onFailAction' dropdowns. |
| [@/components/ui/textarea](../@/components/ui/textarea.md) | Imports Textarea used for multi-line fields responseText and ttsText. |
| [@/components/shared/async-state](../@/components/shared/async-state.md) | Imports AsyncState to render loading/error/empty states for the initial fetch (query.isLoading, query.isError, and missing data when editing). |
| [./kb-fallback-meta](.././kb-fallback-meta.md) | Imports kbFallbackCategoryOptions, kbFallbackFailActions, kbFallbackNextActions, kbFallbackQueueOptions arrays which provide option lists used to render the category select, next action radio options, target queue options, and fail-action select. |
| [@/types/domain](../@/types/domain.md) | Imports the type KbFallbackRule (type-only import) to derive the form type KbFallbackFormValues = Omit<KbFallbackRule, 'id' | 'updatedAt'> for strong typing of the form data. |

## 📁 Directory

This file is part of the **components** directory. View the [directory index](_docs/src/features/kb/components/README.md) to see all files in this module.

## Architecture Notes

- This is a React functional component using hooks for state management: react-hook-form for local form state and field watching, and react-query for server state (fetching and mutating KB fallback rules). The separation keeps server calls declarative (useQuery/useMutation) and local UI state isolated to the form.
- Conditional rendering pattern: useWatch values (nextAction, onFailAction, status, active) are observed to render different UI blocks without re-registering the entire form. This reduces coupling between UI and form state but requires careful attention to re-render triggers.
- Side-effect handling: useEffect resets the form when query.data?.data becomes available. Mutations handle navigation and toast notifications in onSuccess/onError callbacks. There is no optimistic update or rollback logic.
- Error handling: Initial fetch errors are surfaced through AsyncState with a retry; mutation errors are shown via toast.error. Server-side validation is assumed but not implemented in the form (no client-side validation rules are provided besides valueAsNumber on maxWaitSec).

## Usage Examples

### Create a new KB fallback rule

Render <KbFallbackEditor /> with no fallbackId. The form is initialized from defaultValues. The user edits fields (name, category, responseText, etc.). On submit, useMutation calls createKbFallbackRule(payload). If successful, the onSuccess callback shows a success toast and navigates to /kb/fallback/{newId} using router.push. On error, a toast.error is displayed. While the create request is pending the submit button is disabled and shows 'Đang lưu...'.

### Edit an existing KB fallback rule

Render <KbFallbackEditor fallbackId="FBK-123" />. useQuery (queryKey ['kb-fallback', fallbackId]) calls fetchKbFallbackRule(fallbackId). While loading, AsyncState with 'loading' is shown; if error, AsyncState shows an error and allows retry. When data arrives, useEffect resets the form values with the fetched rule fields. The user updates fields and submits; mutation calls updateKbFallbackRule(fallbackId, payload). On success, a success toast appears and the router navigates to /kb/fallback/{id}. The UI shows transfer-agent override controls only if nextAction is set to 'TRANSFER_AGENT', and will show a special inline error/info if onFailAction is 'PLAY_ERROR_MESSAGE'.

## Maintenance Notes

- Add explicit client-side validation rules (required fields, max/min for maxWaitSec) to prevent invalid payloads being sent to the API and to provide faster user feedback.
- Consider debouncing or memoizing expensive derived values if more watch fields are added; useWatch can cause more re-renders when many fields are observed.
- Mutation error handling is minimal (toast). For better UX, show field-level errors if the API returns validation failures and avoid blind navigation on ambiguous success responses.
- Testing: cover flows for create vs edit, conditional rendering of TRANSFER_AGENT block, setting maxWaitSec via quick-select buttons, and behavior when fetch returns empty (query.data?.data undefined). Add unit tests that mock react-query fetch/mutate and assert navigation/toast behavior.
- Potential enhancement: support optimistic updates in list/detail views and add a loading indicator for the mutation scope to disable/visualize field interactions during save.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/features/kb/components/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*
