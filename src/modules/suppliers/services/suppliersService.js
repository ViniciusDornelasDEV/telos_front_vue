import http from '@/shared/services/http'

export function mapFromApi(apiSupplier) {
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

export async function fetchSuppliers(activeOnly = false) {
  const { data } = await http.get('/suppliers', {
    params: activeOnly ? { active: 1 } : {}
  })
  return data.map(mapFromApi)
}

export async function createSupplier(payload) {
  const { data } = await http.post('/suppliers', payload)
  return mapFromApi(data)
}

export async function updateSupplier(payload) {
  const { data } = await http.put(`/suppliers/${payload.id}`, payload)
  return mapFromApi(data)
}
