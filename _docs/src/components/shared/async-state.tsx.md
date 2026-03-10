<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/components/shared/async-state.tsx",
  "source_hash": "17391e9f265eeb10d123a738450e4846b8194d0cabbf61c7a0e4035c2acaf597",
  "last_updated": "2026-03-10T04:11:21.451403+00:00",
  "git_sha": "d865336de7a80eb48678ec2a6ebb72f679fabf4a",
  "tokens_used": 5707,
  "complexity_score": 2,
  "estimated_review_time_minutes": 10,
  "external_dependencies": [
    "lucide-react"
  ]
}
```

</details>

[Documentation Home](../../../README.md) > [src](../../README.md) > [components](../README.md) > [shared](./README.md) > **async-state.mdx**

---

# async-state.tsx

> **File:** `src/components/shared/async-state.tsx`

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

This file defines a single exported React functional component AsyncState which is implemented in TypeScript (TSX). AsyncState is responsible for rendering a Card-centered status panel for four explicit states: "loading", "empty", "error", and "forbidden". It maps each state to a small meta object containing a JSX icon, a title, and a description. The component accepts a typed props object that includes a discriminated union for state ("loading" | "empty" | "error" | "forbidden"), an optional message string that overrides the default description for error/forbidden states, and an optional onRetry callback invoked by a rendered retry Button when applicable.

AsyncState is purely presentational: it does not perform network requests, side effects, or local state updates. It consumes three imports: icon components from the external lucide-react package and two internal UI primitives (Card and Button) from the project's component library. The component uses className-based Tailwind/CSS utility classes and CSS variables (e.g., --accent, --text-dim, --text-main) for styling. Important behavior details: the error and forbidden descriptions fall back to default Vietnamese strings unless message is provided; the retry Button is only shown when onRetry is provided and the state is not "loading".

## Dependencies

### External Dependencies

| Module | Usage |
| --- | --- |
| `lucide-react` | Imports four icon components: Ban, Database, Loader2, TriangleAlert. These are used directly in the runtime meta mapping to render the corresponding icon for each AsyncState (e.g., Loader2 with animate-spin for 'loading', TriangleAlert for 'error'). |

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/components/ui/button](../@/components/ui/button.md) | Imports the project's Button component and uses it to render a retry button when onRetry is provided and state !== 'loading'; the Button receives the onRetry function as its onClick handler. |
| [@/components/ui/card](../@/components/ui/card.md) | Imports the project's Card component and uses it as the outer container for the status panel. Card receives layout className props to center content and apply spacing/styling. |

## 📁 Directory

This file is part of the **shared** directory. View the [directory index](_docs/src/components/shared/README.md) to see all files in this module.

## Architecture Notes

- Presentational functional component pattern: no internal state, all behavior driven by props (state, message, onRetry).
- Uses a simple mapping object (meta) keyed by the state union to select icon, title, and description. This keeps rendering logic declarative and concise.
- Styling uses utility classes and CSS custom properties (e.g., --accent, --text-dim, --text-main) so visual theme is driven by global CSS variables rather than inline styles.
- Error/forbidden message override: message prop is used only for 'error' and 'forbidden' descriptions (falls back to default strings when absent).
- Conditional rendering: retry Button is rendered only if onRetry is provided and state is not 'loading', preventing retry attempts during active loading.

## Usage Examples

### Display a loading state while fetching a list

Parent list component renders <AsyncState state="loading" /> while awaiting data. The component shows the spinning Loader2 icon and the default Vietnamese loading title/description. No retry button is shown because onRetry is not passed or because state === 'loading'.

### Show a retryable error state after a failed fetch

On fetch failure, parent renders <AsyncState state="error" message={serverErrorMessage} onRetry={fetchData} />. The component displays TriangleAlert icon, the error title, and either the provided serverErrorMessage or the default error description. Because onRetry is provided and state !== 'loading', a Button labeled 'Thử lại' is shown; clicking it calls the provided fetchData function.

### Empty list prompting user action

When the dataset is empty, render <AsyncState state="empty" /> to show the Database icon with guidance text. No retry button appears unless an onRetry handler is explicitly provided by the parent and state is not 'loading'.

## Maintenance Notes

- Strings are hard-coded in Vietnamese; extract to a localization system if multi-language support is required.
- The component relies on CSS variables for color theming. Ensure global CSS defines --accent, --text-dim, and --text-main or update classNames accordingly.
- Because icons are imported from lucide-react, ensure that package is present in dependencies and that tree-shaking/build supports these named imports.
- Unit tests should verify the meta mapping for each state, the message fallback behavior for error/forbidden, and the conditional rendering of the retry Button.
- If more states are required in the future, add them to the union type in the prop definition and to the meta mapping to keep types and runtime mapping consistent.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/components/shared/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*
