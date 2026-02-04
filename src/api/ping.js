import http from './http'

export function ping() {
  return http.get('/ping')
}
