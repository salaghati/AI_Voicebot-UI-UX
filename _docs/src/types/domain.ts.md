<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/types/domain.ts",
  "source_hash": "5c86cfff28d5ad47624d2a01f18c3aa56fa2615d7a942fc640c4bdde98338da7",
  "last_updated": "2026-03-10T04:23:26.397494+00:00",
  "git_sha": "2cbf0148f90982414d1de7b19117e51db3fa5a03",
  "tokens_used": 6670,
  "complexity_score": 2,
  "estimated_review_time_minutes": 10,
  "external_dependencies": []
}
```

</details>

[Documentation Home](../../README.md) > [src](../README.md) > [types](./README.md) > **domain**

---

# domain.ts

> **File:** `src/types/domain.ts`

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

This module is a pure type-definition file: it declares union types, generic result wrappers, paginated structures, filter parameter shapes, and rich interfaces for domain objects such as Campaign, Workflow, WorkflowNode, CallReport, KbDocument, fallback rules, and permission models. Many fields are optional (using ?), and several union types encode allowed status/kind values (for example CampaignStatus, InboundStatus, KbTrainingStatus, KbSourceType). The file also defines generic container types ApiResult<T> and Paginated<T> to represent common API responses.

Because it contains only type declarations (no runtime logic, functions, imports, or side effects), this file is intended to be imported by other TypeScript modules (UI components, services, API clients, or backend handlers) purely for compile-time type checking and to document the expected shape of requests and responses. Important design choices visible in the types: use of string-union literal types for statuses (some in Vietnamese), usage of generics for reusable response shapes, and a highly flexible WorkflowNode interface that captures multiple node kinds (Intent, KB, API, Condition) by making many node-specific properties optional. This file does not interact with external systems directly — it models data exchanged with APIs, storage, and UI layers rather than implementing I/O or business logic.

## Dependencies

No dependencies identified.

## 📁 Directory

This file is part of the **types** directory. View the [directory index](_docs/src/types/README.md) to see all files in this module.

## Architecture Notes

- Type-only module: contains no imports, exports only TypeScript types and interfaces for compile-time checking.
- Uses string literal union types for enumerations (e.g., CampaignStatus, InboundStatus, KbTrainingStatus) which enforces allowed values at compile time but has no runtime representation.
- ApiResult<T> and Paginated<T> are generic DTO shapes that standardize API responses: ApiResult wraps a payload with an optional message; Paginated contains items, total, page and pageSize for list endpoints.
- Workflow-related types (Workflow, WorkflowNode, WorkflowDraft, WorkflowPreviewItem) model a graph of nodes where WorkflowNode is deliberately wide and optional to accommodate multiple node kinds in a single interface rather than using discriminated unions with separate interfaces.

## Usage Examples

### Typing an API client that fetches a paginated list of call reports

An API client function can declare its return type as Promise<ApiResult<Paginated<CallReport>>> so TypeScript enforces that the response object contains data.items (CallReport[]), data.total (number), and pagination fields. UI list components can use data.items to render rows and rely on CallReport fields such as id, customerPhone, status, startAt, and transcript (WorkflowPreviewItem[]). Because fields like transcript and entities are typed, developers get autocompletion when rendering transcripts or extracting entity key/value pairs.

### Building or editing a workflow in a UI canvas

Editor state can use WorkflowDraft and WorkflowNode to type the in-memory model of the graph. Each node has a type: 'Intent' | 'KB' | 'API' | 'Condition' and optional fields for the configuration relevant to that type (e.g., apiUrl, apiMethod, successCondition for API nodes; mainIntent, confidenceThreshold for Intent nodes). When saving, the editor can submit the WorkflowDraft to a REST endpoint; TypeScript ensures the payload adheres to the expected shape (intents: string[], nodes: WorkflowNode[]).

### Displaying knowledge base document metadata in an admin UI

Components rendering KB documents can accept KbDocument objects and display fields like title, status (KbTrainingStatus), sourceType (KbSourceType), version, updatedAt, and optional fields such as url or fileName. Filtering or batch operations can rely on the strongly-typed fields to build queries against the backend.

## Maintenance Notes

- Because status and type enumerations are string literal unions (some in Vietnamese), adding or renaming values requires updating all consuming code — consider centralizing or converting to enum objects if runtime checks are needed.
- WorkflowNode is a broad interface with many optional properties; this provides flexibility but reduces compile-time guarantees for node-specific configs. Consider using discriminated unions (e.g., separate interfaces with a common 'type' field) if stricter validation or exhaustive checks are desired.
- This file provides type-level contracts only. For runtime validation of incoming JSON (from APIs or external systems), add schema validators (e.g., zod, io-ts) or explicit runtime checks to avoid mismatches between runtime data and TypeScript types.
- When adding new fields, ensure backward compatibility for optional fields and update any API clients, mock fixtures, and test data that rely on these types.
- No external dependencies are declared here; keep this file dependency-free to avoid circular imports and to make it safe for both frontend and backend use.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/types/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*
