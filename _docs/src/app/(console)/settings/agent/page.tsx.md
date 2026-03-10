<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/app/(console)/settings/agent/page.tsx",
  "source_hash": "7bb692940868748743673d8a0f6aca274bce34ebf3ee0d23fdb3098d6ce5d36f",
  "last_updated": "2026-03-10T03:59:57.403970+00:00",
  "git_sha": "a0299669ee6667df830cc35c74b3207201fdc59f",
  "tokens_used": 9040,
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

[Documentation Home](../../../../../README.md) > [src](../../../../README.md) > [app](../../../README.md) > [(console)](../../README.md) > [settings](../README.md) > [agent](./README.md) > **page.mdx**

---

# page.tsx

> **File:** `src/app/(console)/settings/agent/page.tsx`

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

This file implements a client-side React functional component (default export SettingsAgentPage) using React hooks, react-hook-form for form state, and @tanstack/react-query for data fetching and mutation. On mount it issues a query (fetchAgentSettings) to load saved agent handover configuration and resets the main form when data arrives. The component exposes a main form for editing transfer conditions (intents, repeat count, keywords) and a set of checkboxes controlling which context fields to send to an agent (intent, entities, recent history, full transcript). Submitting the main form calls a mutation (updateAgentSettings) and presents success/error feedback via toast messages from sonner. The page also shows loading/error states via an AsyncState component while the query is in-flight or failed.

The component also manages an in-component modal for adding a new agent queue. That modal uses a separate react-hook-form instance (queueForm) with its own default values and, on submit, only performs a mocked save (toast + close modal). The UI is composed from internal UI components (SettingsShell, Card, Input, Button, Select, Textarea, Badge, AsyncState) and a small local constant groups used to render an example list of queues. Important implementation details: the file is a client component ("use client"), it relies on uncontrolled form registration via form.register from react-hook-form, uses useEffect to map query.data into form.reset, and does not implement optimistic updates or client-side validation beyond defaultValues.

## Dependencies

### External Dependencies

| Module | Usage |
| --- | --- |
| `react` | Imports useEffect and useState: useEffect is used to reset the main form when query.data changes; useState manages openQueueModal boolean state for showing/hiding the add-queue modal. |
| `react-hook-form` | Imports useForm: used twice to create two form controllers: `form` for the Agent Handover settings and `queueForm` for the Add Queue modal. The code uses form.register(...) to bind inputs and form.handleSubmit(...) for submission handling, and form.reset(...) to reload server data into the UI. |
| `@tanstack/react-query` | Imports useMutation and useQuery: useQuery with queryKey `['settings-agent']` calls fetchAgentSettings to load existing settings; useMutation with mutationFn updateAgentSettings is invoked on main form submit and uses onSuccess/onError callbacks to show toast notifications. |
| `lucide-react` | Imports the X icon component: used as the close button icon inside the add-queue modal header. |
| `sonner` | Imports toast: used to display success or error messages after mutation on the main form and to show a mocked success message when the Add Queue modal form is submitted. |

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/lib/api-client](../@/lib/api-client.md) | Imports fetchAgentSettings and updateAgentSettings: fetchAgentSettings is used as the queryFn for useQuery to load persisted agent settings; updateAgentSettings is used as the mutationFn for useMutation when the user submits the main settings form. |
| [@/features/settings](../@/features/settings.md) | Imports SettingsShell: used as the page shell wrapper that provides title, description, and section props for consistent settings layout. |
| [@/components/ui/card](../@/components/ui/card.md) | Imports Card component: used throughout to group related UI sections (agent groups list, conditions, context package, modal content). |
| [@/components/ui/input](../@/components/ui/input.md) | Imports Input component: used for text and numeric inputs bound to react-hook-form (transferIntents, transferRepeatCount, queueName, maxWait). |
| [@/components/ui/button](../@/components/ui/button.md) | Imports Button component: used for primary/secondary actions including opening modal, submitting forms, and cancel actions. |
| [@/components/ui/select](../@/components/ui/select.md) | Imports Select component: used in the Add Queue modal for selecting priority (Cao, Trung bình, Đặc biệt) and bound to queueForm.register('priority'). |
| [@/components/ui/textarea](../@/components/ui/textarea.md) | Imports Textarea component: used for transferKeywords in the main form and description field in the Add Queue modal, both registered with react-hook-form. |
| [@/components/shared/async-state](../@/components/shared/async-state.md) | Imports AsyncState component: used to render standardized loading and error states while fetchAgentSettings is loading or has errored; error state provides onRetry that calls query.refetch(). |
| [@/components/ui/badge](../@/components/ui/badge.md) | Imports Badge component: used to display priority labels for the local `groups` list (Cao, Trung bình, Đặc biệt) with different tone props. |

