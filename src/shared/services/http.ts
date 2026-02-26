import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'

type TokenGetter = () => string | null | undefined
type LogoutHandler = () => void | Promise<void>

let getToken: TokenGetter | null = null
let handleLogout: LogoutHandler | null = null

export function setAuthTokenGetter(fn: TokenGetter) {
  getToken = fn
}

export function setLogoutHandler(fn: LogoutHandler) {
  handleLogout = fn
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
        ;(config.headers as Record<string, string>).Authorization = `Bearer ${token}`
      }
    }

    return config
  },
  (error) => Promise.reject(error)
)

http.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const response = error.response
    if (!response) {
      alert('Erro de conexão com o servidor.')
      return Promise.reject(error)
    }

    const { status, data } = response

    if (status === 401) {
      alert('Sessão expirada. Faça login novamente.')
      const isLogoutRequest = String(error.config?.url || '').includes('/logout')
      if (handleLogout && !isLogoutRequest) {
        handleLogout().catch(() => { /* clear state only; redirect below */ })
      }
      window.location.href = '/login'
    }

    if (status === 403) {
      alert('Você não tem permissão para executar esta ação.')
    }

    if (status === 422 && data?.errors) {
      const firstError = Object.values(data.errors)?.[0]?.[0]
      alert((firstError as string) || 'Erro de validação.')
    }

    if (status >= 500) {
      alert('Erro interno do servidor. Tente novamente mais tarde.')
    }

    return Promise.reject(error)
  }
)

export default http

