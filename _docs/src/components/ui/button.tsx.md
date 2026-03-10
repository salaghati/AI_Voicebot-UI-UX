<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/components/ui/button.tsx",
  "source_hash": "c36513220d5647997cadb4936e8d3d97c999cce84f5a357cd2e094c0530f2d57",
  "last_updated": "2026-03-10T04:11:53.609271+00:00",
  "git_sha": "3a92a808ced6f85f6f0416e37cc90516c5f07da0",
  "tokens_used": 5739,
  "complexity_score": 2,
  "estimated_review_time_minutes": 10,
  "external_dependencies": [
    "class-variance-authority",
    "react"
  ]
}
```

</details>

[Documentation Home](../../../README.md) > [src](../../README.md) > [components](../README.md) > [ui](./README.md) > **button.mdx**

---

# button.tsx

> **File:** `src/components/ui/button.tsx`

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

This file provides a single, stateless React button component (Button) and a corresponding ButtonProps interface. Styling is driven by a buttonVariants constant created with class-variance-authority (cva), which encodes variant and size variant classes and defaultVariants. The Button component composes those computed classes with an optional className via a local cn helper and forwards all other HTML button attributes via props spreading.

The styling uses Tailwind-like utility classes and CSS variables (e.g., var(--accent), var(--text-main)) for colors, plus accessibility-focused classes (focus-visible:ring-*, focus-visible:outline-none) and disabled handling (disabled:pointer-events-none, disabled:opacity-50). Variant options implemented are primary, secondary, ghost, and danger; size options are sm, md, lg with defaults variant: "primary" and size: "md". The file does not perform network I/O or interact with external systems — it purely provides a presentational UI primitive that other components can import and render.

## Dependencies

### External Dependencies

| Module | Usage |
| --- | --- |
| `class-variance-authority` | Imports cva (used to declare buttonVariants with variant and size options) and the VariantProps type (used in the ButtonProps interface: extends VariantProps<typeof buttonVariants>). |
| `react` | Imports ButtonHTMLAttributes from React to extend HTML button props in the exported ButtonProps interface: export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}. |

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/lib/utils](../@/lib/utils.md) | Imports cn (class-name helper) to merge the computed buttonVariants(...) result with any incoming className prop when rendering the <button> element. |

## 📁 Directory

This file is part of the **ui** directory. View the [directory index](_docs/src/components/ui/README.md) to see all files in this module.

## Architecture Notes

- Component pattern: functional, stateless React component that forwards all standard button attributes using props spreading and exposes variant/size options through typed props.
- Styling pattern: uses class-variance-authority (cva) to centralize conditional Tailwind-style classes for 'variant' and 'size'; defaultVariants ensure consistent defaults (variant: 'primary', size: 'md').
- Accessibility: includes focus-visible ring and outline utilities and handles disabled state with pointer-events and opacity classes; behavior relies on native button semantics (type, onClick, etc.) passed via props.
- Error handling: none in-file; invalid variant/size values are type-checked by TypeScript via VariantProps but runtime validation is handled implicitly by cva (unknown values would simply not match variant keys).

## Usage Examples

### Basic usage in a UI component

Import Button and render it with a variant and an onClick handler. The caller may pass className to append custom classes. Example flow: JSX renders <Button variant='secondary' onClick={handleClick}>Save</Button>. The Button component calls buttonVariants({ variant, size }) to compute classes, cn merges them with className, and the resulting className is applied to the rendered <button>. Native button attributes (disabled, type) and event handlers are forwarded via {...props}.

### Custom sizing and additional classes

Render <Button size='lg' className='w-full' type='submit'>Submit</Button>. The size prop selects the height/padding from cva (lg -> 'h-10 px-5'), cn merges 'w-full' with the computed classes, and props spreading ensures type='submit' is applied to the element so it works within forms.

## Maintenance Notes

- If Tailwind utilities or project CSS variables change, update the class strings inside buttonVariants. These strings are the single source of truth for button styling.
- Ensure the project's cn helper at '@/lib/utils' remains available and compatible; breaking changes to its API would require updating the Button implementation.
- Keep class-variance-authority and React types in sync with project dependencies; the ButtonProps interface depends on VariantProps<typeof buttonVariants> for correct typing.
- Add visual regression or snapshot tests when changing variant or size classes to catch unintended style regressions. Test disabled and focus-visible states for accessibility.
- Consider adding explicit runtime validation or stricter TypeScript literal unions for variant/size if consumers incorrectly pass arbitrary strings.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/components/ui/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*
