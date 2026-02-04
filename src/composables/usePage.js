import { computed } from 'vue'
import { useRoute } from 'vue-router'

export function usePage() {
  const route = useRoute()

  const title = computed(() => route.meta.title || '')

  const breadcrumbs = computed(() => {
    const base = route.meta.breadcrumb || []

    return [
      ...base,
      { label: route.meta.title }
    ]
  })

  return {
    title,
    breadcrumbs
  }
}
