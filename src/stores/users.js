import { defineStore } from 'pinia'

export const useUsersStore = defineStore('users', {
  state: () => ({
    items: [],
    loading: false
  }),

  actions: {
    async fetchUsers() {
      this.loading = true
      this.items = []
      await new Promise(resolve => setTimeout(resolve, 500))
      this.items = [
        { id: 1, name: 'Admin', email: 'admin@teste.com', status: 'active', type: 'admin' }
      ]
      this.loading = false
    },

    create(data) {
      this.items.push({
        id: Date.now(),
        name: data.name,
        email: data.email,
        password: data.password,
        status: data.status,
        type: data.type
      })
    },

    update(data) {
      const index = this.items.findIndex(u => u.id === data.id)
      if (index !== -1) this.items[index] = { ...data }
    },

    remove(id) {
      this.items = this.items.filter(u => u.id !== id)
    }
  }
})
