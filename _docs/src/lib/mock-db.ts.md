<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/lib/mock-db.ts",
  "source_hash": "d9e18be8de76152512a128c8ffb453ec821cdad0bfe8f85e9ced759bc61ecbf3",
  "last_updated": "2026-03-10T04:22:01.219170+00:00",
  "tokens_used": 15424,
  "complexity_score": 3,
  "estimated_review_time_minutes": 15,
  "external_dependencies": []
}
```

</details>

[Documentation Home](../../README.md) > [src](../README.md) > [lib](./README.md) > **mock-db**

---

# mock-db.ts

> **File:** `src/lib/mock-db.ts`

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

This file defines several module-level arrays that act as in-memory data stores (campaigns, inbounds, workflows, previewData, callReports, errorMetrics, agentMetrics) and exports a collection of functions that operate on those arrays to simulate typical back-end behavior (list, create, retrieve, update, toggle status, and preview generation). The module relies on typed domain models imported from '@/types/domain' for TypeScript typing and uses three helper utilities (applyFilter, applySort, paginate) from '@/lib/query-utils' to implement filtering, sorting and pagination for list endpoints.

The module offers concrete implementations for common operations: listCampaigns (filter/sort/paginate), createCampaign (generates an id and unshifts to front of campaigns), getCampaignById (find by id), listInbounds/createInbound, listWorkflows/getWorkflowById/createWorkflow/updateWorkflow/toggleWorkflowStatus, getWorkflowPreview (returns previewData or creates a preview via an internal buildWorkflowPreviewFromWorkflow), plus report-related functions (getReportOverview, listInboundReports, listOutboundReports, getCallReport) and metric listing functions (listErrorMetrics, listAgentMetrics). Important implementation details: create* functions mutate the in-memory arrays (unshift), id generation is deterministic/simple (e.g., `CMP-${1000 + campaigns.length + 1}`, `INB-${200 + inbounds.length + 1}`, or `WF_${Date.now().toString().slice(-6)}`), updateWorkflow increments the version by parsing the 'vX.Y' string and adding 0.1, toggleWorkflowStatus flips between "Active" and "Draft", and getWorkflowPreview returns items for a tab and optionally filters by nodeId. The module intentionally returns null for not-found lookups rather than throwing errors, which is suitable for tests and front-end mocks.

## Dependencies

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/types/domain](../@/types/domain.md) | Imported with `import type { ... } from "@/types/domain"` at the top of the file. The imported TypeScript types (AgentMetric, Campaign, CampaignDraft, CallReport, FilterParams, InboundConfig, InboundDraft, ReportOverview, Workflow, WorkflowDraft, WorkflowPreviewItem, ErrorMetric) are used to type the seeded arrays (e.g., `const campaigns: Campaign[] = [...]`) and the exported function signatures (e.g., `export function createCampaign(draft: CampaignDraft)`). This is an internal project module (is_external=false). |
| [@/lib/query-utils](../@/lib/query-utils.md) | Imported with `import { applyFilter, applySort, paginate } from "@/lib/query-utils"`. These three helper functions are used by list functions across the module: applyFilter(...) narrows arrays by FilterParams and specific keys, applySort(...) sorts the filtered result by a default or provided sort string (examples use fields like 'createdAt:desc' or 'startAt:desc'), and paginate(...) slices the sorted array according to page and pageSize. Used in listCampaigns, listInbounds, listWorkflows, listInboundReports, listOutboundReports, listAgentMetrics. This is an internal project module (is_external=false). |

## 📁 Directory

This file is part of the **lib** directory. View the [directory index](_docs/src/lib/README.md) to see all files in this module.

## Architecture Notes

- Pattern: In-memory mock repository — module-level arrays seeded with example objects are used as the single source of truth for this mock DB. Exported functions act as repository methods (list/create/get/update) that mutate or read these arrays.
- Paging & querying: All list endpoints follow the same pattern: applyFilter -> applySort -> paginate. Filtering keys are explicitly passed per list function (e.g., campaigns filtered by ['id','name','workflow','owner']). The filtering and sorting logic is delegated to '@/lib/query-utils'.
- State & mutability: create* functions mutate arrays in-place using unshift (new items are added to the front). updateWorkflow directly replaces element at index. There is no concurrency control; operations are not atomic and the module is not safe for concurrent writes in a multi-threaded or multi-process environment.
- Error handling and return values: Lookups return null when an item isn't found (e.g., getCampaignById returns null). There are no thrown errors for expected conditions — this design simplifies usage in front-end testing but may hide input validation issues.
- Preview generation: getWorkflowPreview first attempts to use static previewData for known workflow IDs; if none exists it calls internal buildWorkflowPreviewFromWorkflow(workflow) which synthesizes session, conversation, kb, and api-log arrays from workflow.nodes.

## Usage Examples

### Create a campaign and then list campaigns with pagination

Call createCampaign(draft: CampaignDraft) to generate a new Campaign object. The function creates an id of the form `CMP-${1000 + campaigns.length + 1}`, sets owner to 'Bạn', status to 'Nháp', createdAt to the current ISO string, unshifts the new object into the campaigns array and returns it. After creation, call listCampaigns(params: FilterParams) to retrieve a paginated list — listCampaigns uses applyFilter(campaigns, params, ['id','name','workflow','owner']), applySort(..., params.sort || 'createdAt:desc') and paginate(..., params.page, params.pageSize). Expected outcome: new campaign appears in page 1 results (assuming default page parameters) and listing respects filter, sort and page arguments.

### Update an existing workflow and obtain a preview

Use updateWorkflow(id: string, draft: WorkflowDraft) to update a workflow already present in the workflows array. The function finds the workflow by id, sets updated fields (name, kind, status, intents, nodes), updates updatedAt to now, and increments version by parsing the numeric part of current.version and adding 0.1 (formatted with one decimal place). After update, call getWorkflowPreview(id: string, tab: string, nodeId?: string) to obtain either the static preview from previewData or a dynamically built preview. getWorkflowPreview returns arrays keyed by tab (e.g., 'session', 'conversation', 'kb', 'api-log') and optionally filters entries by nodeId.

### Query inbound reports with filtering, sorting and pagination

Call listInboundReports(params: FilterParams). The function builds a base set by filtering callReports where item.workflow.includes('WF_'), then calls applyFilter(base, params, ['id','campaign','workflow','customerPhone']), applySort(..., params.sort || 'startAt:desc'), and paginate(...). Expected outcome: a paginated list of call report objects that match criteria in params; each call report includes id, customerPhone, campaign, workflow, intent, durationSec, status, startAt (ISO strings), transcript (array of timestamped utterances) and entities (key/value pairs).

## Maintenance Notes

- Performance: All operations operate on in-memory arrays and use full-array scans for filter/sort; this is fine for small seed sets but will not scale. If test data grows, consider replacing with an indexed in-memory structure or a real DB for performance testing.
- Concurrency and state: Mutations (unshift, direct index replacement) are not thread-safe. In environments with parallel tests or concurrent access, race conditions can occur. Consider cloning arrays or adding simple locking in test harnesses if parallel tests mutate the mock store.
- ID generation stability: Current id schemes are simplistic and depend on array length or Date.now(). They can create collisions in some scenarios (especially across process restarts). If uniqueness across runs is required, switch to UUIDs or a monotonic counter persisted across test runs.
- Date handling: createdAt/updatedAt/startAt use ISO string format via new Date().toISOString(). Consumers should expect ISO timestamps and perform parsing if needed.
- Validation: create and update functions do not validate draft contents beyond assigning fields. If callers supply invalid nodes/intents, inconsistent state can be introduced. Adding lightweight validation or using the TypeScript types at runtime (e.g., zod/pieces) would catch issues earlier.
- Testing: Tests that depend on the seeded state should either reset the module (re-import or provide a reset function) or avoid relying on absolute array positions because create* uses unshift and changes ordering.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/lib/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*


---

## Functions and Classes


#### function buildWorkflowPreviewFromWorkflow

![Type: Sync](https://img.shields.io/badge/Type-Sync-green)

### Signature

```typescript
function buildWorkflowPreviewFromWorkflow(workflow: Workflow)
```

### Description

Generate a preview object containing session, conversation, kb and API log arrays derived from the provided Workflow object.


This function takes a Workflow object and produces a preview representation intended for UI or mock display. It maps workflow.nodes to four separate arrays: "session" (a sequence of system/bot messages with timestamps), "conversation" (messages annotated with speaker and optional confidence for Condition nodes), "kb" (messages for KB-type nodes only), and "api-log" (entries for API and Condition nodes only). For kb and api-log, if there are no matching nodes the function provides a single fallback item describing the absence of KB or API calls. Timestamps are synthesized from node indices; content strings are constructed from node properties (label, value, type). The return value is typed as Record<string, WorkflowPreviewItem[]> and the arrays are created using inline mapping and filtering operations.

### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `workflow` | `Workflow` | ✅ | The source workflow object whose nodes will be transformed into preview items.
<br>**Constraints:** Must have a nodes property that is iterable (array), Each node is expected to have id, label, value, and type properties used in the mappings |

### Returns

**Type:** `Record<string, WorkflowPreviewItem[]>`

An object with keys: 'session', 'conversation', 'kb', and 'api-log', each mapped to an array of WorkflowPreviewItem objects. kb and api-log may contain a single fallback item if no matching nodes are present.


**Possible Values:**

- An object where 'session' contains one item per node in workflow.nodes with speaker = 'System' for index 0 else 'Bot'.
- 'conversation' contains one item per node with speaker 'System' for API nodes else 'Bot'; Condition nodes include a confidence value (0.91) and different content text.
- 'kb' contains items only for nodes with type === 'KB', or a single fallback object stating the workflow does not use KB.
- 'api-log' contains items for nodes with type === 'API' or type === 'Condition', or a single fallback object stating no API call was produced.

### Usage Examples

#### Create a preview from a workflow with mixed node types

```typescript
const preview = buildWorkflowPreviewFromWorkflow(myWorkflow);
```

Produces an object suitable for rendering a mock session, conversation, KB lookup entries and API logs derived from myWorkflow.nodes.

### Complexity

Time: O(n) where n is workflow.nodes.length because the function iterates over nodes multiple times with map/filter operations. Space: O(n) additional space for the returned arrays (session, conversation, kb, api-log).

### Related Functions

- `none` - No other related functions are visible in the provided snippet; this is a standalone transformer in the mock DB module.

### Notes

- Timestamps are synthetically generated using fixed hour/minute prefixes and node index-derived seconds.
- Content strings and speakers are hard-coded and localized (contain Vietnamese phrases).
- The function uses TypeScript 'satisfies' operator to assert array element types for compile-time checking.
- If workflow.nodes is empty, kb and api-log fallbacks use optional chaining to set nodeId and nodeLabel to undefined.

---


