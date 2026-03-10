<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/lib/navigation.ts",
  "source_hash": "47a9fca251df2e667e6b53bf623ae5166dc60a5739596a6f88cd6c857e344eab",
  "last_updated": "2026-03-10T04:22:41.799964+00:00",
  "git_sha": "afb40269d602c07e1ea2d787e1569594070dbf10",
  "tokens_used": 6211,
  "complexity_score": 2,
  "estimated_review_time_minutes": 10,
  "external_dependencies": [
    "react",
    "lucide-react"
  ]
}
```

</details>

[Documentation Home](../../README.md) > [src](../README.md) > [lib](./README.md) > **navigation**

---

# navigation.ts

> **File:** `src/lib/navigation.ts`

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

This module declares two TypeScript interfaces, NavSubItem and NavItem, and exports a single constant primaryNav typed as NavItem[]. NavSubItem is a minimal shape with title:string and href:string. NavItem contains title:string, href:string, icon: ComponentType<{ className?: string }>, and an optional children?: NavSubItem[] array. The icon type is imported from React's ComponentType to ensure each icon value is a valid React component that accepts an optional className prop.

The primaryNav array is a static, data-driven navigation configuration: each entry maps a human-readable title to an internal route (href) and supplies a lucide-react icon component as the icon field. Several entries include children arrays representing nested/submenu items. All icons used (LayoutDashboard, Bot, FileCode2, BarChart3, PlayCircle, ShieldQuestion, Settings) are imported from lucide-react and assigned directly as the icon value. There are no functions or classes in this file — it only contains type declarations, imports, and a single exported constant — so its responsibility is purely declarative configuration for UI/navigation rendering. Note: some titles are in Vietnamese and some hrefs are duplicated between a parent item and its first child (e.g., parent href equals one of its children's hrefs), which is a pattern callers should be aware of when implementing active-route logic.

## Dependencies

### External Dependencies

| Module | Usage |
| --- | --- |
| `react` | Imports a TypeScript type: 'ComponentType' is used in the NavItem interface to type the icon property as a React component that accepts an optional { className?: string } prop. Exact import line: 'import type { ComponentType } from "react";'. |
| `lucide-react` | Imports icon components used as concrete values in the primaryNav array. Exact imported identifiers: BarChart3, Bot, FileCode2, LayoutDashboard, PlayCircle, Settings, ShieldQuestion. These identifiers are assigned to the 'icon' field of NavItem objects so UI renderers can render them as React components. |

## 📁 Directory

This file is part of the **lib** directory. View the [directory index](_docs/src/lib/README.md) to see all files in this module.

## Architecture Notes

- Data-driven navigation: the file separates navigation data (primaryNav) from presentation logic so UI components can map over the array to render menus, icons, and nested submenus.
- Type-safety: NavItem.icon is typed as ComponentType<{ className?: string }>, enforcing that icons are React components and enabling consumers to pass a className when rendering (e.g., <Icon className="h-5 w-5" />).
- No runtime logic: the module contains only imports, type/interface declarations, and a constant export. There are no functions, side effects, network calls, or state management responsibilities in this file.
- Pattern considerations: parent items sometimes duplicate a child href (top-level href equals one of its children's hrefs). UI consumers should define clear rules for active state and routing when parent and child hrefs overlap.

## Usage Examples

### Rendering a sidebar navigation component in a React app

A Sidebar component imports primaryNav and maps over it to produce navigation links. For each NavItem: render a Link using item.href, render the item.title as the link label, and render the icon by creating a React element from item.icon and passing a className (e.g., const Icon = item.icon; <Icon className="h-5 w-5" />). If item.children exists, render a nested list for each NavSubItem using its title and href. Ensure the active-route logic accounts for cases where parent.href equals a child's href to avoid duplicate active states.

## Maintenance Notes

- Localization: several titles are in Vietnamese. If the app needs i18n, replace hard-coded title strings with keys and resolve them via a translation function at render time.
- Consistency of hrefs: many parent items repeat a child's href. If route structure changes, update both parent and child entries to prevent broken links or inconsistent active-route behavior.
- Type-safety when adding icons: any new icon must be a React component compatible with ComponentType<{ className?: string }> (e.g., lucide-react icons or other components that accept className).
- Consider adding unique ids or permission metadata to NavItem if the navigation should be filtered based on user roles or feature flags in the future.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/lib/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*
