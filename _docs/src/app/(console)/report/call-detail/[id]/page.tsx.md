<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/app/(console)/report/call-detail/[id]/page.tsx",
  "source_hash": "9bf4cee9c067f1c66fa33704bf4bf107653682498f8c83bd0eea10eece8b730d",
  "last_updated": "2026-03-10T03:59:04.140503+00:00",
  "git_sha": "602e101eb43d54914db6357eb9aea165ab2db654",
  "tokens_used": 7233,
  "complexity_score": 3,
  "estimated_review_time_minutes": 10,
  "external_dependencies": [
    "@tanstack/react-query",
    "next/navigation"
  ]
}
```

</details>

[Documentation Home](../../../../../../README.md) > [src](../../../../../README.md) > [app](../../../../README.md) > [(console)](../../../README.md) > [report](../../README.md) > [call-detail](../README.md) > [[id]](./README.md) > **page.mdx**

---

# page.tsx

> **File:** `src/app/(console)/report/call-detail/[id]/page.tsx`

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

This file exports a single default React component CallDetailPage which is a client-side page component (note the "use client" directive). It reads the route parameter id via useParams from next/navigation, uses useQuery from @tanstack/react-query to fetch call detail data by calling fetchCallReport(callId), and conditionally renders three main UI states: loading, error (with retry), and the detail view. The detail view composes shared UI primitives (PageHeader, Card, Badge, AsyncState) and utility mappers/formatters (mapStatusTone, formatDateTime) to render a transcript list, metadata (call id, customer phone, workflow, intent, start time, status), recognized entities, and an audio player (audio source is currently empty in the markup).

Within the larger application, this component is the page displayed at a dynamic route that provides a single-call report. It integrates with an internal API client (fetchCallReport) to retrieve a response expected to be shaped as query.data.data (the component checks query.data?.data before rendering). React Query handles caching, loading and error state and exposes a refetch used by AsyncState for retry. Important implementation details: the query is enabled only when callId is truthy; transcript rendering uses time+index as the React key for each line; status rendering maps a string status to a Badge tone via mapStatusTone; startAt is displayed using formatDateTime. The audio element is present but its <source src="" /> is left empty in this file and must be populated (typically from the fetchCallReport response) for playback to work.

## Dependencies

### External Dependencies

| Module | Usage |
| --- | --- |
| `@tanstack/react-query` | Imports useQuery and uses it to perform the data fetch for the call detail with queryKey ['call-detail', callId], a queryFn that calls fetchCallReport(callId), enabled controlled by Boolean(callId), and to check isLoading/isError and call refetch(). |
| `next/navigation` | Imports useParams and uses it to read the dynamic route parameter { id: string } to obtain callId used to drive the query and rendering. |

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/lib/api-client](../@/lib/api-client.md) | Imports fetchCallReport, which is called inside the react-query queryFn: () => fetchCallReport(callId). This is the primary API call used to retrieve the call data shape expected at query.data.data. |
| [@/components/shared/page-header](../@/components/shared/page-header.md) | Imports PageHeader and uses it to render the top header of the page with title and description: <PageHeader title="Report - Chi tiết cuộc gọi" description="Transcript, ghi âm, intent và entity nhận diện"/>. |
| [@/components/ui/card](../@/components/ui/card.md) | Imports Card and uses it as layout container wrappers for transcript and call information sections: <Card className=...> around groups of UI elements. |
| [@/components/ui/badge](../@/components/ui/badge.md) | Imports Badge and uses it to display call.status with a visual tone determined by mapStatusTone(call.status): <Badge tone={mapStatusTone(call.status)}>{call.status}</Badge>. |
| [@/components/shared/async-state](../@/components/shared/async-state.md) | Imports AsyncState and uses it to render UI for loading and error states. On error, AsyncState is passed an onRetry prop that calls query.refetch(). Loading state: <AsyncState state="loading" />; Error state: <AsyncState state="error" onRetry={() => query.refetch()} />. |
| [@/lib/mappers](../@/lib/mappers.md) | Imports mapStatusTone and uses it to convert call.status (a string) into a Badge tone prop value: tone={mapStatusTone(call.status)}. |
| [@/lib/utils](../@/lib/utils.md) | Imports formatDateTime and uses it to format call.startAt for display: {formatDateTime(call.startAt)}. |

## 📁 Directory

This file is part of the **[id]** directory. View the [directory index](_docs/src/app/(console)/report/call-detail/[id]/README.md) to see all files in this module.

## Architecture Notes

- Client-only React component: The file begins with the 'use client' directive, so it runs entirely on the client. That affects SEO and server-side rendering—data fetching and rendering occur in the browser.
- Data fetching with React Query: useQuery is used for asynchronous data retrieval, caching, and state management. The query is keyed by ['call-detail', callId] and enabled only when callId is truthy to avoid unnecessary requests.
- Conditional rendering for UX states: The component returns an AsyncState for loading and error cases. When data is present (query.data?.data), it renders the detail UI. Error handling supports retry via query.refetch passed to AsyncState.
- UI composition and mapping utilities: Presentation uses shared UI primitives (PageHeader, Card, Badge) and small utility functions (mapStatusTone, formatDateTime). The code assumes the API returns a structure accessible at query.data.data with specific fields used in the render.
- Data flow: Route param (useParams) → callId → useQuery(queryFn: fetchCallReport(callId)) → query.data.data (call) → render transcript, metadata, entities, and audio. React Query encapsulates remote state; no local component state is used.

## Usage Examples

### Render the call detail page for a route like /report/call-detail/123

When a user navigates to the dynamic route with id=123, useParams returns { id: '123' } and callId becomes '123'. useQuery is initialized with queryKey ['call-detail', '123'] and calls fetchCallReport('123'). While the request is pending, the component returns <AsyncState state="loading"/>. If the request fails or returns an empty body, the component returns <AsyncState state="error" onRetry={() => query.refetch()} />. On success (query.data.data exists), the component renders: PageHeader, a Card with the transcript entries (each transcript line expects objects with time, speaker, content), a Card with call metadata fields (id, customerPhone, workflow, intent, startAt formatted via formatDateTime, status rendered with a Badge whose tone is set by mapStatusTone), a list of entities (each entity expected to have key and value), and an audio element (note: the source in this file is empty and should be set to the returned audio URL from the API).

## Maintenance Notes

- Audio source is empty in this file: <source src="" />. To enable playback, populate the audio source with a URL from fetchCallReport response (e.g., call.recordingUrl).
- Large transcripts may cause rendering/performance issues: consider virtualization (react-window/react-virtualized) if transcripts frequently have many lines.
- Key usage for transcript list uses `${line.time}-${index}`; prefer a stable unique id from the API if available to avoid React list reconciliation pitfalls.
- Because this is a client component, loading happens client-side; if SEO or initial paint is important, consider moving data fetching to a server component or implementing hybrid rendering.
- Tests should mock fetchCallReport and react-query to assert the three render branches (loading, error with retry, success) and validate that fields used in JSX (id, transcript[], entities[], customerPhone, workflow, intent, startAt, status) are displayed correctly.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/app/(console)/report/call-detail/[id]/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*
