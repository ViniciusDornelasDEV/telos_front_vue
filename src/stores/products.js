import { defineStore } from 'pinia'
import http from '@/api/http'

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
        const { data } = await http.get('/products')
        this.items = data.map(this.mapFromApi)
      } finally {
        this.loading = false
      }
    },
    async create(payload) {
      const { data } = await http.post('/products', {
        supplier_id: payload.supplierId,
        reference: payload.reference,
        name: payload.name,
        color: payload.color,
        price: payload.price,
        status: payload.status
      })

      this.items.push(this.mapFromApi(data))
    },
    async update(payload) {
      const { data } = await http.put(`/products/${payload.id}`, {
        supplier_id: payload.supplierId,
        reference: payload.reference,
        name: payload.name,
        color: payload.color,
        price: payload.price,
        status: payload.status
      })

      const product = this.mapFromApi(data)

      const index = this.items.findIndex(p => p.id === payload.id)
      if (index !== -1) {
        this.items.splice(index, 1, product)
      }

      return product
    },
    async importCsv({ file, supplierId }) {
      this.importing = true

      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('supplier_id', supplierId)

        const { data } = await http.post(
          '/products/import',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        )

        return data
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
        const { data } = await http.get(
          `/suppliers/${supplierId}/products`
        )

        this.items = data.map(this.mapFromApi)
      } finally {
        this.loading = false
      }
    },
    clear() {
      this.items = []
      this.supplierId = null
    },

    mapFromApi(apiProduct) {
      const normalizeStatus = status => {
        if (status === 'Ativo' || status === 'active') return 'active'
        if (status === 'Inativo' || status === 'inactive') return 'inactive'
        return status
      }

      return {
        id: apiProduct.id,
        supplierId: apiProduct.supplier_id,
        reference: apiProduct.reference,
        name: apiProduct.name,
        color: apiProduct.color,
        price: Number(apiProduct.price),
        status: Boolean(apiProduct.status)
      }
    }
  }
})

