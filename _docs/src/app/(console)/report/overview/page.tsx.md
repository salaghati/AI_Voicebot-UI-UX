<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/app/(console)/report/overview/page.tsx",
  "source_hash": "0dc7b19ed18398e540245de921c8e61a574831aa7ed5fa585f67eac2d0198671",
  "last_updated": "2026-03-10T03:59:46.897004+00:00",
  "git_sha": "633d7e29ff405cda07974ed303a52ad28ebdc86f",
  "tokens_used": 7319,
  "complexity_score": 3,
  "estimated_review_time_minutes": 10,
  "external_dependencies": [
    "next/link",
    "@tanstack/react-query",
    "lucide-react"
  ]
}
```

</details>

[Documentation Home](../../../../../README.md) > [src](../../../../README.md) > [app](../../../README.md) > [(console)](../../README.md) > [report](../README.md) > [overview](./README.md) > **page.mdx**

---

# page.tsx

> **File:** `src/app/(console)/report/overview/page.tsx`

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

This file exports a default React functional component: ReportOverviewPage. It is a client component ("use client") that uses react-query (useQuery) to run three parallel data fetches: fetchReportOverview(), fetchInboundReports({ page: 1, pageSize: 5 }), and fetchOutboundReports({ page: 1, pageSize: 5 }). While any query is loading, the component renders an AsyncState with state="loading"; if any query errors it renders AsyncState with state="error" and an onRetry that reloads the page. On success it renders a PageHeader with an Export button (no handler wired) and a grid of MetricCard components populated from overview.data?.data, followed by two Card sections that list the most recent inbound and outbound items and provide Next/Link anchors to full detail pages (/report/inbound and /report/outbound).

The file integrates local UI primitives and an internal API client: it imports fetchReportOverview, fetchInboundReports, and fetchOutboundReports from the internal '@/lib/api-client' and displays the results using MetricCard, Card, PageHeader and AsyncState components from the project. Data shown includes numeric totals and per-item fields such as id, workflow, campaign, customerPhone, intent and status. The component uses optional chaining and simple string formatting (e.g., `${overview.data?.data.avgDurationSec ?? 0}s`) to guard missing values, and it hardcodes the inbound/outbound query parameters (page 1, pageSize 5) to show only the most recent items. The Export button and metric 'trend' values are static in this implementation (trend strings are hard-coded).

## Dependencies

### External Dependencies

| Module | Usage |
| --- | --- |
| `next/link` | Imports Link and uses it to render client-side navigation anchors to '/report/inbound' and '/report/outbound' in the two Card headers; exact import: `import Link from "next/link"`. |
| `@tanstack/react-query` | Imports useQuery and uses it to perform three separate queries: `useQuery({ queryKey: ["report-overview"], queryFn: () => fetchReportOverview() })`, `useQuery({ queryKey: ["report-overview-inbound"], queryFn: () => fetchInboundReports({ page: 1, pageSize: 5 }) })`, and `useQuery({ queryKey: ["report-overview-outbound"], queryFn: () => fetchOutboundReports({ page: 1, pageSize: 5 }) })` for client-side data fetching and caching. |
| `lucide-react` | Imports Download icon component and renders `<Download className="h-4 w-4" />` inside the Export Button for a visual icon; exact import: `import { Download } from "lucide-react"`. |

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/lib/api-client](../@/lib/api-client.md) | Imports three API helper functions: `fetchInboundReports`, `fetchOutboundReports`, and `fetchReportOverview` and passes them as queryFn to react-query to fetch required data for the page. Exact import: `import { fetchInboundReports, fetchOutboundReports, fetchReportOverview } from "@/lib/api-client"`. |
| [@/components/shared/page-header](../@/components/shared/page-header.md) | Imports PageHeader and uses it at the top of the page to show a title, description and actions prop (the Export button). Exact import: `import { PageHeader } from "@/components/shared/page-header"`. |
| [@/components/ui/card](../@/components/ui/card.md) | Imports Card and uses it to wrap the Inbound and Outbound recent-items sections and to provide consistent card styling. Exact import: `import { Card } from "@/components/ui/card"`. |
| [@/components/ui/button](../@/components/ui/button.md) | Imports Button and uses it to render the Export action in the PageHeader: `<Button variant="secondary" className="gap-2">` with the Download icon as a child. Exact import: `import { Button } from "@/components/ui/button"`. |
| [@/components/shared/metric-card](../@/components/shared/metric-card.md) | Imports MetricCard and renders five MetricCard components showing totals (totalCalls, successCalls, failedCalls, avgDurationSec, conversionRate) from overview.data?.data. Exact import: `import { MetricCard } from "@/components/shared/metric-card"`. |
| [@/components/shared/async-state](../@/components/shared/async-state.md) | Imports AsyncState and uses it to display a loading state (`<AsyncState state="loading" />`) and an error state (`<AsyncState state="error" onRetry={() => window.location.reload()} />`) depending on react-query state flags. Exact import: `import { AsyncState } from "@/components/shared/async-state"`. |

## 📁 Directory

This file is part of the **overview** directory. View the [directory index](_docs/src/app/(console)/report/overview/README.md) to see all files in this module.

## Architecture Notes

- This is a Next.js client component (file starts with `"use client"`) and uses React + react-query for client-side data fetching and caching; three independent useQuery hooks run in parallel to load overview, inbound, and outbound data.
- UI composition uses small presentational components (PageHeader, MetricCard, Card, Button, AsyncState) imported from the project; data rendering is straightforward: metrics use overview.data?.data fields and lists map over inbound.data?.data.items and outbound.data?.data.items.
- Error and loading handling is coarse-grained: if any of the three queries are loading the page shows a global loading state; if any query errors it shows a global error state with a retry that reloads the entire page via window.location.reload().
- Query parameters are hard-coded for inbound/outbound (page: 1, pageSize: 5). The Export action is present visually but lacks an onClick handler and therefore no export API integration exists in this component.

## Usage Examples

### User opens the Report - Tổng quan dashboard

On mount the component triggers three useQuery hooks. React Query executes fetchReportOverview(), fetchInboundReports({ page: 1, pageSize: 5 }), and fetchOutboundReports({ page: 1, pageSize: 5 }) in parallel. While any are pending, AsyncState with state="loading" is rendered. If all succeed, the PageHeader is shown with an Export button (no handler), five MetricCard components render values derived from overview.data.data (totalCalls, successCalls, failedCalls, avgDurationSec, conversionRate), and two Card columns show recently fetched inbound/outbound items by mapping inbound.data.data.items and outbound.data.data.items and rendering id, workflow/campaign, customerPhone, and intent/status. If any query errors, AsyncState with state="error" is shown and the onRetry callback reloads the page (window.location.reload()). Clicking the Link elements navigates to the respective detailed report pages (/report/inbound and /report/outbound).

## Maintenance Notes

- Performance: three separate queries are executed; consider combining related requests server-side or using useQueries to manage them together and reduce render logic duplication. Also consider configuring react-query staleTime/cacheTime to reduce network load.
- Robustness: code uses optional chaining for overview but directly maps items with `inbound.data?.data.items.map(...)`; if data exists but items is undefined this will throw. Consider defensive defaults like `inbound.data?.data.items ?? []` before mapping.
- Export button: currently has no onClick handler; add an explicit handler that calls an export API or triggers CSV/Excel generation and wire authentication/permissions as needed.
- Error handling: current retry strategy reloads the entire page; consider using react-query's refetch methods to retry specific queries or provide user-friendly retry behavior.
- Testing: unit tests should cover rendering states (loading, error, success), formatting of avgDurationSec and conversionRate fallback values, and the mapping of inbound/outbound items. Add integration tests to verify link navigation and react-query interactions.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/app/(console)/report/overview/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*
