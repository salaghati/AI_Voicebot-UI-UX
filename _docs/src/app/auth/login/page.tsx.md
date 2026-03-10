<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/app/auth/login/page.tsx",
  "source_hash": "83b8c1b60ef693bf9133a39fdaa035066b4f01f22cb21c1ac8012603a7d072b5",
  "last_updated": "2026-03-10T04:09:20.631672+00:00",
  "git_sha": "20751471977aeed88e58acca8de2991d67d924c4",
  "tokens_used": 6055,
  "complexity_score": 2,
  "estimated_review_time_minutes": 10,
  "external_dependencies": []
}
```

</details>

[Documentation Home](../../../../README.md) > [src](../../../README.md) > [app](../../README.md) > [auth](../README.md) > [login](./README.md) > **page.mdx**

---

# page.tsx

> **File:** `src/app/auth/login/page.tsx`

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

This file exports a default React component LoginPage (a Next.js app route page located at src/app/auth/login/page.tsx) that renders a full-screen, centered login card. The layout is implemented using Tailwind CSS utility classes: an outer <main> with complex radial background gradients and a centered container that uses a responsive CSS grid (max-w-6xl, lg:grid-cols-[1.15fr_1fr]) to split content into a decorative left section and a functional right section where the LoginForm component is placed.

The left section is fully static/visual: headings, descriptive text (in Vietnamese), three feature-style bullets, and two absolutely positioned blurred decorative circles. The right section is a simple centered container that renders <LoginForm /> which is imported from the internal module "@/features/auth". This page component is purely presentational: it accepts no props, manages no state, and does not perform data fetching or side effects itself. The responsibility for handling user input, validation, and authentication is delegated to the LoginForm component. Because this file lives under src/app/.../page.tsx it is intended to act as the route entry for /auth/login in a Next.js app router structure.

## Dependencies

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/features/auth](../@/features/auth.md) | Imports the named export LoginForm and renders it inside the right-hand section of the page. The page itself delegates all interactive/login behavior to this component. |

## 📁 Directory

This file is part of the **login** directory. View the [directory index](_docs/src/app/auth/login/README.md) to see all files in this module.

## Architecture Notes

- Presentational page component pattern: this file composes the visual layout and delegates behavior to a child component (LoginForm).
- Tailwind CSS utility classes are used throughout for layout, spacing, colors, and responsive behavior (e.g., grid, max-w-6xl, lg:grid-cols, rounded-3xl).
- Decorative elements use absolute positioning and pointer-events-none to avoid intercepting input (two blurred circular overlays in the left section).
- No client-side state, data fetching, or side effects occur in this file; interactive logic should be implemented inside the imported LoginForm component.
- By file location (src/app/auth/login/page.tsx) this serves as a Next.js app-router page file responsible for the /auth/login route.

## Usage Examples

### Rendering the login page in the browser when navigating to /auth/login

When a user navigates to the /auth/login route, Next.js will render this page component. The host layout provides the global page frame; LoginPage creates a centered card with a promotional left column and an interactive right column containing <LoginForm />. All form input handling, validation, and submission are expected to be implemented in the LoginForm component. This page provides only layout and visual context and does not handle authentication logic directly.

## Maintenance Notes

- Ensure LoginForm is implemented as a client component (if it uses React hooks or browser-only APIs) while this page remains server-renderable if desired. If LoginForm requires client runtime, add 'use client' at the top of the LoginForm file rather than here.
- Tailwind class names are extensive; changes to the design system or Tailwind configuration (colors, breakpoints) may require updates to multiple utility class sets in this file.
- Accessibility: the page currently contains semantic elements (section, main) but the static left column should be checked for sufficient color contrast and localization (text is partially Vietnamese). Verify the LoginForm includes appropriate aria attributes and keyboard focus management.
- Performance: large backdrop gradients and blurred elements are purely decorative but could affect paint; test on low-end devices and consider using optimized SVGs or lower-cost effects if necessary.
- Testing: snapshot tests can validate layout; integration tests should mount LoginForm separately to validate input, validation, and submission flows.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/app/auth/login/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*
