import { defineStore } from 'pinia'
import http from '@/api/http'

export const useUsersStore = defineStore('users', {
  state: () => ({
    items: [],
    loading: false
  }),

  actions: {
    async fetchUsers() {
      this.loading = true

      try {
        const { data } = await http.get('/users')
        this.items = data.map(this.mapFromApi)
      } finally {
        this.loading = false
      }
    },

    async create(payload) {
      const { data } = await http.post('/users', {
        name: payload.name,
        email: payload.email,
        password: payload.password,
        type: payload.type,
        status: payload.status
      })

      this.items.push(this.mapFromApi(data))
    },

    async update(payload) {
      const { data } = await http.put(`/users/${payload.id}`, {
        name: payload.name,
        email: payload.email,
        password: payload.password || '',
        type: payload.type,
        status: payload.status
      })

      const user = this.mapFromApi(data)

      const index = this.items.findIndex(u => u.id === payload.id)
      if (index !== -1) {
        this.items.splice(index, 1, user)
      }

      return user
    },

    async deactivate(user) {
      return this.update({
        ...user,
        status: 'inactive',
        password: ''
      })
    },

    mapFromApi(apiUser) {
      const normalizeStatus = status => {
      if (status === 'Ativo' || status === 'active') return 'active'
      if (status === 'Inativo' || status === 'inactive') return 'inactive'
        return status
      }

      return {
        id: apiUser.id,
        name: apiUser.name,
        email: apiUser.email,
        status: normalizeStatus(apiUser.status),
        type: apiUser.type
      }
    }
  }
})
