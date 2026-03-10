<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/app/(console)/preview/playground/page.tsx",
  "source_hash": "b2b07cc8255d89cc85fd242e8e559b47b351a7bdd6ed84799d80455f9e72aaa9",
  "last_updated": "2026-03-10T03:58:52.459162+00:00",
  "git_sha": "0ee3e498379a6c28cbfd9b5d3495212d3aeb026d",
  "tokens_used": 7019,
  "complexity_score": 2,
  "estimated_review_time_minutes": 10,
  "external_dependencies": [
    "react",
    "lucide-react"
  ]
}
```

</details>

[Documentation Home](../../../../../README.md) > [src](../../../../README.md) > [app](../../../README.md) > [(console)](../../README.md) > [preview](../README.md) > [playground](./README.md) > **page.mdx**

---

# page.tsx

> **File:** `src/app/(console)/preview/playground/page.tsx`

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

This file exports a single React functional component PlaygroundPage which implements a presentation-only preview UI for a scripted voicebot conversation. It defines a module-level constant script (an array of transcript entries with speaker, content, and log fields), and uses React hooks (useState, useMemo) to manage the current reveal index (index) and playback state (playing). The component renders a PageHeader with action buttons and a two-column grid: a Card that displays the progressively revealed transcript items and a Card that displays the logs and static latency metrics.

The UI behavior is driven by a small local API: const next = () => setIndex(value => Math.min(value + 1, script.length)) advances the revealed transcript slice and setIndex(0)/setPlaying(false) resets the preview. useMemo computes transcript = script.slice(0, index) to derive what is currently visible. The Play/Pause Button toggles the playing boolean and, when transitioning from paused to playing, immediately calls next() to reveal the next line. No asynchronous I/O, network calls, or external systems are invoked by this file; it composes UI from imported internal components (Button, Card, PageHeader) and third-party icon components (lucide-react).

Important implementation notes: the file is purely presentational and intentionally stores the sample data inline (const script). Text shown in the UI is Vietnamese. Visual and accessibility behavior (for example ARIA attributes, keyboard handling, or auto-advance while playing) is minimal—'playing' is only a boolean toggle used for button label/icon and to trigger one immediate next() on start; there is no timer/interval to auto-advance further lines. The component is client-side only ("use client" directive) which is appropriate for interactive hook-based behavior in Next.js 13+ app router pages.

## Dependencies

### External Dependencies

| Module | Usage |
| --- | --- |
| `react` | Imports named hooks: useMemo and useState (import { useMemo, useState } from "react"). useState manages local state variables index and playing; useMemo computes the transcript slice from the script constant to avoid recomputing on every render. |
| `lucide-react` | Imports three icon components: Pause, Play, Square (import { Pause, Play, Square } from "lucide-react"). These are used as inline icon elements inside Button components to indicate Play/Pause and End/Stop actions in the page header. |

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/components/ui/button](../@/components/ui/button.md) | Imports the project's Button component (import { Button } from "@/components/ui/button"). Used for the Play/Pause toggle, the reset button, and the 'Hiển thị câu tiếp theo' inline control in the transcript card. Buttons handle onClick callbacks that call setPlaying, next, and setIndex as implemented in the component. |
| [@/components/ui/card](../@/components/ui/card.md) | Imports the project's Card component (import { Card } from "@/components/ui/card"). Used to render the two primary panels: the transcript card (lg:col-span-2) and the log/metrics card. Cards are given className props for spacing and content layout. |
| [@/components/shared/page-header](../@/components/shared/page-header.md) | Imports PageHeader (import { PageHeader } from "@/components/shared/page-header"). PageHeader is used at the top of the page to show the page title, description, and actions prop containing the Play/Pause and Reset buttons. |

## 📁 Directory

This file is part of the **playground** directory. View the [directory index](_docs/src/app/(console)/preview/playground/README.md) to see all files in this module.

## Architecture Notes

- Pattern: single React functional component using local state (useState) and memoized derived state (useMemo). The component is client-only ("use client"), which enables hook usage and interactive UI.
- Data flow: a static constant script (array of {speaker, content, log}) is the only data source. index (number) controls how many entries are revealed via transcript = script.slice(0, index). next() updates index using a capped increment (Math.min), ensuring it never exceeds script.length.
- UI composition: uses internal presentational components (Button, Card, PageHeader) and external icon components for consistent styling. The component delegates layout and basic styling to these components and Tailwind CSS classes provided inline.
- Error handling: none present — the component assumes script is valid and index is bounded; next uses Math.min to avoid overflow. There are no network calls or try/catch blocks.
- State management strategy: local component state only (no global state, context, or Redux). 'playing' is a boolean used only for label/icon toggling and to trigger a single next() when toggled from false to true; there is no interval or automatic playback loop.

## Usage Examples

### Interactive preview of a scripted conversation in the development UI

Render PlaygroundPage in the app to visually inspect the sample voicebot transcript and logs. Initial render sets index to 0 so transcript is empty. Clicking the Play button toggles playing from false to true and immediately calls next() to increment index to 1; this causes transcript to include the first entry (script[0]) and the Play button shows a Pause icon and label. The developer can then click 'Hiển thị câu tiếp theo' or the Play button again (which will toggle playing and, when starting from paused, reveal the next line). Clicking the 'Kết thúc cuộc gọi Preview' button sets index to 0 and playing to false, clearing the transcript and resetting the header actions. The logs card mirrors transcript entries by mapping transcript to log lines; latency values are displayed as static values in the card.

## Maintenance Notes

- Performance: current data set is small and in-memory; useMemo prevents unnecessary recomputation of transcript but is not critical here. If script grows large, consider virtualized list rendering for the transcript/logs.
- Accessibility and i18n: visible text is in Vietnamese; consider exposing accessible labels (aria-label) on action buttons and ensuring keyboard focus states. If used by non-Vietnamese developers or locales, extract strings for localization.
- Playback behavior: 'playing' currently only triggers a single next() when toggled; if the intended UX is continuous auto-advance, implement an interval or requestAnimationFrame loop to advance index until script.length or playing becomes false, and ensure to clear the timer on unmount.
- Testing: unit tests should render PlaygroundPage and assert initial state, button label/icon toggling, next() behavior (index increments and capping at script.length), and reset behavior. Edge cases include rapid toggles and index bounds (index must not exceed script.length).
- Future improvements: expose callbacks or events when a line is revealed (e.g., onLineShown) to integrate with telemetry or external demo hooks; allow editing the script via props to make component reusable for different demos.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/app/(console)/preview/playground/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*
