import { computed } from 'vue'
import { useRoute } from 'vue-router'

export function usePage() {
  const route = useRoute()

  const title = computed(() => {
    return route.meta.title || 'Dashboard'
  })

  const breadcrumbs = computed(() => {
    const items = [{ label: 'Home', to: '/' }]

    if (route.meta.title && route.path !== '/') {
      items.push({
        label: route.meta.title,
        to: route.path
      })
    }

    return items
  })

  return {
    title,
    breadcrumbs
  }
}
