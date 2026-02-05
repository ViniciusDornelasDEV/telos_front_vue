import { defineStore } from 'pinia'

export const useSuppliersStore = defineStore('suppliers', {
  state: () => ({
    items: [],
    loading: false
  }),

  actions: {
    async fetchSuppliers() {
        this.loading = true
        this.items = []
        await new Promise(resolve => setTimeout(resolve, 1000))

        this.items = [
        {
            id: 1,
            name: 'Fornecedor Alpha',
            cnpj: '76.060.377/0001-06',
            cep: '01001-000',
            address: 'Praça da Sé - São Paulo/SP',
            status: 'active',
            sellers: [2, 3]
        }
        ]

        this.loading = false
    },

    create(data) {
    this.items.push({
        id: Date.now(),
        name: data.name,
        cnpj: data.cnpj,
        cep: data.cep,
        address: data.address,
        status: data.status
    })
    },

    update(data) {
      const index = this.items.findIndex(s => s.id === data.id)
      if (index !== -1) {
        this.items[index] = { ...data }
      }
    },

    remove(id) {
      this.items = this.items.filter(s => s.id !== id)
    }
  }
})
