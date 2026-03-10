<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/components/shared/metric-card.tsx",
  "source_hash": "cbcad42ca51c474179e76860ffa14341a2d48c03e4259547f5d80f4cd58308e9",
  "last_updated": "2026-03-10T04:11:20.434576+00:00",
  "git_sha": "2a1c4d0b2dc50c4fccfc8a13a4f85c50c8f93463",
  "tokens_used": 5468,
  "complexity_score": 2,
  "estimated_review_time_minutes": 10,
  "external_dependencies": [
    "lucide-react"
  ]
}
```

</details>

[Documentation Home](../../../README.md) > [src](../../README.md) > [components](../README.md) > [shared](./README.md) > **metric-card.mdx**

---

# metric-card.tsx

> **File:** `src/components/shared/metric-card.tsx`

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

This file exports a single React functional component MetricCard which is implemented in TypeScript/JSX. MetricCard accepts a typed props object ({ title, value, trend, up = true }) and returns a Card wrapper containing a title line, a large value line, and an optional trend line that displays either an up or down arrow icon from lucide-react depending on the boolean `up`. Styling is applied via Tailwind-like class strings and a cn utility to conditionally apply color classes for positive/negative trends.

The component is purely presentational and stateless: it does not hold or mutate any internal state, perform data fetching, or interact with external systems. It integrates with the project's UI primitives by importing Card from an internal UI module and uses the cn utility (internal) to concatenate conditional classes. The component expects CSS variables --text-dim and --text-main to exist in the consuming app's stylesheet for correct color rendering, and it relies on lucide-react for the arrow icon SVGs.

## Dependencies

### External Dependencies

| Module | Usage |
| --- | --- |
| `lucide-react` | Imports ArrowDown and ArrowUp icon components which are conditionally rendered inside the trend paragraph depending on the `up` prop. These provide the visual up/down arrows. |

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/components/ui/card](../@/components/ui/card.md) | Imports the Card component which is used as the outer wrapper element for the metric card UI. This is an internal UI primitive that provides layout/styling for the contained content. |
| [@/lib/utils](../@/lib/utils.md) | Imports the cn utility (class-name combiner) to merge base classes with conditional color classes based on the `up` boolean (`text-emerald-600` vs `text-red-600`). Used to keep JSX className expressions concise and readable. |

## 📁 Directory

This file is part of the **shared** directory. View the [directory index](_docs/src/components/shared/README.md) to see all files in this module.

## Architecture Notes

- Implements a single stateless React functional component pattern — no hooks, no state, and no side effects. This makes it safe to render many instances and easy to memoize if needed by parent components.
- Conditional rendering pattern: the trend paragraph is rendered only when the optional `trend` prop is provided. The `up` boolean controls which arrow icon is shown and which color class (positive/negative) is applied via cn.
- Styling depends on project CSS variables (--text-dim, --text-main) and Tailwind-like utility classes. There is no accessibility markup (aria labels) on the icon or trend container, which may be important for screen-reader users.

## Usage Examples

### Rendering a positive metric with trend

A parent component can render <MetricCard title="Revenue" value="$12.3k" trend="+5.2%" up={true} />. The Card wrapper will show the title and value; since trend is provided and up is true, the ArrowUp icon will be shown in an emerald color next to the '+5.2%' text. If the parent omits the trend prop, the trend row will not be rendered.

### Rendering a negative metric without trend

To display only a title and value, call <MetricCard title="Active" value="1,234" />. The component will render the title and value lines and skip the trend paragraph because `trend` is undefined. No icons or conditional color classes will be applied in this case.

## Maintenance Notes

- Performance: component is trivial and renders quickly. If used in large lists, consider React.memo at the import site to avoid unnecessary re-renders when props are unchanged.
- Styling pitfalls: relies on CSS variables --text-dim and --text-main and Tailwind classes. Ensure these tokens exist in the consuming app; otherwise text colors may be unexpected.
- Accessibility: icons are purely decorative; consider adding aria-hidden or accessible labels if the trend information must be exposed to assistive technologies.
- Testing: unit tests should verify the presence/absence of the trend paragraph, correct icon selection based on `up`, and correct color classes. Edge cases: empty string for `trend` will render a blank trend paragraph; prefer undefined to hide it.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/components/shared/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*
