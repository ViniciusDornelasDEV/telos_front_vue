import http from '@/shared/services/http'

export function loginRequest(email, password) {
  return http.post('/login', { email, password })
}

export function logoutRequest() {
  return http.post('/logout')
}

