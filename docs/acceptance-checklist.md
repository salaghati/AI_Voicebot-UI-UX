# Acceptance Checklist

## Routing and Navigation

- [x] All phase 1 routes exist and are navigable.
- [x] All phase 2 KB and Settings routes exist and are navigable.
- [x] No dead-end path for primary CTA.
- [x] Root route redirects to login.

## Core Behaviors

- [x] List pages support search/filter/sort/pagination.
- [x] Create/Edit/Delete/Copy/Export actions show confirm/toast feedback.
- [x] Campaign and Inbound wizard support validate/back/review/save draft.
- [x] Workflow preview tabs preserve current query context.
- [x] Preview playground has transcript and technical log interaction.

## Async States

- [x] `loading`/`empty`/`error`/`forbidden` mock states available via query param `state`.
- [x] API handlers return stateful responses for testing UX.

## API Contracts

- [x] Auth, Campaign, Inbound, Workflow, Report endpoints implemented.
- [x] KB and Settings API stubs + client handlers implemented.

## Test Coverage

- [x] Unit tests for validators.
- [x] Unit tests for filter parser and mappers.
- [x] Integration tests for campaign/inbound creation.
- [x] E2E Playwright specs added for phase 1 + phase 2 flows.
- [x] Visual regression snapshots for desktop/mobile.
