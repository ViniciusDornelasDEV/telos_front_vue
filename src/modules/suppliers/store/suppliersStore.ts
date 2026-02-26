import { defineStore } from 'pinia'
import {
  fetchSuppliers,
  createSupplier,
  updateSupplier,
  mapFromApi,
  type Supplier
} from '../services/suppliersService'

interface ApiSupplier {
  id: number
  name: string
  cnpj: string
  cep: string
  address: string
  status: boolean
  sellers?: number[]
}

export const useSuppliersStore = defineStore('suppliers', {
  state: () => ({
    items: [] as Supplier[],
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
    async create(payload: Partial<Supplier>) {
      const supplier = await createSupplier(payload)
      this.items.push(supplier)
    },
    async update(payload: Supplier) {
      const supplier = await updateSupplier(payload)
      const index = this.items.findIndex((s) => s.id === payload.id)
      if (index !== -1) {
        this.items.splice(index, 1, supplier)
      }
      return supplier
    },
    mapFromApi(apiSupplier: ApiSupplier) {
      return mapFromApi(apiSupplier)
    }
  }
})
