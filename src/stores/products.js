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
          name: 'Produto Alpha 1',
          color: 'Azul',
          price: 199.99
        },
        {
          id: 2,
          supplierId: 1,
          reference: 'REF-002',
          name: 'Produto Alpha 2',
          color: 'Branco',
          price: 25.00
        },
        {
          id: 3,
          supplierId: 1,
          reference: 'REF-003',
          name: 'Produto Alpha 3',
          color: 'Preto',
          price: 50.00
        },
        {
          id: 4,
          supplierId: 2,
          reference: 'REF-021',
          name: 'Produto Beta 1',
          color: 'Rosa',
          price: 73.25
        },{
          id: 5,
          supplierId: 2,
          reference: 'REF-022',
          name: 'Produto Beta 2',
          color: 'Verde',
          price: 88.99
        },

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
    },

    async uploadCsv(formData) {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        return { success: true, message: 'Upload simulado com sucesso!' }
      } catch (error) {
        console.error(error)
        throw error
      }
    }

  }
})
