import { defineStore } from 'pinia'

export const useProductsStore = defineStore('products', {
  state: () => ({
    items: [],
    loading: false
  }),

  actions: {
    async fetchProducts() {
      this.loading = true
      this.items = []
      await new Promise(resolve => setTimeout(resolve, 500))

      this.items = [
        {
          id: 1,
          supplierId: 1,
          reference: 'REF-001',
          name: 'Produto Alpha',
          color: 'Azul',
          price: 'R$ 199,99'
        }
      ]

      this.loading = false
    },

    create(data) {
      this.items.push({
        id: Date.now(),
        ...data
      })
    },

    update(data) {
      const index = this.items.findIndex(p => p.id === data.id)
      if (index !== -1) {
        this.items[index] = { ...data }
      }
    },

    remove(id) {
      this.items = this.items.filter(p => p.id !== id)
    }
  }
})
