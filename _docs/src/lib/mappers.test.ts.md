<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/lib/mappers.test.ts",
  "source_hash": "358844be4e97cbcf82527c980c9a14536840a760afdad0ea64e0c93a77a57446",
  "last_updated": "2026-03-10T04:21:39.728367+00:00",
  "git_sha": "b32c05743a033a3542e585aafedbb43666b2b28a",
  "tokens_used": 5537,
  "complexity_score": 2,
  "estimated_review_time_minutes": 5,
  "external_dependencies": []
}
```

</details>

[Documentation Home](../../README.md) > [src](../README.md) > [lib](./README.md) > **mappers.test**

---

# mappers.test.ts

> **File:** `src/lib/mappers.test.ts`

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

This file contains Jest tests focused on two exported functions from the internal module "@/lib/mappers": mapCampaignToSummary and mapStatusTone. The tests are organized under a single describe block named "mappers" and include two it() test cases. The first test constructs a campaign-like object inline (with fields id, name, status, source, workflow, totalCalls, successRate, owner, createdAt) and asserts that mapCampaignToSummary returns an expected summary object containing id, title, subtitle, and metric. The second test asserts the mapping of three different status strings to badge tones using mapStatusTone.

These are pure unit tests with no external I/O or network interactions. They use the Jest globals describe, it, and expect (toEqual and toBe) to perform assertions. The test data includes Vietnamese status strings ("Đang chạy", "Nháp") and a hard-coded English status ("Failed"), which implies the underlying mappers perform exact string matching/lookup. createdAt is populated using new Date().toISOString() in the fixture but is not asserted in the expectations, indicating the summary mapper does not expose or assert timestamp fields in this test. The file's role in the codebase is to provide deterministic checks that the mapping functions continue to produce the exact shape and values expected by UI summary cards and status badges; it will be run as part of the project's test suite (e.g., jest).

## Dependencies

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/lib/mappers](../@/lib/mappers.md) | Imports named exports mapCampaignToSummary and mapStatusTone. The test file calls mapCampaignToSummary with an inline campaign object and asserts the returned summary object shape and values; it calls mapStatusTone with several status strings and asserts the returned badge tone strings. |

## 📁 Directory

This file is part of the **lib** directory. View the [directory index](_docs/src/lib/README.md) to see all files in this module.

## Architecture Notes

- This is a focused unit-test file following the Arrange-Act-Assert pattern: arrange inline test fixtures, act by calling the mapper, assert using Jest's expect APIs.
- No asynchronous behavior, external services, or side effects are exercised; tests are deterministic and fast.
- Tests depend on exact string values for statuses (including non-ASCII/Vietnamese strings), so the mappers likely use exact string matching rather than locale-insensitive heuristics.
- Error handling isn't demonstrated here; the tests cover only expected, well-formed inputs and do not verify behavior for missing or malformed fields.

## Usage Examples

### Validate mapping of a campaign object to a UI summary card

Create a plain object with fields { id, name, status, source, workflow, totalCalls, successRate, owner, createdAt } and pass it to mapCampaignToSummary. The function is expected to return an object with keys { id, title, subtitle, metric } where subtitle is composed of workflow and source separated by ' • ', and metric is a localized string for totalCalls (e.g., '10 cuộc gọi'). The test uses expect(...).toEqual(...) to assert deep equality of the returned object. No external calls or mutations are performed.

### Verify mapping of status strings to badge tones

Call mapStatusTone with specific status strings and assert the exact returned tone string. Example assertions in the test: mapStatusTone('Đang chạy') shouldBe 'success', mapStatusTone('Failed') shouldBe 'danger', and mapStatusTone('Nháp') shouldBe 'warning'. These checks confirm that the status-to-tone mapping uses literal status values and returns a small set of predefined tone strings.

## Maintenance Notes

- Tests assume exact status string matches (including language-specific characters). If status values are normalized or come from an external source, consider adding normalization tests or updating fixtures.
- The createdAt field is provided in the fixture but not asserted; if time-related behavior is introduced to the mapper, adjust tests to control/verify timestamps (use fixed dates or mocks).
- Add negative/edge-case tests (missing fields, zero totalCalls, unexpected status values) to increase robustness and to document intended fallback behavior of the mappers.
- Keep the import path '@/lib/mappers' in sync with project path aliases; renaming or moving the mappers module will break these tests.
- As tests are lightweight, they should run quickly in CI; if more cases are added, group or parameterize tests to reduce duplication.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/lib/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*
