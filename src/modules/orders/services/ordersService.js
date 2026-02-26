import http from '@/shared/services/http'

export function mapFromApi(apiOrder) {
  return {
    id: apiOrder.id,
    date: apiOrder.date,
    supplier: apiOrder.supplier
      ? { id: apiOrder.supplier.id, name: apiOrder.supplier.name }
      : null,
    items: Array.isArray(apiOrder.items)
      ? apiOrder.items.map(i => ({
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

export async function fetchOrders() {
  const { data } = await http.get('/orders')
  return data.map(mapFromApi)
}

export async function createOrder(payload) {
  await http.post('/orders', {
    date: payload.date,
    supplier: { id: payload.supplierId },
    products: payload.products.map(p => ({
      id: p.productId,
      unitPrice: p.unitPrice,
      quantity: p.quantity
    })),
    observation: payload.observation
  })
}

export async function updateOrder(payload) {
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
  return mapFromApi(data)
}
