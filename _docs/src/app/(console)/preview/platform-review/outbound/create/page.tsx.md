<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/app/(console)/preview/platform-review/outbound/create/page.tsx",
  "source_hash": "bb6fcd294d5762da9a01bb9cb9011bea0b5eb2bd9285e234e86646fc2293bc14",
  "last_updated": "2026-03-10T03:57:16.336019+00:00",
  "git_sha": "8f640525060d98fe45bcd9053a00cff9941e36ea",
  "tokens_used": 7990,
  "complexity_score": 3,
  "estimated_review_time_minutes": 15,
  "external_dependencies": [
    "next/link",
    "react",
    "lucide-react",
    "sonner"
  ]
}
```

</details>

[Documentation Home](../../../../../../../README.md) > [src](../../../../../../README.md) > [app](../../../../../README.md) > [(console)](../../../../README.md) > [preview](../../../README.md) > [platform-review](../../README.md) > [outbound](../README.md) > [create](./README.md) > **page.mdx**

---

# page.tsx

> **File:** `src/app/(console)/preview/platform-review/outbound/create/page.tsx`

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

This file exports a default React function component OutboundCreateReviewPage that renders a step-based form (wizard) for creating an Outbound Campaign. It is marked as a client component ("use client"), uses React's useState for local UI state, and renders UI via internal design-system components (PageHeader, Button, Card, Input, Select, Textarea). The component maintains a local draft object with keys { name, description, sourceType, workflowId, kbId, schedule, retryRule } and a steps constant used to drive the stepper UI. Navigation between steps is controlled locally; validation is performed by an inner validate() function that shows toast error messages when required fields are missing for the current step.

The UI presents a left-to-right or top stepper (rendered from the steps array) and conditionally renders different inputs per step: campaign information (name/description), data source selection, workflow selection (populated from workflowRefs filtered by kind === "Outbound"), knowledge base selection (from knowledgeRefs), schedule & retry rule, and a review summary. There are no network or persistence calls in this file; the final "Tạo Campaign" action is a mock that checks draft.workflowId and draft.kbId and then shows a success toast. Key design decisions include: entirely client-side state, controlled inputs for all fields, simple inline validation via toast, and reuse of internal UI components. This file integrates with local mock data (workflowRefs, knowledgeRefs) for select options and navigates back to the outbound list via Next.js Link.

## Dependencies

### External Dependencies

| Module | Usage |
| --- | --- |
| `next/link` | Imports default Link from "next/link" and is used to wrap the "Danh sách" Button to navigate back to "/preview/platform-review/outbound" (client-side navigation). |
| `react` | Imports useState from "react" and is used to manage component-local state: step (current wizard step) and draft (object storing form values). |
| `lucide-react` | Imports ArrowLeft, CheckCircle2, Circle icons from "lucide-react" and uses them in the UI: ArrowLeft in the back/link button and CheckCircle2/Circle to visually indicate completed/current/remaining steps in the stepper. |
| `sonner` | Imports toast from "sonner" and uses it for inline user feedback: toast.error(...) for validation failures and toast.success(...) for the mock create success message. |

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/components/shared/page-header](../@/components/shared/page-header.md) | Imports PageHeader (internal UI component) and uses it to render the page title, description and the action button area at the top of the page. |
| [@/components/ui/button](../@/components/ui/button.md) | Imports Button (internal UI component) and uses it for all clickable actions in the page such as navigation ("Quay lại", "Tiếp tục", "Tạo Campaign") and the header link button. |
| [@/components/ui/card](../@/components/ui/card.md) | Imports Card (internal UI component) and uses it as the primary container for the stepper and form sections to provide card-like layout/padding/styling. |
| [@/components/ui/input](../@/components/ui/input.md) | Imports Input (internal UI component) and uses it as controlled input elements for campaign name, schedule, and retryRule fields (value/onChange pattern tied to draft state). |
| [@/components/ui/select](../@/components/ui/select.md) | Imports Select (internal UI component) and uses it as the controlled select element for selecting workflowId and kbId; options are populated from workflowRefs and knowledgeRefs mock data. |
| [@/components/ui/textarea](../@/components/ui/textarea.md) | Imports Textarea (internal UI component) and uses it as a controlled textarea for the campaign description field, bound to draft.description. |
| [@/features/platform-review/mock](../@/features/platform-review/mock.md) | Imports knowledgeRefs and workflowRefs (mock arrays) and uses them to populate Select options. workflowRefs is filtered by w.kind === "Outbound" when rendering workflow options. |

## 📁 Directory

This file is part of the **create** directory. View the [directory index](_docs/src/app/(console)/preview/platform-review/outbound/create/README.md) to see all files in this module.

## Architecture Notes

- Implements a single React function component OutboundCreateReviewPage as a client-side multi-step wizard using local state (useState). All inputs are controlled components (value/onChange) and update a single draft object via setDraft((p) => ({ ...p, key: value })).
- No server calls or side-effectful persistence are performed here; final creation is mocked via toast.success. The component relies on project internal UI primitives (Button, Card, Input, Select, Textarea) and mock data imports (workflowRefs, knowledgeRefs).
- Validation is synchronous and step-scoped: the validate() inner function checks required fields depending on the current step and uses toast for user-visible errors. Navigation is prevented if validation fails. Error-handling strategy is minimal: user feedback via toasts, no retry or server error flow.
- State management is deliberately simple: a flat draft object plus an integer step. This favors easy serialization if later needed, but currently no persistence (localStorage, API) is implemented.

## Usage Examples

### Create a new Outbound Campaign through the wizard

Open the page and fill step 0: enter Campaign name and Description. Click "Tiếp tục"; validate() ensures name is present. Step 1: choose a data source (File/CRM/Segment) which updates draft.sourceType. Step 2: choose a Workflow from the Select; the options are populated from workflowRefs filtered by kind === "Outbound". If no workflow is selected, validate() will show a toast error when trying to advance. Step 3: choose a Knowledge Base from knowledgeRefs. Step 4: provide schedule and retryRule. Step 5: review the summary which reads draft.name, draft.sourceType, draft.workflowId, draft.kbId. On final "Tạo Campaign" click, the component ensures workflowId and kbId are present and shows a success toast (mock creation).

## Maintenance Notes

- Validation is currently minimal and only step-scoped; consider centralizing validation logic or adding schema validation (e.g., zod) for stronger guarantees and better unit testing.
- No persistence: draft is kept only in memory. If the UX should survive reloads/navigation, implement save-to-server or localStorage sync. When adding server calls, convert the final action from mock to an API POST and show progress/error states.
- Accessibility: verify that interactive buttons are keyboard-accessible and that form controls have associated labels for screen readers (labels are present but ensure aria attributes if custom UI primitives change DOM structure).
- Testing: add unit tests for validate() behavior and integration tests (e.g., React Testing Library) that exercise step transitions and toast error/success flows. Edge cases: empty strings with whitespace, selecting non-Outbound workflows (currently filtered out).
- Potential improvements: extract the wizard state management into a custom hook (useCampaignDraft) if other pages/components need to reuse the draft lifecycle or if persistence is added.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/app/(console)/preview/platform-review/outbound/create/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*
