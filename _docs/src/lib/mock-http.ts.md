<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/lib/mock-http.ts",
  "source_hash": "ac253c3483c651dc539f40096651dd2a1fa2ef2b7f8db7690bae63a9f4072aaa",
  "last_updated": "2026-03-10T04:21:36.145050+00:00",
  "git_sha": "facce6a290f28ce8db050eef6eb16c4b3f750bb3",
  "tokens_used": 5822,
  "complexity_score": 2,
  "estimated_review_time_minutes": 10,
  "external_dependencies": [
    "next/server"
  ]
}
```

</details>

[Documentation Home](../../README.md) > [src](../README.md) > [lib](./README.md) > **mock-http**

---

# mock-http.ts

> **File:** `src/lib/mock-http.ts`

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

This module defines a MockState union type and exports three small utilities: getMockState, guardMockState, and getFilters. getMockState reads the "state" query parameter from a NextRequest's nextUrl.searchParams and maps it to one of the allowed MockState values ("loading", "empty", "error", "forbidden", or default "ready"). guardMockState implements the simulated behaviors for certain mock states: it awaits a 900ms sleep for "loading", returns NextResponse.json(...) with a 500 status and a Vietnamese error message for "error", returns NextResponse.json(...) with a 403 status and a Vietnamese forbidden message for "forbidden", and otherwise returns null. getFilters delegates to parseFilterParams to turn request.nextUrl.searchParams into an application-specific filter structure.

This file is designed to be used by Next.js route handlers or middleware during development/testing to mimic backend conditions via a URL query parameter. It interacts with Next.js types (NextRequest and NextResponse) and with two internal helpers: parseFilterParams (to parse filter query parameters) and sleep (to introduce an artificial delay). Important implementation details a developer should know: the exact sleep duration is 900ms (hard-coded), error and forbidden responses contain Vietnamese messages exactly as coded ("Mô phỏng lỗi từ hệ thống" and "Bạn không có quyền truy cập màn hình này"), and unknown or missing "state" query values fall back to "ready". The guardMockState function returns either null (meaning "no mock response, continue normal handling") or a NextResponse JSON response (for error/forbidden), so route handlers should check for a non-null return and short-circuit if provided.

## Dependencies

### External Dependencies

| Module | Usage |
| --- | --- |
| `next/server` | Imports NextRequest and NextResponse: NextRequest is used as the function parameter type for getMockState, guardMockState, and getFilters (to access request.nextUrl.searchParams); NextResponse is used to construct JSON HTTP responses in guardMockState for error (status 500) and forbidden (status 403). |

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/lib/query-utils](../@/lib/query-utils.md) | Imports parseFilterParams which is called in getFilters(request) to convert request.nextUrl.searchParams into the application's filter representation. The module is internal to the project and responsible for parsing query parameters into filter data structures. |
| [@/lib/utils](../@/lib/utils.md) | Imports sleep which is awaited in guardMockState when the mock state is "loading" to introduce a 900ms artificial delay before returning null (allowing handlers to simulate loading behavior). |

## 📁 Directory

This file is part of the **lib** directory. View the [directory index](_docs/src/lib/README.md) to see all files in this module.

## Architecture Notes

- Uses a small, explicit MockState union type ("loading" | "empty" | "error" | "forbidden" | "ready") for clear, compile-time-checked state values.
- Employs async/await for non-blocking behavior: guardMockState is async and awaits sleep(900) for the "loading" case so callers can simulate latency without blocking the event loop.
- Error handling strategy: guardMockState returns NextResponse.json(...) for terminal mock states (error/forbidden) so callers can short-circuit route logic by checking the return value; for non-terminal states it returns null to indicate normal processing should continue.
- Design decision: control is driven entirely by a "state" query parameter in the request URL. Unknown values default to "ready" which simplifies usage but means typos in the query param won't trigger mocks.

## Usage Examples

### Simulate a loading page from a Next.js route handler

In a GET route handler, call const mock = await guardMockState(request); if (mock) return mock; This will await sleep(900) and then return null when state=loading, causing the handler to continue after a 900ms delay. Use URL ?state=loading to trigger behavior.

### Return a simulated server error before route logic runs

Call guardMockState(request) at the start of a handler. If request URL includes ?state=error, guardMockState will immediately return NextResponse.json({ message: "Mô phỏng lỗi từ hệ thống" }, { status: 500 }). The handler should check the returned value and return it to the client instead of proceeding.

### Extract structured filters from request query parameters

Call const filters = getFilters(request) inside a handler. getFilters delegates to parseFilterParams(request.nextUrl.searchParams) to produce the application's filter object/structure; this centralizes query parsing logic in the project's query-utils module.

## Maintenance Notes

- Performance: the only deliberate delay is the hard-coded 900ms sleep. If many requests trigger the loading state concurrently, consider making the delay configurable or conditional to avoid test slowdowns.
- Localization: the error and forbidden messages are hard-coded in Vietnamese. If you need multi-language support, externalize these messages or use a translation helper.
- Testing: unit tests should mock NextRequest.nextUrl.searchParams to cover each state value (loading, empty, error, forbidden, ready) and assert guardMockState's return is either null or a NextResponse with the expected status and JSON body.
- Edge cases: getMockState treats any value not equal to the four listed states as "ready"; if you need stricter validation, update getMockState to validate and optionally return an error or undefined.
- Future improvements: expose the sleep duration or make mock responses configurable (status codes, messages) via additional query params or a dev-only config to increase flexibility.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/lib/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*
