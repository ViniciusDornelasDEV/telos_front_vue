import { defineStore } from 'pinia'
import {
  fetchOrders as fetchOrdersApi,
  createOrder,
  updateOrder,
  mapFromApi
} from '../services/ordersService'

export const useOrdersStore = defineStore('orders', {
  state: () => ({
    items: [],
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
    async create(payload) {
      await createOrder(payload)
      await this.fetchOrders()
    },
    async update(payload) {
      const order = await updateOrder(payload)
      const index = this.items.findIndex(o => o.id === payload.id)
      if (index !== -1) {
        this.items.splice(index, 1, order)
      }
      return order
    },
    fetchById(id) {
      return this.items.find(o => o.id === Number(id)) || null
    },
    mapFromApi(apiOrder) {
      return mapFromApi(apiOrder)
    }
  }
})
