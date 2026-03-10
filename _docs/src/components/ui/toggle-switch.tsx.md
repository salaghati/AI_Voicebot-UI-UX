<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/components/ui/toggle-switch.tsx",
  "source_hash": "01efe24b9349916adf0d73799b947556310646ed67d291ab271bf939302bdbcf",
  "last_updated": "2026-03-10T04:12:22.116701+00:00",
  "git_sha": "e2a98f899fe6b4645b5d430466ae4c16931aec4c",
  "tokens_used": 5275,
  "complexity_score": 2,
  "estimated_review_time_minutes": 10,
  "external_dependencies": []
}
```

</details>

[Documentation Home](../../../README.md) > [src](../../README.md) > [components](../README.md) > [ui](./README.md) > **toggle-switch.mdx**

---

# toggle-switch.tsx

> **File:** `src/components/ui/toggle-switch.tsx`

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

This file implements a single exported function component ToggleSwitch which accepts a props object typed inline: { checked: boolean; onChange: () => void; disabled?: boolean }. The component renders a <button> element with role="switch" and aria-checked bound to the checked prop, making it accessible to assistive technologies. The button's onClick handler calls e.preventDefault() and e.stopPropagation() and then invokes the provided onChange() callback; the component itself does not keep or manage any internal state, so it is a fully controlled component and expects its parent to toggle the checked value.

Styling is applied via a className string composed with template literals to vary visual appearance by checked and disabled props. The outer button uses inline Tailwind-like utility classes and two explicit hex background colors: #10b981 when checked and #cbd5e1 when not. The inner <span> represents the knob and uses conditional translate classes (translate-x-5 vs translate-x-0.5) to animate position based on checked. There are no imports in this file (it relies on the consuming project’s JSX/TSX setup and the environment-provided React runtime when applicable). No external APIs, files, or databases are touched; the component simply renders markup and invokes the onChange callback passed by its caller.

## Dependencies

No dependencies identified.

## 📁 Directory

This file is part of the **ui** directory. View the [directory index](_docs/src/components/ui/README.md) to see all files in this module.

## Architecture Notes

- Implements a stateless (controlled) React function component pattern: all state is owned by the caller via the checked prop; the component only issues change events via onChange().
- Accessibility: uses role="switch" and aria-checked={checked} to communicate state to assistive tech. The element is a <button>, which preserves built-in keyboard activation behavior.
- Event handling: onClick prevents default and stops propagation before calling onChange(); this prevents parent handlers and default browser behavior from running for that click event.
- Styling pattern: uses a template literal to compose className with conditional fragments for checked and disabled states and inline hex color values, suggesting Tailwind-style utility classes but with explicit colors present in the string.

## Usage Examples

### Parent component toggles a boolean setting

Parent holds a boolean state (e.g., isOn) and renders <ToggleSwitch checked={isOn} onChange={() => setIsOn(prev => !prev)} disabled={false} />. When the user clicks the rendered button, ToggleSwitch's onClick handler prevents default/propagation and calls the provided onChange callback. The parent flips its state in the callback, causing the parent to re-render ToggleSwitch with the updated checked prop which changes the button background and knob translate classes to reflect the new state.

## Maintenance Notes

- Because the component calls e.preventDefault() and e.stopPropagation() on click, consumers should be aware that surrounding click handlers or default behaviors will not run; remove these calls if propagation is desired in some contexts.
- Keyboard accessibility is mostly preserved by using a <button>, but if custom keyboard interactions are required (e.g., left/right arrow to toggle), add onKeyDown handlers and update aria attributes accordingly.
- Testing should assert: aria-checked reflects the checked prop, disabled prop disables the button, onChange is invoked exactly once per activation, and className toggles for the checked/disabled combinations.
- If this project uses the automatic JSX runtime (React 17+), explicit React imports are not required; otherwise, add an import React from 'react' depending on build configuration.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/components/ui/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*
