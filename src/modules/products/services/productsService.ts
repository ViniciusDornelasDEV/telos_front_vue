import http from '@/shared/services/http'

export interface Product {
  id: number
  supplierId: number
  reference: string
  name: string
  color: string
  price: number
  status: boolean
}

interface ApiProduct {
  id: number
  supplier_id: number
  reference: string
  name: string
  color: string
  price: number | string
  status: boolean
}

function mapFromApi(apiProduct: ApiProduct): Product {
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

export async function fetchProducts(): Promise<Product[]> {
  const { data } = await http.get<ApiProduct[]>('/products')
  return data.map(mapFromApi)
}

export async function createProduct(payload: Partial<Product>): Promise<Product> {
  const { data } = await http.post<ApiProduct>('/products', {
    supplier_id: payload.supplierId,
    reference: payload.reference,
    name: payload.name,
    color: payload.color,
    price: payload.price,
    status: payload.status
  })
  return mapFromApi(data)
}

export async function updateProduct(payload: Product): Promise<Product> {
  const { data } = await http.put<ApiProduct>(`/products/${payload.id}`, {
    supplier_id: payload.supplierId,
    reference: payload.reference,
    name: payload.name,
    color: payload.color,
    price: payload.price,
    status: payload.status
  })
  return mapFromApi(data)
}

export async function importCsv(p: { file: File; supplierId: string | number }): Promise<unknown> {
  const formData = new FormData()
  formData.append('file', p.file)
  formData.append('supplier_id', String(p.supplierId))
  const { data } = await http.post('/products/import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return data
}

export async function fetchProductsBySupplier(supplierId: number | string): Promise<Product[]> {
  const { data } = await http.get<ApiProduct[]>(`/suppliers/${supplierId}/products`)
  return data.map(mapFromApi)
}
