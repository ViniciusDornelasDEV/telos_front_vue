import { defineStore } from 'pinia'
import http from '@/api/http'
import { resetAllStores } from '@/stores/resetStores'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token
  },

  actions: {
    async login(email, password) {
      const { data } = await http.post('/login', {
        email,
        password
      })

      this.token = data.token
      this.user = data.user

      localStorage.setItem('token', this.token)
      localStorage.setItem('user', JSON.stringify(this.user))
    },

    async logout() {
      try {
        await http.post('/logout')
      } catch (e) {
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
        this.token = token
        this.user = JSON.parse(user)
      }
    }
  }
})
