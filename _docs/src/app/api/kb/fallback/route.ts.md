<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/app/api/kb/fallback/route.ts",
  "source_hash": "cad87de653ef66207bd9e472119cc9db6b1289b3213e4ed1b3110815e6126adf",
  "last_updated": "2026-03-10T04:06:46.039982+00:00",
  "git_sha": "19453a1791fef1dde464de6fec9117f9b8e289c8",
  "tokens_used": 6458,
  "complexity_score": 2,
  "estimated_review_time_minutes": 10,
  "external_dependencies": [
    "next/server"
  ]
}
```

</details>

[Documentation Home](../../../../../README.md) > [src](../../../../README.md) > [app](../../../README.md) > [api](../../README.md) > [kb](../README.md) > [fallback](./README.md) > **route**

---

# route.ts

> **File:** `src/app/api/kb/fallback/route.ts`

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

This file exports two asynchronous route handler functions named GET and POST (Next.js App Router convention). The GET handler uses guardMockState(request) to potentially short-circuit and return a response (if the guard returns a truthy value). If the guard does not short-circuit, GET calls getMockState(request) and if it equals the literal string "empty" it returns NextResponse.json({ data: [] }). Otherwise it calls listKbFallbackRules() to obtain an array of rule objects and, if the request URL includes the search parameter active=true, filters that array to only rules whose r.active is truthy. The final response from GET is NextResponse.json({ data: rules }). The POST handler reads the JSON payload from the request body (await request.json()), passes that payload to createKbFallbackRule(payload) and returns NextResponse.json({ data, message: "Tạo KB fallback thành công" }, { status: 201 }). Both handlers use NextRequest and NextResponse from "next/server" and are asynchronous functions.

This route is implemented against internal mock modules ("@/lib/mock-phase2" and "@/lib/mock-http"), so it is intended for development/testing or a mock phase rather than production persistence. The code assumes listKbFallbackRules() returns an array of rule-like objects (with an active boolean or truthy property) and that createKbFallbackRule(payload) returns the created rule representation. Key design choices visible in the file: early request guarding via guardMockState, a simple query-string-driven filter for active rules, and a single-language (Vietnamese) success message on POST. There is minimal validation, no try/catch error handling, and no persistent storage integration in this file; those responsibilities are delegated to the imported mock modules.

## Dependencies

### External Dependencies

| Module | Usage |
| --- | --- |
| `next/server` | Imports NextRequest and NextResponse (import { NextRequest, NextResponse } from "next/server"); used in function signatures (GET(request: NextRequest), POST(request: NextRequest)) and to build JSON HTTP responses via NextResponse.json(...) |

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/lib/mock-phase2](../@/lib/mock-phase2.md) | Imports createKbFallbackRule and listKbFallbackRules (import { createKbFallbackRule, listKbFallbackRules } from "@/lib/mock-phase2"); listKbFallbackRules() is called by GET to retrieve the array of fallback rule objects, and createKbFallbackRule(payload) is called by POST to create and return a new mock rule based on the request payload. |
| [@/lib/mock-http](../@/lib/mock-http.md) | Imports getMockState and guardMockState (import { getMockState, guardMockState } from "@/lib/mock-http"); guardMockState(request) is awaited at the start of GET to possibly short-circuit the request with an early response, and getMockState(request) is used to detect the literal "empty" state which causes GET to return an empty data array. |

## 📁 Directory

This file is part of the **fallback** directory. View the [directory index](_docs/src/app/api/kb/fallback/README.md) to see all files in this module.

## Architecture Notes

- Uses Next.js App Router route handler convention: exported async functions named GET and POST that accept a NextRequest and return a NextResponse (or a value convertible to a Response).
- Asynchronous non-blocking I/O pattern: both handlers are async and use await for guardMockState and request.json().
- Early-return guard pattern: GET calls guardMockState(request) and returns its value directly if truthy, allowing test/mocking middleware to short-circuit behavior without further processing.
- Query-parameter-based filtering: GET inspects request.nextUrl.searchParams.get("active") and strictly compares to the string "true" to decide whether to filter rules by their active property.
- Minimal error handling: there is no try/catch around JSON parsing or mock-library calls; the file delegates error handling and state persistence semantics to imported mock modules.

## Usage Examples

### Fetch all KB fallback rules

A client issues a GET to /api/kb/fallback. Server-side: GET(request) first awaits guardMockState(request); if guardMockState returns a Response-like value it is returned immediately. If not, getMockState(request) is checked and if it equals "empty" the handler returns NextResponse.json({ data: [] }). Otherwise listKbFallbackRules() is called to obtain an array of rules; because the URL did not include active=true the full list is returned as JSON in the shape { data: rules }. No additional validation is performed.

### Fetch only active KB fallback rules

A client issues GET /api/kb/fallback?active=true. The handler follows the same guard and mock-state checks; when it calls listKbFallbackRules() it filters the returned array with rules.filter((r) => r.active) (i.e., truthy active property) and returns NextResponse.json({ data: filteredRules }).

### Create a new KB fallback rule

A client issues POST /api/kb/fallback with a JSON body describing a rule. The POST handler awaits request.json() to parse the payload, then calls createKbFallbackRule(payload). The returned object is included in the response body under the data key, and the handler returns NextResponse.json({ data, message: "Tạo KB fallback thành công" }, { status: 201 }). The handler does not perform payload validation or error translation, so malformed payloads or errors from the mock library will propagate unless the mock module handles them.

## Maintenance Notes

- Payload validation: POST does not validate the incoming JSON. Add explicit validation or TypeScript interfaces for the expected rule shape to avoid runtime errors and improve developer DX.
- Error handling: There is no try/catch around request.json() or calls to the mock modules. Consider adding error handling that returns consistent HTTP error codes and messages for malformed input or internal errors.
- Statefulness and concurrency: The file relies on in-memory/mock modules (mock-phase2, mock-http). If those modules maintain shared in-memory state, concurrent test runs or serverless cold starts could cause surprising behavior; consider making the mock state explicit or moving to a test-only storage backend.
- Internationalization: The POST success message is hard-coded in Vietnamese ("Tạo KB fallback thành công"). If the API will be consumed by clients expecting other locales, extract messages to an i18n layer or return machine-friendly fields only.
- Testing: Unit tests should cover guardMockState short-circuiting, getMockState=="empty" handling, active query filtering behavior (including active=false and missing param cases), and POST payload handling and status 201 response.
- Dependency upkeep: Keep Next.js (the environment that provides next/server) up-to-date as route handler semantics can change between Next.js versions.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/app/api/kb/fallback/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*
