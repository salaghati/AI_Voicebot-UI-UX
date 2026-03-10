<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/app/(console)/report/outbound/page.tsx",
  "source_hash": "e66f1200bdafca1ddb46c23a14329a95b6c4d8e8f7d06eef7bac26ca5b564164",
  "last_updated": "2026-03-10T03:59:37.491889+00:00",
  "git_sha": "036bf6f2f6fe2202a0c8fc5ecbd42407a836eba5",
  "tokens_used": 5528,
  "complexity_score": 2,
  "estimated_review_time_minutes": 5,
  "external_dependencies": []
}
```

</details>

[Documentation Home](../../../../../README.md) > [src](../../../../README.md) > [app](../../../README.md) > [(console)](../../README.md) > [report](../README.md) > [outbound](./README.md) > **page.mdx**

---

# page.tsx

> **File:** `src/app/(console)/report/outbound/page.tsx`

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

This file exports a single default React functional component OutboundReportPage which composes an EntityListPage UI component with configuration specific to outbound call reporting. The component passes static metadata (title, description, queryKey), UI toggles (showCreate, showRowActions), a list of status filter values, a fetcher function to load report data, a detail link generator, and an explicit array of column definitions. Column renderers reference fields on each report item (id, campaign, customerPhone, workflow, durationSec, startAt) and use a project utility (formatDateTime) to format timestamps.

In the larger application, this page acts as the route-level UI for viewing outbound call reports: it delegates data loading and list rendering to the imported EntityListPage component and the imported fetchOutboundReports function. The page does not manage state or perform side effects itself; instead it supplies configuration and small render callbacks. Important integration points are the fetcher prop (fetchOutboundReports) which must return data in the shape expected by EntityListPage, and the columns' render functions which expect each item to have id, campaign, customerPhone, workflow, durationSec, and startAt fields. Navigation to a detailed call view is provided by detailHref which builds a URL using item.id.

## Dependencies

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/features/bot-engine](../@/features/bot-engine.md) | Imports the EntityListPage React component and uses it as the primary UI composition target. The file passes props (title, description, queryKey, showCreate, showRowActions, statuses, fetcher, detailHref, columns) into EntityListPage to render the outbound report list. |
| [@/lib/api-client](../@/lib/api-client.md) | Imports the fetchOutboundReports function and assigns it to the fetcher prop of EntityListPage. This function is responsible for fetching the outbound report data the page displays (EntityListPage will call it to load rows). The code expects fetchOutboundReports to accept whatever parameters EntityListPage passes and to return data shaped as items containing id, campaign, customerPhone, workflow, durationSec, and startAt. |
| [@/lib/utils](../@/lib/utils.md) | Imports formatDateTime and uses it in the columns array to render the startAt field: render: (item) => formatDateTime(item.startAt). This implies that formatDateTime accepts a value present at item.startAt and returns a string suitable for display. |

## 📁 Directory

This file is part of the **outbound** directory. View the [directory index](_docs/src/app/(console)/report/outbound/README.md) to see all files in this module.

## Architecture Notes

- Composition over implementation: the page delegates UI and data handling to a reusable EntityListPage component by providing configuration (props) and small render callbacks rather than implementing list logic itself.
- Stateless page component: OutboundReportPage does not manage internal state or side effects; it supplies a data fetcher and renderers and relies on EntityListPage to perform loading, pagination, filtering, and error handling.
- Data contract expectations: The columns' render callbacks and detailHref assume each report item has keys id, campaign, customerPhone, workflow, durationSec, and startAt. The fetchOutboundReports implementation must return items that satisfy this contract.
- No local error handling: There is no try/catch or loading UI here; error handling and async behavior are expected to be handled inside EntityListPage or the fetcher implementation.

## Usage Examples

### Render outbound reports list on navigation to /report/outbound

When the route that mounts this page is navigated to, React will render OutboundReportPage. EntityListPage receives fetchOutboundReports as its fetcher prop and will call it (with whatever paging/filters EntityListPage provides). Each returned item should be an object with id, campaign, customerPhone, workflow, durationSec, and startAt. The list displays columns according to the columns array: id (Mã cuộc gọi), campaign (Chiến dịch), customerPhone (SĐT KH), workflow (Workflow), durationSec rendered as `${durationSec}s`, and startAt formatted via formatDateTime. Clicking a row (or the item action provided by EntityListPage) should navigate to `/report/call-detail/{item.id}` based on detailHref.

## Maintenance Notes

- Ensure fetchOutboundReports returns items with the exact keys expected by columns and that startAt is a type supported by formatDateTime. Mismatched shapes will cause runtime render errors.
- If EntityListPage changes its expected fetcher signature (parameters/return shape), update the fetchOutboundReports adapter or this page's configuration accordingly.
- Adding or reordering columns: maintain the label and render contract; render functions should defensively handle missing fields to avoid exceptions in the UI.
- Internationalization: column labels are currently hard-coded Vietnamese strings. If localization is required, replace these with a translation utility or keys.
- Testing: unit tests should mount OutboundReportPage with a mocked EntityListPage (or mock fetchOutboundReports) and assert that the correct props (queryKey, statuses, detailHref, columns) are passed through.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/app/(console)/report/outbound/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*
