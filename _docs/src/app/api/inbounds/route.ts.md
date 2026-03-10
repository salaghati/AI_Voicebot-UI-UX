<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/app/api/inbounds/route.ts",
  "source_hash": "9f5163e66cd50c86d592affbc8042c78abe49f6a559a7e2d86c83d283aa1ab7f",
  "last_updated": "2026-03-10T04:06:41.845497+00:00",
  "git_sha": "76ba17ce2834c458976ace3f10ae1cb122fe216c",
  "tokens_used": 5715,
  "complexity_score": 2,
  "estimated_review_time_minutes": 10,
  "external_dependencies": [
    "next/server"
  ]
}
```

</details>

[Documentation Home](../../../../README.md) > [src](../../../README.md) > [app](../../README.md) > [api](../README.md) > [inbounds](./README.md) > **route**

---

# route.ts

> **File:** `src/app/api/inbounds/route.ts`

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

This file exports two asynchronous route handler functions (GET and POST) that conform to Next.js app router server handler signatures (accepting a NextRequest and returning a NextResponse). The GET handler first calls guardMockState(request) and returns early if that helper provides a Response; it next checks getMockState(request) === "empty" and, if true, returns a JSON payload with an empty paginated structure ({ data: { items: [], total: 0, page: 1, pageSize: 10 } }). If the mock state is not "empty", the GET handler computes filters via getFilters(request) and returns { data: listInbounds(filters) } (where listInbounds is an internal mock-db function). The POST handler reads the JSON body (await request.json()), calls createInbound(payload) and returns the created item bundled as { data, message: "Tạo inbound thành công" } with HTTP status 201.

This file is part of a test/mock layer in the application: it does not interact with real external data stores but delegates to internal mock modules (@/lib/mock-db and @/lib/mock-http) to emulate behavior. It relies on Next.js server runtime types (NextRequest, NextResponse) and uses async/await for request processing. Important implementation details: there is no explicit payload validation or error handling in the handlers (no try/catch), so exceptions thrown by request.json() or the internal helpers will bubble up to Next.js default error handling. The POST response includes a Vietnamese success message string "Tạo inbound thành công" and sets status 201 to indicate resource creation.

## Dependencies

### External Dependencies

| Module | Usage |
| --- | --- |
| `next/server` | Imports NextRequest and NextResponse: NextRequest is the handler parameter type and provides request utilities (used to read JSON and inspect request data); NextResponse.json is used to produce JSON HTTP responses and to set the 201 status on POST. |

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/lib/mock-db](../@/lib/mock-db.md) | Imports createInbound and listInbounds from the project's mock database module. createInbound(payload) is called by POST to create and return a new inbound record. listInbounds(filters) is called by GET to return a collection of inbound records according to filters computed from the request. |
| [@/lib/mock-http](../@/lib/mock-http.md) | Imports getFilters, getMockState, and guardMockState which control request-level mock behavior. guardMockState(request) can return an early Response (the GET handler returns it directly). getMockState(request) is compared to the string "empty" to return an empty paginated payload. getFilters(request) computes filter parameters passed to listInbounds. |

## 📁 Directory

This file is part of the **inbounds** directory. View the [directory index](_docs/src/app/api/inbounds/README.md) to see all files in this module.

## Architecture Notes

- Uses Next.js app router server route pattern: exported async functions named GET and POST that accept NextRequest and return NextResponse.
- Async/await is used for non-blocking request body parsing (await request.json()) and for calling guardMockState which may be asynchronous.
- Early-return guard pattern: guardMockState(request) can short-circuit processing by returning a Response which the handler forwards unchanged.
- No explicit validation or try/catch: unhandled errors from request parsing or mock helpers will bubble to Next.js error handling middleware; consider adding validation and structured error responses for robustness.

## Usage Examples

### GET /api/inbounds when mock state is empty

A GET request arrives. GET(request) calls guardMockState(request) — if it returns falsy, the handler calls getMockState(request) which returns the string "empty". The handler responds with NextResponse.json({ data: { items: [], total: 0, page: 1, pageSize: 10 } }). No calls to the mock-db listInbounds are made in this path.

### GET /api/inbounds with filters

A GET request that is not short-circuited by guardMockState and whose mock state is not "empty" flows to getFilters(request). The computed filters are passed to listInbounds(filters) and the result is returned as NextResponse.json({ data: listInboundsResult }). This returns the mock-db list output to the client.

### POST /api/inbounds to create a new inbound

A POST request with a JSON body arrives. POST(request) does await request.json() to parse the payload, then calls createInbound(payload). The returned object is included in the response body as { data, message: "Tạo inbound thành công" } and the response status is set to 201. If request.json() or createInbound throws, the error propagates to Next.js.

## Maintenance Notes

- Add input validation for POST payloads: the current implementation assumes payload shape is correct and will let parsing or createInbound throw on invalid data.
- Consider adding try/catch around asynchronous operations to return consistent error responses (JSON with status codes) instead of allowing uncaught exceptions to surface.
- If switching from mock modules to real persistence, replace or adapt createInbound and listInbounds to perform I/O asynchronously and ensure handlers await those operations.
- Localization: the POST success message is in Vietnamese ("Tạo inbound thành công"); ensure message consistency or externalize i18n if needed.
- Tests should cover guardMockState short-circuiting, getMockState === "empty" behavior, filter handling by getFilters, and that POST returns 201 with created payload.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/app/api/inbounds/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*
