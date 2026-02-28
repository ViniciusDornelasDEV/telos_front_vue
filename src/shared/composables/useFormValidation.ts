import { computed, type Ref } from 'vue'
import { hasApiError } from '@/shared/types/apiError'

/**
 * Consume validation errors from a caught Axios error (with apiError attached by the HTTP interceptor).
 * Use in forms that await API calls and want to show field-level validation messages.
 *
 * @param errorRef - Ref to the error (e.g. from catch). Can be null/undefined.
 * @returns validation map and getFieldError(field) helper.
 */
export function useFormValidationErrors(errorRef: Ref<unknown>) {
  const validation = computed(() => {
    if (!hasApiError(errorRef.value)) return undefined
    return (errorRef.value as { apiError: { validation?: Record<string, string[]> } }).apiError.validation
  })

  function getFieldError(field: string): string | null {
    const v = validation.value
    if (!v || !v[field]) return null
    const messages = v[field]
    return Array.isArray(messages) ? messages[0] ?? null : null
  }

  return { validation, getFieldError }
}
