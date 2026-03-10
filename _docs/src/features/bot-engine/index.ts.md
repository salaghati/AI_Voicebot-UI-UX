<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/features/bot-engine/index.ts",
  "source_hash": "21d193464b2063b2aeeae3b40ebe54e4518ac4f46508de3c40687d88f7349baa",
  "last_updated": "2026-03-10T04:13:13.659628+00:00",
  "git_sha": "5d5cb279e8cc03e5f23192056423e03983005d52",
  "tokens_used": 5917,
  "complexity_score": 1,
  "estimated_review_time_minutes": 5,
  "external_dependencies": []
}
```

</details>

[Documentation Home](../../../README.md) > [src](../../README.md) > [features](../README.md) > [bot-engine](./README.md) > **index**

---

# index.ts

> **File:** `src/features/bot-engine/index.ts`

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

This file's primary responsibility is to re-export selected symbols from two other modules: the EntityListPage UI component from "@/components/modules/entity-list-page" and several mock values plus helper getters and type definitions from a local "./mock" module. It does not define any functions, classes, constants, or runtime logic itself; it only exposes named exports so callers can import from a single feature entry point rather than referencing the underlying modules directly.

As a feature-level index (barrel) file it simplifies imports across the codebase and separates value exports from type-only exports by using TypeScript's "export type" for the type names. This file directly re-exports the following runtime/value bindings: outboundCampaignsMock, inboundRoutesMock, workflowRefs, knowledgeRefs, getWorkflowRef, getKnowledgeRef, and EntityListPage. It also re-exports the following type names (type-only): OutboundCampaignPreview, InboundRoutePreview, OutboundStatus, InboundStatus, WorkflowRef, KnowledgeRef. NO FUNCTIONS OR CLASSES FOUND: there are no definitions in this file — only export-from statements.

## Dependencies

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/components/modules/entity-list-page](../@/components/modules/entity-list-page.md) | Re-exports the named symbol EntityListPage via the statement: export { EntityListPage } from "@/components/modules/entity-list-page". This makes the component available to callers of this barrel module without importing the component path directly. |
| [./mock](.././mock.md) | Re-exports a set of runtime bindings and type definitions from the local mock module. Runtime/value exports re-exported are: outboundCampaignsMock, inboundRoutesMock, workflowRefs, knowledgeRefs, getWorkflowRef, getKnowledgeRef (via: export { ... } from "./mock"). Type-only exports re-exported are: OutboundCampaignPreview, InboundRoutePreview, OutboundStatus, InboundStatus, WorkflowRef, KnowledgeRef (via: export type { ... } from "./mock"). |

## 📁 Directory

This file is part of the **bot-engine** directory. View the [directory index](_docs/src/features/bot-engine/README.md) to see all files in this module.

## Architecture Notes

- Pattern: Barrel / re-export file. This module groups and re-exports symbols from other modules to provide a single import entry for the bot-engine feature.
- Type vs value separation: Uses TypeScript's `export type` to re-export only type information for the specified names, ensuring those exports are erased at runtime and avoid adding to the generated bundle.
- No runtime logic: The file has no functions or classes and therefore introduces no side effects; it only forwards symbols from the source modules.
- Circular import caution: Because this module re-exports items, if the target modules import from this barrel it could create circular dependencies. Keep the barrel as a leaf exporter rather than a two-way import target.

## Usage Examples

### Importing the UI component in a React feature

Instead of importing the component directly from '@/components/modules/entity-list-page', other parts of the app can import it from the feature entry: import { EntityListPage } from 'src/features/bot-engine'; Then render <EntityListPage .../>. This centralizes import paths and makes future refactors of the component location easier.

### Using mock data and types in tests

Test files can import mock datasets and helpers and associated types from the same entry: import { outboundCampaignsMock, getWorkflowRef } from 'src/features/bot-engine'; import type { OutboundCampaignPreview } from 'src/features/bot-engine'; Use the mock values as fixtures and the types for static typing in test helpers. Because type names are exported with `export type`, they produce no runtime import overhead.

## Maintenance Notes

- Keep the re-export list in sync with the source modules: if symbols are renamed or removed in '@/components/modules/entity-list-page' or './mock', update this barrel to avoid unresolved export errors.
- Prefer type-only exports (`export type`) for interfaces/types to ensure they're erased from compiled JS and don't create runtime dependencies.
- Watch for accidental circular imports: avoid having the mocked modules import from this barrel file.
- If the number of re-exports grows, consider grouping or splitting barrels (e.g., `index.ts` vs `types.ts`) to keep responsibilities clear.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/features/bot-engine/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*
