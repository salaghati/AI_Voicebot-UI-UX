<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/app/layout.tsx",
  "source_hash": "fe0703c8ebbe979a28604ce4b1385d0db6f652256e19dc8fe4ea8a714f8c74e0",
  "last_updated": "2026-03-10T04:10:12.456245+00:00",
  "git_sha": "b312e04cb679a318d3bd05b8e5931eea837af648",
  "tokens_used": 5983,
  "complexity_score": 2,
  "estimated_review_time_minutes": 5,
  "external_dependencies": [
    "next",
    "next/font/google"
  ]
}
```

</details>

[Documentation Home](../../README.md) > [src](../README.md) > [app](./README.md) > **layout.mdx**

---

# layout.tsx

> **File:** `src/app/layout.tsx`

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

This file's primary responsibility is to configure and export the application's top-level layout component for the Next.js App Router. It imports two Google fonts via next/font/google (Plus_Jakarta_Sans and Space_Grotesk), constructs font configuration objects (jakarta and display) with CSS variable names, imports a Providers component from the project, and applies a global stylesheet via a side-effect import. It also exports a typed metadata object (Metadata) used by Next.js and sets the dynamic rendering mode explicitly with export const dynamic = "force-dynamic".

The exported default RootLayout component returns an <html lang="vi"> element and a <body> that composes the font CSS variables and the utility class "antialiased" into its className. The Providers component wraps the children prop so that all nested pages/components receive whatever context or setup Providers supplies. As a layout.tsx file in a Next.js app directory, this file functions as the root layout for the matching route tree and influences rendering, global styles, font variables, and metadata for the pages it encloses.

## Dependencies

### External Dependencies

| Module | Usage |
| --- | --- |
| `next` | Imports the Metadata type via `import type { Metadata } from "next";`. The Metadata type is used to type the exported `metadata` constant: `export const metadata: Metadata = { ... }`. |
| `next/font/google` | Imports `Plus_Jakarta_Sans` and `Space_Grotesk` functions via `import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";`. These functions are called to create `jakarta` and `display` font objects with `{ variable: "--font-...", subsets: ["latin"] }`. The file then references `jakarta.variable` and `display.variable` in the body className to inject CSS variables for the fonts. |

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/components/providers](../@/components/providers.md) | Imports the `Providers` React component via `import { Providers } from "@/components/providers";`. This component is used to wrap `children` inside the layout JSX: `<Providers>{children}</Providers>`, ensuring application-level contexts or providers are available to descendant components. |
| [./globals.css](.././globals.css.md) | Side-effect import via `import "./globals.css";` to include project-wide CSS. The import ensures global styles are applied to the rendered HTML without binding an exported symbol. |

## 📁 Directory

This file is part of the **app** directory. View the [directory index](_docs/src/app/README.md) to see all files in this module.

## Architecture Notes

- This file is a Next.js App Router layout (layout.tsx). By convention such files run as server components unless marked with `"use client"`; this file contains no `"use client"` directive and therefore is a server component. It returns the top-level <html> and <body> structure for pages in this route tree.
- Font loading uses next/font/google to configure fonts at build/runtime and exposes CSS custom properties via the returned font objects' `.variable` property. The layout composes these variables into the body class so child components can use the fonts via the declared CSS variables.
- The module sets `export const dynamic = "force-dynamic";`, explicitly instructing Next.js to treat this layout route as dynamically rendered (which affects caching and ISR behavior).
- Global styles are applied through a side-effect CSS import. The internal Providers component is composed at the top level to supply contexts or other cross-cutting concerns to all pages; the layout does not itself implement client-side state or handlers.

## Usage Examples

### Rendering pages under the root route

When Next.js renders any page within this layout's route tree, it will import this layout and call the default RootLayout with the page's React nodes as the `children` prop. RootLayout will render `<html lang="vi">` and a `<body>` whose className concatenates the two font CSS variable names (jakarta.variable and display.variable) and `antialiased`. The Providers component wraps `children`, so application-level contexts provided there (authentication/context providers/theme providers, etc.) are available to the rendered page. The exported `metadata` object provides typed metadata for the route, and `dynamic = "force-dynamic"` configures Next.js rendering behavior for this route.

## Maintenance Notes

- Because fonts are loaded via next/font/google, changes to font options (like subsets or variable name) should be updated both where the font is created and where the CSS variable is referenced in styles. Ensure CSS and components reference the same CSS variable names.
- The `dynamic = "force-dynamic"` flag affects caching and rendering. If pages are expected to be fully static, consider removing or changing this flag. Review Next.js docs when altering dynamic/static behavior.
- Providers is an internal dependency; changes to its API (props or side effects) can impact all pages. Keep Providers' public contract stable or update the layout accordingly.
- When adding client-only behavior to the layout, remember to add `"use client"` at the top and verify Providers can run in a client component if required.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/app/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*
