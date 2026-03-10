<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/lib/validators.test.ts",
  "source_hash": "71e882055717ef271887f910f1d866e59e5dbb04d2196dbac407f3a33ba837ba",
  "last_updated": "2026-03-10T04:23:33.957446+00:00",
  "git_sha": "a796bae323fecdfbbad045e02d7bb7c09f3d6f76",
  "tokens_used": 5851,
  "complexity_score": 2,
  "estimated_review_time_minutes": 10,
  "external_dependencies": []
}
```

</details>

[Documentation Home](../../README.md) > [src](../README.md) > [lib](./README.md) > **validators.test**

---

# validators.test.ts

> **File:** `src/lib/validators.test.ts`

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

This test module imports named schema objects from "@/lib/validators" and exercises their parse(...) behavior to assert correct validation rules. It contains three test blocks: one for login payload validation, one covering a three-step campaign wizard (steps 1–3), and one for the inbound wizard step 1. Each test uses expect(...).not.toThrow() for valid payloads and expect(...).toThrow() for invalid payloads.

The file is a small, self-contained unit test suite intended to run under a Jest/Vitest-style test runner (it uses the describe/it/expect globals). It does not perform I/O or interact with external services; instead it verifies that the imported schemas enforce field presence and basic formatting by calling schema.parse(...) with representative example objects. The tests document the exact example payload shapes the application expects (for example, login payloads with email and password, campaign step payloads with name/source/workflow/schedule/callerId/retryRule, and inbound step payloads with name/queue/extension).

## Dependencies

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/lib/validators](../@/lib/validators.md) | Imports named schema objects campaignStep1Schema, campaignStep2Schema, campaignStep3Schema, inboundStep1Schema, and loginSchema. The test code calls each schema's parse(...) method (e.g., loginSchema.parse(...), campaignStep1Schema.parse(...)) to assert that valid payloads do not throw and invalid payloads do throw. |

## 📁 Directory

This file is part of the **lib** directory. View the [directory index](_docs/src/lib/README.md) to see all files in this module.

## Architecture Notes

- This file implements unit tests using a Jest/Vitest-style structure (describe/it/expect). It relies on test-runner globals rather than explicit imports for testing utilities.
- Validation is exercised by calling schema.parse(...) and asserting whether parsing throws; this treats exceptions thrown by parse as the primary error signal for invalid input.
- No external systems (APIs, databases, files) are touched; tests are synchronous and fast, making them suitable for inclusion in a CI pipeline.

## Usage Examples

### Validating user login payloads

The test calls loginSchema.parse({ email: "admin@voicebot.vn", password: "123456" }) and expects no exception (expect(...).not.toThrow()), demonstrating the schema accepts a well-formed email and password. It then calls loginSchema.parse({ email: "invalid", password: "123456" }) and expects an exception (expect(...).toThrow()), asserting that the schema rejects improperly formatted email values.

### Validating multi-step campaign wizard payloads

The test suite verifies three campaign step schemas: campaignStep1Schema is called with { name: "Campaign A", source: "CRM" }; campaignStep2Schema is called with { workflow: "WF_ThuNo_A" }; campaignStep3Schema is called with { schedule: "09:00-12:00", callerId: "19001234", retryRule: "2 lần" }. Each parse(...) invocation is expected not to throw, confirming the schemas accept those representative values.

### Validating inbound wizard step 1 payloads

The test calls inboundStep1Schema.parse({ name: "Inbound CS", queue: "queue_payment", extension: "801" }) and expects no exception, asserting required fields for the inbound step are present and acceptable.

## Maintenance Notes

- Because tests rely on parse(...) throwing to indicate invalid input, future changes to the validator implementations that change error types or behavior (for example returning error objects instead of throwing) will require updating the assertions.
- Add negative tests for more edge cases (missing fields, wrong types, boundary values) to increase coverage beyond the single invalid-email case in the login test.
- Keep example payloads aligned with real application payloads; when validators change field names or requirements, update these test payloads immediately to prevent false positives.
- If the project migrates to a different validation library or alters the parse API, replace direct parse(...) calls with the library's canonical validation/assertion mechanism in tests.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/lib/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*
