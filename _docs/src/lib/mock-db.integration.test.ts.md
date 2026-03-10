<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/lib/mock-db.integration.test.ts",
  "source_hash": "922725f70de9b1f1e035cfbf23db309fb86ddc82f620ee970324593c73adee04",
  "last_updated": "2026-03-10T04:21:42.037725+00:00",
  "git_sha": "174a8d962e6c6dc3a7e2f0f026e21c1f4a6480db",
  "tokens_used": 5936,
  "complexity_score": 2,
  "estimated_review_time_minutes": 5,
  "external_dependencies": []
}
```

</details>

[Documentation Home](../../README.md) > [src](../README.md) > [lib](./README.md) > **mock-db.integration.test**

---

# mock-db.integration.test.ts

> **File:** `src/lib/mock-db.integration.test.ts`

![Complexity: Low](https://img.shields.io/badge/Complexity-Low-green) ![Review Time: 5min](https://img.shields.io/badge/Review_Time-5min-blue)

## 📑 Table of Contents


- [Overview](#overview)
- [Dependencies](#dependencies)
- [Architecture Notes](#architecture-notes)
- [Usage Examples](#usage-examples)
- [Maintenance Notes](#maintenance-notes)
- [Functions and Classes](#functions-and-classes)

---

## Overview

This test module imports four functions from the project's mock database implementation (import { createCampaign, createInbound, listCampaigns, listInbounds } from "@/lib/mock-db"). It defines two integration tests: one that creates a campaign and verifies that listCampaigns reflects an increased total and that the most-recent item matches the created record; and a second test that performs the same checks for an inbound record. Each test follows an arrange-act-assert pattern: it calls list* to capture the count before, calls create* with a literal object of fields (e.g., campaign: name, source, workflow, schedule, callerId, retryRule, note; inbound: name, queue, extension, workflow, fallback, handoverTo, note), then calls list* again and asserts the total increment and that items[0].id equals the created.id.

These tests are small integration checks intended to assert stateful behavior of the mock-db module rather than exercising network or external services. They rely on in-process state provided by the imported mock-db (the tests assume listCampaigns/listInbounds return an object with at least { total: number, items: Array<{ id: any }> }). The file uses Jest-style globals (describe, it, expect) and does not include explicit teardown or isolation, which means the tests depend on the mock-db's handling of shared state across calls within the same test run.

## Dependencies

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/lib/mock-db](../@/lib/mock-db.md) | Imports four named exports from the project's mock database module: createCampaign, createInbound, listCampaigns, listInbounds. The tests call listCampaigns({ page: 1, pageSize: 50 }) to get totals and items, then call createCampaign(...) and createInbound(...) with literal payloads, and finally re-call listCampaigns/listInbounds to assert the total increment and that items[0].id matches the created record's id. |

## 📁 Directory

This file is part of the **lib** directory. View the [directory index](_docs/src/lib/README.md) to see all files in this module.

## Architecture Notes

- Testing pattern: uses Jest-style describe/it blocks and the Arrange-Act-Assert flow (capture state, perform action, assert state change).
- Stateful dependency: tests depend on the mock-db maintaining in-process state across calls within a test (they compare list totals before and after a create operation and check items[0].id).
- No explicit teardown/isolation: there are no resets or cleanup calls in these tests, which can lead to inter-test coupling if mock-db is not reset between tests.
- Assertions are focused and minimal: they check total count increment and that the first listed item has the same id as the created item; they do not assert ordering guarantees beyond items[0], nor do they verify all fields of created records.

## Usage Examples

### Run integration checks for mock-db create/list consistency

Execute the test file with the project's Jest test runner (e.g., npm test or npx jest src/lib/mock-db.integration.test.ts). For the campaign test: the sequence is listCampaigns({ page: 1, pageSize: 50 }) to obtain before.total, call createCampaign({ name: 'Campaign Integration', source: 'CSV', workflow: 'WF_ThuNo_A', schedule: '09:00-12:00', callerId: '19001234', retryRule: '2 lần', note: 'test' }), then call listCampaigns(...) again and assert after.total === before.total + 1 and after.items[0].id === created.id. The inbound test follows the same sequence using listInbounds and createInbound with the inbound fields shown in the test file.

## Maintenance Notes

- Because tests rely on mock-db state, add explicit reset/teardown between tests (or use isolated mock instances) to avoid flakiness when running the whole test suite or running tests in parallel.
- Current assertions check only total and items[0].id; consider adding assertions that verify persisted fields match the input objects or use a lookup-by-id API if provided by mock-db.
- If mock-db is backed by a shared resource or persists across runs, ensure tests use a test-scoped database or unique identifiers to prevent collisions.
- Keep the payload shapes in tests in sync with the mock-db API surface: changes to required fields or return shapes (e.g., items array structure) will break these tests.
- No external dependencies are imported in this file beyond the internal mock-db module; ensure the mock-db module's API remains stable or update tests accordingly when it changes.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/lib/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*
