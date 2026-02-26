import { defineStore } from 'pinia'
import {
  fetchSuppliers,
  createSupplier,
  updateSupplier,
  mapFromApi
} from '../services/suppliersService'

export const useSuppliersStore = defineStore('suppliers', {
  state: () => ({
    items: [],
    loading: false
  }),

  actions: {
    async fetchSuppliers(activeOnly = false) {
      this.loading = true
      try {
        this.items = await fetchSuppliers(activeOnly)
      } finally {
        this.loading = false
      }
    },
    async create(payload) {
      const supplier = await createSupplier(payload)
      this.items.push(supplier)
    },
    async update(payload) {
      const supplier = await updateSupplier(payload)
      const index = this.items.findIndex(s => s.id === payload.id)
      if (index !== -1) {
        this.items.splice(index, 1, supplier)
      }
      return supplier
    },
    mapFromApi(apiSupplier) {
      return mapFromApi(apiSupplier)
    }
  }
})
