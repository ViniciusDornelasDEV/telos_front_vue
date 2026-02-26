import http from '@/shared/services/http'

export interface OrderItem {
  productId: number
  unitPrice: number
  quantity: number
  total?: number
}

export interface Order {
  id: number
  date: string
  supplier: { id: number; name: string } | null
  items: OrderItem[]
  observation?: string
  status: string
  total: number
}

interface ApiOrderItem {
  product_id: number
  unit_price: number | string
  quantity: number
  total?: number | string
}

interface ApiOrder {
  id: number
  date: string
  supplier?: { id: number; name: string }
  items?: ApiOrderItem[]
  observation?: string
  status: string
  total: number | string
}

export function mapFromApi(apiOrder: ApiOrder): Order {
  return {
    id: apiOrder.id,
    date: apiOrder.date,
    supplier: apiOrder.supplier
      ? { id: apiOrder.supplier.id, name: apiOrder.supplier.name }
      : null,
    items: Array.isArray(apiOrder.items)
      ? apiOrder.items.map((i) => ({
          productId: i.product_id,
          unitPrice: Number(String(i.unit_price).replace(',', '.')),
          quantity: i.quantity,
          total: Number(String(i.total).replace(',', '.'))
        }))
      : [],
    observation: apiOrder.observation,
    status: apiOrder.status,
    total: Number(apiOrder.total)
  }
}

export async function fetchOrders(): Promise<Order[]> {
  const { data } = await http.get<ApiOrder[]>('/orders')
  return data.map(mapFromApi)
}

interface CreateOrderPayload {
  date: string
  supplierId: number | string
  products: { productId: number; unitPrice: number; quantity: number }[]
  observation?: string
}

export async function createOrder(payload: CreateOrderPayload): Promise<void> {
  await http.post('/orders', {
    date: payload.date,
    supplier: { id: payload.supplierId },
    products: payload.products.map((p) => ({
      id: p.productId,
      unitPrice: p.unitPrice,
      quantity: p.quantity
    })),
    observation: payload.observation
  })
}

interface UpdateOrderPayload {
  id: number
  date: string
  observation?: string
  status: string
  products: { id?: number; unitPrice: number; quantity: number }[]
}

export async function updateOrder(payload: UpdateOrderPayload): Promise<Order> {
  const { data } = await http.put<ApiOrder>(`/orders/${payload.id}`, {
    date: payload.date,
    observation: payload.observation,
    status: payload.status,
    products: payload.products.map((p) => ({
      id: p.id,
      unitPrice: p.unitPrice,
      quantity: p.quantity
    }))
  })
  return mapFromApi(data)
}
