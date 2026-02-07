import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useOrdersStore } from './orders'

export const useDashboardStore = defineStore('dashboard', () => {
  const ordersStore = useOrdersStore()

  const summary = computed(() => {
    const orders = ordersStore.items.filter(
      o => o.status !== 'Cancelado'
    )

    const last30Days = new Date()
    last30Days.setDate(last30Days.getDate() - 30)

    const recentOrders = orders.filter(
      o => new Date(o.date) >= last30Days
    )

    const totalSales = recentOrders.reduce(
      (sum, o) => sum + o.total,
      0
    )

    const ordersCount = recentOrders.length

    const avgTicket = ordersCount
      ? totalSales / ordersCount
      : 0

    const productsSold = recentOrders.reduce(
      (sum, o) =>
        sum +
        o.items.reduce((s, i) => s + i.quantity, 0),
      0
    )

    const salesByDayMap = {}

    recentOrders.forEach(o => {
      salesByDayMap[o.date] =
        (salesByDayMap[o.date] || 0) + o.total
    })

    const salesByDay = Object.entries(salesByDayMap).map(
      ([date, total]) => ({ date, total })
    )

    const salesBySupplierMap = {}

    recentOrders.forEach(o => {
      const name = o.supplier?.name ?? '—'
      salesBySupplierMap[name] =
        (salesBySupplierMap[name] || 0) + o.total
    })

    const salesBySupplier = Object.entries(
      salesBySupplierMap
    ).map(([name, total]) => ({ name, total }))

    const lastOrders = [...orders]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)
      .map(o => ({
        id: o.id,
        supplier: o.supplier?.name ?? '—',
        total: o.total,
        status: o.status
      }))

    return {
      totalSales,
      ordersCount,
      avgTicket,
      productsSold,
      salesByDay,
      salesBySupplier,
      lastOrders
    }
  })

  return {
    summary
  }
})
