import http from '@/shared/services/http'

export function mapFromApi(apiUser) {
  return {
    id: apiUser.id,
    name: apiUser.name,
    email: apiUser.email,
    status: Boolean(apiUser.status),
    type: apiUser.type
  }
}

export async function fetchUsers() {
  const { data } = await http.get('/users')
  return data.map(mapFromApi)
}

export async function createUser(payload) {
  const { data } = await http.post('/users', {
    name: payload.name,
    email: payload.email,
    password: payload.password,
    type: payload.type,
    status: payload.status
  })
  return mapFromApi(data)
}

export async function updateUser(payload) {
  const { data } = await http.put(`/users/${payload.id}`, {
    name: payload.name,
    email: payload.email,
    password: payload.password || '',
    type: payload.type,
    status: payload.status
  })
  return mapFromApi(data)
}
