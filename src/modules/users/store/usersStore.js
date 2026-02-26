import { defineStore } from 'pinia'
import {
  fetchUsers,
  createUser,
  updateUser,
  mapFromApi
} from '../services/usersService'

export const useUsersStore = defineStore('users', {
  state: () => ({
    items: [],
    loading: false
  }),

  actions: {
    async fetchUsers() {
      this.loading = true
      try {
        this.items = await fetchUsers()
      } finally {
        this.loading = false
      }
    },
    async create(payload) {
      const user = await createUser(payload)
      this.items.push(user)
    },
    async update(payload) {
      const user = await updateUser(payload)
      const index = this.items.findIndex(u => u.id === payload.id)
      if (index !== -1) {
        this.items.splice(index, 1, user)
      }
      return user
    },
    mapFromApi(apiUser) {
      return mapFromApi(apiUser)
    }
  }
})
