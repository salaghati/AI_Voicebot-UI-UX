<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/lib/mock-phase2.ts",
  "source_hash": "b0cc98b5ee0326a4142d17da79fbe367e3d7e3212f9f2d61c7f5a0d49b9d0ee4",
  "last_updated": "2026-03-10T04:22:58.611184+00:00",
  "tokens_used": 14347,
  "complexity_score": 2,
  "estimated_review_time_minutes": 10,
  "external_dependencies": []
}
```

</details>

[Documentation Home](../../README.md) > [src](../README.md) > [lib](./README.md) > **mock-phase2**

---

# mock-phase2.ts

> **File:** `src/lib/mock-phase2.ts`

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

This module exports a set of hard-coded, in-memory fixtures and utility functions intended to simulate a backend for knowledge-base management and related configuration. It defines arrays such as kbDocs, kbFallbackRules, fallbackRules, kbUsage, users, roles, phoneContexts, phoneNumbers, and extensions; configuration objects like sttTtsSetting, apiSetting, and agentSetting; and helper functions to list, retrieve, create, update, delete, and toggle records. All timestamps are produced with new Date().toISOString(), IDs are generated deterministically from array lengths (e.g., `KB-${100 + kbDocs.length}` or `FBK-${29480 + kbFallbackRules.length + 1}`), and several functions perform type normalization (string coercion, Number conversion, splitting CSV tags into arrays).

The module is purely in-memory and synchronous: functions manipulate module-level arrays using unshift, splice, find, and findIndex to implement CRUD behavior. It relies on TypeScript types imported from the local project alias "@/types/domain" to describe expected shapes (e.g., KbDocument, KbFallbackRule, FallbackRule, RolePermission). Key helper functions include createMockKbDoc (accepts Partial<KbDocument> & { articleTags?: string[] | string } and normalizes fields like articleTags, pageLimit, crawlMode, chunkingMode), updateMockKbDoc (merges payload into an existing KB doc and updates updatedAt), and createKbFallbackRule/updateKbFallbackRule/toggleKbFallbackActive which handle lifecycle operations for fallback rules. The module intentionally returns simple sentinel values for error conditions (null when a requested item is not found, or false when deletion fails), making it straightforward to stub API behavior in a front-end or integration test environment.

## Dependencies

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/types/domain](../@/types/domain.md) | Imports TypeScript types (FallbackRule, KbDocument, KbFallbackRule, KbSourceType, RolePermission) used to type exported constants and function signatures in this module. No runtime values are imported; the import is used solely for static typing. |

## 📁 Directory

This file is part of the **lib** directory. View the [directory index](_docs/src/lib/README.md) to see all files in this module.

## Architecture Notes

- State is kept in module-level mutable arrays (e.g., kbDocs, kbFallbackRules). Functions mutate these arrays directly (unshift, splice, assignment), so the module acts as an in-memory datastore for the lifetime of the Node/VM process.
- ID generation is deterministic and array-length based (e.g., new KB id uses `KB-${100 + kbDocs.length}`), which is simple but can produce collisions or non-sequential IDs if items are removed. There is no UUID or centralized ID service.
- Error handling is explicit and minimal: lookup functions return the found object or null; delete functions return boolean success. Consumers must check for null/false and handle error conditions themselves.
- Type normalization and parsing occur in create/update helpers: payload fields are coerced to string/number, articleTags accepts a CSV string or an array and is normalized to string[], and chunkingMode/fileTypes default logic depends on sourceType.
- No external I/O, network, or database interactions occur — this file is intentionally isolated from side effects beyond in-memory mutation and usage of Date for timestamps.

## Usage Examples

### Create a new KB document for a URL source

Call createMockKbDoc({ sourceType: 'url', url: 'https://example.com', displayName: 'Example' }). The function: (1) determines sourceType (defaults to 'url' if omitted), (2) builds a title via buildKbTitle, (3) assigns source label via getKbSourceLabel, (4) normalizes fields (pageLimit -> Number, crawlMode default), (5) generates id as `KB-${100 + current length}`, (6) sets updatedAt to new Date().toISOString(), (7) inserts the new document at the front of kbDocs with unshift and returns the created KbDocument object. Side effects: kbDocs array is mutated in-place.

### Update an existing KB document

Call updateMockKbDoc('KB-100', { displayName: 'Landing Page Thu hồi nợ (updated)' }). The function: (1) finds index with findIndex; if not found returns null, (2) merges current and payload into a new object, ensures sourceType is preserved or updated from payload, (3) recalculates source label and title using getKbSourceLabel and buildKbTitle, (4) sets updatedAt to current ISO timestamp, (5) if payload.articleTags is a CSV string it is split and trimmed into an array, (6) replaces kbDocs[index] with the new object and returns it. Consumers should check for a null return to detect missing items.

### Manage KB fallback rules

Use listKbFallbackRules() to retrieve the array, getKbFallbackRuleById(id) to get a single rule or null, createKbFallbackRule(payload) to add a new rule (id generated with base 29480 + length + 1), updateKbFallbackRule(id, payload) to merge changes (returns null if not found), deleteKbFallbackRule(id) to remove by id (returns boolean), and toggleKbFallbackActive(id) to flip active boolean and update updatedAt (returns updated rule or null if not found). All operations mutate kbFallbackRules in-place.

## Maintenance Notes

- Because the module mutates exported arrays, tests or parallel usage may interfere with one another. Reset functions are not provided; tests should import the module afresh or manually restore state between runs.
- ID generation uses array length and fixed bases — removing items can cause re-use of IDs for newly created items. Consider switching to a UUID or centralized incremental counter to avoid collisions if needed.
- Type normalization is permissive (coercing to String/Number); there is no validation of semantics (e.g., url format, pageLimit bounds). Add validation if this mock will be used for closer-to-production testing.
- Timestamping uses new Date().toISOString() on mutation; this is adequate for tests but offers no timezone control or deterministic timestamps. For deterministic tests, inject a clock or allow passing updatedAt in payload.
- Edge cases to test: createMockKbDoc with articleTags as comma-separated string, create/update when sourceType omitted (defaults), delete/update non-existent ids (expect false/null), and toggleKbFallbackActive multiple times to ensure active state flips.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/lib/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*


---

## Functions and Classes


#### function getKbSourceLabel

![Type: Sync](https://img.shields.io/badge/Type-Sync-green)

### Signature

```typescript
function getKbSourceLabel(sourceType: KbSourceType): string | undefined
```

### Description

Return a human-readable label for a knowledge base source type by mapping the provided sourceType to a fixed string label.


The function accepts a single parameter sourceType and uses an object literal as a lookup table to map known source type keys to corresponding human-readable labels. It returns the mapped label for keys 'url', 'article', and 'file'. If a value not present in the lookup is provided, the expression returns undefined because the lookup object has no matching property.

### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `sourceType` | `KbSourceType` | ✅ | The key representing the knowledge base source type to be converted into a human-readable label.
<br>**Constraints:** Should be one of the keys present in the lookup object: 'url', 'article', 'file' (values outside these keys will result in undefined)., Type must be KbSourceType as declared in the codebase. |

### Returns

**Type:** `string | undefined`

A human-readable label corresponding to the provided sourceType key, or undefined if the key is not present in the internal mapping.


**Possible Values:**

- "URL Source"
- "Article Source"
- "File Source"
- undefined

### Usage Examples

#### Get label for a URL source

```typescript
getKbSourceLabel('url')
```

Returns the string 'URL Source' when the sourceType is 'url'.

#### Unknown source type

```typescript
getKbSourceLabel('unknown' as KbSourceType)
```

Returns undefined because 'unknown' is not a key in the internal mapping.

### Complexity

O(1) time complexity and O(1) additional space complexity (constant-time property lookup on a small literal object).

### Related Functions

- `None detected in provided context` - No related functions are visible in the given snippet; this is a standalone lookup helper.

### Notes

- The function uses an object literal lookup and returns undefined for keys not present in that literal.
- The function signature in the source does not explicitly declare a return type; the documented return type is inferred from the implementation.
- KbSourceType is referenced but its definition is not shown in the provided snippet; callers should ensure they pass a compatible value.

---



#### function buildKbTitle

![Type: Sync](https://img.shields.io/badge/Type-Sync-green)

### Signature

```typescript
function buildKbTitle(payload: Partial<KbDocument>)
```

### Description

Return a string title for a knowledge-base document by selecting the first available title-like field based on the document's sourceType.


This function inspects the provided payload (a Partial<KbDocument>) and returns a string used as the document's title. If payload.sourceType is exactly the string "article", it returns, in order of preference, payload.articleTitle, payload.title, or the literal fallback "Bài viết mới", coerced to String. For any other sourceType (or if sourceType is missing), it returns, in order of preference, payload.displayName, payload.title, payload.fileName, payload.url, or the literal fallback "KB mới", coerced to String. The function uses JavaScript/TypeScript truthiness and the logical OR operator to pick the first non-falsy value and always converts the result to a string.

### Parameters

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `payload` | `Partial<KbDocument>` | ✅ | An object representing (part of) a knowledge-base document. Expected possible fields read by the function include sourceType, articleTitle, title, displayName, fileName, and url.
<br>**Constraints:** Fields accessed may be undefined because the type is Partial<KbDocument>., sourceType is compared strictly to the string "article"., No validation is performed on field types; values are coerced to String before returning. |

### Returns

**Type:** `string`

A string chosen from the first available title-like property according to the selection logic; guaranteed to be a string (via String(...) coercion).


**Possible Values:**

- String(payload.articleTitle) if payload.sourceType === 'article' and articleTitle is truthy
- String(payload.title) if payload.sourceType === 'article' and articleTitle is falsy but title is truthy
- "Bài viết mới" if payload.sourceType === 'article' and both articleTitle and title are falsy
- String(payload.displayName) if payload.sourceType !== 'article' and displayName is truthy
- String(payload.title) if payload.sourceType !== 'article' and displayName is falsy but title is truthy
- String(payload.fileName) if payload.sourceType !== 'article' and previous fields are falsy but fileName is truthy
- String(payload.url) if payload.sourceType !== 'article' and previous fields are falsy but url is truthy
- "KB mới" if none of the above fields are truthy

### Usage Examples

#### Article payload with articleTitle

```typescript
buildKbTitle({ sourceType: 'article', articleTitle: 'How to Test' })
```

Returns 'How to Test' because sourceType is 'article' and articleTitle is present.

#### Non-article payload using displayName fallback

```typescript
buildKbTitle({ sourceType: 'file', displayName: 'User Guide' })
```

Returns 'User Guide' because sourceType is not 'article' and displayName is present.

#### Missing title fields

```typescript
buildKbTitle({})
```

Returns 'KB mới' because no title-like fields are present and sourceType is not 'article'.

### Complexity

O(1) time and O(1) additional space; constant-time selection and string coercion based on a small fixed number of properties.

### Notes

- The function coerces whatever value it picks to a string via String(...), so non-string values (numbers, booleans) will be converted.
- Falsy values (e.g., empty string, 0, null, undefined, false) are skipped by the logical OR sequence.
- No validation or trimming is performed on the returned string.
- The two literal fallbacks are localized text: 'Bài viết mới' for articles and 'KB mới' for others.

---


