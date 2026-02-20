# AI Voicebot UI/UX Interactive Prototype

Next.js prototype implementing the PPT flow (slide 1-60) and excluding research app (slide 61-101).

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS
- React Query
- Mock API (Next route handlers)
- Vitest + Playwright

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Test

```bash
npm run lint
npm test
npm run build
npm run test:e2e
```

## Main routes

- Auth: `/auth/login`, `/auth/forgot-password`
- Dashboard: `/dashboard`
- Bot Engine Outbound: `/bot-engine/outbound` and `/bot-engine/outbound/new/step-1..4`
- Bot Engine Inbound: `/bot-engine/inbound` and `/bot-engine/inbound/new/step-1..4`
- Workflow: `/workflow`, `/workflow/:id`, `/workflow/:id/preview/*`
- Report: `/report/overview`, `/report/inbound`, `/report/outbound`, `/report/call-detail/:id`, `/report/error-monitor`, `/report/agent-analysis`
- Preview/Test: `/preview/playground`
- Phase 2 placeholders: `/kb`, `/settings`

## Deliverables

- Slide mapping: `docs/slide-route-mapping.md`
- Acceptance checklist: `docs/acceptance-checklist.md`
- Refactored structure guide: `docs/PROJECT_STRUCTURE.md`
