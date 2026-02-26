import { defineStore } from 'pinia'
import {
  fetchUsers,
  createUser,
  updateUser,
  mapFromApi,
  type User
} from '../services/usersService'

interface ApiUser {
  id: number
  name: string
  email: string
  status: boolean
  type: string
}

export const useUsersStore = defineStore('users', {
  state: () => ({
    items: [] as User[],
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
    async create(payload: Partial<User> & { password: string }) {
      const user = await createUser(payload)
      this.items.push(user)
    },
    async update(payload: User & { password?: string }) {
      const user = await updateUser(payload)
      const index = this.items.findIndex((u) => u.id === payload.id)
      if (index !== -1) {
        this.items.splice(index, 1, user)
      }
      return user
    },
    mapFromApi(apiUser: ApiUser) {
      return mapFromApi(apiUser)
    }
  }
})
