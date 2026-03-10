<details>
<summary>Documentation Metadata (click to expand)</summary>

```json
{
  "doc_type": "file_overview",
  "file_path": "src/app/(console)/settings/api/page.tsx",
  "source_hash": "8e134936b764dc8168a08f897d660ce6ddc21c93119ba1159930bb94ca618dc2",
  "last_updated": "2026-03-10T04:01:13.914468+00:00",
  "git_sha": "dd168bebe22256ee41c6c268e43fe824f525f0c3",
  "tokens_used": 5755,
  "complexity_score": 3,
  "estimated_review_time_minutes": 15,
  "external_dependencies": [
    "react",
    "react-hook-form",
    "@tanstack/react-query",
    "lucide-react",
    "sonner"
  ]
}
```

</details>

[Documentation Home](../../../../../README.md) > [src](../../../../README.md) > [app](../../../README.md) > [(console)](../../README.md) > [settings](../README.md) > [api](./README.md) > **page.mdx**

---

# page.tsx

> **File:** `src/app/(console)/settings/api/page.tsx`

![Complexity: Low](https://img.shields.io/badge/Complexity-Low-green) ![Review Time: 15min](https://img.shields.io/badge/Review_Time-15min-blue)

## 📑 Table of Contents


- [Overview](#overview)
- [Dependencies](#dependencies)
- [Architecture Notes](#architecture-notes)
- [Usage Examples](#usage-examples)
- [Maintenance Notes](#maintenance-notes)
- [Functions and Classes](#functions-and-classes)

---

## Overview

This file exports a default React functional component SettingsApiPage which is a client-side page ("use client"). It displays a static list of endpointRows, two sample Data Mapping templates (request and response templates), and an actions area that opens a modal to add a new API endpoint. The modal contains a form managed with react-hook-form (defaultValues include apiName, method, url, authType, token, timeout, headerKey, headerValue) and uses @tanstack/react-query's useMutation to submit the form via the updateApiSettings function imported from the internal module @/lib/api-client. Successful submits trigger a sonner toast, reset the form, and close the modal; failures trigger an error toast. The UI is composed of project-specific UI primitives (Card, Input, Select, Button, Table and related table parts) and icons from lucide-react.

The component's responsibilities are: presenting current endpoints (endpointRows constant), collecting new API configuration via a modal form, and performing an async save via the mutation. Key implementation details developers need to know: form.register(...) wires inputs into react-hook-form, the mutation object config uses mutationFn: updateApiSettings and handlers onSuccess/onError to drive UI feedback and form state; mutation.isPending is used to disable the submit button and show a loading label. The Test connection button currently triggers a mocked success toast only (no network check). The modal is controlled by local state openModal (useState). The file does not itself perform network logic — it delegates persistence to updateApiSettings (internal).

## Dependencies

### External Dependencies

| Module | Usage |
| --- | --- |
| `react` | Imports useState from "react" to control local component state (openModal) for modal visibility. is_external: true |
| `react-hook-form` | Imports useForm to manage form state and registration for inputs. The code calls useForm({ defaultValues: { apiName, method, url, authType, token, timeout, headerKey, headerValue } }) and uses form.register on inputs. is_external: true |
| `@tanstack/react-query` | Imports useMutation to perform the async save operation. useMutation is configured with mutationFn: updateApiSettings and onSuccess/onError handlers to show toasts and reset/close the form. is_external: true |
| `lucide-react` | Imports Plus and X icons used in the Add API button and modal close button respectively. is_external: true |
| `sonner` | Imports toast to show user feedback: toast.success on successful save or mocked connection test, and toast.error on mutation failure. is_external: true |

### Internal Dependencies

| Module | Usage |
| --- | --- |
| [@/lib/api-client](../@/lib/api-client.md) | Imports updateApiSettings (internal API client function). This function is passed as mutationFn to useMutation and receives the form values when the form is submitted: form.handleSubmit((values) => mutation.mutate(values)). is_external: false |
| [@/features/settings](../@/features/settings.md) | Imports SettingsShell which wraps the page content and provides title, description, section, and actions props (used to place the Add API button and overall layout). is_external: false |
| [@/components/ui/card](../@/components/ui/card.md) | Imports Card used as a container for the endpoints list, data mapping blocks, and the modal dialog content. is_external: false |
| [@/components/ui/input](../@/components/ui/input.md) | Imports Input which is used for text, password and numeric fields inside the modal form (apiName, url, token, timeout, headerKey, headerValue). Registered via form.register. is_external: false |
| [@/components/ui/select](../@/components/ui/select.md) | Imports Select used for the method and authType fields in the form (options: GET/POST/PUT/DELETE and Bearer Token/API Key/Basic Auth). Registered via form.register. is_external: false |
| [@/components/ui/button](../@/components/ui/button.md) | Imports Button used for page actions (Add API), modal actions (Test connection, Cancel, Save) and displays different variants and disabled state controlled by mutation.isPending. is_external: false |
| [@/components/ui/table](../@/components/ui/table.md) | Imports Table, TBody, TD, TH, THead used to present the endpointRows table: columns TÊN API, METHOD, TIMEOUT, TRẠNG THÁI and rows rendered from the endpointRows constant. is_external: false |

## 📁 Directory

This file is part of the **api** directory. View the [directory index](_docs/src/app/(console)/settings/api/README.md) to see all files in this module.

## Architecture Notes

- Implements a single React functional component (default export SettingsApiPage) as a client component ("use client")—stateful UI with local useState and form state managed by react-hook-form.
- Uses the mutation pattern from @tanstack/react-query to perform side-effectful saves: useMutation({ mutationFn: updateApiSettings, onSuccess: ..., onError: ... }). Success handler resets form and closes modal; error handler surfaces a toast.
- UI composition relies on internal design-system primitives (Card, Input, Select, Button, Table). The file delegates network/persistence to the imported updateApiSettings function rather than implementing API calls inline.
- Error handling is minimal: mutation onError triggers toast.error. There is no client-side form validation rules declared here (react-hook-form is used but no validation schema or register options are provided).

## Usage Examples

### Add a new API endpoint via the modal form

User clicks the "Thêm API" button (renders Plus icon). That sets openModal = true via useState, showing the modal Card. The form is managed by useForm(defaultValues). The user fills fields (apiName, method, url, authType, token, timeout, headerKey, headerValue); inputs are wired with form.register. On Save (form submit) form.handleSubmit calls mutation.mutate(values) where updateApiSettings receives the values. If the mutation resolves, onSuccess displays toast.success("Lưu API thành công"), closes the modal (setOpenModal(false)), and resets the form (form.reset()). If the mutation rejects, onError displays toast.error("Không thể lưu API"). The Save button is disabled and shows "Đang lưu..." while mutation.isPending is true.

## Maintenance Notes

- Form validation: react-hook-form is used but no validators are provided in register/defaultValues. Add register validation rules or a schema (e.g., required, pattern for URL) to prevent invalid data from being submitted.
- Secret handling: token is placed in a password input but the component stores it in react-hook-form state and will be passed to updateApiSettings; ensure updateApiSettings and backend store/transmit secrets securely (use HTTPS, avoid logging).
- Test connection button is a mock (toast.success only). Consider implementing a real lightweight connectivity check (e.g., HEAD/OPTIONS or ping endpoint) before saving to surface misconfigurations.
- Performance: endpointRows is a static in-file constant; if the real list comes from a server, replace with a query and handle loading/error states. Currently there is no loading indicator for the table.
- Testing: component should be covered by unit tests that mock updateApiSettings and verify onSuccess/onError behaviors (toasts, modal close, form reset) and that mutation.isPending disables the submit button.

---

## Navigation

**↑ Parent Directory:** [Go up](_docs/src/app/(console)/settings/api/README.md)

---

*This documentation was automatically generated by AI ([Woden DocBot](https://github.com/marketplace/ai-document-creator)) and may contain errors. It is the responsibility of the user to validate the accuracy and completeness of this documentation.*
