import { defineStore } from 'pinia'
import { loginRequest, logoutRequest } from '../services/authService'
import { resetAllStores } from '@/shared/store/resetStores'

interface AuthUser {
  id?: number
  name?: string
  email?: string
  type?: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as AuthUser | null,
    token: null as string | null
  }),

  getters: {
    isAuthenticated: (state): boolean => !!state.token
  },

  actions: {
    async login(email: string, password: string) {
      const { data } = await loginRequest(email, password)

      this.token = data.token
      this.user = data.user

      localStorage.setItem('token', this.token)
      localStorage.setItem('user', JSON.stringify(this.user))
    },

    async logout() {
      try {
        await logoutRequest()
      } catch {
        // se falhar, seguimos limpando local
      }

      this.token = null
      this.user = null
      resetAllStores()
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },

    loadFromStorage() {
      const token = localStorage.getItem('token')
      const user = localStorage.getItem('user')

      if (token && user) {
        try {
          this.token = token
          this.user = JSON.parse(user)
        } catch {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
        }
      }
    }
  }
})
