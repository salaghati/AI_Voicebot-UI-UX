<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/app/(console)/preview/platform-review/inbound/create/page.tsx",
  "source_hash": "3a67e10425a3eb9be76b83e48a3bf0d3a740135ea6ca5998d7bd99fa55902d10",
  "last_updated": "2026-03-10T03:56:43.040666+00:00",
  "git_sha": "5127230bc357339357637c8d31ce59554463da3d",
  "tokens_used": 5785,
  "complexity_score": 3,
  "estimated_review_time_minutes": 10,
  "external_dependencies": [
    "next/link",
    "react",
    "lucide-react",
    "sonner"
  ]
}
```

</details>

[Documentation Home](../../../../../../../README.md) > [src](../../../../../../README.md) > [app](../../../../../README.md) > [(console)](../../../../README.md) > [preview](../../../README.md) > [platform-review](../../README.md) > [inbound](../README.md) > [create](./README.md) > **page.mdx**

---

# page.tsx

> **File:** `src/app/(console)/preview/platform-review/inbound/create/page.tsx`

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

This file exports a client-rendered React functional component that implements a multi-step form for creating an inbound route in a preview/mock area. It manages local UI state with useState, stores form values in a single draft object (name, description, queue, extension, workflowId, kbId), and renders a left-side step navigator alongside a content pane. Each step exposes controlled inputs or selects and a primary action that advances the step after lightweight client-side validation. Visual cues indicate completed and upcoming steps using icon components, and the final step shows a review summary and a mock "create" action.

All data operations are mocked: workflow and knowledge options are read from internal mock arrays and there are no network requests or persistence. The component integrates internal UI primitives (PageHeader, Button, Card, Input, Select, Textarea) and uses sonner to emit localized toast notifications for validation errors and success. This implementation is suitable for preview/prototyping but requires backend integration, typing improvements, and accessibility enhancements before production use.

## Dependencies

### External Dependencies

| Module | Usage |
| --- | --- |
| `next/link` | Used as Link component to navigate back to the inbound listing (href="/preview/platform-review/inbound"). Imported via: import Link from "next/link"; |
| `react` | Uses the useState hook to manage local component state (step number and draft object). Imported via: import { useState } from "react"; |
| `lucide-react` | Provides icon components used in the UI: ArrowLeft (back button icon), CheckCircle2 (completed step indicator), and Circle (incomplete step indicator). Imported via: import { ArrowLeft, CheckCircle2, Circle } from "lucide-react"; |
| `sonner` | Provides toast notifications for validation errors and success messages (toast.error and toast.success). Imported via: import { toast } from "sonner"; |

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/components/shared/page-header](../@/components/shared/page-header.md) | Renders the top PageHeader with title, description, and an actions slot containing the back link/button. Imported via: import { PageHeader } from "@/components/shared/page-header"; |
| [@/components/ui/button](../@/components/ui/button.md) | UI primitive for clickable buttons across the page (secondary/back buttons and primary actions). Imported via: import { Button } from "@/components/ui/button"; |
| [@/components/ui/card](../@/components/ui/card.md) | Card layout container used to group the step navigation and the form content blocks. Imported via: import { Card } from "@/components/ui/card"; |
| [@/components/ui/input](../@/components/ui/input.md) | Controlled text input component used for 'Route name' and 'Extension'. Imported via: import { Input } from "@/components/ui/input"; |
| [@/components/ui/select](../@/components/ui/select.md) | Controlled select/dropdown UI used for Queue, Workflow, and Knowledge Base selections. Imported via: import { Select } from "@/components/ui/select"; |
| [@/components/ui/textarea](../@/components/ui/textarea.md) | Controlled textarea used for the route description field. Imported via: import { Textarea } from "@/components/ui/textarea"; |
| [@/features/platform-review/mock](../@/features/platform-review/mock.md) | Provides mock arrays workflowRefs and knowledgeRefs which are iterated to render <option> items for workflow and knowledge base selection. Imported via: import { knowledgeRefs, workflowRefs } from "@/features/platform-review/mock"; |

## 📁 Directory

This file is part of the **create** directory. View the [directory index](_docs/src/app/(console)/preview/platform-review/inbound/create/README.md) to see all files in this module.

## Architecture Notes

- Implements a single React functional component marked with "use client" so it runs fully on the client; state is entirely local using useState.
- Uses controlled form inputs bound to a single draft object (keys: name, description, queue, extension, workflowId, kbId). This central draft object is updated via setDraft with shallow merges.
- Step navigation pattern: numeric 'step' state indexes into a constant steps array; step buttons set the current step directly and a primary action increments the step after validation. Visual step state uses conditional rendering and icon components.
- Error handling is simple: synchronous validation inside validate() triggers toast.error messages and prevents navigation; final creation logic also checks required fields and displays a mock success toast. There is no try/catch or async handling because there are no network calls.
- No server/API interactions or persistence; the component relies on internal mock data (workflowRefs/knowledgeRefs) and local UI primitives, making it suitable for preview or prototyping but not production-ready without backend integration.

## Usage Examples

### Create an inbound route (happy path)

User opens the page, fills 'Route name' and optional 'Description' on step 0, then clicks 'Tiếp tục'. validate() ensures name is not empty. On step 1 the user picks a Queue (default 'Queue Payment') and sets an extension, then clicks 'Tiếp tục'. On step 2 the user selects a workflow from options populated by workflowRefs; validate() requires workflowId on this step. On step 3 the user selects a Knowledge Base from knowledgeRefs; validate() requires kbId on this step. On step 4 (Review), clicking 'Tạo Route' triggers a final check for both workflowId and kbId and then shows toast.success("Tạo inbound route thành công (mock). "). No network requests occur; the result is purely visual/mock feedback.

### Step validation failure (missing name)

If the user attempts to move forward from step 0 without entering a non-empty route name, validate() calls toast.error with message "Nhập tên route trước." and prevents advancing. This pattern repeats for step 2 (workflow required) and step 3 (KB required), each producing specific localized toast.error messages.

## Maintenance Notes

- Performance: trivial UI — no heavy computations. Re-rendering occurs on every draft change; if inputs become numerous, consider splitting draft into smaller pieces or using useReducer for predictable updates.
- Type safety: draft is untyped (implicit any inferred). Consider adding a TypeScript interface for the draft state to catch typos and enforce fields (e.g., interface Draft { name: string; description: string; queue: string; extension: string; workflowId: string; kbId: string; }).
- Testing: unit tests should cover validate() behavior (per-step validation) and that the appropriate toast messages are emitted. UI tests should assert conditional rendering per step and that workflowRefs/knowledgeRefs are used to populate selects.
- Accessibility & UX: step buttons are plain <button>s but could use aria-current on the active step and better focus management when switching steps. Select and input components depend on underlying UI primitives — ensure they forward aria attributes.
- Enhancements: integrate real backend endpoints for saving routes, add optimistic updates/loading states for network calls, and persist queued selection via query params or local storage if desired.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/app/(console)/preview/platform-review/inbound/create/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*
