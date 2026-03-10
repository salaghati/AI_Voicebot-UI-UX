<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "e2e/voicebot-flow.spec.ts",
  "source_hash": "7829d245f1177c8be5ff4f4448d5025a637bc4ac8b2b00d12a951dffba4f20e5",
  "last_updated": "2026-03-10T03:48:07.624476+00:00",
  "git_sha": "85878380783677b970ae7ad0720343bd0a189a0d",
  "tokens_used": 5786,
  "complexity_score": 2,
  "estimated_review_time_minutes": 10,
  "external_dependencies": [
    "@playwright/test"
  ]
}
```

</details>

[Documentation Home](../README.md) > [e2e](./README.md) > **voicebot-flow.spec**

---

# voicebot-flow.spec.ts

> **File:** `e2e/voicebot-flow.spec.ts`

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

This file uses Playwright's test runner to declare three independent E2E test cases. It imports the test and expect helpers from "@playwright/test" and then defines three tests (via test(...)) that navigate to particular application routes and assert either the current URL or the visibility of specific text on the page. There are no function or class definitions in this module; the file is purely a test specification script containing test declarations and assertions.

Each test is written as an async callback receiving a Playwright Page fixture (async ({ page }) => { ... }). The tests perform navigation using page.goto(...) and perform assertions using expect(...).toHaveURL(...) and expect(...).toBeVisible(...). The file contains three explicit test scenarios (names are the first argument to test): "login -> dashboard -> create outbound", "login failed + forgot password", and "open report call detail". The tests reference application routes and UI text directly: "/dashboard", "/bot-engine/outbound/create", "/auth/login?failed=1", "/auth/forgot-password", and "/report/call-detail/CALL-1000" and check for text snippets including "Tạo Outbound Campaign", "Login Failed", "Quên mật khẩu", and "Transcript hội thoại".

Because the file contains only test declarations and no helper functions, shared fixtures, or setup/teardown code, it should be treated as an atomic set of scenarios. Important context for developers: these tests assume the application is reachable at the base URL configured for Playwright (page.goto uses root-relative paths), and they rely on visible text (some in Vietnamese) rather than stable test IDs, which may cause flakiness or localization sensitivity. There is also an implicit assumption about authentication or route accessibility (e.g., navigating to /dashboard directly) which should be validated with the project’s Playwright configuration or pre-auth fixtures if these routes require an authenticated session.

## Dependencies

### External Dependencies

| Module | Usage |
| --- | --- |
| `@playwright/test` | Imports the test runner and assertion helpers: "import { test, expect } from \"@playwright/test\"". 'test' is used to declare three async test cases (test("...", async ({ page }) => { ... })), and 'expect' is used for assertions such as expect(page).toHaveURL(...) and expect(page.getByText(...)).toBeVisible(). |

## 📁 Directory

This file is part of the **e2e** directory. View the [directory index](_docs/e2e/README.md) to see all files in this module.

## Architecture Notes

- Uses Playwright test runner style: tests declared with test(name, async ({ page }) => { ... }) and assertions via expect(). This enables fixture injection (page) and async/await non-blocking navigation/assertions.
- Tests perform direct navigation with page.goto('/') using root-relative paths, so they rely on Playwright's base URL configuration to target the correct environment.
- Selectors/assertions target visible text (page.getByText(...)) and URL patterns (expect(...).toHaveURL(/regex/)). Using visible text makes tests sensitive to localization and UI copy changes; using stable test ids or data-test attributes would reduce brittleness.
- Error handling: there is no explicit try/catch; failures are surfaced via Playwright's expect assertions which will fail the test run and produce diagnostics (screenshots/traces) if configured.

## Usage Examples

### Verify navigation to dashboard and outbound creation page

The test named "login -> dashboard -> create outbound" navigates to /dashboard (await page.goto('/dashboard')) and asserts the URL matches /\/dashboard/. It then navigates to /bot-engine/outbound/create and checks that the localized text "Tạo Outbound Campaign" is visible. Expected outcome: both navigations complete and the target text is present; failures indicate broken routing or missing UI text.

### Check login failure messaging and forgot-password flow

The test named "login failed + forgot password" visits /auth/login?failed=1, asserts that the page contains text "Login Failed", clicks the link role named "Quên mật khẩu" (await page.getByRole('link', { name: 'Quên mật khẩu' }).click()), then asserts the page navigates to /auth/forgot-password via expect(page).toHaveURL(/\/auth\/forgot-password/). Expected outcome: the failure banner is shown and the forgot-password link routes to the correct page.

### Open a specific call detail report and assert transcript presence

The test named "open report call detail" navigates directly to /report/call-detail/CALL-1000 and verifies that the text "Transcript hội thoại" is visible. This checks that the call-detail route renders and includes the expected transcript UI element for the given CALL-1000 identifier.

## Maintenance Notes

- Tests rely on visible UI text (Vietnamese strings). If the application is localized or copy changes, these tests will break. Consider switching to data-test-id attributes or stable locators for resilience.
- Direct navigation to authenticated routes (e.g., /dashboard) may fail if the environment requires login; ensure Playwright is configured with appropriate authentication state or add a login/setup fixture.
- Hard-coded route paths and identifiers (e.g., CALL-1000) can make tests brittle. Prefer creating test data fixtures or mocking backend responses when possible.
- Keep Playwright and its types compatible with the project's TypeScript configuration. Update Playwright carefully when upgrading to avoid breaking test APIs.
- Add timeout adjustments or retries only where necessary; otherwise rely on Playwright's built-in waiting mechanisms on getByText and navigation promises.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/e2e/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*
