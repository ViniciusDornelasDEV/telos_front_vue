import type { RouteRecordRaw } from 'vue-router'

export const ordersRoutes: RouteRecordRaw[] = [
  {
    path: '/orders',
    name: 'orders.index',
    component: () => import('./pages/OrdersIndexPage.vue'),
    meta: { auth: true, layout: 'default', title: 'Pedidos' }
  },
  {
    path: '/orders/create',
    name: 'orders.create',
    component: () => import('./pages/OrdersCreatePage.vue'),
    meta: {
      auth: true,
      layout: 'default',
      title: 'Novo Pedido',
      breadcrumb: [
        { label: 'Home', to: '/' },
        { label: 'Pedidos', to: '/orders' }
      ]
    }
  },
  {
    path: '/orders/:id/edit',
    name: 'orders.edit',
    component: () => import('./pages/OrdersEditPage.vue'),
    meta: {
      auth: true,
      layout: 'default',
      title: 'Editar Pedido',
      breadcrumb: [
        { label: 'Home', to: '/' },
        { label: 'Pedidos', to: '/orders' }
      ]
    }
  }
]
