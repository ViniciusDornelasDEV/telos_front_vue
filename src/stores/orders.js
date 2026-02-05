import { defineStore } from 'pinia'
import { useProductsStore } from './products'

export const useOrdersStore = defineStore('orders', {
  state: () => ({
    items: [
      {
        id: 1,
        date: '2024-10-01',
        supplier: {
          id: 1,
          name: 'Fornecedor Alpha'
        },
        products: [
          {
            id: 1,
            unitPrice: 25.9,
            quantity: 3
          },
          {
            id: 2,
            unitPrice: 12.5,
            quantity: 2
          }
        ],
        observation: 'Pedido inicial do fornecedor 1',
        status: 'Pendente'
      },
      {
        id: 2,
        date: '2024-10-05',
        supplier: {
          id: 2,
          name: 'Fornecedor Beta'
        },
        products: [
          {
            id: 4,
            unitPrice: 99.9,
            quantity: 1
          }
        ],
        observation: 'Compra pontual',
        status: 'Concluído'
      }
    ],
    loading: false
  }),

  actions: {
    create(order) {
      const id = this.items.length
        ? Math.max(...this.items.map(o => o.id)) + 1
        : 1

      this.items.push({ id, ...order })
    },

    update(order) {
      const index = this.items.findIndex(o => o.id === order.id)
      if (index !== -1) {
        this.items[index] = { ...order }
      }
    },

    remove(id) {
      this.items = this.items.filter(o => o.id !== id)
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

    totalValue(order) {
      return order.products.reduce(
        (acc, p) => acc + p.unitPrice * p.quantity,
        0
      )
    }
  }
})
