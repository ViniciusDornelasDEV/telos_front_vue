import { defineStore } from 'pinia'
import {
  fetchProducts,
  createProduct,
  updateProduct,
  importCsv as importCsvApi,
  fetchProductsBySupplier as fetchBySupplierApi,
  mapFromApi
} from '../services/productsService'

export const useProductsStore = defineStore('products', {
  state: () => ({
    items: [],
    loading: false,
    importing: false,
    supplierId: null
  }),

  actions: {
    async fetchProducts() {
      this.loading = true
      try {
        this.items = await fetchProducts()
      } finally {
        this.loading = false
      }
    },
    async create(payload) {
      const product = await createProduct(payload)
      this.items.push(product)
    },
    async update(payload) {
      const product = await updateProduct(payload)
      const index = this.items.findIndex(p => p.id === payload.id)
      if (index !== -1) {
        this.items.splice(index, 1, product)
      }
      return product
    },
    async importCsv({ file, supplierId }) {
      this.importing = true
      try {
        return await importCsvApi({ file, supplierId })
      } finally {
        this.importing = false
      }
    },
    async fetchBySupplier(supplierId) {
      if (!supplierId) {
        this.items = []
        this.supplierId = null
        return
      }
      if (this.supplierId === supplierId && this.items.length) {
        return
      }
      this.loading = true
      this.supplierId = supplierId
      try {
        this.items = await fetchBySupplierApi(supplierId)
      } finally {
        this.loading = false
      }
    },
    clear() {
      this.items = []
      this.supplierId = null
    },
    mapFromApi(apiProduct) {
      return mapFromApi(apiProduct)
    }
  }
})
