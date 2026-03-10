<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/app/(console)/report/inbound/page.tsx",
  "source_hash": "e89ba55adbcd45acb44a17d54c42b1a8a785b70d49bb1bf6db7297c652f878bf",
  "last_updated": "2026-03-10T03:59:40.472482+00:00",
  "git_sha": "b0a4470fda3b76baad308fb8383cb4c7fde3910d",
  "tokens_used": 5876,
  "complexity_score": 2,
  "estimated_review_time_minutes": 10,
  "external_dependencies": []
}
```

</details>

[Documentation Home](../../../../../README.md) > [src](../../../../README.md) > [app](../../../README.md) > [(console)](../../README.md) > [report](../README.md) > [inbound](./README.md) > **page.mdx**

---

# page.tsx

> **File:** `src/app/(console)/report/inbound/page.tsx`

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

This file exports a single client-side React component: export default function InboundReportPage(). It is a presentational/configuration module that composes the generic EntityListPage component (imported from @/features/bot-engine) and provides it with specific props to render an "Inbound" call report list. Key configuration passed to EntityListPage includes: title, description, queryKey="report-inbound", UI toggles (showCreate=false, showRowActions=false), a statuses filter ["Success", "Failed", "Transferred"], the fetcher function fetchInboundReports (from @/lib/api-client), a detailHref renderer that links each row to /report/call-detail/${item.id}, and an explicit columns array that maps item properties to labels and per-column render functions (including formatDateTime for startAt and a string append for durationSec). The file begins with the "use client" directive so it runs as a client component in Next.js / React environments.

Within the larger system this page acts as the inbound-report route's UI layer: it does not implement data fetching logic itself but delegates fetching to the provided fetcher (fetchInboundReports) and delegates rendering and list behaviors to the shared EntityListPage component. This keeps concerns separated: this file declares which fields to display, human-readable labels (Vietnamese), basic formatting for two fields, and navigation for detail views. Important practical details: the columns array expects list item objects to have id, customerPhone, workflow, intent, durationSec, and startAt properties; detailHref builds a path using item.id; formatDateTime is used to transform startAt into a display string. The page disables creation and row actions, indicating a read-only list use case for inbound call records.

## Dependencies

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/features/bot-engine](../@/features/bot-engine.md) | Imports the EntityListPage React component and uses it as the primary renderer for the inbound report list by passing props (title, description, queryKey, UI toggles, statuses, fetcher, detailHref, columns). |
| [@/lib/api-client](../@/lib/api-client.md) | Imports fetchInboundReports and passes it directly to EntityListPage as the fetcher prop so the list component can call it to load inbound report data. |
| [@/lib/utils](../@/lib/utils.md) | Imports formatDateTime and uses it in the columns configuration to format the item's startAt value for display in the "Bắt đầu" column. |

## 📁 Directory

This file is part of the **inbound** directory. View the [directory index](_docs/src/app/(console)/report/inbound/README.md) to see all files in this module.

## Architecture Notes

- Composition pattern: the file composes a generic EntityListPage by providing configuration props rather than implementing list rendering or fetching itself.
- Client component: The top-level "use client" pragma marks this as a client-side React component (Next.js app router), so any interactions, hooks, or browser-only APIs inside EntityListPage will run on the client.
- Props-driven rendering: Columns are declared as an array of { key, label, render } objects; the render closures expect specific item fields (id, customerPhone, workflow, intent, durationSec, startAt).
- No local state or error handling here: responsibility for loading state, pagination, sorting, and errors is delegated to EntityListPage and fetchInboundReports.

## Usage Examples

### Render the inbound report page in a Next.js app route

When the route that imports this component is visited, Next.js will hydrate this client component. EntityListPage will call the supplied fetcher (fetchInboundReports) to retrieve a list of inbound call items. Each item is rendered according to the columns array: id appears under label "Mã cuộc gọi", customerPhone under "SĐT KH", workflow and intent under their labels, durationSec is shown with an appended "s" (e.g., "42s"), and startAt is formatted using formatDateTime. Clicking a row (or the UI provided by EntityListPage) should navigate to /report/call-detail/{item.id} for details. Any loading/error/pagination behavior is expected to be handled by EntityListPage.

## Maintenance Notes

- Ensure the shape of items returned by fetchInboundReports includes id, customerPhone, workflow, intent, durationSec, and startAt; missing fields will cause render output to be partial or undefined.
- The columns use inline render functions; if the list grows large, consider memoizing columns or their renderers to avoid unnecessary re-renders when EntityListPage re-renders.
- Labels are currently hard-coded in Vietnamese; if localization is required, replace label strings with a translation function.
- The detailHref path is hard-coded. If route structure changes, update the template `/report/call-detail/${item.id}` accordingly.
- Add defensive formatting for durationSec and startAt (e.g., handle null/undefined) to avoid displaying 'undefineds' in the UI.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/app/(console)/report/inbound/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*
