import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/modules/auth/store/authStore'
import { authRoutes } from '@/modules/auth/routes'
import { dashboardRoutes } from '@/modules/dashboard/routes'
import { suppliersRoutes } from '@/modules/suppliers/routes'
import { usersRoutes } from '@/modules/users/routes'
import { productsRoutes } from '@/modules/products/routes'
import { ordersRoutes } from '@/modules/orders/routes'

const routes = [
  ...authRoutes,
  ...dashboardRoutes,
  ...suppliersRoutes,
  ...usersRoutes,
  ...productsRoutes,
  ...ordersRoutes
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.auth && !auth.isAuthenticated) {
    return '/login'
  }
})

export default router
