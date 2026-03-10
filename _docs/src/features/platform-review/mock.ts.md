<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/features/platform-review/mock.ts",
  "source_hash": "563b2b72ff4b3632c7c668c3973547c39c6546de840608c3d52790c926383250",
  "last_updated": "2026-03-10T04:17:43.295468+00:00",
  "git_sha": "a1e43ff496a892c1671a68b7e4289a1c5f3e9e93",
  "tokens_used": 7132,
  "complexity_score": 2,
  "estimated_review_time_minutes": 10,
  "external_dependencies": []
}
```

</details>

[Documentation Home](../../../README.md) > [src](../../README.md) > [features](../README.md) > [platform-review](./README.md) > **mock**

---

# mock.ts

> **File:** `src/features/platform-review/mock.ts`

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

This file defines TypeScript type aliases and interfaces that describe domain shapes used by the platform-review feature (workflows, knowledge base references, outbound campaign previews, inbound route previews). It then exports several constant arrays filled with realistic mock records (workflowRefs, knowledgeRefs, outboundCampaignsMock, inboundRoutesMock) that follow those interfaces. The file uses union string literal types for statuses (OutboundStatus and InboundStatus) and ISO-8601 timestamp strings for createdAt/updatedAt values.

At module scope it exposes two pure lookup helper functions: getWorkflowRef(id: string) and getKnowledgeRef(id: string). Each performs a linear array search using Array.prototype.find on the corresponding exported constant and returns the matching item or null. There are no external imports, no side effects, and no I/O: the file is strictly a source of static, in-memory fixtures meant for UI preview, local testing, or storybook-style renderers. Important details developers should note: status and summary fields are localized (Vietnamese); workflow.kind is a literal union of "Inbound" | "Outbound" | "Playground"; timestamps are stored as strings; and the lookup functions intentionally return null when not found rather than throwing errors.

## Dependencies

No dependencies identified.

## 📁 Directory

This file is part of the **platform-review** directory. View the [directory index](_docs/src/features/platform-review/README.md) to see all files in this module.

## Architecture Notes

- Module-exported, read-only mock fixtures pattern: data is declared as `const` arrays of typed objects and exported for consumption by UI, tests, or storybook components.
- Type-level safety: the file uses TypeScript string literal union types (OutboundStatus, InboundStatus) and interfaces (WorkflowRef, KnowledgeRef, OutboundCampaignPreview, InboundRoutePreview) to ensure consumers get consistent fields and value domains.
- Lookup helpers are synchronous, pure, and trivial: getWorkflowRef(id: string) and getKnowledgeRef(id: string) perform a linear scan over arrays and return the first match or null. This is simple but O(n) per lookup.
- No external dependencies or side effects: there are no imports, no network or file access, and no mutation logic. Mock data is static; consumers should not rely on runtime mutations of these arrays.

## Usage Examples

### Render a workflow preview card in UI

A component that displays details for a workflow can import { workflowRefs, getWorkflowRef } from this module. If the component receives a workflow id, call getWorkflowRef(id) to retrieve the WorkflowRef or receive null. Example flow: (1) component receives id='WF_ThuNo_A'; (2) call getWorkflowRef('WF_ThuNo_A'); (3) function returns the WorkflowRef object with fields id, name, kind, version, updatedAt, summary; (4) component renders the name, kind and summary. If null is returned, render a not-found state. No try/catch is required because the function never throws.

### Unit test using outbound campaign mocks

A unit test for an outbound campaign summary component can import outboundCampaignsMock and assert rendering logic. Test flow: (1) import outboundCampaignsMock; (2) pick an item e.g., outboundCampaignsMock[0] (CMP-1001); (3) pass object into renderer and verify displayed fields: name, totalCalls (number), successRate (number), schedule (string). Because data is static and typed, tests are deterministic. If a lookup by workflow is needed, call getWorkflowRef(campaign.workflowId) to get the workflow metadata for assertion.

## Maintenance Notes

- Performance: lookup helpers use linear search (Array.find). For larger mock datasets or frequent lookups, consider building an index map (Record<string, WorkflowRef>) at module init to achieve O(1) lookups.
- Type strictness: functions do not have explicit return type annotations; adding explicit returns (e.g., export function getWorkflowRef(id: string): WorkflowRef | null) improves readability and prevents accidental type widening.
- Localization: many string literals (status, summaries) are in Vietnamese and are part of the mock payloads. If tests or components expect English values, adapt or provide translations in the mock set.
- Timestamps: createdAt/updatedAt are ISO-8601 strings. Consumers that need Date objects should parse them explicitly (new Date(...)). Keep consistency if other modules expect Date instances.
- Edge cases and tests: add tests that check getWorkflowRef/getKnowledgeRef return null for unknown ids, and behavior when multiple items share the same id (current implementation returns the first match).

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/features/platform-review/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*
