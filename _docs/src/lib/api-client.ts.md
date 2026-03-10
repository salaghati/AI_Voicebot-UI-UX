<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/lib/api-client.ts",
  "source_hash": "adb9e2082c5411ae9194668e0e32fa40d20a950a3a1f7af44aac89358277a017",
  "last_updated": "2026-03-10T04:19:49.948612+00:00",
  "git_sha": "f5264d835c4ac9f926750f8d79d97850740a83e9",
  "tokens_used": 8318,
  "complexity_score": 3,
  "estimated_review_time_minutes": 10,
  "external_dependencies": []
}
```

</details>

[Documentation Home](../../README.md) > [src](../README.md) > [lib](./README.md) > **api-client**

---

# api-client.ts

> **File:** `src/lib/api-client.ts`

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

This file implements a lightweight HTTP client and a large set of typed endpoint helper functions. At its core is an async generic request<T>(url: string, init?: RequestInit): Promise<T> wrapper around the global fetch API that sets a JSON content-type header, disables caching (cache: "no-store"), parses JSON responses, and converts non-OK HTTP responses into thrown Errors (attempting to extract an error message from the JSON response). A small utility buildQuery(params?: FilterParams) serializes a FilterParams object into a URL query string (omitting undefined, null, and empty strings).

On top of these primitives the module exports many REST convenience functions (login, forgotPassword, fetchCampaigns, createCampaign, fetchCampaign, fetchWorkflows, createWorkflow, updateWorkflow, toggleWorkflowStatus, fetchWorkflowPreview, report-related fetchers, KB management functions, settings CRUD functions, users/roles/phone-numbers/extensions management, etc.). Each exported function wraps a specific HTTP endpoint, chooses the appropriate HTTP method (GET/POST/PUT/PATCH/DELETE), passes JSON-serialized payloads where required, and types the returned JSON with ApiResult<T> generics imported from the project's domain types. This file does not manage authentication headers, retries, or timeouts — those concerns are left to callers or to global fetch configuration/middleware elsewhere in the application.

## Dependencies

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/types/domain](../@/types/domain.md) | Imported only for TypeScript type annotations used throughout the file. The exact named types imported are: AgentMetric, ApiResult, Campaign, CampaignDraft, CallReport, FilterParams, InboundConfig, InboundDraft, Paginated, ReportOverview, Workflow, WorkflowDraft, WorkflowPreviewItem, ErrorMetric, FallbackRule, KbDocument, KbFallbackRule, RolePermission. These types are used as function parameter and return generics (for example: request<ApiResult<Paginated<Campaign>>>('/api/campaigns' + buildQuery(params))). |

## 📁 Directory

This file is part of the **lib** directory. View the [directory index](_docs/src/lib/README.md) to see all files in this module.

## Architecture Notes

- Implements a thin request wrapper pattern: request<T>(url, init) centralizes JSON header injection, cache disabling (cache: 'no-store'), JSON response parsing, and basic error translation (tries to extract payload.message and otherwise throws a generic Vietnamese error string 'Yêu cầu thất bại (status)').
- All endpoint helpers are small, single-responsibility functions that map to REST endpoints and HTTP verbs. They call the shared request() function and pass typed generics (ApiResult<T>) so callers get compile-time typing for payloads and responses.
- Asynchronous non-blocking I/O is used consistently via async/await. There is no explicit retry, timeout, or cancellation logic — fetch is called directly and the function returns the parsed JSON Promise.
- Error handling: non-2xx responses result in thrown Error objects. The request() tries to parse the response body as JSON to extract a message property; if parsing fails it falls back to a generic message including the status code.
- This module intentionally avoids adding authentication headers (it merges init.headers but does not inject tokens). That design decision delegates auth header management (for example reading a bearer token) to higher-level code or global fetch wrappers.

## Usage Examples

### User authentication (login)

Call login({ email, password }) which internally POSTs '/api/auth/login' with a JSON body. The function returns a Promise resolving to ApiResult<{ token: string; user: string }>. On HTTP errors the request() wrapper throws an Error; calling code should catch and handle it (e.g., show validation errors or retry). The token returned is not automatically stored or used by this module — the caller must persist it and attach it to subsequent requests if needed.

### Fetching and creating campaigns

To list campaigns use fetchCampaigns(params) which GETs '/api/campaigns' plus query string from buildQuery(params) and returns ApiResult<Paginated<Campaign>>. To create a campaign call createCampaign(payload: CampaignDraft) which POSTs to '/api/campaigns' with a JSON body and returns ApiResult<Campaign>. Both functions rely on request() for JSON parsing and error handling; network or API errors will result in thrown Errors that the UI layer should catch and map to user-facing messages.

### Updating a workflow and previewing

updateWorkflow(id, payload) sends a PUT request to /api/workflows/{id} with the WorkflowDraft JSON and returns ApiResult<Workflow>. To fetch a preview use fetchWorkflowPreview(id, tab, params?) which constructs a query string containing the optional FilterParams plus a required 'tab' query param and GETs '/api/workflows/{id}/preview'. Both functions return typed ApiResult payloads; callers should validate the workflow id and payload structure using the domain types before calling.

## Maintenance Notes

- Performance: every request sets cache: 'no-store', which prevents browser caching. If some endpoints are safe to cache (e.g., static settings), consider adding optional cache control or another wrapper to support cached reads.
- Global fetch behavior: the module relies on the global fetch. In server-side rendering or testing environments, ensure fetch is available or polyfilled. There is no timeout or abort signal support; consider adding support for AbortSignal in the request wrapper if callers need cancellation.
- Authentication: the request() function merges init.headers but does not automatically add Authorization headers. To integrate auth tokens, either modify request() to read a token store or ensure callers pass headers in init. Be careful merging headers: the request wrapper always sets 'Content-Type': 'application/json', which may be undesirable for multipart/form-data uploads.
- Error semantics: request() throws a generic Error with Vietnamese message 'Yêu cầu thất bại (status)' if JSON parsing of the error body fails. If the backend returns structured errors, consider standardizing on a typed error shape and rethrowing a custom Error type to preserve machine-readable error details.
- Testing: unit tests should stub or mock fetch to assert correct URL construction, HTTP methods, headers, and body serialization. Edge cases to test: buildQuery behavior with undefined/null/empty values, request() error parsing when response body is invalid JSON, and behavior when response.ok is true but body is unexpected.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/lib/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*
