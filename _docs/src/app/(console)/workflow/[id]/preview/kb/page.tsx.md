<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/app/(console)/workflow/[id]/preview/kb/page.tsx",
  "source_hash": "83f152ba546d38e318629134c2d04dcf161b348122d80d16e053553e85d5b7bf",
  "last_updated": "2026-03-10T04:04:11.320620+00:00",
  "git_sha": "2bdfc72c09670ff736a385fbc46e9d97582dbbf8",
  "tokens_used": 5378,
  "complexity_score": 2,
  "estimated_review_time_minutes": 5,
  "external_dependencies": []
}
```

</details>

[Documentation Home](../../../../../../../README.md) > [src](../../../../../../README.md) > [app](../../../../../README.md) > [(console)](../../../../README.md) > [workflow](../../../README.md) > [[id]](../../README.md) > [preview](../README.md) > [kb](./README.md) > **page.mdx**

---

# page.tsx

> **File:** `src/app/(console)/workflow/[id]/preview/kb/page.tsx`

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

This file exports a single default async function component named WorkflowPreviewKbPage which receives route params as a Promise resolving to an object with an id string: ({ params }: { params: Promise<{ id: string }>; }). The function awaits params to extract the id and returns a JSX element: <WorkflowPreviewView workflowId={id} tab="kb" />. The file imports WorkflowPreviewView from the project's internal module "@/features/workflow" and delegates all rendering and behavior to that component.

Placed at app/(console)/workflow/[id]/preview/kb, this is a leaf page in a Next.js App Router layout that specifically renders the "kb" tab of a workflow preview. It is implemented as an async server component (default exported async function) to await the incoming params promise before rendering. The file intentionally contains minimal logic: it performs no validation, error handling, or side-effectful operations itself and relies entirely on WorkflowPreviewView to fetch and display workflow data. There are no external API calls, database interactions, or runtime configuration in this module; it is strictly a routing-to-view bridge that hands the workflow id and a static tab prop to the imported component.

## Dependencies

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/features/workflow](../@/features/workflow.md) | Imports the WorkflowPreviewView React component (named import) and uses it directly in the default exported async function to render the workflow preview for the given workflowId with the tab prop set to "kb". |

## 📁 Directory

This file is part of the **kb** directory. View the [directory index](_docs/src/app/(console)/workflow/[id]/preview/kb/README.md) to see all files in this module.

## Architecture Notes

- Implemented as an async Next.js App Router server component (default exported async function) so it can await the params promise provided by Next.js routing.
- Delegation pattern: this module only extracts the workflow id from params and delegates UI and data handling to WorkflowPreviewView, keeping the page component very small and focused.
- No error handling or input validation is present; the function assumes params resolves to an object containing id.
- No external systems (APIs, databases, filesystem) are directly touched by this file; any such interactions should occur inside WorkflowPreviewView or its descendants.

## Usage Examples

### Render the knowledge-base tab of a workflow preview via Next.js routing

When a request hits the route corresponding to app/(console)/workflow/[id]/preview/kb, Next.js provides params as a Promise<{ id: string }>. The exported async function WorkflowPreviewKbPage awaits params, destructures id, and returns <WorkflowPreviewView workflowId={id} tab="kb" />. The resulting page displays the workflow preview UI scoped to the "kb" tab. There are no side effects in this module itself; any loading, data fetching, or error presentation is handled by WorkflowPreviewView.

## Maintenance Notes

- Validate params: consider adding explicit validation or a guard for missing/invalid id to avoid runtime errors when params does not contain id.
- Add error boundaries or try/catch if WorkflowPreviewView can throw synchronously during render or if awaiting params may reject.
- If server/client rendering behavior changes, confirm whether WorkflowPreviewView should be a client component; adjust this page to match (e.g., add 'use client' or change data fetching strategy).
- Keep the internal import path (@/features/workflow) in sync with project path aliases; refactor tools that rename or move the WorkflowPreviewView component will require updating this import.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/app/(console)/workflow/[id]/preview/kb/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*
