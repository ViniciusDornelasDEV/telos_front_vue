import type { RouteRecordRaw } from 'vue-router'

export const dashboardRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('./pages/DashboardPage.vue'),
    meta: { auth: true, layout: 'default', title: 'Dashboard' }
  }
]
