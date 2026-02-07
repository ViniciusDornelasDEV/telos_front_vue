import { defineStore } from 'pinia'
import http from '@/api/http'
import { useProductsStore } from './products'

export const useOrdersStore = defineStore('orders', {
  state: () => ({
    items: [],
    loading: false
  }),
  actions: {
    async fetchOrders() {
      this.loading = true

      try {
        const { data } = await http.get('/orders')
        this.items = data.map(this.mapFromApi)
      } finally {
        this.loading = false
      }
    },
    async create(payload) {
      await http.post('/orders', {
        date: payload.date,
        supplier: { id: payload.supplierId },
        products: payload.products.map(p => ({
          id: p.productId,
          unitPrice: p.unitPrice,
          quantity: p.quantity
        })),
        observation: payload.observation,
      })

      await this.fetchOrders()
    },

    async update(payload) {
      const { data } = await http.put(`/orders/${payload.id}`, {
        date: payload.date,
        observation: payload.observation,
        status: payload.status,
        products: payload.products.map(p => ({
          id: p.id,
          unitPrice: p.unitPrice,
          quantity: p.quantity
        }))
      })

      const order = this.mapFromApi(data)

      const index = this.items.findIndex(o => o.id === payload.id)
      if (index !== -1) {
        this.items.splice(index, 1, order)
      }

      return order
    },

    fetchById(id) {
      return this.items.find(o => o.id === Number(id)) || null
    },

    getProductsBySupplier(supplierId) {
      const productsStore = useProductsStore()
      return productsStore.items.filter(
        p => p.supplierId === supplierId
      )
    },

    mapFromApi(apiOrder) {
      return {
        id: apiOrder.id,
        date: apiOrder.date,

        supplier: apiOrder.supplier
          ? {
              id: apiOrder.supplier.id,
              name: apiOrder.supplier.name
            }
          : null,

        items: Array.isArray(apiOrder.items)
          ? apiOrder.items.map(i => ({
              productId: i.product_id,
              unitPrice: Number(
                String(i.unit_price).replace(',', '.')
              ),
              quantity: i.quantity,
              total: Number(
                String(i.total).replace(',', '.')
              )
            }))
          : [],

        observation: apiOrder.observation,
        status: apiOrder.status,
        total: Number(apiOrder.total)
      }
    }


  }
})
