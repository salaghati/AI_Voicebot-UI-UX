<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/features/bot-engine/mock.ts",
  "source_hash": "7de052baf16d90751c80cbf5df14b26ecd95481daac9dda28671ad1ddc2f440b",
  "last_updated": "2026-03-10T04:13:01.594820+00:00",
  "git_sha": "935954f57a635e2eb3c25edadb28d1c9336638d4",
  "tokens_used": 6867,
  "complexity_score": 2,
  "estimated_review_time_minutes": 10,
  "external_dependencies": []
}
```

</details>

[Documentation Home](../../../README.md) > [src](../../README.md) > [features](../README.md) > [bot-engine](./README.md) > **mock**

---

# mock.ts

> **File:** `src/features/bot-engine/mock.ts`

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

This file defines TypeScript types and exports static mock datasets that represent workflows, knowledge base references, outbound campaign previews, and inbound route previews. It declares union types for localized status strings (OutboundStatus, InboundStatus), typed interfaces (KnowledgeRef, OutboundCampaignPreview, InboundRoutePreview, WorkflowRef) describing each record shape, and then instantiates arrays of sample objects: knowledgeRefs, workflowRefs, outboundCampaignsMock, and inboundRoutesMock. Two small helper functions, getWorkflowRef(id: string) and getKnowledgeRef(id: string), perform simple lookups against the corresponding arrays and return either the matching item or null.

The module is a pure, in-memory fixture: there are no imports or external dependencies, no network or database calls, and all timestamps are represented as ISO-8601 strings. The mock records use Vietnamese strings for human-facing fields and union-typed status values (e.g., "Đang chạy", "Hoàn tất"). The exported types and constants make this file suitable for use in UI storybooks, unit tests, local development stubs, or anywhere the application expects the same data shapes as production but without backend integration. Consumers should import the specific arrays or the helper functions to resolve related entities by id (for example, outboundCampaignsMock items reference workflowId and kbId that can be resolved via workflowRefs and knowledgeRefs).

## Dependencies

No dependencies identified.

## 📁 Directory

This file is part of the **bot-engine** directory. View the [directory index](_docs/src/features/bot-engine/README.md) to see all files in this module.

## Architecture Notes

- Module-level mock provider pattern: all data and helper lookups are defined at module scope and exported for direct import by other modules (no classes or services).
- Type safety: uses TypeScript union types and interfaces (OutboundStatus, InboundStatus, KnowledgeRef, OutboundCampaignPreview, InboundRoutePreview, WorkflowRef) to ensure consumers see consistent shapes at compile time.
- Lookup helpers (getWorkflowRef, getKnowledgeRef) are pure, synchronous functions that use Array.prototype.find to return the first matching item or null. They do not throw errors and perform no I/O.
- State mutability note: datasets are exported as const arrays; however, their contents can still be mutated at runtime. They are intended as read-only fixtures—treat them as immutable in tests to avoid shared-state flakiness.
- Error handling approach is minimal: missing lookups return null rather than throwing, letting the caller decide how to handle absent records.

## Usage Examples

### Resolving a campaign's workflow and knowledge reference for display

Import outboundCampaignsMock and the lookup helpers. Take an outbound campaign object (e.g., outboundCampaignsMock[0]) and call getWorkflowRef(campaign.workflowId) and getKnowledgeRef(campaign.kbId). Each call returns either the referenced WorkflowRef or KnowledgeRef object or null. Use returned objects to render workflow.name and knowledge.title. If either lookup returns null, the UI should render a fallback (e.g., 'Unknown workflow'). This sequence maintains separation of concerns: campaigns store only ids, and the helpers map those ids to their full records.

### Using the mocks in unit tests for a component that lists inbound routes

In a test, import inboundRoutesMock and assert expected properties: each InboundRoutePreview contains id, name, workflowId, kbId, queue, extension, entryPoint, updatedAt (ISO string), and status (one of the InboundStatus union). For richer assertions, call getWorkflowRef(route.workflowId) to verify that the route references an existing workflow id. Since getWorkflowRef returns null for unknown ids, tests can assert that routes reference valid workflows or intentionally inject invalid ids to test error handling in the component.

## Maintenance Notes

- When adding new status values, update the union types OutboundStatus and InboundStatus to preserve compile-time checks across all consumers.
- Keep IDs consistent across datasets: outboundCampaignsMock.workflowId and .kbId should match entries in workflowRefs and knowledgeRefs respectively. Tests and UI logic rely on this correspondence.
- Timestamps are plain strings (ISO-8601). If consumers need Date objects, they must parse them (e.g., new Date(updatedAt)).
- Because arrays are exported as mutable consts, accidental mutation in tests can cause cross-test contamination — prefer cloning (e.g., structuredClone or JSON deep copy) when modifying fixtures.
- If this mock data grows large, consider moving to a dedicated fixture loader or JSON files to simplify updates and reduce file size in the TypeScript source.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/features/bot-engine/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*
