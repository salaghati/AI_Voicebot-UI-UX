<details><summary>Directory Metadata (for smart change detection)</summary>

```json
{
  "doc_type": "directory_index",
  "directory_path": "_docs/src/app/(console)",
  "directory_hash": "623ffb723f4750ab43a4640a4afd88cfbb04eedba4e05a7c80965bbe8f51486c",
  "file_count": 1,
  "file_hashes": {
    "layout.tsx": "68ac5938f8f513f5"
  }
}
```

</details>

[Documentation Home](../../../README.md) > [src](../../README.md) > [app](../README.md) > [(console)](./README.md) > **(console)**

---

# 📁 (console)

> **Purpose:** Houses the console area page layout and organizes route-level documentation pages and feature sections for the console portion of the docs site.
> 

![Organization: Feature Based](https://img.shields.io/badge/Organization-Feature_Based-blue)

## 📑 Table of Contents


- [Overview](#overview)
- [Subdirectories](#subdirectories)
- [All Files](#all-files)
- [Dependencies](#dependencies)
- [Architecture Notes](#architecture-notes)

---

## Overview

This directory provides the top-level layout and organizational structure for the console portion of the documentation application. At the root it contains a single layout implementation (layout.tsx) which is intended to define the surrounding layout, shared UI scaffolding, or route wrapper used by console routes. That root-level layout file is the primary entry point at this directory level and establishes how console pages are composed within the docs site.

Beneath the root layout are several feature-oriented subdirectories (bot-engine, dashboard, kb, settings, workflow, preview, report). Each subdirectory contains the route-level page implementations and, where applicable, additional nested route segments or organizational subfolders for focused areas (for example: bot-engine includes landing pages and multi-step flows; settings contains multiple settings-area subroutes). Together, the root layout and these subdirectories define the console section: the layout provides the common frame and each subdirectory implements specific console routes or features, making this directory the central entry and organization point for console-related documentation routes.


### File Organization

A single root-level layout file provides the shared wrapper for console routes. Feature-focused subdirectories contain route-level page components and any nested flows for each console area (bot-engine, dashboard, kb, settings, workflow, preview, report). This groups files by route/feature area rather than mixing different concerns at the root.

## 📂 Subdirectories

This directory contains the following subdirectories:

### [📁 bot-engine](./bot-engine/README.md)

**Purpose:** Contains the route-level page and organizational subdirectories for the bot-engine area of the console documentation site, including landing pages and multi-step flows for campaigns, inbound, and outbound sections.

![Files: 1](https://img.shields.io/badge/Files-1-blue)

---

### [📁 dashboard](./dashboard/README.md)

**Purpose:** Holds the files that implement the dashboard route/feature located at docs/src/app/(console)/dashboard, with the primary entry file at the directory root.

![Files: 1](https://img.shields.io/badge/Files-1-blue)

---

### [📁 kb](./kb/README.md)

**Purpose:** Holds the route-level page components and organized subroutes for the console knowledge-base section of the docs application, providing entry points for list, add, usage, version, and fallback KB views.

![Files: 1](https://img.shields.io/badge/Files-1-blue)

---

### [📁 settings](./settings/README.md)

**Purpose:** Houses the console settings route entry and organized subroutes for various settings areas (agent, api, extensions, fallback, phone-numbers, roles, stt-tts, users).

![Files: 1](https://img.shields.io/badge/Files-1-blue)

---

### [📁 workflow](./workflow/README.md)

**Purpose:** Contains route-level page components and route-specific subviews for managing and interacting with workflows in the console area of the application.

![Files: 1](https://img.shields.io/badge/Files-1-blue)

---

### [📁 preview](./preview/README.md)

**Purpose:** Contains console preview route implementations and organized preview areas (platform-review and playground) used to render preview pages for the console preview flow.

![Files: 0](https://img.shields.io/badge/Files-0-blue)

---

### [📁 report](./report/README.md)

**Purpose:** Houses route implementations and page components for the console report area, organizing per-report pages and related route segments.

![Files: 0](https://img.shields.io/badge/Files-0-blue)

---
## 📂 All Files

| File | Type |
| --- | --- |
| [layout.tsx](./layout.tsx.md) | ⚛️ React |

## Dependencies

### Internal Dependencies

| Dependency | Usage |
| --- | --- |
| `route-level page components` | Subdirectories rely on route-level page.tsx files to implement feature entry points that are wrapped by the root layout.tsx. |

## Architecture Notes

- Console routes are organized feature-wise: a single shared layout at the directory root provides common scaffolding, while individual subdirectories implement route-level pages and nested flows for each console area.

---

## Navigation

**↑ Parent Directory:** [Go up](../README.md)
**🔗 Related:** [bot-engine](./bot-engine/README.md) • [dashboard](./dashboard/README.md) • [kb](./kb/README.md) • [settings](./settings/README.md) • [workflow](./workflow/README.md)

---

*Generated by Woden Docbot*