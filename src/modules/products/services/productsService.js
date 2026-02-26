import http from '@/shared/services/http'

function mapFromApi(apiProduct) {
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

export { mapFromApi }

export async function fetchProducts() {
  const { data } = await http.get('/products')
  return data.map(mapFromApi)
}

export async function createProduct(payload) {
  const { data } = await http.post('/products', {
    supplier_id: payload.supplierId,
    reference: payload.reference,
    name: payload.name,
    color: payload.color,
    price: payload.price,
    status: payload.status
  })
  return mapFromApi(data)
}

export async function updateProduct(payload) {
  const { data } = await http.put(`/products/${payload.id}`, {
    supplier_id: payload.supplierId,
    reference: payload.reference,
    name: payload.name,
    color: payload.color,
    price: payload.price,
    status: payload.status
  })
  return mapFromApi(data)
}

export async function importCsv({ file, supplierId }) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('supplier_id', supplierId)
  const { data } = await http.post('/products/import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return data
}

export async function fetchProductsBySupplier(supplierId) {
  const { data } = await http.get(`/suppliers/${supplierId}/products`)
  return data.map(mapFromApi)
}
