<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/features/auth/components/LoginForm.tsx",
  "source_hash": "bbe395b9c49e0bcc978b628d351dbb57c18876d4e7063e8e3f49a27973f2c2cf",
  "last_updated": "2026-03-10T04:13:09.643302+00:00",
  "git_sha": "2c398db8c1a6285cb7a9747a3c106be4e45e4d50",
  "tokens_used": 6917,
  "complexity_score": 3,
  "estimated_review_time_minutes": 10,
  "external_dependencies": [
    "next/link",
    "next/navigation",
    "react-hook-form",
    "@hookform/resolvers/zod",
    "sonner"
  ]
}
```

</details>

[Documentation Home](../../../../README.md) > [src](../../../README.md) > [features](../../README.md) > [auth](../README.md) > [components](./README.md) > **LoginForm.mdx**

---

# LoginForm.tsx

> **File:** `src/features/auth/components/LoginForm.tsx`

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

This file exports a single React component function LoginForm() which implements a login UI and client-side behavior. It uses react-hook-form with a zodResolver tied to loginSchema to validate two fields (email and password) typed by the local LoginValues type. The component reads search params to detect a failure state (failed=1) and conditionally renders a red failure banner; it also uses router.push to navigate on success/failure and to demonstrate the failure banner via a "Demo lỗi đăng nhập" button.

The form submission handler onSubmit calls the internal login(values) API client function imported from "@/lib/api-client" inside a try/catch. On success it shows a toast.success message via sonner and navigates to "/dashboard"; on failure it shows a toast.error and navigates to "/auth/login?failed=1" to trigger the error banner. The component relies on internal UI primitives (Card, Input, Button) for consistent styling, disables the submit button while isSubmitting is true, and displays field-level error messages surfaced from the zod validation resolver. The file is marked as a client component ("use client") so it executes browser-side and depends on Next.js navigation hooks for routing/state in the client environment.

## Dependencies

### External Dependencies

| Module | Usage |
| --- | --- |
| `next/link` | Provides the Link component used to render a navigation link to "/auth/forgot-password" (used in the form UI). |
| `next/navigation` | Imports useRouter and useSearchParams. useRouter() is used to programmatically navigate (router.push) after login success/failure and for the demo-failure button; useSearchParams() is used to read the "failed" query parameter to conditionally render an error banner. |
| `react-hook-form` | Imports useForm which manages the form state (register, handleSubmit) and exposes formState { errors, isSubmitting } used to show validation messages and disable the submit button during submission. |
| `@hookform/resolvers/zod` | Imports zodResolver and passes it to useForm so the imported loginSchema (Zod schema) drives validation of the form fields. |
| `sonner` | Imports toast and uses toast.success and toast.error to display user notifications on login success or failure. |

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/lib/validators](../@/lib/validators.md) | Imports loginSchema (a Zod schema) which is used by zodResolver to validate LoginValues (email, password). |
| [@/lib/api-client](../@/lib/api-client.md) | Imports the login function which is called inside onSubmit(values) to perform the authentication request; the component assumes login returns a Promise and throws on error. |
| [@/components/ui/button](../@/components/ui/button.md) | Imports Button, used for the form submit button. The component sets disabled={isSubmitting} and shows a different label when submitting. |
| [@/components/ui/input](../@/components/ui/input.md) | Imports Input, used for the email and password fields. Inputs are wired to react-hook-form via {...register("email")} and {...register("password")}. |
| [@/components/ui/card](../@/components/ui/card.md) | Imports Card which wraps the form and headings to provide consistent layout and styling. |

## 📁 Directory

This file is part of the **components** directory. View the [directory index](_docs/src/features/auth/components/README.md) to see all files in this module.

## Architecture Notes

- Client component: The file begins with "use client" so all logic runs in the browser; it uses Next.js client-side routing hooks (useRouter, useSearchParams).
- Form validation pattern: Uses react-hook-form + zod via zodResolver(loginSchema) to provide synchronous validation and produce error messages for each field (errors.email, errors.password).
- Error handling and UX flow: onSubmit is async and wrapped in try/catch; success triggers a toast and navigation to /dashboard, failure triggers a toast and navigation to the same login route with ?failed=1 to show a persistent banner driven by search params.
- State management: No global state; local form state is handled by react-hook-form which internally manages values, touched state, validation and isSubmitting; component uses isSubmitting to disable the submit button.

## Usage Examples

### Standard login flow (valid credentials)

User fills email and password. react-hook-form validates inputs using loginSchema; if validation passes handleSubmit calls onSubmit with LoginValues { email, password }. onSubmit awaits login(values) from the internal API client; when the promise resolves, toast.success("Đăng nhập thành công") is shown and router.push('/dashboard') navigates the user to the dashboard. While awaiting the API call the Button is disabled and displays "Đang xử lý...".

### Login failure flow and demo failure

If login(values) throws, onSubmit catches the error, shows toast.error("Đăng nhập thất bại"), and does router.push('/auth/login?failed=1'). The component reads useSearchParams() and when failed=1 it renders a red error banner with the failure message. The demo-failure button triggers the same navigation without attempting login, allowing developers/testers to see the error banner.

## Maintenance Notes

- Remove or secure default credentials: defaultValues in useForm set a hard-coded email/password (admin@voicebot.vn / 123456) — this is useful for development but must be removed or gated for production.
- Tighten error handling: current catch block does not inspect error details; consider surfacing server-provided messages or handling network/timeouts separately to provide more specific feedback.
- Testing: Add unit and integration tests that cover validation failures, successful login navigation, and failure path that sets the failed query param and displays the banner.
- Accessibility: Ensure Input and Button components provide necessary aria attributes; labels are present but verify that focus, error announcements, and keyboard navigation work correctly.
- API contract: This component assumes login(values) returns a rejected promise on failure. If the API client returns error objects instead, adapt onSubmit to inspect return values and throw appropriately.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/features/auth/components/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*
