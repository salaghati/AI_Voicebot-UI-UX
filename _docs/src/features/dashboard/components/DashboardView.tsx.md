<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/features/dashboard/components/DashboardView.tsx",
  "source_hash": "ae01a219e13f3edea9a0eec5a12979d9ce1f4bbf1474a56d6f7e499c51a93909",
  "last_updated": "2026-03-10T04:14:10.091708+00:00",
  "tokens_used": 22563,
  "complexity_score": 3,
  "estimated_review_time_minutes": 15,
  "external_dependencies": [
    "react",
    "@tanstack/react-query",
    "lucide-react",
    "sonner"
  ]
}
```

</details>

[Documentation Home](../../../../README.md) > [src](../../../README.md) > [features](../../README.md) > [dashboard](../README.md) > [components](./README.md) > **DashboardView.mdx**

---

# DashboardView.tsx

> **File:** `src/features/dashboard/components/DashboardView.tsx`

![Complexity: Low](https://img.shields.io/badge/Complexity-Low-green) ![Review Time: 15min](https://img.shields.io/badge/Review_Time-15min-blue)

## 📑 Table of Contents


- [Overview](#overview)
- [Dependencies](#dependencies)
- [Architecture Notes](#architecture-notes)
- [Usage Examples](#usage-examples)
- [Maintenance Notes](#maintenance-notes)
- [Functions and Classes](#functions-and-classes)

---

## Overview

This file implements a DashboardView React component and several small presentational components used only in this module: Widget (a generic widget frame with header, refresh and hide actions), LineChart (SVG polyline + points), GroupedBars (two-series vertical bars grouped by label), HorizontalBars (labelled horizontal progress bars) and DonutChart (SVG donut using strokeDasharray/strokeDashoffset). DashboardView uses react hooks (useState, useMemo) and react-query (useQuery) to load three backend resources via internal API helpers: fetchReportOverview, fetchCampaigns, and fetchInbounds. It maintains local UI state hiddenWidgets: WidgetId[] to allow users to hide individual widgets and restore them with a single action. UI feedback uses sonner.toast for success messages and lucide-react icons for widget headers.

DashboardView coordinates data flow: it issues three queries (keys: ["overview"], ["dashboard-campaigns"], ["dashboard-inbounds"]) and returns an AsyncState loading or error view when any query is loading or errored. Once data is available it computes several derived data structures (callsByHour, outboundByHour, weeklyInbound/outbound, sttAccuracy, apiLatency, intentData, handoverData) and memoized lists derived from API responses: campaignSuccess (maps campaigns.data?.data.items → {label, value, color}), extensionLoad (maps inbounds.data?.data.items → {label, value, color}), and outcomeData (uses overview.data?.data.successCalls/failedCalls/totalCalls to build donut segments). The design favors small, focused presentational components and local state; it does not persist hiddenWidgets beyond the component lifespan, nor does it enable polling or websocket subscriptions — data is fetched only once per mount via react-query's defaults.

## Dependencies

### External Dependencies

| Module | Usage |
| --- | --- |
| `react` | Imports useMemo and useState hooks. useState holds hiddenWidgets: WidgetId[], useMemo memoizes arrays used by charts to avoid recomputation on every render. |
| `@tanstack/react-query` | Imports useQuery to fetch asynchronous data. DashboardView calls useQuery three times: queryKey ['overview'] with queryFn fetchReportOverview, ['dashboard-campaigns'] with queryFn fetchCampaigns({ page: 1, pageSize: 6 }), and ['dashboard-inbounds'] with queryFn fetchInbounds({ page: 1, pageSize: 6 }). |
| `lucide-react` | Imports icon components AlertTriangle, BarChart3, Bot, Clock3, Phone, RefreshCw, X. These are rendered in the Widget header and used as the title icon. |
| `sonner` | Imports toast and uses it to show success messages when a widget is refreshed, hidden, or when all widgets are restored. Example uses: toast.success(`Đã làm mới widget: ${title}`), toast.success(`Đã ẩn widget "${label}"`). |

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/lib/api-client](../@/lib/api-client.md) | Imports fetchCampaigns, fetchInbounds, fetchReportOverview. These internal API helper functions are passed as queryFn to useQuery in DashboardView to load backend data for campaigns, inbounds, and overview respectively. |
| [@/components/ui/card](../@/components/ui/card.md) | Imports Card used at the bottom to show a summary when widgets are hidden (e.g., 'Đang ẩn N widget'). |
| [@/components/shared/page-header](../@/components/shared/page-header.md) | Imports PageHeader which is rendered at the top of the view with title, description and an actions button to restore all widgets. |
| [@/components/ui/button](../@/components/ui/button.md) | Imports Button used for restore actions both in the PageHeader actions and the Card control that appears when widgets are hidden. |
| [@/components/shared/async-state](../@/components/shared/async-state.md) | Imports AsyncState used to render loading and error UI when one of the three useQuery hooks is loading or errored. When error, AsyncState is rendered with onRetry={() => window.location.reload()}. |
| [@/lib/utils](../@/lib/utils.md) | Imports cn (classNames utility) used once to compose a className for the wrapper around DonutChart and the latency LineChart. |

## 📁 Directory

This file is part of the **components** directory. View the [directory index](_docs/src/features/dashboard/components/README.md) to see all files in this module.

## Architecture Notes

- This file follows a component composition pattern: small, focused presentational components (Widget, LineChart, GroupedBars, HorizontalBars, DonutChart) are composed by a single container DashboardView that manages data fetching and local UI state (hiddenWidgets).
- Data fetching uses react-query (useQuery) to asynchronously retrieve three resources. Each query is independent; the component blocks rendering of the dashboard until all three queries finish by checking overview.isLoading || campaigns.isLoading || inbounds.isLoading and overview.isError || campaigns.isError || inbounds.isError.
- Local UI state is minimal and synchronous: hiddenWidgets is an array of widget IDs (WidgetId union type). Hiding a widget appends its id to the array; restoring clears the array. There is no persistence (e.g., localStorage) and no per-widget persistent settings.
- Rendering of charts is entirely client-side, using inline SVG for LineChart and DonutChart and CSS + inline styles for bar heights/widths. Measurements (max, heights, strokeDasharray offsets) are computed imperatively in render, which is simple but may re-run on each render; the file uses useMemo for static arrays derived from API responses to reduce some recomputation.

## Usage Examples

### Rendering the dashboard on initial load

DashboardView mounts and issues three useQuery requests: fetchReportOverview (key ['overview']), fetchCampaigns (key ['dashboard-campaigns']), and fetchInbounds (key ['dashboard-inbounds']). While any are loading, the component returns <AsyncState state="loading" />. When all succeed, DashboardView computes derived arrays (campaignSuccess, extensionLoad, outcomeData) and renders multiple Widget components. Each Widget receives a title, an icon (lucide-react component), and an onHide callback wired to hideWidget(id, label) which updates hiddenWidgets and shows a toast via sonner.

### User hides a widget and then restores all

When the user clicks the hide (X) button in a Widget header, the Widget onHide handler calls hideWidget(id, label). hideWidget appends the widget ID to hiddenWidgets using setHiddenWidgets(prev => [...prev, id]) and calls toast.success to show feedback. The DashboardView filters widgets by checking hiddenWidgets.includes(id) and does not render hidden widgets. If any widgets are hidden, a Card is shown containing a button that calls setHiddenWidgets([]) to restore all widgets and optionally the PageHeader 'Hiển thị lại widget' action also resets the hiddenWidgets and shows a toast.

## Maintenance Notes

- Performance: chart components compute layout (max values, heights, stroke offsets) during render. For large dynamic datasets or frequent re-renders consider memoizing computed points/segments with useMemo keyed to the input arrays to avoid unnecessary recalculation.
- Data freshness: react-query queries are configured with default behavior (no polling). If the dashboard requires near-real-time updates, add refetchInterval or integrate a websocket/Server-Sent Events source to push updates into react-query cache.
- Error handling: on error the UI shows AsyncState with onRetry={() => window.location.reload()}; this is a coarse approach. Consider using queryClient.refetchQueries or per-query retry/backoff for finer control and better UX.
- Testing: snapshot tests for rendered widgets (SVG output), unit tests for computed arrays (campaignSuccess, extensionLoad, outcomeData), and integration tests that mock useQuery responses will be useful. Edge cases: campaigns.data?.data.items may be undefined so code currently falls back to defaults, ensure tests cover empty arrays and missing fields.
- Future enhancements: persist hiddenWidgets to localStorage or user profile, add per-widget settings (time-range, aggregation), expose per-widget loading/error states, and extract chart utilities into a shared chart helper for reuse.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/features/dashboard/components/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*


---

## Functions and Classes


#### function Widget

![Type: Sync](https://img.shields.io/badge/Type-Sync-green)

### Signature

```typescript (tsx)
function Widget({
  title,
  icon: Icon,
  onHide,
  children,
}: {
```

### Description

Implementation not visible

Implementation not visible. The provided snippet shows only the start of a React functional component named Widget with destructured props (title, icon aliased to Icon, onHide, children) and begins a type annotation for the props object, but the function body and return statements are not included in the provided lines.

### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `title` | `unknown (type annotation not visible in provided snippet)` | ✅ | A prop named title destructured from the component props; exact type and intended use not visible.
<br>**Constraints:** Not available in the visible snippet |
| `icon` | `unknown (type annotation not visible in provided snippet)` | ✅ | A prop named icon that is aliased to Icon via destructuring (icon: Icon); exact type not visible.
<br>**Constraints:** Not available in the visible snippet |
| `onHide` | `unknown (type annotation not visible in provided snippet)` | ✅ | A prop named onHide destructured from the component props; exact type (likely a function) is not visible in the snippet.
<br>**Constraints:** Not available in the visible snippet |
| `children` | `unknown (type annotation not visible in provided snippet)` | ✅ | A prop named children destructured from the component props; exact type (typically React.ReactNode) is not visible.
<br>**Constraints:** Not available in the visible snippet |

### Returns

**Type:** `unknown (return statement / JSX not visible in provided snippet)`

Cannot determine what the function returns because the function body and return statements are not included in the provided lines.


**Possible Values:**

- Not available in the visible snippet

### Usage Examples

#### Cannot provide concrete usage because implementation is not visible

```typescript (tsx)
<Widget title={...} icon={...} onHide={...}>{/* children */}</Widget>
```

This shows the shape of how the component might be used as a React component given the visible props, but the component's rendering and behavior are not visible in the provided snippet.

### Complexity

Unknown - implementation not visible therefore time and space complexity cannot be determined

### Notes

- Only the beginning of the function signature is visible; the function body, prop type details, return JSX, and any internal logic are not present in the provided snippet.
- Because the implementation is not visible, this documentation avoids asserting behavior, side effects, or return values that are not present in the supplied lines.

---



#### function LineChart

![Type: Sync](https://img.shields.io/badge/Type-Sync-green)

### Signature

```typescript (tsx)
function LineChart({
  values,
  color,
  labels,
}: {
```

### Description

Implementation not visible

Implementation not visible: the provided source excerpt contains only the start of the function declaration and the beginning of the parameter type annotation. No implementation body, return statements, or internal logic are present in the supplied lines, so behavior cannot be determined from the provided snippet.

### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `values` | `unknown (type annotation not visible in provided snippet)` | ✅ | Parameter named 'values' from the function's destructured props; actual type and purpose are not visible in the provided code.
<br>**Constraints:** Type and constraints not present in the visible snippet |
| `color` | `unknown (type annotation not visible in provided snippet)` | ✅ | Parameter named 'color' from the function's destructured props; actual type and purpose are not visible in the provided code.
<br>**Constraints:** Type and constraints not present in the visible snippet |
| `labels` | `unknown (type annotation not visible in provided snippet)` | ✅ | Parameter named 'labels' from the function's destructured props; actual type and purpose are not visible in the provided code.
<br>**Constraints:** Type and constraints not present in the visible snippet |

### Returns

**Type:** `unknown (return not visible in provided snippet)`

Return value cannot be determined because the function body and return statements are not included in the provided excerpt.


**Possible Values:**

- Unknown — implementation not visible

### Usage Examples

#### Cannot provide usage example — implementation not visible

```typescript (tsx)
/* Implementation not visible; cannot show a reliable example */
```

The function body and prop types are not available in the provided snippet, so a concrete, correct usage example cannot be generated without risking hallucination.

### Complexity

Unknown — implementation not visible, so time and space complexity cannot be determined.

### Related Functions

- `Unknown` - Cannot determine related functions from the provided snippet

### Notes

- Only the beginning of the function signature is present in the provided source (lines 65-69). The implementation body, return statements, and full parameter type annotations are not included, so accurate behavior, side effects, and return types cannot be documented without the rest of the function.

---



#### function GroupedBars

![Type: Sync](https://img.shields.io/badge/Type-Sync-green)

### Signature

```typescript (tsx)
function GroupedBars({ labels, inbound, outbound, }: {
```

### Description

Implementation not visible

Implementation not visible in the provided snippet (only the function header with destructured parameters is present). The body, return statements, internal logic, and any calls or side effects are not available, so no further behavioral details can be determined from the provided content.

### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `labels` | `type not visible in provided snippet` | ✅ | Parameter named 'labels' as destructured from the function props; exact type and purpose are not visible in the snippet
<br>**Constraints:** Not visible in provided snippet |
| `inbound` | `type not visible in provided snippet` | ✅ | Parameter named 'inbound' as destructured from the function props; exact type and purpose are not visible in the snippet
<br>**Constraints:** Not visible in provided snippet |
| `outbound` | `type not visible in provided snippet` | ✅ | Parameter named 'outbound' as destructured from the function props; exact type and purpose are not visible in the snippet
<br>**Constraints:** Not visible in provided snippet |

### Returns

**Type:** `not visible in provided snippet`

Return value is not visible because the function body and return statements are not included in the provided snippet.


**Possible Values:**

- Not determinable from provided snippet

### Usage Examples

#### Cannot provide concrete usage because implementation is not visible

```typescript (tsx)
GroupedBars({ labels: /* ... */, inbound: /* ... */, outbound: /* ... */ })
```

Only the parameter names are visible; the example shows how the function would be invoked with those named props, but behavior and return are unknown.

### Complexity

Not determinable from provided snippet

### Notes

- Only the function signature's parameter destructuring was present in the provided lines (labels, inbound, outbound).
- The function body, return statements, types of parameters, and any internal logic are not present in the snippet, so this documentation is intentionally minimal and does not speculate about behavior.

---



#### function HorizontalBars

![Type: Sync](https://img.shields.io/badge/Type-Sync-green)

### Signature

```typescript (tsx)
function HorizontalBars({ data }: { data: Array<{ label: string; value: number; color: string }> })
```

### Description

Implementation not visible

Implementation not available in the provided snippet. The function signature indicates it accepts a single props object with a data array of items having label, value, and color fields, but the body and behavior (what it returns or renders, side effects, and internal logic) are not present in the provided source line.

### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `data` = `none` | `Array<{ label: string; value: number; color: string }>` | ✅ | An array of objects, each containing a label (string), value (number), and color (string). This is the only parameter destructured from the props object in the signature.
<br>**Constraints:** Must be provided as part of the single destructured props object, Each array element should have the fields: label (string), value (number), color (string) — presence/validation not enforced in visible code |

### Returns

**Type:** `unknown`

Return value cannot be determined because the function body/return statement is not included in the provided snippet.


**Possible Values:**

- Unknown — could return JSX.Element, null, void, or any other value depending on implementation

### Usage Examples

#### Example call using the visible signature

```typescript (tsx)
HorizontalBars({ data: [{ label: 'A', value: 10, color: '#ff0000' }, { label: 'B', value: 20, color: '#00ff00' }] })
```

Illustrative call following the function's signature. Actual behavior/result is unknown because implementation is not visible.

### Complexity

Unknown (implementation not visible)

### Notes

- Only the function signature line was provided; the implementation body is missing so behavior, return type, side effects, and exceptions cannot be determined.
- The function appears to be a React/TSX component based on the .tsx file and typical naming, but this cannot be confirmed without the body.

---



#### function DonutChart

![Type: Sync](https://img.shields.io/badge/Type-Sync-green)

### Signature

```typescript (tsx)
function DonutChart({
  data,
}: {
```

### Description

Implementation not visible

The implementation of this function is not present in the provided source excerpt (only the beginning of the parameter destructuring and type annotation is visible). Therefore, no line-by-line behavior, algorithm, return values, or internal calls can be determined from the supplied snippet.

### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `data` = `none visible` | `unknown (type annotation incomplete in provided snippet)` | ✅ | Parameter is present in the destructured props object; exact expected shape and purpose are not visible in the provided code.
<br>**Constraints:** No constraints visible — type/shape not provided in the snippet |

### Returns

**Type:** `unknown (implementation not visible)`

Return value cannot be determined because the function body and return statements are not included in the provided excerpt.


**Possible Values:**

- Unknown — implementation not visible

### Usage Examples

#### Example of how the component/function might be called in JSX based on the visible parameter name

```typescript (tsx)
<DonutChart data={someData} />
```

Demonstrates passing a data prop to the DonutChart component; exact prop shape and runtime behavior are unknown because the implementation is not provided.

### Complexity

Unknown — implementation not visible, so time and space complexity cannot be determined

### Related Functions

- `N/A` - No related functions visible in the provided snippet

### Notes

- Only the start of the function signature is present in the provided snippet. The body, return statements, internal logic, and full type annotation are not available.
- Do not assume behavior based on the function name; review the full implementation to produce concrete documentation.

---


