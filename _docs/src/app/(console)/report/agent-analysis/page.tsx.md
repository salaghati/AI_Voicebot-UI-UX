<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/app/(console)/report/agent-analysis/page.tsx",
  "source_hash": "900202df86327cd36a3ab364dfcb883139661d593f58028052e62aab5e35765a",
  "last_updated": "2026-03-10T03:59:03.841236+00:00",
  "git_sha": "27abdcfd5d1dbfa859cfc99614b54f95318d6ad7",
  "tokens_used": 5863,
  "complexity_score": 2,
  "estimated_review_time_minutes": 10,
  "external_dependencies": []
}
```

</details>

[Documentation Home](../../../../../README.md) > [src](../../../../README.md) > [app](../../../README.md) > [(console)](../../README.md) > [report](../README.md) > [agent-analysis](./README.md) > **page.mdx**

---

# page.tsx

> **File:** `src/app/(console)/report/agent-analysis/page.tsx`

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

This file exports a default functional React component named AgentAnalysisPage (client component, indicated by the "use client" directive). The component returns a configured EntityListPage element with props that tailor it for an "Agent Analysis" report: title and description (Vietnamese text mentioning Excel export), a fixed queryKey, flags disabling create and row-level actions, a fetcher function (fetchAgentMetrics) for loading data, and a columns array which maps item properties to visible columns and small inline renderers (including formatting for average handle time and transfer rate).

The file itself does not implement data fetching or UI primitives — it imports EntityListPage from "@/features/bot-engine" and fetchAgentMetrics from "@/lib/api-client" and wires them together. EntityListPage is expected to perform the actual data loading, pagination/export behavior, and error handling; this page simply provides configuration (column definitions, UI labels, and which fetcher to use). There is no local state, side-effects, or asynchronous logic in this file; all runtime behavior is delegated to the imported EntityListPage and fetchAgentMetrics modules.

## Dependencies

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/features/bot-engine](../@/features/bot-engine.md) | Imports the EntityListPage React component and uses it as the main UI element returned by AgentAnalysisPage. The file passes props (title, description, queryKey, showCreate, showRowActions, fetcher, columns) to EntityListPage, so EntityListPage is expected to accept these props and handle rendering, fetching, and export behavior. |
| [@/lib/api-client](../@/lib/api-client.md) | Imports fetchAgentMetrics and passes it directly to the EntityListPage via the fetcher prop. EntityListPage will call this function to retrieve agent metrics data for the list/report. The file itself does not call fetchAgentMetrics; it only wires the function into the list component. |

## 📁 Directory

This file is part of the **agent-analysis** directory. View the [directory index](_docs/src/app/(console)/report/agent-analysis/README.md) to see all files in this module.

## Architecture Notes

- Client-side React component: The file begins with the "use client" directive, so it is executed on the client and intended for interactive UI.
- Composition over implementation: This module composes an EntityListPage rather than implementing list, fetch, or export logic itself. All data fetching and list behaviors are delegated to EntityListPage and the imported fetcher.
- Columns defined as lightweight renderers: The columns prop is an array of objects with key, label, and render fields. Renderers are inline functions that access fields on each item and perform simple formatting (e.g., `${item.avgHandleTime}s`, `${item.transferRate}%`).
- No local state or error handling: The page does not manage state or errors; those responsibilities are expected to be handled by EntityListPage or the fetcher implementation.

## Usage Examples

### Rendering the Agent Analysis page in the application route

When the user navigates to the route that maps to this page, the framework will render AgentAnalysisPage (client-side). AgentAnalysisPage returns an EntityListPage configured with queryKey="agent-analysis" and fetcher=fetchAgentMetrics. EntityListPage should call fetchAgentMetrics to request metrics data (an array of items whose fields include agentName, handledCalls, avgHandleTime, transferRate, csat). Each returned item will be displayed in the columns configured here: agentName and csat are displayed directly, handledCalls is shown as-is, avgHandleTime is formatted with a trailing "s", and transferRate is formatted with a trailing "%". EntityListPage is responsible for showing loading/error states, pagination, and any export-to-Excel functionality referenced in the description prop.

## Maintenance Notes

- Ensure fetchAgentMetrics signature matches what EntityListPage expects (parameters such as filters/pagination and return shape). This file assumes returned items have keys: agentName, handledCalls, avgHandleTime, transferRate, csat.
- Column renderers perform string interpolation without type checks — ensure avgHandleTime and transferRate are numeric or handle null/undefined in fetcher or EntityListPage to avoid rendering 'undefineds' or throwing at runtime.
- Labels are in Vietnamese; if localization is required, consider replacing hardcoded strings with a translation/localization mechanism.
- Large result sets or expensive fetches should be managed by EntityListPage (pagination, server-side filtering). This page does not impose limits — verify EntityListPage is configured appropriately for performance.
- If you change column keys or data shape returned by fetchAgentMetrics, update the columns array here to match the actual item fields.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/app/(console)/report/agent-analysis/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*
