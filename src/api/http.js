import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
})

// 🔐 Interceptor de request (Bearer Token)
http.interceptors.request.use(
  (config) => {
    const auth = useAuthStore()

    if (auth.token) {
      config.headers.Authorization = `Bearer ${auth.token}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

http.interceptors.response.use(
  (response) => response,

  (error) => {
    const response = error.response
    if (!response) {
      alert('Erro de conexão com o servidor.')
      return Promise.reject(error)
    }
    const { status, data } = response
    if (status === 401) {
      alert('Sessão expirada. Faça login novamente.')
      const auth = useAuthStore()
      auth.logout?.()
      window.location.href = '/login'
    }
    if (status === 403) {
      alert('Você não tem permissão para executar esta ação.')
    }
    if (status === 422 && data?.errors) {
      const firstError = Object.values(data.errors)?.[0]?.[0]
      alert(firstError || 'Erro de validação.')
    }
    if (status >= 500) {
      alert('Erro interno do servidor. Tente novamente mais tarde.')
    }

    return Promise.reject(error)
  }
)

export default http
