# Global Error Handling & Messaging – Analysis & Proposal

## 1. Current Implementation Analysis

### HTTP layer (`src/shared/services/http.ts`)
- **Request interceptor**: Injects Bearer token via `getToken` callback (set from auth store in `main.ts`).
- **Response interceptor**:
  - **Network error** (no `response`): `alert('Erro de conexão...')`, then `Promise.reject(error)`.
  - **401**: `alert('Sessão expirada...')`, calls `handleLogout()`, then `window.location.href = '/login'`.
  - **403**: `alert('Você não tem permissão...')`.
  - **422**: Reads first validation message from `data.errors`, `alert(firstError)`.
  - **500+**: `alert('Erro interno do servidor...')`.
- **Issues**:
  - All feedback via `alert()` (blocking, not user-friendly).
  - No centralized messaging; no way to show success/info toasts.
  - 422 only shows the first error; full `data.errors` (Laravel format) is not exposed to forms.
  - Rejected value is the raw Axios error; no normalized shape for callers (e.g. forms) to use.
  - No distinction between “show global toast” and “let form handle validation errors”.

### Messaging
- No global toast/alert system. Components use `alert()` or local state (e.g. `LoginPage` `error` ref, `SuppliersCreatePage` `cnpjError`).

### Validation (422)
- Interceptor shows one message only. Forms do not consume API validation errors; they only use client-side validation (e.g. CNPJ). So 422 is not “normalized and easily consumable in forms”.

### Unauthorized (401)
- Handled in interceptor: message, logout, redirect. Works but uses `alert()`.

### Server errors (500+)
- Single generic `alert()`.

### Architecture
- **Modular**: `auth`, `dashboard`, `suppliers`, `users`, `products`, `orders`; shared code in `shared/` (services, composables, layouts, components, store). No cross-module coupling; `http` is the shared dependency for API.
- **Stores**: Do not catch errors; they let them bubble. Some views don’t await store actions (e.g. `SuppliersCreatePage` calls `suppliersStore.create(form)` without await and then `router.push`), so the user can navigate away before seeing the result.

---

## 2. Proposed Improved Structure

### Principles
- **HTTP interceptor** handles raw API errors only: normalize → show global message → attach normalized error to rejection.
- **Normalized error format** so interceptors and callers share one shape (status, message, validation).
- **Centralized messaging**: one place (store) to push messages; one UI component to display toasts. No tight coupling between stores and UI (store holds queue; layout/App renders it).
- **422**: Normalize Laravel `errors` to `Record<string, string[]>` (or first message per field), attach to normalized error so forms can optionally consume it.
- **Backward compatible**: Still reject the same Axios error; add `error.apiError` for optional use. Existing `catch (e)` continue to work.

### Ideal flow
1. Axios response interceptor receives error.
2. Parse to **normalized API error** (status, message, validation for 422).
3. Push a **global message** (toast) for the user (except when we want form-only handling; by default we show one toast for 422 summary).
4. Attach normalized error to the Axios error: `error.apiError = normalized`.
5. `Promise.reject(error)` so callers can still catch and, if they want, use `error.apiError.validation` for field-level display.

### Components

| Component | Responsibility |
|----------|----------------|
| **Normalized API error** | Type + parser: Axios error → `{ code, status, message, validation? }`. Laravel 422 `errors` → `Record<string, string[]>`. |
| **Message store** (Pinia) | Queue of messages `{ id, type, text, duration? }`. Actions: `add`, `remove`. No UI. |
| **Toast container** | Single component (e.g. in `App.vue`) that reads message store and renders toasts (DaisyUI alert or custom). |
| **HTTP interceptor** | Build normalized error, push to message store, set `error.apiError`, reject(error). 401: same logout + redirect. |
| **Optional: useFormValidation** | Composable that takes a ref to the caught error and exposes `validation`, `getFieldError(field)` so forms can show field-level errors. |

---

## 3. Files to Create

| File | Purpose |
|------|--------|
| `src/shared/types/apiError.ts` | Types and parser: `ApiError`, `normalizeAxiosError()`, Laravel 422 → validation map. |
| `src/shared/store/messageStore.ts` | Pinia store: message queue, `addMessage()`, `removeMessage()`. |
| `src/shared/components/ToastContainer.vue` | Renders toasts from message store (fixed position, auto-dismiss). |
| `src/shared/composables/useFormValidation.ts` | Optional: `useFormValidationErrors(errorRef)` → `{ validation, getFieldError }`. |

---

## 4. Files to Modify

| File | Change |
|------|--------|
| `src/shared/services/http.ts` | Use normalized error + message store; remove all `alert()`; attach `error.apiError`; keep 401 logout + redirect. |
| `src/App.vue` | Mount `<ToastContainer />` so toasts appear in all layouts. |
| (Optional) `src/modules/suppliers/views/SuppliersCreatePage.vue` | Await `suppliersStore.create(form)`, catch error, use `useFormValidationErrors` to show field errors. |

---

## 5. No Changes Required (by design)

- **main.ts**: Pinia already global; message store is just another store.
- **Module stores**: No need to catch or show messages; interceptor + optional form handling cover it.
- **Other views**: Can gradually adopt `useFormValidationErrors` and replace local `alert()` with `useMessageStore().addMessage()` where desired.

---

## 6. Validation error shape (Laravel 422)

Laravel typically returns:
```json
{ "message": "...", "errors": { "email": ["O campo email é obrigatório."], "name": ["O campo name é obrigatório."] } }
```
We normalize to:
- `ApiError.validation`: `Record<string, string[]>` (keep arrays for multiple messages per field).
- Helper `getFieldError(field)`: return `validation[field]?.[0] ?? null` for simple inline display.

This keeps forms decoupled from HTTP; they only consume the normalized shape from the caught error.
