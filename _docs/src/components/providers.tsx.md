<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/components/providers.tsx",
  "source_hash": "671554f5b05f62c381790f04c26bf65d32284f136e42535b0277ef5cda4532f5",
  "last_updated": "2026-03-10T04:10:05.626957+00:00",
  "git_sha": "49b18adc76f7b7a582931e5a290fb66b9a95fac3",
  "tokens_used": 5328,
  "complexity_score": 2,
  "estimated_review_time_minutes": 10,
  "external_dependencies": [
    "@tanstack/react-query",
    "react",
    "sonner"
  ]
}
```

</details>

[Documentation Home](../../README.md) > [src](../README.md) > [components](./README.md) > **providers.mdx**

---

# providers.tsx

> **File:** `src/components/providers.tsx`

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

This file exports a single React component Providers that is intended to wrap application UI. It uses a lazily-initialized QueryClient (created inside useState with a function initializer) and returns a QueryClientProvider that supplies that client to descendant components. The QueryClient is configured with defaultOptions.queries set to { retry: 1, staleTime: 20_000 } which controls retry behavior and cache staleness for all queries by default.

The component also renders a Toaster from the sonner library at the top-right of the viewport so toasts are available across the app. The file begins with the Next.js/React "use client" directive, indicating the component runs on the client. This file is typically used near the top of the React tree (for example in a Next.js root layout or a top-level App component) so that react-query state and toast UI are available application-wide. Important design decisions: a single QueryClient instance is created per mount (kept in component state) via lazy initialization to avoid recreating the client on every render, and global defaults for queries are set in one place to centralize cache and retry policies.

## Dependencies

### External Dependencies

| Module | Usage |
| --- | --- |
| `@tanstack/react-query` | Imports QueryClient and QueryClientProvider. QueryClient is instantiated with defaultOptions for queries (retry: 1, staleTime: 20_000). QueryClientProvider is used to wrap children and provide the QueryClient instance to the React component tree. |
| `react` | Imports ReactNode (type) and useState (hook). ReactNode is used to type the children prop of the exported Providers component. useState is used with a lazy initializer to create and hold the QueryClient instance across renders: const [queryClient] = useState(() => new QueryClient(...)). |
| `sonner` | Imports Toaster and renders <Toaster richColors position="top-right"/> inside the provider so that application-wide toast notifications are available. The component uses the Toaster directly without additional configuration beyond the props shown. |

## 📁 Directory

This file is part of the **components** directory. View the [directory index](_docs/src/components/README.md) to see all files in this module.

## Architecture Notes

- Pattern: React composition + provider pattern. The file creates a provider (QueryClientProvider) that wraps children to supply a shared client instance via React context used by @tanstack/react-query hooks.
- State management: QueryClient is created once per mount using useState with a lazy initializer (() => new QueryClient(...)) so the same client instance is stable across renders and won't be recreated on each render cycle.
- Client-only component: The file starts with the "use client" directive so it runs in the browser environment (important for Next.js app router where server components are default).
- Error handling: No explicit error boundaries or try/catch around QueryClient creation — QueryClient constructor is synchronous and expected to succeed; any runtime errors would propagate as React errors.
- UI integration: Toaster from sonner is mounted at top-right; it is independent of react-query but colocated here to provide a single place for global UI notification configuration.

## Usage Examples

### Wrap application root to provide react-query and global toasts

In a Next.js or React app, import Providers and use it at the top level (e.g., in app/layout.tsx or index.tsx). Example workflow: The Providers component creates a QueryClient with the defaultOptions { queries: { retry: 1, staleTime: 20000 } }. Descendant components call useQuery/useMutation from @tanstack/react-query and receive the configured behavior. Any part of the app can call sonner's toast API (e.g., toast.success) and the rendered Toaster mounted by Providers will display notifications at the configured position (top-right).

## Maintenance Notes

- Performance: A single QueryClient instance is appropriate for most apps; recreating the client causes cache resets. Ensure Providers is mounted once at the app root to preserve query cache across route changes.
- Configuration hotspots: The default query options (retry, staleTime) are hard-coded. If you need different per-query defaults or environment-specific settings (dev vs prod), externalize these values to a config file or environment-based logic.
- Testing: For unit tests, mount Providers around components that use react-query to provide the QueryClient context. You may want to pass a custom QueryClient (or mock) in tests instead of relying on the internal lazy initializer.
- Client-only requirement: The top-level "use client" directive makes this component client-only. If you need server-side rendering for parts of your app, ensure Providers is only used where client behavior is intended.
- Upgrades: Keep an eye on @tanstack/react-query and sonner major versions — their API surface (QueryClient options or Toaster props) can change across major releases.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/components/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*
