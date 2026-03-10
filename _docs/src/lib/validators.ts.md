<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/lib/validators.ts",
  "source_hash": "0750900fe872672a78f98b6464e497dc439df7acde5b93103064c83b94aaa17c",
  "last_updated": "2026-03-10T04:23:23.680969+00:00",
  "git_sha": "1851bd975732e56f4b5d5ce7ac2cf8004b9c0089",
  "tokens_used": 5908,
  "complexity_score": 2,
  "estimated_review_time_minutes": 10,
  "external_dependencies": [
    "zod"
  ]
}
```

</details>

[Documentation Home](../../README.md) > [src](../README.md) > [lib](./README.md) > **validators**

---

# validators.ts

> **File:** `src/lib/validators.ts`

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

This module defines and exports multiple Zod schemas (loginSchema, forgotPasswordSchema, campaignStep1Schema, campaignStep2Schema, campaignStep3Schema, inboundStep1Schema, inboundStep2Schema, inboundStep3Schema) to validate request or form data. Each schema is declared with z.object(...) and uses z.string(), z.email(), .min(...) and .optional() to express required fields, minimum lengths, and optional notes. The validation error messages are provided in Vietnamese (for example: "Email không hợp lệ", "Mật khẩu tối thiểu 6 ký tự", "Tên chiến dịch tối thiểu 3 ký tự") so this module also acts as a single source of truth for user-facing validation text for these forms.

The file contains no runtime side-effects or I/O; it's a pure module that only imports the Zod library and exports schema constants. Typical integration points are form handlers, API endpoints, or controllers that import these schemas and call Zod's parse/safeParse to validate incoming payloads before applying business logic or persistence. The design decision to keep small, per-step schemas (campaignStep1/2/3 and inboundStep1/2/3) makes it straightforward to validate multi-step forms incrementally and reuse schemas in different parts of the UI or backend validation flow.

## Dependencies

### External Dependencies

| Module | Usage |
| --- | --- |
| `zod` | Imports the named binding 'z' (import { z } from "zod"); used throughout the file to declare validation schemas: z.object(...), z.string(), z.email(), .min(...), and .optional(). These utilities are used to express required fields, minimum lengths and to attach Vietnamese error messages to each validator. |

## 📁 Directory

This file is part of the **lib** directory. View the [directory index](_docs/src/lib/README.md) to see all files in this module.

## Architecture Notes

- Declarative schema definitions: each exported constant is a z.object(...) describing a small focused payload (login, forgot password, campaign/inbound steps). This encourages reuse and single-responsibility for each step of multi-step forms.
- Pure module with no side effects: the file only declares and exports schemas; it does not perform I/O, async operations, or mutate external state.
- Validation strategy: leverage Zod for synchronous validation. Consumers should call schema.parse() to throw on invalid input or schema.safeParse() to inspect validation issues and return structured errors to callers/UI.
- Error messages are embedded in the schema (Vietnamese strings). If localization is required later, these messages should be extracted to a localization layer instead of keeping them inline.

## Usage Examples

### Validating login payload on API endpoint

Import loginSchema and call loginSchema.safeParse(request.body). If safeParse returns success, proceed with authentication logic. If not, map the returned Zod errors to an HTTP 400 response payload and return the Vietnamese validation messages to the client. Example flow: import { loginSchema } from './validators'; const result = loginSchema.safeParse(body); if (!result.success) return res.status(400).json({ errors: result.error.format() });

### Multi-step campaign creation in UI or API

For a multi-step campaign form, validate each step independently with campaignStep1Schema, campaignStep2Schema and campaignStep3Schema as the user progresses. On step submission, call the corresponding schema.parse() (or safeParse()) to validate fields such as name (min 3 characters), source (required), workflow (required), schedule/callerId/retryRule (required). Only when all steps validate should the aggregated payload be accepted for persistence or further processing.

## Maintenance Notes

- Keep validation rules synchronized with UI field names and client-side validations to avoid mismatches (e.g., if the UI renames 'callerId' or changes minimum lengths, update these schemas accordingly).
- Consider extracting inline Vietnamese messages into a localization resource if multi-language support is required in the future.
- Add unit tests that assert schema.accepts() and schema.rejects() specific payload shapes and edge cases (empty strings, too-short values, invalid email formats).
- To derive TypeScript types from these schemas, use z.infer<typeof schema> in consuming modules to keep request types consistent with validation rules.
- Because validation is synchronous and lightweight, performance impact is negligible. However, if schemas grow complex (regex, custom refinements), add focused benchmarks and tests.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/lib/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*
