import { defineStore } from 'pinia'
import {
  fetchOrders as fetchOrdersApi,
  createOrder,
  updateOrder,
  mapFromApi,
  type Order
} from '../services/ordersService'

interface CreateOrderPayload {
  date: string
  supplierId: number | string
  products: { productId: number; unitPrice: number; quantity: number }[]
  observation?: string
}

interface UpdateOrderPayload {
  id: number
  date: string
  observation?: string
  status: string
  products: { id?: number; unitPrice: number; quantity: number }[]
}

interface ApiOrder {
  id: number
  date: string
  supplier?: { id: number; name: string }
  items?: { product_id: number; unit_price: number | string; quantity: number; total?: number | string }[]
  observation?: string
  status: string
  total: number | string
}

export const useOrdersStore = defineStore('orders', {
  state: () => ({
    items: [] as Order[],
    loading: false
  }),

  actions: {
    async fetchOrders() {
      this.loading = true
      try {
        this.items = await fetchOrdersApi()
      } finally {
        this.loading = false
      }
    },
    async create(payload: CreateOrderPayload) {
      await createOrder(payload)
      await this.fetchOrders()
    },
    async update(payload: UpdateOrderPayload) {
      const order = await updateOrder(payload)
      const index = this.items.findIndex((o) => o.id === payload.id)
      if (index !== -1) {
        this.items.splice(index, 1, order)
      }
      return order
    },
    fetchById(id: string | number) {
      return this.items.find((o) => o.id === Number(id)) || null
    },
    mapFromApi(apiOrder: ApiOrder) {
      return mapFromApi(apiOrder)
    }
  }
})
