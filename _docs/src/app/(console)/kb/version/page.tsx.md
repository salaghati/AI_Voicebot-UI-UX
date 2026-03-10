<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/app/(console)/kb/version/page.tsx",
  "source_hash": "7c4ccd489c68ae185d548fbd8d02f1b8a54ff070583143eb52599a43a8275946",
  "last_updated": "2026-03-10T03:56:01.322460+00:00",
  "git_sha": "6f63dc4154eeae760d121fe03d7593ab169e957c",
  "tokens_used": 6463,
  "complexity_score": 2,
  "estimated_review_time_minutes": 10,
  "external_dependencies": [
    "react",
    "@tanstack/react-query",
    "sonner"
  ]
}
```

</details>

[Documentation Home](../../../../../README.md) > [src](../../../../README.md) > [app](../../../README.md) > [(console)](../../README.md) > [kb](../README.md) > [version](./README.md) > **page.mdx**

---

# page.tsx

> **File:** `src/app/(console)/kb/version/page.tsx`

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

This file exports a default React function component named KbVersionPage which is marked as a client component ("use client"). On mount it uses react-query (useQuery) with the query key ["kb-version"] and the query function fetchKbDocs from the project's API client to load KB documents. The component keeps a local piece of state checkingId (type string | null) via React's useState to track which item is currently being checked. The UI is composed with internal layout/components: KbShell (page layout wrapper), Card (container), and Button (action control). The code maps over query.data?.data (an assumed array of items) and renders each item's title, id, and version; each item has a "Kiểm tra version" button that sets checkingId, schedules a setTimeout for 600ms, resets checkingId, and calls toast.success from sonner to show a success notification.

From a systems perspective this component is a thin client-side view layer: it depends on an internal API-client function fetchKbDocs to obtain the list of KB documents and on internal UI primitives (KbShell, Card, Button) for consistent layout. It uses @tanstack/react-query for fetching/caching the list, React useState for ephemeral UI state, and sonner.toast for user feedback. Important implementation details: the code expects query.data to contain a data property with an iterable array (query.data?.data.map(...)); the version check is simulated locally with setTimeout (no network call is made when clicking the check button), and there is no explicit handling of loading or error states from react-query in the current implementation.

## Dependencies

### External Dependencies

| Module | Usage |
| --- | --- |
| `react` | Imports useState from React to maintain local component state (checkingId: string | null) which tracks which KB item is being checked. |
| `@tanstack/react-query` | Imports useQuery to fetch and cache KB documents. useQuery is invoked as useQuery({ queryKey: ['kb-version'], queryFn: () => fetchKbDocs() }) to call the internal fetchKbDocs function and provide query.data?.data to the UI. |
| `sonner` | Imports toast and uses toast.success(...) to display a success notification after the simulated version check completes. |

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/lib/api-client](../@/lib/api-client.md) | Imports the internal fetchKbDocs function which is used as the react-query queryFn to retrieve the KB documents list. The component expects the returned structure to have a data property containing an array of items. |
| [@/features/kb](../@/features/kb.md) | Imports the internal KbShell component which is used as the page shell/layout wrapper and provided title/description props. |
| [@/components/ui/card](../@/components/ui/card.md) | Imports the internal Card UI component used to contain and space the list of KB items. |
| [@/components/ui/button](../@/components/ui/button.md) | Imports the internal Button component used for the "Kiểm tra version" action for each item; onClick triggers the simulated check logic. |

## 📁 Directory

This file is part of the **version** directory. View the [directory index](_docs/src/app/(console)/kb/version/README.md) to see all files in this module.

## Architecture Notes

- React functional component (client): The file begins with "use client" so it runs on the client; it relies on React hooks (useState) and react-query (useQuery) for state and data fetching.
- Data flow: fetchKbDocs -> useQuery -> query.data?.data -> map over items -> render UI. The per-item "check" action is local-only: setCheckingId(item.id) then setTimeout to reset state and call toast.success; no network request is performed for the check itself.
- State management: Local ephemeral state is managed with useState for checkingId. Persistent/cached remote data is handled by react-query; however the component does not handle or render loading/error states from useQuery (no isLoading/isError usage).
- Error handling and cleanup: The component does not include error handling for failed fetches, nor does it clear or track the setTimeout if the component unmounts, which can lead to setState on an unmounted component.

## Usage Examples

### Render the KB version check page in the console

When a user navigates to the KB version page, the component mounts and react-query uses fetchKbDocs to retrieve KB documents. The component maps query.data?.data to render each item's title, id, and version inside a Card. When the user clicks "Kiểm tra version" for an item, the component sets checkingId to that item's id, the Button label updates to "Đang kiểm tra...", a 600ms timer runs, and then checkingId is cleared and toast.success displays: "KB <item.id> đang ở bản mới nhất". No network call is made for the check action as implemented.

## Maintenance Notes

- Add loading and error states: The component should handle and render useQuery's isLoading and isError to improve UX during fetch and surface problems.
- Avoid potential memory leaks: The setTimeout used for the simulated check is not cleaned up on unmount; convert to useEffect with cleanup or use a cancellable approach to avoid setState on unmounted component.
- Type-safety and response shape: The code assumes query.data?.data is an array of items with id, title, and version. Add explicit TypeScript types/interfaces for the fetchKbDocs return shape to make this contract explicit and avoid runtime errors.
- Replace simulation with real check: If a real version-check API is available, replace the setTimeout simulation with an async call and handle loading/error states and retries via react-query or explicit logic.
- Performance considerations: Rendering a very large list may require virtualization; if KB lists grow large, consider react-window/react-virtual for better performance.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/app/(console)/kb/version/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*
