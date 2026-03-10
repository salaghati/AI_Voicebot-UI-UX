<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/app/auth/forgot-password/page.tsx",
  "source_hash": "ba115cdca31909ea16f174c0bbe00fb4c4bbc575f0afb105307f649f0865ea98",
  "last_updated": "2026-03-10T04:09:29.662534+00:00",
  "git_sha": "d7a5c59b5a639b48f264f3b7e52ee15294d81721",
  "tokens_used": 6919,
  "complexity_score": 3,
  "estimated_review_time_minutes": 10,
  "external_dependencies": [
    "next/link",
    "react-hook-form",
    "@hookform/resolvers/zod",
    "sonner"
  ]
}
```

</details>

[Documentation Home](../../../../README.md) > [src](../../../README.md) > [app](../../README.md) > [auth](../README.md) > [forgot-password](./README.md) > **page.mdx**

---

# page.tsx

> **File:** `src/app/auth/forgot-password/page.tsx`

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

This file exports a default React client component ForgotPasswordPage which implements a single-page "Forgot password" flow. It is marked with the "use client" directive so it runs entirely on the browser. The component uses react-hook-form with zodResolver and a project Zod schema (forgotPasswordSchema) to validate an email input (type ForgotValues = { email: string }). The form exposes register, handleSubmit, formState.errors and formState.isSubmitting; submission is handled by an async onSubmit function which calls the internal forgotPassword API helper and shows success/error messages using sonner's toast API (messages are in Vietnamese: "Đã gửi OTP qua email" on success and "Không thể gửi OTP" on failure). The form UI is built from internal shared UI components (Card, Input, Button) and uses next/link for navigation back to the login page.

## Dependencies

### External Dependencies

| Module | Usage |
| --- | --- |
| `next/link` | Uses the Link component to render a client-side navigation link back to the login page: <Link href="/auth/login">Quay lại đăng nhập</Link>. This is part of Next.js and enables SPA-style navigation. |
| `react-hook-form` | Imports useForm to manage form state. The code calls useForm<ForgotValues>({ resolver: zodResolver(forgotPasswordSchema), defaultValues: { email: "" } }) and uses returned register, handleSubmit, and formState (errors, isSubmitting) for validation, submission and disabling the submit button while the async request runs. |
| `@hookform/resolvers/zod` | Imports zodResolver and passes it to useForm as the resolver to integrate Zod validation (forgotPasswordSchema) with react-hook-form. This wires schema-based validation into the form's errors and submit flow. |
| `sonner` | Imports toast from sonner and uses toast.success(...) and toast.error(...) inside the onSubmit try/catch to notify the user about success/failure of the OTP request. Sonner is an external toast/notification library. |

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/lib/validators](../@/lib/validators.md) | Imports forgotPasswordSchema (a Zod schema) which is passed to zodResolver to validate the email field. This is an internal project module (path alias '@/lib/validators'). |
| [@/lib/api-client](../@/lib/api-client.md) | Imports the forgotPassword function which is called inside onSubmit: await forgotPassword(values). This is the internal API client helper that performs the network call to request an OTP for the provided email; the file itself does not implement the network call, it delegates to this module. |
| [@/components/ui/card](../@/components/ui/card.md) | Imports Card, used to wrap the form UI and apply consistent layout/styling: <Card className="..."> ... </Card>. This is an internal presentational component used for layout/visual consistency. |
| [@/components/ui/input](../@/components/ui/input.md) | Imports Input, used for the email field. The component is wired to react-hook-form via {...register("email")} and uses placeholder and styling props. This is an internal UI primitive. |
| [@/components/ui/button](../@/components/ui/button.md) | Imports Button, used for the submit button. It receives disabled={isSubmitting}, className and type="submit". The button label switches between "Đang gửi..." and "Gửi OTP" depending on isSubmitting. |

## 📁 Directory

This file is part of the **forgot-password** directory. View the [directory index](_docs/src/app/auth/forgot-password/README.md) to see all files in this module.

## Architecture Notes

- This file is a client-only React component (top-level "use client" directive) intended for browser execution — no server-side rendering or server handlers are implemented here.
- Form state and validation use react-hook-form + Zod via @hookform/resolvers/zod. Validation is schema-driven: forgotPasswordSchema is supplied as the resolver so validation errors surface through formState.errors and are rendered under the input.
- Submission flow is asynchronous and uses async/await with a try/catch: onSubmit calls the internal forgotPassword API helper. The component uses isSubmitting (from react-hook-form) to disable the submit button and show a loading label, avoiding duplicate submits.
- User feedback is provided with sonner toast calls inside the try/catch: toast.success on success and toast.error on failure. The code currently treats any thrown error as a generic failure and displays a single fallback message.
- UI composition relies on internal reusable components (Card, Input, Button) and Next.js Link for navigation. Styling is applied via Tailwind classes embedded on elements and components.

## Usage Examples

### User requests an OTP to reset password

User navigates to the /auth/forgot-password route rendered by this component. They enter their login email into the Input (registered via {...register('email')}). When the user submits the form, react-hook-form runs Zod validation (forgotPasswordSchema). If validation passes, handleSubmit calls onSubmit with values of type ForgotValues ({ email: string }). onSubmit awaits forgotPassword(values) (internal API client). If the promise resolves, toast.success('Đã gửi OTP qua email') is shown; if the promise rejects, toast.error('Không thể gửi OTP') is shown. During the pending network request, isSubmitting is true and the submit Button is disabled and shows "Đang gửi...".

## Maintenance Notes

- Error handling is generic: the catch block shows a single fallback toast message. To improve UX, surface server error details (when safe) or map known error codes to localized messages.
- Unit/integration tests should mock the forgotPassword API and assert the toast behavior and isSubmitting state changes. Also test validation edge cases from forgotPasswordSchema (empty email, invalid format).
- Accessibility: ensure the Input component exposes aria-invalid and aria-describedby when errors.email is present. The label is present, but screen-reader associations depend on the Input implementation.
- Rate limiting and brute-force protection: the component does not throttle requests; backend should enforce rate limits for OTP requests. Consider client-side debounce or exhaustion UI states for improved UX.
- Keep dependencies up to date (react-hook-form, @hookform/resolvers, sonner). If the project updates Next.js routing, verify Link usage remains compatible.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/app/auth/forgot-password/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*
