import { computed, type ComputedRef } from 'vue'
import { useRoute } from 'vue-router'

export interface BreadcrumbItem {
  label: string
  to?: string
}

export function usePage(): {
  title: ComputedRef<string>
  breadcrumbs: ComputedRef<BreadcrumbItem[]>
} {
  const route = useRoute()

  const title = computed(() => (route.meta.title as string) || '')

  const breadcrumbs = computed(() => {
    const base = (route.meta.breadcrumb as BreadcrumbItem[]) || []
    return [
      ...base,
      { label: route.meta.title as string }
    ]
  })

  return {
    title,
    breadcrumbs
  }
}
