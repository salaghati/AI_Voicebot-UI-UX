<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "e2e/phase2-flow.spec.ts",
  "source_hash": "d1d3c5e67693aafd7e1af4590dec884faf743c477ceb3084f6488961331e43c5",
  "last_updated": "2026-03-10T03:48:08.291623+00:00",
  "git_sha": "d822612df51f7ab4ea4acc891d89ca51d09e9711",
  "tokens_used": 5974,
  "complexity_score": 2,
  "estimated_review_time_minutes": 10,
  "external_dependencies": [
    "@playwright/test"
  ]
}
```

</details>

[Documentation Home](../README.md) > [e2e](./README.md) > **phase2-flow.spec**

---

# phase2-flow.spec.ts

> **File:** `e2e/phase2-flow.spec.ts`

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

This file uses the Playwright test runner to exercise UI flows in a web application. It registers a global beforeEach hook that navigates to "/dashboard" and asserts the URL contains "/dashboard". It then defines two tests: "kb flow: list -> add -> usage filter" and "settings flow: stt-tts -> users -> roles editor". Each test uses Playwright's page object to navigate to specific routes (e.g., "/kb/list", "/kb/add", "/kb/usage/filter", "/settings/stt-tts", "/settings/users/new", "/settings/roles/editor"), interact with inputs and buttons (getByPlaceholder, getByRole, locator, getByText), and assert visibility of expected UI text nodes.

The file is minimal and focused on UI-level verification without explicit cleanup or mocking. Tests perform sequential operations: navigation, filling inputs, clicking buttons, and assertions via expect(...).toBeVisible(). The test code relies on route-based navigation and DOM selectors (placeholders, roles, text) rather than internal APIs. Important practical details: the tests await each Playwright action (async/await), they assume the application state is prepared to show specific elements (e.g., "KB - 1. Danh sách KB", "KB-100 • WF_ThuNo_A"), and they perform create-like actions (filling "KB từ e2e", creating a user and role) without teardown. Developers maintaining these tests should be aware that stateful side effects may require test isolation or cleanup outside this file.

## Dependencies

### External Dependencies

| Module | Usage |
| --- | --- |
| `@playwright/test` | Imports exact symbols: { test, expect } from "@playwright/test". Used to define the test.beforeEach hook and test cases (test("...", async ({ page }) => { ... })), to make assertions with expect(...).toHaveURL(...) and expect(...).toBeVisible(), and to provide the Playwright test runner's page fixture used throughout the file. |

## 📁 Directory

This file is part of the **e2e** directory. View the [directory index](_docs/e2e/README.md) to see all files in this module.

## Architecture Notes

- Uses Playwright test runner patterns: test.beforeEach hook for common setup and test(...) for individual scenarios.
- Async/await is used for all page interactions (await page.goto, await page.getBy...().fill(), await page.getByRole(...).click(), and await expect(...)).toBeVisible()), ensuring sequential execution and waiting for the UI to update.
- Selectors rely on accessible queries: getByText, getByPlaceholder, getByRole, and locator(input).nth(...). These are readable but can be brittle if placeholders, visible texts, or roles change.
- No explicit error handling or retries are implemented — the tests rely on Playwright's built-in timeouts and expect assertions to fail the test on mismatch.
- State management is implicit: tests navigate to specific routes and perform actions that may mutate server-side state (creating KB entries, users, roles) but the file does not include teardown or fixture resets.

## Usage Examples

### kb flow: list -> add -> usage filter

Sequence: beforeEach navigates to /dashboard. The test navigates to /kb/list and asserts the text "KB - 1. Danh sách KB" is visible. It then navigates to /kb/add, fills the placeholder input "VD: Chính sách hoàn tiền" with "KB từ e2e", and clicks the button with role "button" and name "Thêm KB" to create the KB. Finally, it navigates to /kb/usage/filter, fills the filter input "Filter thời gian / keyword" with "WF_ThuNo_A", and asserts that an item with text "KB-100 • WF_ThuNo_A" is visible. Expected outcomes: navigation succeeds, UI elements are present, and the created/filtered KB appears. Failures indicate either routing/UI changes or missing server-side data/state.

### settings flow: stt-tts -> users -> roles editor

Sequence: the test navigates to /settings/stt-tts and expects the heading "Setting 1 - STT/TTS" to be visible, then clicks the button named "Lưu" to save. It proceeds to /settings/users/new, fills two inputs (first with "E2E User" and second with "e2e@voicebot.vn") and clicks the "Save" button to create a user. Finally, it goes to /settings/roles/editor, fills the placeholder "VD: Supervisor" with "E2E Role" and clicks the "Lưu" button to save the role. Expected outcomes: each navigation and UI interaction completes with visible confirmation or expected UI elements. Because there is no teardown, repeated runs may require unique test data or isolated environments.

## Maintenance Notes

- Selectors are text- and placeholder-based, which can be brittle if UI copy changes; prefer data-testids or stable attributes for resilient selectors.
- Tests perform create operations (KB, user, role) with no cleanup. This can cause stateful flakiness on repeated runs against persistent environments; add teardown or use test-specific sandbox environments.
- Consider adding network stubbing or fixtures if deterministic behavior is required (the file currently relies on the application under test and its current data).
- Increase assertion coverage for outcomes (e.g., confirm API responses, check created entity details) to catch partial failures where UI navigation succeeds but creation fails.
- Be mindful of Playwright timeouts and CI resource differences — if tests are flaky, tune timeouts or add explicit waits where appropriate.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/e2e/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*
