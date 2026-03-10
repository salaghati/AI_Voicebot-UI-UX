<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/components/ui/badge.tsx",
  "source_hash": "6f8a2507134ee9140170a7e9457f0923d2619c13d21a7d5f5e0a4b865e3102b6",
  "last_updated": "2026-03-10T04:11:47.199822+00:00",
  "git_sha": "5b75aad505ebacfcb5025e9ebe91b7558d7f7790",
  "tokens_used": 5375,
  "complexity_score": 2,
  "estimated_review_time_minutes": 5,
  "external_dependencies": [
    "react"
  ]
}
```

</details>

[Documentation Home](../../../README.md) > [src](../../README.md) > [components](../README.md) > [ui](./README.md) > **badge.mdx**

---

# badge.tsx

> **File:** `src/components/ui/badge.tsx`

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

This file defines a lightweight, stateless React UI component named Badge and a small constant map (toneClass) that maps semantic tone names to Tailwind CSS utility class strings. The Badge component accepts standard HTML span attributes (typed via HTMLAttributes<HTMLSpanElement>), an optional `tone` prop restricted to the keys of toneClass (defaulting to "muted"), and any other span props which are spread onto the rendered <span>. The visual styling is composed by merging a base set of utility classes with the tone-specific classes and any user-provided className via the imported `cn` utility.

This component is intended as a reusable UI primitive for showing small labeled indicators (status, small tags) across the app. It does not manage state or interact with external systems; it only outputs a semantic span with combined Tailwind classes and forwards events/attributes via props spreading. Important implementation details: toneClass is a plain object literal whose keys (success, warning, info, muted, danger) are used as the allowed tone values via TypeScript's `keyof typeof toneClass`; class composition uses the project's `cn` helper for safe class merging; and the returned element is a <span> with inline-flex rounded-full and small typography sizing consistent with badge UI patterns.

## Dependencies

### External Dependencies

| Module | Usage |
| --- | --- |
| `react` | Imports `HTMLAttributes` from 'react' to type the component props: the Badge prop type is `HTMLAttributes<HTMLSpanElement> & { tone?: keyof typeof toneClass }`. This is an external npm package (React). |

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/lib/utils](../@/lib/utils.md) | Imports the `cn` utility from '@/lib/utils' and uses it to join the base badge classes, the tone-specific classes from `toneClass[tone]`, and any incoming `className` prop into a single className string applied to the <span>. This is an internal project module. |

## 📁 Directory

This file is part of the **ui** directory. View the [directory index](_docs/src/components/ui/README.md) to see all files in this module.

## Architecture Notes

- Implements a presentational (stateless) functional React component: no hooks, no state, purely renders based on props.
- Uses TypeScript typing to restrict `tone` to the literal keys of `toneClass` via `keyof typeof toneClass`, preventing invalid tone values at compile time.
- Class composition pattern: base classes + tone-specific classes + optional className are combined through the `cn` helper to produce a single className string (common pattern for Tailwind + conditional classes).
- Props are spread onto the span (<span {...props} />) allowing consumers to pass standard HTML attributes (e.g., aria-label, id, onClick). This gives flexibility but means consumers are responsible for accessibility semantics.
- No external side-effects or I/O; pure UI rendering only.

## Usage Examples

### Rendering a default muted badge

Import and render <Badge> without specifying tone: it will default to tone="muted" and render a small rounded span with the muted Tailwind classes. You can pass any span attributes (e.g., aria-label or title) and className to extend styling. Example flow: component receives props -> `cn` merges classes -> returns <span> with merged className and forwarded props.

### Using a success tone and custom classes

Render <Badge tone="success" className="mr-2">Success</Badge> to get the `bg-emerald-100 text-emerald-700` tone classes plus any additional classes (here `mr-2`). The TypeScript signature enforces that `tone` must be one of the keys in toneClass (success|warning|info|muted|danger), so invalid strings will be caught at compile time.

## Maintenance Notes

- Because styling relies on Tailwind utility classes in toneClass, any project Tailwind configuration changes or class renames must be reflected here. Keep toneClass synchronized with design tokens.
- The component forwards all span props; ensure tests cover passing event handlers and ARIA attributes to validate expected behavior and a11y requirements.
- Consider adding an explicit role or allowing an optional `as` prop if semantic alternatives are needed (e.g., rendering as a <button> for interactive badges). Currently it always renders a <span> which is purely presentational.
- If the `cn` helper changes its API, update the import usage accordingly. Unit tests should mock or assert the final className string to detect regressions.
- No performance bottlenecks expected; it's a tiny render-only component. However, excessive usage in very large lists may benefit from memoization if props are stable.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/components/ui/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*
