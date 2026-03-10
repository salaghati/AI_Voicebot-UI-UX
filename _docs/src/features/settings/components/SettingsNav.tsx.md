<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/features/settings/components/SettingsNav.tsx",
  "source_hash": "f904da7b0086fee4369032853d72b63c93d5ae1625ae029d1d54dbb89b4b3483",
  "last_updated": "2026-03-10T04:17:46.542307+00:00",
  "git_sha": "7143c8084e6bda5f275ef1c2e291db7f2772553a",
  "tokens_used": 6074,
  "complexity_score": 2,
  "estimated_review_time_minutes": 10,
  "external_dependencies": [
    "next/link",
    "next/navigation"
  ]
}
```

</details>

[Documentation Home](../../../../README.md) > [src](../../../README.md) > [features](../../README.md) > [settings](../README.md) > [components](./README.md) > **SettingsNav.mdx**

---

# SettingsNav.tsx

> **File:** `src/features/settings/components/SettingsNav.tsx`

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

This file exports a single client-side React function component SettingsNav which renders a set of predefined settings links. At module scope it defines a constant settingsLinks — an array of objects with label and href keys — and the component maps over that array to produce a list of next/link <Link> elements. The component uses the Next.js usePathname hook to read the current URL and a local cn utility to conditionally compose CSS class strings so the active link receives a distinct set of classes (using CSS variable-based colors and borders).

Implementation details important to developers: the file begins with the "use client" directive, making the component a client component in Next.js. The active link is determined by strict equality (pathname === link.href). className strings are built with the cn helper to choose between active styling (accent border/background/text) and default styling. There is no local state, side effects, or external API/database calls — it is a pure presentational component that depends only on the Next.js router state (usePathname) and an internal classnames helper. The link array contains explicit labels and hrefs for settings pages (e.g., "/settings/users", "/settings/agent/queue-new"), and each Link uses link.href as the React key.

## Dependencies

### External Dependencies

| Module | Usage |
| --- | --- |
| `next/link` | Imports the default exported Link React component (import Link from "next/link"). Used inside SettingsNav.map to render navigation anchors for each entry in settingsLinks with href and key attributes to enable client-side navigation. |
| `next/navigation` | Imports the named hook usePathname (import { usePathname } from "next/navigation"). Used to read the current pathname so the component can compute active = pathname === link.href and apply active styling to the matching Link. |

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/lib/utils](../@/lib/utils.md) | Imports the named helper cn (import { cn } from "@/lib/utils"). Used to compose the Link className by joining base classes with either the active or inactive class string depending on the computed active boolean. |

## 📁 Directory

This file is part of the **components** directory. View the [directory index](_docs/src/features/settings/components/README.md) to see all files in this module.

## Architecture Notes

- Functional presentational client component: The file exports a single function SettingsNav which is a stateless React component (no hooks other than usePathname) and renders purely from the settingsLinks constant.
- Client rendering: The top-level "use client" directive makes this a Next.js client component to allow usePathname and client-side Link navigation.
- Active-detection strategy: It uses strict equality (pathname === link.href) to determine the active item. This is simple and fast but sensitive to trailing slashes and will not match parent routes (e.g., '/settings/users/123' won't match '/settings/users').
- Styling approach: Class names use a cn utility to combine Tailwind-like classes and CSS variables (e.g., var(--accent), var(--accent-soft)) rather than inline styles or styled-components.
- Minimal error handling: No validation of settingsLinks or pathname; assumes hrefs are valid paths and usePathname returns a non-null string.

## Usage Examples

### Embed SettingsNav in a settings page layout

Import SettingsNav from src/features/settings/components/SettingsNav and include it in the settings page component render. When the page renders, usePathname returns the current path; SettingsNav maps settingsLinks and renders a Link for each. The Link whose href exactly matches pathname receives the active CSS classes. Clicking a Link triggers Next.js client navigation (no full page reload). Note: because active is determined by strict equality, nested or dynamic sub-paths will not set the parent as active unless the pathname exactly matches the href.

## Maintenance Notes

- Active-path edge cases: Consider normalizing pathname (strip trailing slash) or using startsWith for parent-route highlighting if you need parent items to remain active for nested routes.
- Accessibility improvements: Add aria-current="page" on the active Link and ensure contrast of CSS variable colors meets accessibility guidelines.
- Testing: Snapshot tests or DOM tests should assert that the correct Link has the active classes when usePathname returns different values. Mock next/navigation's usePathname in tests.
- Extensibility: If link list needs to be dynamic or localized, replace the hard-coded settingsLinks array with props or a translation-aware data source.
- Performance: Mapping over a small static array is trivial; no memoization required unless the list grows or is computed from expensive data.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/features/settings/components/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*
