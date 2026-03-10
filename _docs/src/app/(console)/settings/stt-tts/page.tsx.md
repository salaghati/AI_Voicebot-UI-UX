<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/app/(console)/settings/stt-tts/page.tsx",
  "source_hash": "e8e640578febf4ac0f9dceb65499c998dfc4b9bd271a32a7e5b0e4b58ae9bc6a",
  "last_updated": "2026-03-10T04:01:56.975213+00:00",
  "git_sha": "282e6178eecbf904599c4abdff2c7ce41485dcdd",
  "tokens_used": 8346,
  "complexity_score": 3,
  "estimated_review_time_minutes": 15,
  "external_dependencies": [
    "react",
    "react-hook-form",
    "@tanstack/react-query",
    "sonner"
  ]
}
```

</details>

[Documentation Home](../../../../../README.md) > [src](../../../../README.md) > [app](../../../README.md) > [(console)](../../README.md) > [settings](../README.md) > [stt-tts](./README.md) > **page.mdx**

---

# page.tsx

> **File:** `src/app/(console)/settings/stt-tts/page.tsx`

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

This file exports a single default React functional component SttTtsSettingsPage. The component uses react-hook-form to manage form state and field registration, @tanstack/react-query to fetch and mutate settings via two API client functions (fetchSttTtsSettings and updateSttTtsSettings), and sonner.toast for user notifications. The UI is composed of project UI primitives (SettingsShell, Card, Select, Input, Button, AsyncState) and presents three grouped sections: STT, TTS, and VAD. The form's defaultValues are defined inline; useWatch is used to render live values for ttsSpeed and ttsPitch, and a useEffect synchronizes the form with data returned from the fetch query (query.data?.data) by calling form.reset(...). Submitting the form calls mutation.mutate(values) which invokes updateSttTtsSettings and shows success/error toasts in onSuccess/onError callbacks.

The component fits into a typical Next.js/React application settings area: it acts as a settings page under a SettingsShell that likely provides page-level layout and navigation. It interacts with an internal API client (@/lib/api-client) to load and persist configuration and with internal UI components for consistent styling. Important implementation details are that most form fields are stored as strings (including numerical inputs and the VAD boolean represented as "true"/"false" strings), the mutation state is used to disable the save button and show a saving label, and AsyncState is used to render loading and error states for the initial fetch. The file contains no additional helper functions or classes; all logic is inside the component scope.

## Dependencies

### External Dependencies

| Module | Usage |
| --- | --- |
| `react` | Imports useEffect from 'react' and uses it to synchronize form state (form.reset) when query.data?.data changes; required for the component lifecycle. |
| `react-hook-form` | Imports useForm and useWatch. useForm initializes the form with defaultValues and provides register, handleSubmit, reset, and control. useWatch reads live values for 'ttsSpeed' and 'ttsPitch' to display their current values in the UI. |
| `@tanstack/react-query` | Imports useQuery and useMutation. useQuery is called with queryKey ['settings-stt-tts'] and queryFn fetchSttTtsSettings to load settings. useMutation is configured with mutationFn updateSttTtsSettings and onSuccess/onError handlers to show toast notifications when saving. |
| `sonner` | Imports toast and uses toast.success/toast.error for user feedback: on successful save, on save error, and a mock 'Test Voice' button click. |

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/lib/api-client](../@/lib/api-client.md) | Imports fetchSttTtsSettings and updateSttTtsSettings. fetchSttTtsSettings is passed to useQuery as queryFn to load initial settings. updateSttTtsSettings is passed to useMutation as mutationFn to persist changes when the form is submitted. |
| [@/features/settings](../@/features/settings.md) | Imports SettingsShell, used as the page-level wrapper providing title, description, and section props for layout and contextual UI around the settings form. |
| [@/components/ui/card](../@/components/ui/card.md) | Imports Card and uses it as a layout container for each of the three settings groups (STT, TTS, VAD). |
| [@/components/ui/select](../@/components/ui/select.md) | Imports Select and uses it for select inputs (sttProvider, sttLanguage, sttModel, ttsProvider, ttsVoice). The Select components are registered with react-hook-form via form.register. |
| [@/components/ui/input](../@/components/ui/input.md) | Imports Input and uses it for numeric and range inputs (ttsSpeed range, ttsPitch range, vadSilence number, vadTimeout number, vadMinSpeech number). Inputs are registered with react-hook-form. |
| [@/components/ui/button](../@/components/ui/button.md) | Imports Button and uses it for actions: Test Voice (mock), Cancel (form.reset), and Save (submit). The save button is disabled when mutation.isPending. |
| [@/components/shared/async-state](../@/components/shared/async-state.md) | Imports AsyncState and uses it to render loading and error UI while the settings query is loading or errored (AsyncState state='loading' or state='error' with onRetry calling query.refetch()). |

## 📁 Directory

This file is part of the **stt-tts** directory. View the [directory index](_docs/src/app/(console)/settings/stt-tts/README.md) to see all files in this module.

## Architecture Notes

- This file implements a single React functional component pattern (no classes). It uses react-hook-form for controlled form state and registration, and react-query for declarative data fetching and mutation lifecycle management.
- Data flow: useQuery(fetchSttTtsSettings) populates initial form state via useEffect calling form.reset. Form submit calls mutation.mutate(values) which triggers updateSttTtsSettings. UI feedback uses sonner.toast in mutation callbacks and the AsyncState component for fetch states.
- State management: local component state is minimized; form state is held by react-hook-form. Live UI values for sliders (ttsSpeed, ttsPitch) are read with useWatch. The code treats nearly all values as strings (including numeric inputs and boolean VAD flag represented as 'true'/'false'), so callers of updateSttTtsSettings must accept string-typed fields or the values must be converted before API consumption.
- Error handling: fetch errors are surfaced with AsyncState and retry is wired to query.refetch(). Mutation errors trigger toast.error but do not otherwise alter UI state. There is no validation logic in this file beyond HTML input types; validation (if needed) would need to be added via react-hook-form rules or server-side validation.

## Usage Examples

### Display and edit STT/TTS/VAD settings

When the page mounts, useQuery(fetchSttTtsSettings) runs and the component shows AsyncState while loading. Once data is available, useEffect calls form.reset(...) to populate fields such as sttProvider, ttsProvider, voice, and vad (mapped to 'true'/'false'). The user can change providers, voices, numeric thresholds, and slider values (ttsSpeed/ttsPitch). The ttsSpeed and ttsPitch values are displayed live via useWatch. Clicking 'Lưu cấu hình' submits the form, calling mutation.mutate(values) which invokes updateSttTtsSettings; onSuccess shows toast.success and onError shows toast.error. While the mutation is pending, the Save button is disabled and shows 'Đang lưu...'.

## Maintenance Notes

- Numeric and boolean form values are stored as strings (defaultValues and form.reset set strings). If the backend expects numbers or booleans, convert these values before calling updateSttTtsSettings or update the API client to perform conversion.
- The component assumes query.data?.data contains specific keys: sttProvider, ttsProvider, voice, vad. If the API shape changes, update the mapping inside useEffect accordingly.
- No client-side validation is present beyond basic HTML input types; add react-hook-form validation rules for ranges and required fields if stricter validation is desired.
- Test Voice button currently triggers a mock toast only. Implementing real voice preview will require client-side audio playback integration and potentially streaming audio from the TTS provider.
- Consider accessibility improvements: associate labels with inputs using htmlFor/id, ensure range inputs have accessible value feedback, and ensure screen-reader compatible descriptions for the Test Voice action.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/app/(console)/settings/stt-tts/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*
