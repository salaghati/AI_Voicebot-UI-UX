<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/app/(console)/bot-engine/inbound/create/page.tsx",
  "source_hash": "0e2f3c4e03bb7eb59d006bdacc5d97d3766bc11b8e026262290cad09cb83b4c6",
  "last_updated": "2026-03-10T03:49:33.705709+00:00",
  "git_sha": "4d2dd6152ce296774b9dadb65f3aacf01d1034d1",
  "tokens_used": 9086,
  "complexity_score": 3,
  "estimated_review_time_minutes": 10,
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

[Documentation Home](../../../../../../README.md) > [src](../../../../../README.md) > [app](../../../../README.md) > [(console)](../../../README.md) > [bot-engine](../../README.md) > [inbound](../README.md) > [create](./README.md) > **page.mdx**

---

# page.tsx

> **File:** `src/app/(console)/bot-engine/inbound/create/page.tsx`

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

This file exports a default React functional component InboundCreatePage() which renders a multi-step wizard for creating an inbound route. The UI is implemented as controlled inputs (Input, Textarea, Select) and a stepper built from a steps constant. Local UI state is managed with useState for a draft object containing keys: name, description, queue, extension, workflowId, kbId, fallbackRuleId. A validate() arrow function performs per-step validation and shows inline toast notifications (sonner) on invalid input. The component uses react-query (useQuery) to load active KB fallback rules (fetchActiveKbFallbackRules) and displays loading and empty-state messages when appropriate.

In terms of integration within the system, this page is a client-side Next.js route built with Next's Link for navigation back to the inbound listing. It uses a set of internal UI primitives (PageHeader, Button, Card, Input, Select, Textarea) and mock reference data (knowledgeRefs, workflowRefs) to populate select lists. The final submit path is mocked: when the user finishes the steps the UI shows a success toast message rather than performing a persisted API call. The file therefore primarily serves the front-end flow and UX for route creation, while relying on other internal modules (e.g., fetchActiveKbFallbackRules) for sandboxed data retrieval.

Key behaviors and design decisions: it is a client component ("use client"); uses controlled components for predictable form state; uses react-query for idempotent async fetching of fallback rules (queryKey: ["kb-fallback-active"]) so the UI can show loading and empty states; validation is step-aware (different required fields at different steps) and driven by a single validate() helper. Strings and UI labels in the component are in Vietnamese, and the final create action is intentionally mocked, showing how the UI would look prior to wiring a real create API call.

## Dependencies

### External Dependencies

| Module | Usage |
| --- | --- |
| `next/link` | Imports default export Link (import Link from "next/link"). Link is used to navigate back to the inbound list via <Link href="/bot-engine/inbound"> wrapping a secondary Button. |
| `react` | Imports useState (import { useState } from "react"). useState provides local component state for the 'step' index and the 'draft' object storing form values. |
| `lucide-react` | Imports icons ArrowLeft, CheckCircle2, Circle (import { ArrowLeft, CheckCircle2, Circle } from "lucide-react"). These icons are used in the header action button and the stepper to indicate completed/current steps. |
| `@tanstack/react-query` | Imports useQuery (import { useQuery } from "@tanstack/react-query"). useQuery is used to load active KB fallback rules by calling the fetchActiveKbFallbackRules function via queryFn and exposing loading and data states to the component. |
| `sonner` | Imports toast (import { toast } from "sonner"). toast.error and toast.success are used throughout for synchronous validation feedback and final success message (mock). |

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/lib/api-client](../@/lib/api-client.md) | Imports fetchActiveKbFallbackRules (import { fetchActiveKbFallbackRules } from "@/lib/api-client"). This internal function is used as the queryFn for useQuery to fetch currently active KB fallback rules to populate the KB Fallback select. |
| [@/components/shared/page-header](../@/components/shared/page-header.md) | Imports PageHeader (import { PageHeader } from "@/components/shared/page-header"). Used to render the page title, description, and an actions slot containing a back link/button. |
| [@/components/ui/button](../@/components/ui/button.md) | Imports Button (import { Button } from "@/components/ui/button"). Buttons are used for step navigation (Quay lại, Tiếp tục) and final actions (Tạo Route), including a secondary variant for the back link. |
| [@/components/ui/card](../@/components/ui/card.md) | Imports Card (import { Card } from "@/components/ui/card"). Card is used to group sections of the UI: the stepper and the form content sections. |
| [@/components/ui/input](../@/components/ui/input.md) | Imports Input (import { Input } from "@/components/ui/input"). Input is used for controlled text inputs such as route name and extension. |
| [@/components/ui/select](../@/components/ui/select.md) | Imports Select (import { Select } from "@/components/ui/select"). Select is used for queue selection, workflow selection, KB selection, and KB fallback rule selection (options populated from workflowRefs, knowledgeRefs, and the fetched fallback rules). |
| [@/components/ui/textarea](../@/components/ui/textarea.md) | Imports Textarea (import { Textarea } from "@/components/ui/textarea"). Textarea is used for the route description field as a controlled component. |
| [@/features/bot-engine/mock](../@/features/bot-engine/mock.md) | Imports knowledgeRefs and workflowRefs (import { knowledgeRefs, workflowRefs } from "@/features/bot-engine/mock"). These mock arrays are used to populate the Workflow and Knowledge Base select options when creating a route in the UI. |

