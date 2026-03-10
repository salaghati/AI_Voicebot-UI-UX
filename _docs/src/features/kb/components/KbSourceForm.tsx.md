<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/features/kb/components/KbSourceForm.tsx",
  "source_hash": "d3a69dfc959aadeb4daeffa93b2196fc438a70489210d1f0ad2094aab7db3f86",
  "last_updated": "2026-03-10T04:17:18.041713+00:00",
  "tokens_used": 12000,
  "complexity_score": 3,
  "estimated_review_time_minutes": 15,
  "external_dependencies": [
    "react"
  ]
}
```

</details>

[Documentation Home](../../../../README.md) > [src](../../../README.md) > [features](../../README.md) > [kb](../README.md) > [components](./README.md) > **KbSourceForm.mdx**

---

# KbSourceForm.tsx

> **File:** `src/features/kb/components/KbSourceForm.tsx`

![Complexity: Low](https://img.shields.io/badge/Complexity-Low-green) ![Review Time: 15min](https://img.shields.io/badge/Review_Time-15min-blue)

## 📑 Table of Contents


- [Overview](#overview)
- [Dependencies](#dependencies)
- [Architecture Notes](#architecture-notes)
- [Usage Examples](#usage-examples)
- [Maintenance Notes](#maintenance-notes)
- [Functions and Classes](#functions-and-classes)

---

## Overview

This file defines a TypeScript React functional component KbSourceForm that renders and controls a form for creating or editing knowledge-base sources of three types: 'url', 'article', and 'file'. It centralizes defaulting logic in buildState(sourceType, initialDoc) and UI text in getMeta(sourceType, mode). The component keeps local form state with useState, synchronizes incoming initialDoc and sourceType via useEffect, and memoizes derived metadata with useMemo.

Inputs are controlled and updated through a generic, type-safe update helper. Rendering branches by sourceType to show only relevant fields (URL, crawl options and patterns for 'url'; title/content/tags for 'article'; simulated file upload, file metadata and chunkingMode for 'file'). On submit it composes a payload shaped per sourceType and calls the provided onSubmit callback; the component does not perform network I/O itself. Layout supports both inline and modal modes. The implementation relies on internal UI components and domain types and uses React hooks from the external react package. Validation is minimal and several labels are in Vietnamese.

## Dependencies

### External Dependencies

| Module | Usage |
| --- | --- |
| `react` | Imports React hooks used by the component: useEffect, useMemo, useState. These hooks manage lifecycle syncing of initialDoc to local state (useEffect), memoization of derived UI metadata (useMemo), and local form state (useState). |

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/types/domain](../@/types/domain.md) | Imports TypeScript types KbDocument and KbSourceType used in props and to drive branching for form fields and payload construction. |
| [@/components/ui/button](../@/components/ui/button.md) | Imports the Button React component used for Cancel and Submit actions at the bottom of the form. |
| [@/components/ui/card](../@/components/ui/card.md) | Imports the Card React component used as the main visual container for the form content. |
| [@/components/ui/input](../@/components/ui/input.md) | Imports the Input React component used for single-line text and numeric inputs. |
| [@/components/ui/select](../@/components/ui/select.md) | Imports the Select React component used for the file chunking mode selection. |
| [@/components/ui/textarea](../@/components/ui/textarea.md) | Imports the Textarea React component used for the articleContent field (multi-line input). |

## 📁 Directory

This file is part of the **components** directory. View the [directory index](_docs/src/features/kb/components/README.md) to see all files in this module.

## Architecture Notes

- Pattern: React functional component with local state management using useState. Input fields are controlled components; state updates are performed via a generic update helper typed against FormState (update<K extends keyof FormState>(key: K, value: FormState[K])).
- Initialization: buildState(sourceType, initialDoc) centralizes defaulting logic for all form fields. useEffect watches initialDoc and sourceType to re-run buildState when parent-provided data changes.
- Conditional rendering: The component branches rendering based on sourceType ('url', 'article', 'file'), producing only the inputs relevant to the selected source type. Layout is also conditional: 'inline' returns the Card directly, 'modal' wraps it in a fixed overlay container.
- Submit behavior: submit() builds a payload object shaped differently per sourceType. Notably pageLimit is converted to Number(values.pageLimit || 100). The component does not call any network APIs itself – it delegates persistence/side-effects to the parent through onSubmit(payload: Record<string, unknown>).
- Error handling & validation: The component contains minimal validation (e.g., input types and numeric min for pageLimit) and no explicit error messages; required fields are indicated in labels (e.g., 'Tiêu đề *') but not enforced programmatically in this component.

## Usage Examples

### Create a new URL KB source

Parent renders <KbSourceForm sourceType='url' mode='create' onCancel={...} onSubmit={handleSubmit} />. The component initializes state using buildState('url', undefined). The user fills URL, optional displayName, chooses crawlMode and pageLimit, then clicks Submit. submit() constructs payload: { sourceType: 'url', title: displayName || url || 'URL KB mới', displayName, url, crawlMode, pageLimit: Number(pageLimit), patterns } and calls onSubmit(payload). The parent receives this payload and performs persistence (e.g., API POST).

### Edit an existing article source

Parent passes initialDoc (KbDocument) and sourceType='article' into <KbSourceForm>. useEffect will set form fields from initialDoc via buildState. The user edits articleTitle and articleContent; clicking Submit triggers submit() which builds payload: { sourceType: 'article', title: articleTitle || 'Bài viết mới', articleTitle, articleContent, articleTags } and forwards it through onSubmit. The parent should interpret this payload for update operations.

### Upload a file (UI placeholder flow)

For sourceType='file', the form shows an upload button that in this implementation only simulates selecting a file by setting fileName to 'customer-handbook.pdf' when clicked (if fileName is empty). The user selects chunkingMode and provides a displayName; submit() builds payload: { sourceType: 'file', title: displayName || fileName || 'File KB mới', displayName, fileName, fileTypes, chunkingMode }. The parent is expected to replace the simulated upload with a real file-upload flow (e.g., file picker + upload to storage) before persisting metadata.

## Maintenance Notes

- Validation: There is currently no programmatic enforcement for required fields. Add field-level validation (e.g., articleTitle and articleContent required for article source, URL format validation, pageLimit range checks) before calling onSubmit to prevent invalid payloads being sent to the backend.
- File upload: The current file upload UI only simulates setting a filename; integrate a real file picker/upload mechanism and update fileTypes and fileName based on the uploaded file's metadata. Consider streaming large files or client-side size checks (max 25MB mentioned in UI).
- i18n and hardcoded strings: Labels and placeholders contain Vietnamese and English strings. Extract strings into an i18n/localization resource if multi-language support is needed.
- Type safety: onSubmit accepts Record<string, unknown>. For stronger typing, define explicit payload types for each sourceType and change onSubmit signature accordingly to reduce runtime errors.
- Accessibility: Inputs and custom controls (the simulated upload button and radio inputs) should be audited for keyboard accessibility and ARIA attributes. Ensure semantic form markup for screen-readers and focus management especially in modal layout.
- Edge cases: buildState uses fallbacks like initialDoc?.pageLimit || 100 and String(initialDoc?.pageLimit || 100) — be aware that pageLimit=0 in initialDoc will fall back to 100. If 0 is a valid value, change the nullish logic to handle 0 correctly.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/features/kb/components/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*


---

## Functions and Classes


#### function getMeta

![Type: Sync](https://img.shields.io/badge/Type-Sync-green)

### Signature

```typescript
function getMeta(sourceType: KbSourceType, mode: "create" | "edit")
```

### Description

Return a small metadata object (title and submitLabel) for a given knowledge-base source type and mode by selecting from a predefined mapping.


The function computes an action string ('Add' when mode is 'create', otherwise 'Edit') and returns one of three metadata objects keyed by sourceType. Each metadata object contains a title string built using the computed action and a submitLabel string which depends on the sourceType and mode. The function indexes into a literal object with keys 'url', 'article', and 'file' and returns the corresponding object for the supplied sourceType.

### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `sourceType` | `KbSourceType` | ✅ | The knowledge-base source type used to select which metadata object to return. The implementation uses this value as a key into a mapping with keys 'url', 'article', and 'file'.
<br>**Constraints:** Should be one of the keys present in the returned mapping (commonly 'url', 'article', or 'file'), If it does not match a key in the mapping, the function will return undefined |
| `mode` | `"create" | "edit"` | ✅ | Controls whether returned titles use the action 'Add' (for 'create') or 'Edit' (for 'edit'), and affects some submitLabel values.
<br>**Constraints:** Must be either the string 'create' or 'edit' |

### Returns

**Type:** `{ title: string; submitLabel: string } | undefined`

An object with two string properties: title (a phrase combining the action and a source descriptor) and submitLabel (the label for a submission button). If sourceType does not match a key in the internal mapping, undefined is returned.


**Possible Values:**

- { title: `${action} URL Source`, submitLabel: mode === 'create' ? 'Add' : 'Save' } (for sourceType 'url')
- { title: `${action} Article Source`, submitLabel: 'Save' } (for sourceType 'article')
- { title: `${action} File Source`, submitLabel: mode === 'create' ? 'Add' : 'Save' } (for sourceType 'file')
- undefined (if sourceType is not one of the mapping keys)

### Usage Examples

#### Create mode for a URL source

```typescript
getMeta('url', 'create')
```

Returns { title: 'Add URL Source', submitLabel: 'Add' }.

#### Edit mode for an Article source

```typescript
getMeta('article', 'edit')
```

Returns { title: 'Edit Article Source', submitLabel: 'Save' }.

#### Create mode for a File source

```typescript
getMeta('file', 'create')
```

Returns { title: 'Add File Source', submitLabel: 'Add' }.

### Complexity

O(1) time and O(1) additional space — function performs constant-time computation and returns a small object literal.

### Related Functions

- `None identified in snippet` - No other functions are called by this implementation; it is a simple mapper used likely by form components to obtain labels.

### Notes

- The function relies on sourceType matching keys in the inline mapping. If KbSourceType can contain values outside 'url' | 'article' | 'file', the function may return undefined.
- The action string is determined only by the mode parameter: 'create' -> 'Add', 'edit' -> 'Edit'.
- submitLabel is 'Save' for 'article' regardless of mode, while for 'url' and 'file' it is 'Add' in create mode and 'Save' in edit mode.

---



#### function buildState

![Type: Sync](https://img.shields.io/badge/Type-Sync-green)

### Signature

```typescript
function buildState(sourceType: KbSourceType, initialDoc?: KbDocument | null): FormState
```

### Description

Construct and return an initial FormState object by merging provided initialDoc values with default fallbacks; some defaults depend on the sourceType.


This function returns a plain object matching the FormState shape. For each field it prefers the corresponding value from initialDoc when present; otherwise it provides a sensible default. For displayName and articleTitle it applies conditional defaults based on whether sourceType === "article". Numeric pageLimit stored in the returned state is converted to a string. articleTags from initialDoc (if present) are joined into a single comma-separated string. No validation or side effects are performed; the function only reads its inputs and returns the computed object.

### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `sourceType` | `KbSourceType` | ✅ | The type of knowledge base source (used to adjust certain default field values such as displayName and articleTitle).
<br>**Constraints:** Must be a valid KbSourceType as defined elsewhere in the codebase, Code branches check for sourceType === "article" to decide some defaults |
| `initialDoc` = `undefined` | `KbDocument | null | undefined` | ❌ | Optional initial document whose properties are used to pre-fill the form state. If omitted or null, defaults are used for all fields.
<br>**Constraints:** If provided, expected to be an object with optional properties: url, displayName, title, crawlMode, pageLimit, patterns, articleTitle, articleContent, articleTags (array), fileName, fileTypes, chunkingMode, Fields not present or falsy on initialDoc will fall back to defaults |

### Returns

**Type:** `FormState`

A FormState object with fields populated from initialDoc when available, otherwise set to defaults. Fields include: url, displayName, crawlMode, pageLimit (string), patterns, articleTitle, articleContent, articleTags (comma-separated string), fileName, fileTypes, chunkingMode.


**Possible Values:**

- { url: string, displayName: string, crawlMode: string, pageLimit: string, patterns: string, articleTitle: string, articleContent: string, articleTags: string, fileName: string, fileTypes: string, chunkingMode: string }
- Typical defaults when initialDoc is absent: url: "", displayName: "" (or from title if not article), crawlMode: "Single Page", pageLimit: "100", patterns: "", articleTitle: "" (for article type may use initialDoc.title), articleContent: "", articleTags: "", fileName: "", fileTypes: "PDF, DOCX, TXT", chunkingMode: "Auto (Recommended)"

### Usage Examples

#### Initialize form state for a new article source with no initial document

```typescript
const state = buildState("article");
```

Returns a FormState where article-specific fields are set to their defaults (empty strings or explicit defaults like crawlMode and chunkingMode).

#### Initialize form state with an existing KbDocument

```typescript
const state = buildState("website", existingDoc);
```

Returns a FormState where fields are populated from existingDoc; pageLimit is converted to a string and articleTags array (if present) is joined into a comma-separated string.

### Complexity

Time complexity: O(1) (constant time) because the function performs a fixed number of property accesses and simple operations; Space complexity: O(1) additional space beyond the returned object (size proportional to number of form fields).

### Related Functions

- `KbSourceForm (component)` - Likely consumer: buildState is intended to provide the initial form state for the KbSourceForm component.

### Notes

- pageLimit is always converted to a string in the returned state (String(initialDoc?.pageLimit || 100)).
- articleTags from initialDoc (if present) are expected to be an array and are converted to a comma-separated string; if not present the returned articleTags is an empty string.
- displayName default uses initialDoc.title when sourceType is not "article"; for "article" displayName falls back to an empty string unless initialDoc.displayName is provided.
- No validation or parsing beyond simple conversions is performed; callers should validate the returned state where necessary.

---


