<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/lib/utils.ts",
  "source_hash": "81dc9c1435e2fca9f466b40b0ab83eb1a36c43538fbafeb2a3ef20af14589948",
  "last_updated": "2026-03-10T04:22:29.469889+00:00",
  "git_sha": "94b56cc29d1098208b6792d916841fa15fba3f2a",
  "tokens_used": 5447,
  "complexity_score": 2,
  "estimated_review_time_minutes": 5,
  "external_dependencies": [
    "clsx",
    "tailwind-merge"
  ]
}
```

</details>

[Documentation Home](../../README.md) > [src](../README.md) > [lib](./README.md) > **utils**

---

# utils.ts

> **File:** `src/lib/utils.ts`

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

This module exports four small utility functions used across a frontend codebase: cn, formatPercent, formatDateTime, and sleep. cn is a thin wrapper around the third-party clsx and tailwind-merge libraries to combine and de-duplicate class names safely; formatPercent formats a numeric value to one decimal place and appends a percent sign; formatDateTime converts an ISO timestamp string into a locale-formatted date/time using the Vietnamese locale ("vi-VN") with specific year/month/day/hour/minute options; sleep returns a Promise that resolves after a given millisecond delay using setTimeout.

The file is intended to be imported by UI components and utility code. It contains no network, filesystem, or database calls — only pure or near-pure functions (sleep has the side effect of scheduling a timer). Design decisions visible in the code: leveraging clsx for flexible class-value input handling (including arrays/objects/strings via ClassValue) and then passing the result through tailwind-merge to collapse/resolve conflicting Tailwind utility classes; and using toLocaleString with an explicit locale and formatting options to ensure consistent date/time presentation for Vietnamese users. The module is minimal and focused on presentation/UX utilities and developer ergonomics for composing class names and formatting small pieces of data.

## Dependencies

### External Dependencies

| Module | Usage |
| --- | --- |
| `clsx` | Imports `clsx` and the TypeScript type `ClassValue` via `import { clsx, type ClassValue } from "clsx";`. The function cn calls clsx(inputs) to convert the variadic ClassValue[] into a single class string that understands arrays/objects/strings. Marked as external because clsx is an npm package. |
| `tailwind-merge` | Imports `twMerge` via `import { twMerge } from "tailwind-merge";`. The function cn calls twMerge(...) on the string returned by clsx to merge and deduplicate Tailwind CSS utility classes (resolving conflicting utilities). Marked as external because tailwind-merge is an npm package. |

## 📁 Directory

This file is part of the **lib** directory. View the [directory index](_docs/src/lib/README.md) to see all files in this module.

## Architecture Notes

- Module follows a utility/helper pattern: small exported functions with no shared mutable state, suitable for tree-shaking in modern bundlers.
- cn composes two third-party libraries: clsx to flatten various class inputs into a string, then tailwind-merge to resolve Tailwind-specific class conflicts. This keeps class-name logic centralized and deterministic.
- formatDateTime uses the runtime's Intl implementation via Date.prototype.toLocaleString with locale "vi-VN" and explicit options; output can vary across JS engines/environments if Intl implementations differ.
- sleep returns a Promise that resolves via setTimeout, making it suitable for awaiting delays in async flows or tests. It is not cancellable and relies on the global timer queue.

## Usage Examples

### Combining dynamic Tailwind classes in a React component

Import cn and pass a mix of conditional classes and arrays/objects. Example: cn('px-4', isActive && 'bg-blue-500', ['text-sm', extraClass]) will first flatten these with clsx, then twMerge will collapse conflicts (e.g., multiple padding or color utilities). The returned string can be used as the className prop on an element. This prevents duplicated/conflicting Tailwind utilities in rendered markup.

### Displaying percentages in UI

Call formatPercent(value) where value is a number (for example 12.345). The function returns a string with one decimal place and a percent sign (e.g., '12.3%'), implemented as `${value.toFixed(1)}%`. Use this when you need consistent single-decimal percentage labels in charts, tables, or badges.

### Formatting timestamps for Vietnamese locale and waiting in async flows/tests

For a stored ISO timestamp string (e.g., '2023-09-01T12:34:56Z'), call formatDateTime(iso) to get a locale-formatted string using 'vi-VN' with 2-digit month/day and 2-digit hour/minute. For test delays or sequencing UI animations, await sleep(ms) where ms is the number of milliseconds to pause; sleep returns a Promise that resolves after setTimeout completes. Note: sleep is not cancellable and relies on global timers.

## Maintenance Notes

- Keep clsx and tailwind-merge versions compatible. Changes in tailwind-merge behavior could alter how class conflicts are resolved; lock versions or add tests that assert expected merged class outputs.
- formatDateTime relies on the environment's Intl implementation; server-side rendering or older JS runtimes may produce different formats. If deterministic formatting across environments is required, consider using a dedicated date library (and add tests for edge cases/timezones).
- formatPercent uses Number.prototype.toFixed which rounds; if different rounding behavior is required (bankers rounding, floor/ceil), adjust implementation and tests accordingly.
- sleep uses setTimeout and is subject to test flakiness if used with real timeouts. Prefer injecting a mock timer (jest.useFakeTimers) in unit tests or reduce durations for test runs.
- Add unit tests for cn to cover array/object inputs, and ensure tailwind-merge resolution cases (e.g., 'p-2 p-4' -> correct result).

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/lib/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*
