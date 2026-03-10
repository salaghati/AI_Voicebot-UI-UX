<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "playwright.config.ts",
  "source_hash": "4274590cafac59fa89706925238bb1af22865e677e2cd1a4030c3d14d87bcf81",
  "last_updated": "2026-03-10T03:48:49.059503+00:00",
  "git_sha": "1ba873bb8ea38a46944490a096225c780e612c85",
  "tokens_used": 6320,
  "complexity_score": 2,
  "estimated_review_time_minutes": 10,
  "external_dependencies": [
    "@playwright/test"
  ]
}
```

</details>

[Documentation Home](README.md) > **playwright.config**

---

# playwright.config.ts

> **File:** `playwright.config.ts`

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

This file exports a Playwright configuration object using defineConfig from the @playwright/test package. The configuration targets tests in the ./e2e directory, enables fully parallel test execution (fullyParallel: true), disables test retries (retries: 0), and sets global test options under use: baseURL is http://localhost:3000 and trace collection is configured as "on-first-retry". A single project named "chromium" is defined that spreads the built-in devices["Desktop Chrome"] device descriptor into the project's use configuration.

It also defines a webServer section that instructs Playwright to run the command "npm run build && npm run start -- --port 3000" and wait for the application to be reachable at http://localhost:3000. The server startup is given a timeout of 180_000 milliseconds (180 seconds). The reuseExistingServer option is controlled by the environment: reuseExistingServer is set to !process.env.CI, so the server will be reused when running locally (no CI env var) but will be started fresh in CI. This configuration file is declarative (no runtime functions or classes) and is intended to be consumed by Playwright's CLI/runner to control test execution and application lifecycle during e2e runs.

## Dependencies

### External Dependencies

| Module | Usage |
| --- | --- |
| `@playwright/test` | Imports defineConfig and devices from '@playwright/test'. defineConfig is used to wrap and export the Playwright configuration object; devices is used to reference devices["Desktop Chrome"] and spread its settings into the chromium project. |

## 📁 Directory

This file is part of the **_docs** directory. View the [directory index](_docs/README.md) to see all files in this module.

## Architecture Notes

- Configuration-only module: the file exports a single configuration object; there are no functions or classes. Playwright reads this object to configure test execution and webServer lifecycle.
- Environment-gated behavior: reuseExistingServer uses !process.env.CI to treat CI and local runs differently (reuse server locally, always start in CI).
- Web server lifecycle: Playwright will run the provided npm command and poll the configured url until it becomes available or the timeout (180_000 ms) elapses. If reuseExistingServer is true and a server already responds at the url, Playwright will skip starting a new server.
- Device plumbing: uses the devices map provided by Playwright to inherit the Desktop Chrome device config via spread syntax ({ ...devices['Desktop Chrome'] }) for the chromium project.

## Usage Examples

### Local development: run e2e tests while possibly reusing a running dev server

Developer runs Playwright tests (e.g., npx playwright test). Because reuseExistingServer is !process.env.CI, when running locally without CI set the runner will reuse an already-running server at http://localhost:3000 if present. If no server exists, Playwright will run the configured command (npm run build && npm run start -- --port 3000) and wait up to 180_000 ms for the URL to respond. Tests execute in parallel across worker processes with the chromium project using Desktop Chrome device settings. Traces will only be collected on the first retry of a failing test (trace: 'on-first-retry').

### CI pipeline: start a fresh server and execute e2e tests

In CI (process.env.CI is set), reuseExistingServer becomes false so Playwright will run the provided build/start command regardless of any existing processes. The runner waits up to 180 seconds for the server to become available at http://localhost:3000 before failing the job. Tests run fully parallel against the chromium project configuration. Because retries are 0 in this config, flakes will not be retried unless CI-specific overrides are applied elsewhere.

## Maintenance Notes

- Ensure package.json defines the npm scripts 'build' and 'start' and that start accepts a --port argument; otherwise the webServer command will fail and tests won't run.
- Port collisions: the config assumes port 3000; if another service uses that port adjust both baseURL and webServer.command accordingly.
- Timeouts: the webServer timeout is 180_000 ms. Increase this value if builds or server startup are slow in your environment (e.g., cold CI runners).
- Browser coverage: only a single project named 'chromium' is configured. Add additional projects (firefox, webkit) if cross-browser coverage is required.
- Tracing and retries: trace is set to 'on-first-retry' but retries is 0 here; consider increasing retries in CI or adjusting trace policy to capture traces when useful.
- Environment gating: reuseExistingServer uses truthiness of process.env.CI; if your CI provider uses a different variable, update this check.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*
