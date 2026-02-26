import type { RouteRecordRaw } from 'vue-router'

export const ordersRoutes: RouteRecordRaw[] = [
  {
    path: '/orders',
    name: 'orders.index',
    component: () => import('./views/OrdersIndexPage.vue'),
    meta: { auth: true, layout: 'default', title: 'Pedidos' }
  },
  {
    path: '/orders/create',
    name: 'orders.create',
    component: () => import('./views/OrdersCreatePage.vue'),
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
    component: () => import('./views/OrdersEditPage.vue'),
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
