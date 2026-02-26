import http from '@/shared/services/http'

export interface User {
  id: number
  name: string
  email: string
  status: boolean
  type: string
}

interface ApiUser {
  id: number
  name: string
  email: string
  status: boolean
  type: string
}

export function mapFromApi(apiUser: ApiUser): User {
  return {
    id: apiUser.id,
    name: apiUser.name,
    email: apiUser.email,
    status: Boolean(apiUser.status),
    type: apiUser.type
  }
}

export async function fetchUsers(): Promise<User[]> {
  const { data } = await http.get<ApiUser[]>('/users')
  return data.map(mapFromApi)
}

export async function createUser(payload: Partial<User> & { password: string }): Promise<User> {
  const { data } = await http.post<ApiUser>('/users', {
    name: payload.name,
    email: payload.email,
    password: payload.password,
    type: payload.type,
    status: payload.status
  })
  return mapFromApi(data)
}

export async function updateUser(payload: User & { password?: string }): Promise<User> {
  const { data } = await http.put<ApiUser>(`/users/${payload.id}`, {
    name: payload.name,
    email: payload.email,
    password: payload.password || '',
    type: payload.type,
    status: payload.status
  })
  return mapFromApi(data)
}
