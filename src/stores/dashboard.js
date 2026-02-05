import { defineStore } from 'pinia'

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    loading: false,
    summary: null,
  }),

  actions: {
    async fetchSummary() {
      this.loading = true

      // fake API / cache
      await new Promise(r => setTimeout(r, 500))

      this.summary = {
        totalSales: 18250.75,
        ordersCount: 42,
        avgTicket: 434.54,
        productsSold: 128,

        salesByDay: [
          { date: '01/01', total: 500 },
          { date: '02/01', total: 720 },
          { date: '03/01', total: 320 },
          { date: '04/01', total: 890 },
          { date: '05/01', total: 610 },
        ],

        salesBySupplier: [
          { name: 'Fornecedor A', total: 7200 },
          { name: 'Fornecedor B', total: 5400 },
          { name: 'Fornecedor C', total: 3650 },
        ],

        lastOrders: [
          { id: 1, supplier: 'Fornecedor A', total: 520, status: 'Concluído' },
          { id: 2, supplier: 'Fornecedor B', total: 890, status: 'Pendente' },
          { id: 3, supplier: 'Fornecedor C', total: 210, status: 'Cancelado' },
        ]
      }

      this.loading = false
    }
  }
})
