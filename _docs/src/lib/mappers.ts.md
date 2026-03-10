<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/lib/mappers.ts",
  "source_hash": "5c660e29b7572b81d5844c171ade30ec9ee49b42bab5066c60202f4ce6937ab2",
  "last_updated": "2026-03-10T04:21:32.585308+00:00",
  "git_sha": "68b274f3bd0d6636cfe869ca50274d12876f0ee9",
  "tokens_used": 5417,
  "complexity_score": 2,
  "estimated_review_time_minutes": 10,
  "external_dependencies": []
}
```

</details>

[Documentation Home](../../README.md) > [src](../README.md) > [lib](./README.md) > **mappers**

---

# mappers.ts

> **File:** `src/lib/mappers.ts`

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

This file provides small, pure mapping utilities that translate domain-level campaign data and status values into UI-ready forms. It exports three functions: mapCampaignStatusTone which maps a typed CampaignStatus value to a UI tone literal, mapCampaignToSummary which transforms a Campaign domain object into a lightweight summary object (id, title, subtitle, metric), and mapStatusTone which maps an optional free-form status string (multiple possible language variants) into a tone literal. The functions return string literals like "success", "warning", "info", "danger", or "muted" and use explicit "as const" assertions so they are literal types at compile time.

These mappers are deliberately small and side-effect free: they only read input arguments and return derived values. They do not perform I/O, network, or database operations. Typical consumers are UI components (cards, badges, lists) that need a short summary object or a tone (visual emphasis) for different campaign statuses. The file depends only on type imports from the project's domain types (Campaign and CampaignStatus) to ensure correct typing when mapping campaign objects and strongly typed statuses.

Important implementation details: mapCampaignToSummary builds a subtitle by concatenating campaign.workflow and campaign.source with a dot separator " • " and formats metric as `${campaign.totalCalls} cuộc gọi` (Vietnamese text). mapStatusTone accepts an optional string and checks multiple known status strings (both Vietnamese and English variants) to determine the tone; unknown or missing statuses fall back to "muted" (when undefined) or "info" (when no match). mapCampaignStatusTone expects the typed CampaignStatus and provides a narrower switch based on exact Vietnamese status strings with a default of "muted".

## Dependencies

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/types/domain](../@/types/domain.md) | Imports the type definitions 'Campaign' and 'CampaignStatus' (import type { Campaign, CampaignStatus } from "@/types/domain"). These are used only for TypeScript type annotations on the exported functions: mapCampaignStatusTone(status: CampaignStatus) and mapCampaignToSummary(campaign: Campaign). No runtime values or side-effectful imports are used. |

## 📁 Directory

This file is part of the **lib** directory. View the [directory index](_docs/src/lib/README.md) to see all files in this module.

## Architecture Notes

- Pure function style: all exported functions are deterministic, have no side effects, and return simple scalar or object literals.
- Type-safety: the file uses 'import type' to bring in Campaign and CampaignStatus types and uses 'as const' on returned strings to maintain literal types.
- No external systems: there are no network, filesystem, or database interactions in this module.
- Error handling: there is no explicit error handling; functions assume the provided objects/values have the expected shape (mapCampaignToSummary accesses campaign.id, .name, .workflow, .source, .totalCalls). mapStatusTone guards against undefined by returning 'muted' when status is falsy.

## Usage Examples

### Rendering a campaign card in the UI

Given a Campaign object from the domain layer, call mapCampaignToSummary(campaign) to obtain { id, title, subtitle, metric } for a summary card. Use mapCampaignStatusTone(campaign.status) to derive a tone (e.g., 'success', 'warning') for the card badge when the code has a typed CampaignStatus. If the status may be an arbitrary string (from external sources), use mapStatusTone(statusString) which checks multiple language variants and returns a safe tone value. Expected outcome: the card displays campaign.name as title, 'workflow • source' as subtitle, and 'N cuộc gọi' as metric while showing a badge colored according to the returned tone.

## Maintenance Notes

- Localization: The metric string uses Vietnamese 'cuộc gọi' and mapCampaignStatusTone matches Vietnamese status strings; if the app must support other locales, update formatting and status lists accordingly.
- Status list maintenance: mapStatusTone contains hardcoded arrays of known status strings (Vietnamese and English). Add or remove items here when backend status values change to avoid incorrect tone mapping.
- Type assumptions: mapCampaignToSummary reads specific campaign properties (id, name, workflow, source, totalCalls). Ensure incoming Campaign objects always include those keys or add defensive checks/tests.
- Testing: cover all branches in unit tests—each mapped status string (including unknown values and undefined) and the mapCampaignToSummary output shape.
- Performance: negligible; these are simple synchronous transformations. No immediate performance concerns.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/lib/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*
