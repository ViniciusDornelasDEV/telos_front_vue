import http from '@/shared/services/http'

export interface Supplier {
  id: number
  name: string
  cnpj: string
  cep: string
  address: string
  status: boolean
  sellers: number[]
}

interface ApiSupplier {
  id: number
  name: string
  cnpj: string
  cep: string
  address: string
  status: boolean
  sellers?: number[]
}

export function mapFromApi(apiSupplier: ApiSupplier): Supplier {
  return {
    id: apiSupplier.id,
    name: apiSupplier.name,
    cnpj: apiSupplier.cnpj,
    cep: apiSupplier.cep,
    address: apiSupplier.address,
    status: Boolean(apiSupplier.status),
    sellers: apiSupplier.sellers || []
  }
}

export async function fetchSuppliers(activeOnly = false): Promise<Supplier[]> {
  const { data } = await http.get<ApiSupplier[]>('/suppliers', {
    params: activeOnly ? { active: 1 } : {}
  })
  return data.map(mapFromApi)
}

export async function createSupplier(payload: Partial<Supplier>): Promise<Supplier> {
  const { data } = await http.post<ApiSupplier>('/suppliers', payload)
  return mapFromApi(data)
}

export async function updateSupplier(payload: Supplier): Promise<Supplier> {
  const { data } = await http.put<ApiSupplier>(`/suppliers/${payload.id}`, payload)
  return mapFromApi(data)
}
