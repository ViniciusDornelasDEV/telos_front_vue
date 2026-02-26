import { getActivePinia } from 'pinia'

export function resetAllStores(): void {
  const pinia = getActivePinia()

  if (!pinia) return

  pinia._s.forEach((store) => {
    if (typeof store.$reset === 'function') {
      store.$reset()
    }
  })
}
