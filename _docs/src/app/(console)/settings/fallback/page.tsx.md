<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/app/(console)/settings/fallback/page.tsx",
  "source_hash": "d1c647c19c80233803890137e21380e7a99fa672904b2862e37f87905fa1ebc0",
  "last_updated": "2026-03-10T04:00:35.894530+00:00",
  "git_sha": "8785fc7783eb878a4512bd8f92acbbc870a5c1b7",
  "tokens_used": 7760,
  "complexity_score": 3,
  "estimated_review_time_minutes": 10,
  "external_dependencies": [
    "react-hook-form",
    "@tanstack/react-query",
    "sonner"
  ]
}
```

</details>

[Documentation Home](../../../../../README.md) > [src](../../../../README.md) > [app](../../../README.md) > [(console)](../../README.md) > [settings](../README.md) > [fallback](./README.md) > **page.mdx**

---

# page.tsx

> **File:** `src/app/(console)/settings/fallback/page.tsx`

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

This file exports a single React functional component named exactly "export default function SettingsFallbackPage() {" that renders a settings UI for system/model fallback behavior. It uses react-hook-form to manage form state with predefined defaultValues for each fallback option (sttRetry, sttAction, sttMessage, ttsRetry, ttsAction, ttsProvider, llmTimeout, llmAction, llmSafeMessage, apiRetry, apiTimeout, apiAction). The UI is composed with project-specific layout and form primitives (SettingsShell, Card, Select, Input, Textarea, Button). On submit the form values are passed to a react-query mutation (useMutation) whose mutationFn is updateFallbackSettings; successful/failed saves trigger sonner toast notifications.

This component fits into an administrative/settings area of the application: it is a client-only page ("use client" directive) that collects configuration values and delegates persistence to an internal API client function (updateFallbackSettings). Key workflows are: rendering the current (default) configuration, allowing edits via form controls (numbers, selects, textareas), reset to defaults via form.reset(), and saving changes via mutation.mutate(values) wrapped by react-query to manage remote update state. The component disables the submit button while the mutation is pending and provides immediate user feedback using toasts for success and failure. Note: form default values and input values are strings (even for numeric inputs) because register() is used without explicit value parsing; this has implications for the payload shape sent to updateFallbackSettings and should be validated/converted if the API expects numeric types.

## Dependencies

### External Dependencies

| Module | Usage |
| --- | --- |
| `react-hook-form` | Imports useForm and is used to create a form instance with defaultValues and to register inputs: const form = useForm({ defaultValues: { ... } }); and inputs use {...form.register("fieldName")} to bind values. |
| `@tanstack/react-query` | Imports useMutation and is used to create a mutation that calls updateFallbackSettings. The mutation manages pending state (mutation.isPending) and triggers onSuccess/onError callbacks. |
| `sonner` | Imports toast and is used inside the mutation callbacks to show user feedback: toast.success(...) on successful save and toast.error(...) on failure. |

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/lib/api-client](../@/lib/api-client.md) | Imports updateFallbackSettings which is passed as the mutationFn to useMutation. This is the internal API client function responsible for persisting fallback configuration to the backend. |
| [@/features/settings](../@/features/settings.md) | Imports SettingsShell which provides the page layout and metadata (title, description, section) wrapping the form UI. |
| [@/components/ui/card](../@/components/ui/card.md) | Imports Card UI primitive to visually group related settings (one Card per error domain: STT, TTS, LLM, API). |
| [@/components/ui/select](../@/components/ui/select.md) | Imports Select UI component used for choice fields like sttAction, ttsAction, ttsProvider, llmAction, apiAction. Each Select is registered with react-hook-form. |
| [@/components/ui/input](../@/components/ui/input.md) | Imports Input UI component used for number and timeout fields (sttRetry, ttsRetry, llmTimeout, apiRetry, apiTimeout). These inputs are registered with react-hook-form; note that the registered values are strings by default. |
| [@/components/ui/textarea](../@/components/ui/textarea.md) | Imports Textarea UI component used for multi-line messages (sttMessage, llmSafeMessage) and registered with react-hook-form. |
| [@/components/ui/button](../@/components/ui/button.md) | Imports Button UI component used for form actions: a secondary cancel button that calls form.reset() and a primary submit button that is disabled when mutation.isPending. |

## 📁 Directory

This file is part of the **fallback** directory. View the [directory index](_docs/src/app/(console)/settings/fallback/README.md) to see all files in this module.

## Architecture Notes

- Component type: A single functional React component using hooks (useForm & useMutation). No classes are defined.
- State management: Local form state is managed by react-hook-form; remote update lifecycle is managed by react-query's useMutation. There is no global state interaction in this file.
- Data flow: form.defaultValues -> user edits (registered inputs) -> onSubmit calls form.handleSubmit which passes collected values to mutation.mutate(values) -> mutationFn (updateFallbackSettings) performs API call -> onSuccess/onError display toasts.
- Error handling: Minimal; the file relies on mutation callbacks to show toast messages. There is no per-field validation or display of server-side errors inside the form UI.
- Design decisions: The component opts for composition of small UI primitives (Card, Select, Input, Textarea) and declarative form registration. Numeric inputs are registered without type coercion, so values are strings unless updateFallbackSettings handles conversion.

## Usage Examples

### Administrator updates fallback settings and saves them

An admin navigates to the System / Model Fallback page (this component). The form is pre-populated from defaultValues declared in useForm. The admin modifies values (e.g., changes sttRetry from "2" to "3", edits sttMessage) and clicks the primary 'Lưu cấu hình' button. form.handleSubmit collects the current registered field values (strings), calls mutation.mutate(values). The mutation calls updateFallbackSettings(values). If the API responds successfully, onSuccess triggers toast.success("Lưu cấu hình Fallback thành công"); on failure toast.error("Không thể lưu cấu hình Fallback"). While the mutation is in progress the submit button is disabled and its label changes to "Đang lưu...". The cancel button calls form.reset() to revert to the original defaultValues.

## Maintenance Notes

- Type handling: Registered inputs (including type="number") produce string values with react-hook-form unless valueAsNumber or manual parsing is used. Confirm whether updateFallbackSettings expects numeric types; if so, convert values before calling mutation.mutate or use register options like { valueAsNumber: true }.
- Validation: There is no client-side validation. Add validations (react-hook-form validate/schema integration, e.g., with zod or yup) to prevent invalid timeouts, negative retries, or empty required messages.
- User feedback: Current error handling only shows a generic toast. Consider surfacing server validation errors inline per-field and preserving server error details for debugging.
- Testing: Unit/Integration tests should verify: form defaultValues, field registration, submit path calls updateFallbackSettings with expected shape, disabled state during mutation, and toast triggers on success/error.
- Future improvements: Load current persisted settings from backend on mount (instead of hardcoded defaultValues) so the UI reflects saved configuration. Add optimistic UI or confirm-save flows as required by product UX.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/app/(console)/settings/fallback/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*
