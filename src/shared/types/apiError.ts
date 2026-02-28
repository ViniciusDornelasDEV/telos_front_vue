import type { AxiosError } from 'axios'

/**
 * Normalized API error shape for consistent handling across the app.
 * Attached to Axios errors as `error.apiError` by the HTTP interceptor.
 */
export interface ApiError {
  code: string
  status: number
  message: string
  /** Laravel 422: field name -> list of messages */
  validation?: Record<string, string[]>
}

/** Laravel-style validation errors from response data */
function normalizeValidationErrors(
  data: unknown
): Record<string, string[]> | undefined {
  if (!data || typeof data !== 'object' || !('errors' in data)) return undefined
  const raw = (data as { errors?: Record<string, string | string[]> }).errors
  if (!raw || typeof raw !== 'object') return undefined

  const out: Record<string, string[]> = {}
  for (const [field, messages] of Object.entries(raw)) {
    out[field] = Array.isArray(messages) ? messages : [String(messages)]
  }
  return Object.keys(out).length ? out : undefined
}

function firstValidationMessage(validation: Record<string, string[]>): string {
  const first = Object.values(validation)[0]?.[0]
  return first ?? 'Erro de validação.'
}

const DEFAULT_MESSAGES: Record<number, string> = {
  400: 'Requisição inválida.',
  401: 'Sessão expirada. Faça login novamente.',
  403: 'Você não tem permissão para executar esta ação.',
  404: 'Recurso não encontrado.',
  422: 'Erro de validação.',
  500: 'Erro interno do servidor. Tente novamente mais tarde.'
}

/**
 * Build a normalized ApiError from an Axios error.
 * Use in the HTTP interceptor and optionally in callers.
 */
export function normalizeAxiosError(error: AxiosError<unknown>): ApiError {
  const response = error.response
  const status = response?.status ?? 0
  const data = response?.data as unknown

  const validation = normalizeValidationErrors(data)
  const defaultMessage =
    status >= 500
      ? DEFAULT_MESSAGES[500]
      : DEFAULT_MESSAGES[status] ?? 'Ocorreu um erro.'

  let message: string
  if (typeof data === 'object' && data !== null && 'message' in data) {
    message = String((data as { message: unknown }).message)
  } else if (status === 422 && validation) {
    message = firstValidationMessage(validation)
  } else {
    message = defaultMessage
  }

  const code =
    typeof data === 'object' && data !== null && 'code' in data
      ? String((data as { code: unknown }).code)
      : `HTTP_${status}`

  return {
    code,
    status,
    message,
    ...(validation && { validation })
  }
}

/**
 * Type guard: error has apiError attached (by our interceptor).
 */
export function hasApiError(
  error: unknown
): error is AxiosError<unknown> & { apiError: ApiError } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'apiError' in error &&
    typeof (error as { apiError: unknown }).apiError === 'object'
  )
}
