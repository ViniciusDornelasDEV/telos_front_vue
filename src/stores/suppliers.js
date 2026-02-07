import { defineStore } from 'pinia'
import http from '@/api/http'

export const useSuppliersStore = defineStore('suppliers', {
  state: () => ({
    items: [],
    loading: false
  }),

  actions: {
    async fetchSuppliers() {
      this.loading = true

      try {
        const { data } = await http.get('/suppliers')
        this.items = data.map(this.mapFromApi)
      } finally {
        this.loading = false
      }
    },
    async create(payload) {
      const { data } = await http.post('/suppliers', payload)

      this.items.push(this.mapFromApi(data))
    },
    async update(payload) {
      const { data } = await http.put(`/suppliers/${payload.id}`, payload)

      const supplier = this.mapFromApi(data)

      const index = this.items.findIndex(s => s.id === payload.id)
      if (index !== -1) {
        this.items.splice(index, 1, supplier)
      }

      return supplier
    },
    mapFromApi(apiSupplier) {
      return {
        id: apiSupplier.id,
        name: apiSupplier.name,
        cnpj: apiSupplier.cnpj,
        cep: apiSupplier.cep,
        address: apiSupplier.address,
        status: apiSupplier.status,
        sellers: apiSupplier.sellers || []
      }
    }
  }
})
