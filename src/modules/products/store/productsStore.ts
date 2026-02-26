import { defineStore } from 'pinia'
import {
  fetchProducts,
  createProduct,
  updateProduct,
  importCsv as importCsvApi,
  fetchProductsBySupplier as fetchBySupplierApi,
  mapFromApi,
  type Product
} from '../services/productsService'

interface ApiProduct {
  id: number
  supplier_id: number
  reference: string
  name: string
  color: string
  price: number | string
  status: boolean
}

export const useProductsStore = defineStore('products', {
  state: () => ({
    items: [] as Product[],
    loading: false,
    importing: false,
    supplierId: null as number | string | null
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
    async create(payload: Partial<Product>) {
      const product = await createProduct(payload)
      this.items.push(product)
    },
    async update(payload: Product) {
      const product = await updateProduct(payload)
      const index = this.items.findIndex((p) => p.id === payload.id)
      if (index !== -1) {
        this.items.splice(index, 1, product)
      }
      return product
    },
    async importCsv(p: { file: File; supplierId: string | number }) {
      this.importing = true
      try {
        return await importCsvApi(p)
      } finally {
        this.importing = false
      }
    },
    async fetchBySupplier(supplierId: number | string | null) {
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
    mapFromApi(apiProduct: ApiProduct) {
      return mapFromApi(apiProduct)
    }
  }
})