## 📁 Directory

This file is part of the **create** directory. View the [directory index](_docs/src/app/(console)/bot-engine/inbound/create/README.md) to see all files in this module.

## Architecture Notes

- React functional client component pattern: The file begins with the "use client" directive and defines a default-exported functional component InboundCreatePage(). It uses useState for local state and provides a single local validate() helper for per-step validation logic.
- Step-driven UI state: A steps constant defines a fixed ordered list of steps. The UI renders different controlled inputs depending on the current step index. Navigation is implemented by changing the step index and running validate() before moving forward.
- Async fetching with react-query: useQuery({ queryKey: ["kb-fallback-active"], queryFn: fetchActiveKbFallbackRules }) is used to fetch active fallback rules. The component reads fallbackQuery.data and fallbackQuery.isLoading to render options, show a loading message, or an empty-state warning.
- Error/notification handling: sonner's toast is used synchronously for validation errors (e.g., missing name/workflow/KB) and for the mock success path. There is no centralized error boundary; API errors from fetchActiveKbFallbackRules will surface through useQuery's state but are not specifically handled beyond showing an empty list or loading state.
- Mocked final action: The final 'Tạo Route' action does not call any create API; it validates required fields one more time and then calls toast.success with a message noting the result is mocked. Persisting to a backend would be an explicit future integration point.

## Usage Examples

### Create a new inbound route via the multi-step wizard

User opens the page and sees a stepper (steps: Thông tin Route, Queue/Extension, Workflow, Knowledge Base, KB Fallback, Review). Step 0: enter a Route name and Description in controlled Input and Textarea; clicking 'Tiếp tục' runs validate() which ensures name is non-empty (toast.error if empty). Step 1: select Queue and set Extension. Step 2: pick a workflow from workflowRefs (Select populated from mock workflowRefs). If none selected, validate() prevents advancing and shows a toast.error. Step 3: pick a Knowledge Base from knowledgeRefs (Select). Step 4: react-query loads active KB fallback rules via fetchActiveKbFallbackRules; the Select shows fetched rules, a loading text while fetching, or an amber notice when none are active. Step 5: Review shows all draft fields; clicking 'Tạo Route' re-checks required workflow and KB fields and then shows a success toast (mocked create).

## Maintenance Notes

- Validation is minimal and step-scoped. Consider centralizing validation and returning structured error objects so UI can display inline field errors (not only toasts).
- Final submit is mocked; to persist routes implement an API call and handle success/error states, optimistic updates, and server-side validation errors.
- Type safety: the draft state is untyped. Add a TypeScript interface for draft to catch typos and ensure correct types (e.g., workflowId and kbId may be typed as string | null).
- react-query error handling: currently errors from fetchActiveKbFallbackRules are not surfaced explicitly. Add error UI/messages and retry/backoff policies where appropriate.
- Accessibility and i18n: visible strings are in Vietnamese inline in the component. Move strings to a localization resource and ensure form controls have associated labels and ARIA attributes for better accessibility.
- Testing: unit tests should cover validate() behavior (per-step required fields), the step navigation logic, and useQuery handling (loading, empty results). Integration tests should simulate the full wizard flow and final submission behavior.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/app/(console)/bot-engine/inbound/create/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*
