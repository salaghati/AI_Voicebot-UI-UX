<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/app/(console)/bot-engine/outbound/create/page.tsx",
  "source_hash": "67cce8072a74923d89e68dc7880700e20791194645d3b7e536887230c5fe5111",
  "last_updated": "2026-03-10T03:52:18.518154+00:00",
  "git_sha": "e2389b3ede01ceb9c91ed44143e724cd61914002",
  "tokens_used": 5506,
  "complexity_score": 3,
  "estimated_review_time_minutes": 15,
  "external_dependencies": [
    "next/link",
    "react",
    "lucide-react",
    "@tanstack/react-query",
    "sonner"
  ]
}
```

</details>

[Documentation Home](../../../../../../README.md) > [src](../../../../../README.md) > [app](../../../../README.md) > [(console)](../../../README.md) > [bot-engine](../../README.md) > [outbound](../README.md) > [create](./README.md) > **page.mdx**

---

# page.tsx

> **File:** `src/app/(console)/bot-engine/outbound/create/page.tsx`

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

This file exports a client-side React component OutboundCreatePage that implements a stepper UI for creating an outbound calling campaign. It manages local form state with useState (step and a draft object containing name, description, sourceType, workflowId, kbId, fallbackRuleId, schedule, retryRule) and validates required fields before advancing between steps. The component renders labeled step buttons, controlled inputs (Input, Textarea, Select), and navigation buttons that run inline validation: campaign name is required early, and workflow and KB selections are enforced before final submission. User feedback and validation messages are surfaced via sonner.toast.

Data fetching is performed with useQuery(['kb-fallback-active'], fetchActiveKbFallbackRules) to load active KB fallback rules; the component expects the API response shape such that items are accessible at fallbackQuery.data?.data and maps that array into Select options. Mock arrays workflowRefs and knowledgeRefs populate workflow and KB selects. The final 'Tạo Campaign' action is a local mock that validates required ids and shows a success or error toast — there is no persistence or creation API call in this file.

## Dependencies

### External Dependencies

| Module | Usage |
| --- | --- |
| `next/link` | Imports Link to render a navigation button that routes back to /bot-engine/outbound using Next.js client-side navigation. |
| `react` | Imports useState hook to manage local component state: step (number) and draft (object with campaign fields). |
| `lucide-react` | Imports ArrowLeft, CheckCircle2, Circle icons used in the header/navigation and step list to indicate progress and link actions. |
| `@tanstack/react-query` | Imports useQuery to fetch active KB fallback rules; the hook is invoked with queryKey ['kb-fallback-active'] and queryFn fetchActiveKbFallbackRules. The component reads fallbackQuery.data?.data and fallbackQuery.isLoading. |
| `sonner` | Imports toast to display user-facing notifications for validation errors, loading states and mock success (toast.error and toast.success used). |

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/lib/api-client](../@/lib/api-client.md) | Imports fetchActiveKbFallbackRules (internal API client function) used as the queryFn for useQuery to retrieve active KB Fallback rules. The component expects the response shape such that items are under data (accessed as fallbackQuery.data?.data). |
| [@/components/shared/page-header](../@/components/shared/page-header.md) | Imports PageHeader internal UI component to render the page title, description and an actions area containing the back link. |
| [@/components/ui/button](../@/components/ui/button.md) | Imports Button internal UI primitive used for navigation (Quay lại, Tiếp tục) and final action (Tạo Campaign). |
| [@/components/ui/card](../@/components/ui/card.md) | Imports Card internal UI primitive used to group the step list, form area and footer actions visually. |
| [@/components/ui/input](../@/components/ui/input.md) | Imports Input internal UI primitive used for controlled text inputs: campaign name, schedule, retry rule. |
| [@/components/ui/select](../@/components/ui/select.md) | Imports Select internal UI primitive used to render dropdowns for workflow, KB and KB fallback selection. The component binds Select value to draft keys and handles onChange to update draft state. |
| [@/components/ui/textarea](../@/components/ui/textarea.md) | Imports Textarea internal UI primitive used for the campaign description field (controlled textarea bound to draft.description). |
| [@/features/bot-engine/mock](../@/features/bot-engine/mock.md) | Imports knowledgeRefs and workflowRefs (mock data arrays). These are used to populate the workflow and knowledge base select options (workflowRefs filtered by kind === 'Outbound'). |

## 📁 Directory

This file is part of the **create** directory. View the [directory index](_docs/src/app/(console)/bot-engine/outbound/create/README.md) to see all files in this module.

## Architecture Notes

- Client-only React component ("use client") using useState for local state and useQuery for a single read operation (active KB fallback rules). No server-side rendering is used here.
- Implements a stepper/wizard pattern with a numeric step index and per-step validation enforced before advancing.
- Form state is held in a single flat draft object and inputs are controlled components that shallow-merge updates via setDraft.

## Usage Examples

### Creating a new Outbound Campaign (happy path)

User enters a campaign name on step 0 and advances. They choose an Outbound workflow on the workflow step (populated from workflowRefs) and select a KB on the KB step (from knowledgeRefs). On the review step they click 'Tạo Campaign', which performs final local validation and shows a success toast. There is no network creation in this file.

### Selecting a KB Fallback rule

When navigating to the fallback rule step the component uses useQuery(['kb-fallback-active'], fetchActiveKbFallbackRules) to load rules. The Select renders an initial '-- Không chọn --' option and maps fallbackQuery.data?.data to options. While loading a small 'Đang tải...' hint is shown; if empty an amber warning guides the user to enable KB Fallbacks.

## Maintenance Notes

- Validation is per-step and kept inline; extract validation rules if requirements grow or for i18n.
- The code expects fetchActiveKbFallbackRules to return { data: [...] }; adjust data access if the API shape differs.
- Replace mock workflowRefs/knowledgeRefs with API-driven lists and implement a real create API call to persist campaigns.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/app/(console)/bot-engine/outbound/create/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*
