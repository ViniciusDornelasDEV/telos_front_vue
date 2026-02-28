import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse
} from 'axios'

type TokenGetter = () => string | null | undefined
type LogoutHandler = () => void | Promise<void>

interface MessageStore {
  error: (text: string, duration?: number) => number
  success: (text: string, duration?: number) => number
}

let getToken: TokenGetter | null = null
let handleLogout: LogoutHandler | null = null
let messageStore: MessageStore | null = null

export function setAuthTokenGetter(fn: TokenGetter) {
  getToken = fn
}

export function setLogoutHandler(fn: LogoutHandler) {
  handleLogout = fn
}

export function setMessageStore(store: MessageStore) {
  messageStore = store
}

function showToast(type: 'error' | 'success', text: string, duration = 4500) {
  if (messageStore) {
    if (type === 'error') {
      messageStore.error(text, duration)
    } else {
      messageStore.success(text, duration)
    }
  } else {
    console.warn('[http] Message store not set, falling back to alert:', text)
    alert(text)
  }
}

interface ApiErrorBody {
  success?: boolean
  error?: {
    type?: string
    message?: string
    fields?: Record<string, string[]>
  }
  errors?: Record<string, string | string[]>
}

function parseErrorMessages(data: unknown): string[] {
  const body = data as ApiErrorBody
  if (!body || typeof body !== 'object') return []

  if (body.success === false && body.error) {
    const err = body.error
    const messages: string[] = []

    if (err.fields && typeof err.fields === 'object') {
      for (const [field, msgs] of Object.entries(err.fields)) {
        const arr = Array.isArray(msgs) ? msgs : [String(msgs)]
        for (const m of arr) {
          messages.push(m ? `${field}: ${m}` : m)
        }
      }
    }

    if (messages.length > 0) return messages
    if (err.message) return [err.message]
  }

  if (body.errors && typeof body.errors === 'object') {
    const messages: string[] = []
    for (const [field, msgs] of Object.entries(body.errors)) {
      const arr = Array.isArray(msgs) ? msgs : [String(msgs)]
      for (const m of arr) {
        messages.push(m ? `${field}: ${m}` : m)
      }
    }
    if (messages.length > 0) return messages
  }

  return []
}

function getDefaultMessage(status: number): string {
  const map: Record<number, string> = {
    400: 'Requisição inválida.',
    401: 'Sessão expirada. Faça login novamente.',
    403: 'Você não tem permissão para executar esta ação.',
    404: 'Recurso não encontrado.',
    422: 'Erro de validação.',
    500: 'Erro interno do servidor. Tente novamente mais tarde.'
  }
  return map[status] ?? (status >= 500 ? map[500] : 'Ocorreu um erro.')
}

function showErrorFromResponse(status: number, data: unknown) {
  const parsed = parseErrorMessages(data)
  const text =
    parsed.length > 0
      ? parsed.length > 1
        ? '• ' + parsed.join('\n• ')
        : parsed[0]
      : getDefaultMessage(status)
  showToast('error', text)
}

const http: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
})

http.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    if (getToken) {
      const token = getToken()
      if (token) {
        config.headers = config.headers ?? {}
        ;(config.headers as Record<string, string>).Authorization =
          `Bearer ${token}`
      }
    }

    return config
  },
  (err) => Promise.reject(err)
)

http.interceptors.response.use(
  (response: AxiosResponse) => {
    const data = response.data
    if (
      data &&
      typeof data === 'object' &&
      'success' in data &&
      data.success === false &&
      'error' in data
    ) {
      const err = (data as ApiErrorBody).error
      const parsed = err?.fields
        ? Object.entries(err.fields).flatMap(([f, msgs]) =>
            (Array.isArray(msgs) ? msgs : [String(msgs)]).map(
              (m) => (m ? `${f}: ${m}` : m)
            )
          )
        : err?.message
          ? [err.message]
          : []
      const text =
        parsed.length > 0
          ? (parsed.length > 1 ? '• ' : '') + parsed.join('\n• ')
          : 'Ocorreu um erro.'
      showToast('error', text)
      return Promise.reject(
        Object.assign(new Error(text), { response, isApiError: true })
      )
    }
    if (
      data &&
      typeof data === 'object' &&
      data.success === true &&
      'data' in data
    ) {
      response.data = (data as { data: unknown }).data
    }
    const method = (response.config?.method ?? '').toLowerCase()
    const url = String(response.config?.url ?? '')
    const isMutation = ['post', 'put', 'patch'].includes(method)
    const skipToast = url.includes('/login') || url.includes('/logout') || url.includes('/ping')
    if (isMutation && !skipToast) {
      showToast('success', 'Salvo com sucesso.')
    }
    return response
  },
  (error) => {
    const response = error.response
    if (!response) {
      showToast('error', 'Erro de conexão com o servidor.')
      return Promise.reject(error)
    }

    const { status, data } = response

    if (status === 401) {
      showErrorFromResponse(status, data)
      const isLogoutRequest = String(error.config?.url || '').includes('/logout')
      if (handleLogout && !isLogoutRequest) {
        handleLogout().catch(() => {})
      }
      window.location.href = '/login'
    } else if (status === 403 || status === 404 || status >= 500) {
      showErrorFromResponse(status, data)
    } else {
      showErrorFromResponse(status, data)
    }

    return Promise.reject(error)
  }
)

export default http
