<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/app/api/campaigns/route.ts",
  "source_hash": "1ab4eed653f5386e146e54fcc0c102dd48b81dd6c1e209ca29e78e539748dc6f",
  "last_updated": "2026-03-10T04:05:34.809356+00:00",
  "git_sha": "5aaba508b2ea4140215cc24255c933db3da3313a",
  "tokens_used": 6118,
  "complexity_score": 2,
  "estimated_review_time_minutes": 10,
  "external_dependencies": [
    "next/server"
  ]
}
```

</details>

[Documentation Home](../../../../README.md) > [src](../../../README.md) > [app](../../README.md) > [api](../README.md) > [campaigns](./README.md) > **route**

---

# route.ts

> **File:** `src/app/api/campaigns/route.ts`

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

This file exports two async route handlers for Next.js: "export async function GET(request: NextRequest) {" and "export async function POST(request: NextRequest) {". The GET handler enforces an early guard via guardMockState(request) which may return a Response (for example on invalid state or auth simulation). If the mock state (from getMockState(request)) equals the literal string "empty", GET returns a JSON payload with an empty items array and paging metadata: { data: { items: [], total: 0, page: 1, pageSize: 10 } }. Otherwise GET extracts filters via getFilters(request) and returns { data: listCampaigns(filters) } where listCampaigns is an imported mock-db helper that produces the campaign list synchronously.

The POST handler reads the request body as JSON (await request.json()), passes that payload to createCampaign(payload) from the mock-db module, and returns a JSON response containing the created data and a localized success message: { data, message: "Tạo chiến dịch thành công" } with HTTP status 201. Both handlers use NextResponse.json to produce responses and rely on three internal utilities (mock-db and mock-http) plus Next.js server primitives. Important design choices: (1) an early guard pattern (guardMockState) can short-circuit handlers by returning a Response; (2) the file delegates data operations to mock-db functions (no persistence logic here); (3) there is no local validation or try/catch — runtime exceptions from createCampaign/listCampaigns/json parsing will propagate as server errors unless upstream middleware handles them.

## Dependencies

### External Dependencies

| Module | Usage |
| --- | --- |
| `next/server` | Imports NextRequest and NextResponse. NextRequest is used as the function parameter type for both exported handlers (GET and POST). NextResponse.json(...) is used to construct JSON HTTP responses and to set the response status for POST ({ status: 201 }). |

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/lib/mock-db](../@/lib/mock-db.md) | Imports createCampaign and listCampaigns. createCampaign(payload) is called in POST to create a new campaign using the JSON payload from request.json(). listCampaigns(filters) is called in GET to return campaign items according to filters extracted from the incoming request. |
| [@/lib/mock-http](../@/lib/mock-http.md) | Imports getFilters, getMockState, and guardMockState. guardMockState(request) is awaited at the start of GET and may return a Response that should be forwarded unchanged. getMockState(request) is used to detect the literal "empty" state and return an empty paged response shape. getFilters(request) extracts query/filter parameters passed to listCampaigns. |

## 📁 Directory

This file is part of the **campaigns** directory. View the [directory index](_docs/src/app/api/campaigns/README.md) to see all files in this module.

## Architecture Notes

- Uses Next.js route handler pattern: exports async functions named GET and POST that accept a NextRequest and return NextResponse objects.
- Asynchronous control flow uses async/await for request parsing (request.json()) and for calling guardMockState which may perform asynchronous checks; other helper calls (createCampaign, listCampaigns, getFilters, getMockState) are treated as synchronous in this file.
- Early-guard pattern: GET first calls guardMockState(request) and immediately returns its value if truthy. This allows centralized short-circuit responses (e.g., simulated auth, error injection) from mock-http without duplicating logic in the handler.
- Error handling is minimal: there are no try/catch blocks, so JSON parsing errors or exceptions thrown by createCampaign/listCampaigns will propagate as 500 responses handled by Next.js runtime or upstream middleware.
- State management is delegated: this file does not persist or mutate database state itself; it relies on mock-db functions for data operations, keeping the route handler thin and focused on HTTP-level concerns.

## Usage Examples

### GET request when mock state is 'empty'

When a client issues a GET /api/campaigns and getMockState(request) returns the string "empty", the handler returns a JSON payload that represents an empty paged result: { data: { items: [], total: 0, page: 1, pageSize: 10 } }. Sequence: request arrives -> guardMockState(request) is awaited (may short-circuit) -> getMockState(request) === 'empty' -> return NextResponse.json(...) with empty page data. No calls to getFilters or listCampaigns are made in this branch.

### GET request with filters to list campaigns

A normal GET /api/campaigns request follows: request arrives -> await guardMockState(request) (no short-circuit) -> getMockState(request) not 'empty' -> filters = getFilters(request) -> response = listCampaigns(filters) -> return NextResponse.json({ data: response }). The handler delegates filtering logic to getFilters and data retrieval to listCampaigns. The returned JSON wraps the listCampaigns output under a top-level data property.

### POST request to create a campaign

Client sends POST /api/campaigns with a JSON body describing a new campaign. Sequence: request.json() is awaited to parse the payload -> createCampaign(payload) is called and its return value is assigned to data -> the handler returns NextResponse.json({ data, message: 'Tạo chiến dịch thành công' }, { status: 201 }). There is no server-side validation here, so malformed or incomplete payloads rely on createCampaign to validate or will lead to runtime errors.

## Maintenance Notes

- Add input validation and explicit error handling around request.json() and createCampaign to provide clearer client errors (400) instead of unhandled 500s. Wrap handler bodies in try/catch and return structured error responses.
- createCampaign and listCampaigns are from a mock DB module — if you swap to a real DB, ensure createCampaign becomes async if it performs I/O and update POST to await it accordingly.
- Guard behavior (guardMockState) can short-circuit handlers; unit tests should include cases where guardMockState returns a Response to verify the early return behavior.
- The success message in POST is localized (Vietnamese). If internationalization is required, extract messages to a localization layer instead of hardcoding strings.
- Concurrency: if mock-db stores in-memory state, tests that create campaigns in parallel may interfere with each other. Consider resetting mock state between tests or making the mock DB isolated per-test.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/app/api/campaigns/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*
