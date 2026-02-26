import { computed, type Ref, type ComputedRef } from 'vue'

export interface OrderItem {
  productId: number
  unitPrice: number
  quantity: number
  total?: number
}

export interface Order {
  id: number
  date: string
  status: string
  total: number
  items: OrderItem[]
  supplier?: { id: number; name: string }
}

export interface DashboardSummary {
  totalSales: number
  ordersCount: number
  avgTicket: number
  productsSold: number
  salesByDay: { date: string; total: number }[]
  salesBySupplier: { name: string; total: number }[]
  lastOrders: { id: number; supplier: string; total: number; status: string }[]
}

type OrdersSource = Ref<Order[]> | ComputedRef<Order[]> | (() => Order[])

export function useDashboardSummary(
  ordersRef: OrdersSource
): { summary: ComputedRef<DashboardSummary> } {
  const summary = computed<DashboardSummary>(() => {
    const orders =
      typeof ordersRef === 'function'
        ? ordersRef()
        : 'value' in ordersRef
          ? (ordersRef as Ref<Order[]> | ComputedRef<Order[]>).value
          : []
    const filtered = (orders || []).filter((o) => o.status !== 'Cancelado')

    const last30Days = new Date()
    last30Days.setDate(last30Days.getDate() - 30)

    const recentOrders = filtered.filter((o) => new Date(o.date) >= last30Days)

    const totalSales = recentOrders.reduce((sum, o) => sum + o.total, 0)
    const ordersCount = recentOrders.length
    const avgTicket = ordersCount ? totalSales / ordersCount : 0
    const productsSold = recentOrders.reduce(
      (sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0),
      0
    )

    const salesByDayMap: Record<string, number> = {}
    recentOrders.forEach((o) => {
      salesByDayMap[o.date] = (salesByDayMap[o.date] || 0) + o.total
    })
    const salesByDay = Object.entries(salesByDayMap).map(([date, total]) => ({ date, total }))

    const salesBySupplierMap: Record<string, number> = {}
    recentOrders.forEach((o) => {
      const name = o.supplier?.name ?? '—'
      salesBySupplierMap[name] = (salesBySupplierMap[name] || 0) + o.total
    })
    const salesBySupplier = Object.entries(salesBySupplierMap).map(([name, total]) => ({ name, total }))

    const lastOrders = [...filtered]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
      .map((o) => ({
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

  return { summary }
}