## 📁 Directory

This file is part of the **agent** directory. View the [directory index](_docs/src/app/(console)/settings/agent/README.md) to see all files in this module.

## Architecture Notes

- This file is a client-side React functional component ("use client") that composes UI from shared internal components and coordinates server interaction via react-query. It separates data fetching (useQuery) and side-effectful updates (useMutation) and uses react-hook-form for form state management.
- Data mapping: useEffect watches query.data?.data and calls form.reset with a specific mapping: transferIntents from query.data.data.transferCondition and transferKeywords from query.data.data.transferContext joined by ", ". There is a potential type mismatch: numeric fields are stored as strings in defaultValues and reset values (e.g., transferRepeatCount) which requires careful handling if the API expects numbers.
- Error and UX patterns: loading and error UI are delegated to an AsyncState component; mutation success/error produce toast notifications via sonner. There are no optimistic updates or rollback logic on mutation, and the modal's add-queue form performs a mocked save (no API call).

## Usage Examples

### Edit and save Agent Handover settings

When the page mounts, useQuery(fetchAgentSettings) retrieves persisted settings. useEffect detects query.data and calls form.reset(...) to populate transferIntents, transferKeywords and context checkboxes. The developer or operator edits fields (transfer intents, repeat count, keywords, and context flags) and clicks 'Lưu cấu hình'. The form's handleSubmit passes the values object to mutation.mutate(values), which invokes updateAgentSettings. On mutation success toast.success('Lưu cấu hình Agent thành công') is shown; on failure toast.error('Không thể lưu cấu hình Agent') is shown. If the initial fetch fails, AsyncState is shown with an onRetry calling query.refetch().

### Add a new queue (modal, mocked save)

User clicks 'Thêm nhóm' which sets openQueueModal=true. The modal renders a queueForm with default values (queueName 'Support_L1', priority 'Cao', etc.). On submit, the queueForm.handleSubmit handler triggers toast.success with a formatted message including values.queueName and closes the modal (setOpenQueueModal(false)). No API call is made; this behavior is currently mocked and should be replaced with a real create-queue API call for persistence.

## Maintenance Notes

- Type and validation mismatches: many defaultValues and reset values store numeric values as strings (e.g., transferRepeatCount, maxWait). Consider normalizing types (numbers vs strings) and adding schema validation (zod/yup) to avoid runtime issues or API contract mismatches.
- Server contract mapping: form.reset maps query.data.data.transferCondition and query.data.data.transferContext -> transferIntents/transferKeywords. Confirm the API response shape (transferCondition and transferContext) and the expected payload shape for updateAgentSettings; add transformation logic if updateAgentSettings expects different keys or types.
- Modal behavior: Add Queue modal currently performs a mocked save (toast) only. Implement a proper API call, update the local `groups` state or refetch queues from server after successful creation, and handle validation and error states.
- Testing: Add unit tests for mapping logic (useEffect/form.reset), and integration tests for query/mutation flows (successful and error paths). Also test accessibility of modal (focus trap, ESC to close) and form controls.
- Performance: The component is lightweight; avoid adding heavy synchronous work in renders. If groups list becomes large, derive it from server data and paginate or virtualize the list.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/app/(console)/settings/agent/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*
