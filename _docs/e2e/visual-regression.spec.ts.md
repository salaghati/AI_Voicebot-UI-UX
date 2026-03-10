<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "e2e/visual-regression.spec.ts",
  "source_hash": "af5f48775248d216bd704e304ee225cf4d69146f4ca7d60b51e4370cddf0143a",
  "last_updated": "2026-03-10T03:48:04.075117+00:00",
  "git_sha": "eecb2f6bccfbb336bef42bd9725d84c50e894647",
  "tokens_used": 5232,
  "complexity_score": 2,
  "estimated_review_time_minutes": 10,
  "external_dependencies": [
    "@playwright/test"
  ]
}
```

</details>

[Documentation Home](../README.md) > [e2e](./README.md) > **visual-regression.spec**

---

# visual-regression.spec.ts

> **File:** `e2e/visual-regression.spec.ts`

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

This file is a small Playwright test suite that verifies the visual appearance of the login page at two viewports. It imports the Playwright test runner helpers (test and expect) and defines two test cases: a desktop screenshot comparison and a mobile screenshot comparison. Each test navigates to the route /auth/login using page.goto(...) and asserts the page rendering by calling expect(page).toHaveScreenshot(...) with a specified filename and the option fullPage: true.

The file demonstrates two important Playwright patterns: (1) defining tests with test("name", async ({ page }) => { ... }) which uses Playwright fixtures (page) and async/await for navigation and assertions, and (2) configuring test-level settings by calling test.use({...}) to change the viewport for subsequent tests. In this file the test.use call appears between the two tests, so the first test runs with the default Playwright viewport and the second test runs with the explicit mobile viewport { width: 390, height: 844 }. The screenshot assertions produce or compare image files named login-desktop.png and login-mobile.png and rely on Playwright's snapshot comparison mechanism (baseline images and CI artifacts).

## Dependencies

### External Dependencies

| Module | Usage |
| --- | --- |
| `@playwright/test` | Imports named exports exactly as written: import { test, expect } from "@playwright/test". 'test' is used to declare test blocks (test("visual login desktop", async ({ page }) => { ... })) and to configure test runner behavior via test.use({ viewport: { width: 390, height: 844 } }). 'expect' is used for Playwright assertions, specifically expect(page).toHaveScreenshot(filename, { fullPage: true }) to perform visual snapshot comparisons. |

## 📁 Directory

This file is part of the **e2e** directory. View the [directory index](_docs/e2e/README.md) to see all files in this module.

## Architecture Notes

- Uses Playwright's test runner and fixture model: each test receives a 'page' fixture and uses async/await for navigation and assertions.
- Visual regression is implemented via expect(page).toHaveScreenshot(filename, { fullPage: true }), which relies on baseline images stored by Playwright snapshot system and will fail if pixel differences exceed thresholds configured by the test runner.
- test.use({...}) is used to mutate the test configuration (viewport) for subsequent tests. Because test.use appears between the two test definitions, the ordering determines which tests receive the altered viewport.
- No explicit error handling is present in the file; test failures are surfaced through Playwright's assertion framework. Tests assume stable, deterministic rendering and consistent test environment (same OS, browser, and rendering engine) for reliable screenshot comparisons.

## Usage Examples

### Desktop visual regression check for login page

The test named 'visual login desktop' navigates to '/auth/login' using await page.goto('/auth/login') and then calls await expect(page).toHaveScreenshot('login-desktop.png', { fullPage: true }). This produces or compares a full-page baseline image named login-desktop.png. On CI the test will fail if the captured screenshot differs from the stored baseline beyond Playwright's threshold.

### Mobile visual regression check for login page

After test.use({ viewport: { width: 390, height: 844 } }) is invoked, the following test 'visual login mobile' runs with the mobile viewport. It navigates to '/auth/login' and asserts a full-page screenshot matches login-mobile.png via expect(page).toHaveScreenshot(...). This validates responsive layout and appearance at the specified mobile dimensions.

## Maintenance Notes

- Keep baseline screenshot files (login-desktop.png, login-mobile.png) under source control or managed by CI snapshot tooling. When intentional visual changes are made, update the baselines explicitly using Playwright's snapshot update workflow.
- Visual tests are sensitive to environment differences (OS, GPU, browser version, fonts). Run them in a controlled CI environment or use Docker images with pinned browser versions to reduce flakiness.
- If tests intermittently fail due to animations or late-loaded content, add deterministic waits or stable-ready checks (e.g., waitForSelector for a stable element) before taking screenshots. Avoid arbitrary time-based waits when possible.
- Be mindful that test.use affects subsequent tests; if more configurations are needed, consider grouping tests into files or using describe/test.beforeEach patterns to avoid ordering dependencies.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/e2e/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*
