<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/app/(console)/preview/platform-review/page.tsx",
  "source_hash": "fe5d0704c4d00d1b9cee7f658db291e71ea1e30a791fbd5cd53559ccbb5e9a48",
  "last_updated": "2026-03-10T03:59:02.291941+00:00",
  "git_sha": "66024b89322c06227c9bb47248c7487661986a42",
  "tokens_used": 6972,
  "complexity_score": 2,
  "estimated_review_time_minutes": 10,
  "external_dependencies": [
    "next/link",
    "lucide-react"
  ]
}
```

</details>

[Documentation Home](../../../../../README.md) > [src](../../../../README.md) > [app](../../../README.md) > [(console)](../../README.md) > [preview](../README.md) > [platform-review](./README.md) > **page.mdx**

---

# page.tsx

> **File:** `src/app/(console)/preview/platform-review/page.tsx`

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

This file exports a single default React functional component named PlatformReviewHomePage (export default function PlatformReviewHomePage()) that renders a static UI page used as a preview/landing page for Platform UX Review flows. The component is a client component ("use client" directive at the top) and composes several UI primitives: PageHeader for the page title/description, Card for grouped content blocks, Button for CTAs, Link from Next.js for client-side navigation, and three icons (Bot, GitBranch, Database) from lucide-react for visual affordances. The JSX structure produces: a header, a two-column grid of preview cards (Outbound Campaigns and Inbound Routes) each with an icon, short description, and a Link-wrapped Button to navigate to the corresponding preview routes (/preview/platform-review/outbound and /preview/platform-review/inbound), followed by a Card describing reference-only data relationships in a three-column grid.

The file contains no data-fetching, state, props, or side effects: it is purely presentational. Styling and responsive layout rely on Tailwind-style className values (grid, gap, responsive lg:grid-cols-2, md:grid-cols-3, text classes, border/surface utility classes) applied directly in JSX. Integration points are limited to client-side routing (Next.js Link) and the project's shared UI components (PageHeader, Card, Button) and icon library; there are no API calls, database interactions, or server-side rendering logic inside this file. The design decision to include "use client" forces this component to render on the client, which is appropriate because it uses interactive Link/Button components and client-side navigation, even though it currently has no internal state or hooks.

## Dependencies

### External Dependencies

| Module | Usage |
| --- | --- |
| `next/link` | Uses the default export Link to create client-side navigation anchors. Specifically used twice to wrap Button elements that navigate to /preview/platform-review/outbound and /preview/platform-review/inbound. |
| `lucide-react` | Imports three named icon components: GitBranch, Database, and Bot. These are rendered inline in the UI to visually label cards and list items (Bot for Campaign/Route and Inbound/Outbound entries, GitBranch for Workflow module, Database for Knowledge Base module). |

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/components/shared/page-header](../@/components/shared/page-header.md) | Imports the named PageHeader component and renders it at the top of the page with title="Platform UX Review" and a Vietnamese description string. PageHeader provides the main title and subtitle/description block for the page. |
| [@/components/ui/card](../@/components/ui/card.md) | Imports the named Card component and uses it repeatedly as a container for grouped content blocks: the outbound/inbound preview cards and the data-relationship panel. Cards are supplied className props for spacing and layout. |
| [@/components/ui/button](../@/components/ui/button.md) | Imports the named Button component and uses it as the clickable CTA inside Link wrappers (text: "Xem preview Outbound" and "Xem preview Inbound"). Buttons are child elements of Link to provide a styled interactive element that triggers client-side navigation. |

## 📁 Directory

This file is part of the **platform-review** directory. View the [directory index](_docs/src/app/(console)/preview/platform-review/README.md) to see all files in this module.

## Architecture Notes

- This file implements a presentational React functional component pattern: stateless, no props, pure JSX composition of UI primitives.
- It is marked as a client component via the "use client" directive; therefore it always runs on the client and can use client-only features (events, hooks) if later added. There are currently no hooks or local state.
- Layout uses utility className values (Tailwind-like) for responsive grids and spacing: a two-column grid for preview cards and a three-column grid inside the data relationships Card.
- No error handling, data fetching, or side effects are present. All content is hard-coded strings (Vietnamese) and icons; this simplifies rendering but means translations or dynamic content require future refactoring.
- Integration surface is minimal: Next.js Link for routing and local shared UI components; there are no external API calls or persistence interactions.

## Usage Examples

### Render the Platform UX Review landing page within a Next.js route

Place this file at src/app/(console)/preview/platform-review/page.tsx and ensure the Next.js routing structure includes the /preview/platform-review route. When a user navigates to that route, Next.js will render the PlatformReviewHomePage component on the client due to the "use client" directive. The PageHeader displays the title and description, the two Card elements render preview entries for Outbound and Inbound, and clicking the CTA Buttons (wrapped in Link) performs client-side navigation to /preview/platform-review/outbound or /preview/platform-review/inbound. There is no data fetching or props — the page is static and purely navigational.

## Maintenance Notes

- Because all text is hard-coded (Vietnamese), extract strings to a localization system if multi-language support is required.
- The file is a client component but currently stateless; remove the "use client" directive if it must be server-rendered in the future, or conversely, keep it if you add client-side interactions (hooks, event handlers).
- Ensure the project provides the imported local components (PageHeader, Card, Button) and that their props/behavior match expectations; refactoring those components could change layout or required props.
- Icons come from lucide-react; confirm the dependency is present in package.json and the tree-shaking/build configuration keeps bundle size reasonable. If more icons are added, consider a consistent icon strategy.
- Add tests for presence of navigation links and basic accessibility checks (e.g., ensure buttons are focusable and Link wrappers are used correctly).

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/app/(console)/preview/platform-review/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*
