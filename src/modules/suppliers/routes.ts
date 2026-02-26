import type { RouteRecordRaw } from 'vue-router'

export const suppliersRoutes: RouteRecordRaw[] = [
  {
    path: '/suppliers',
    name: 'suppliers.index',
    component: () => import('./views/SuppliersIndexPage.vue'),
    meta: {
      auth: true,
      layout: 'default',
      title: 'Fornecedores',
      breadcrumb: [{ label: 'Home', to: '/' }]
    }
  },
  {
    path: '/suppliers/create',
    name: 'suppliers.create',
    component: () => import('./views/SuppliersCreatePage.vue'),
    meta: {
      auth: true,
      layout: 'default',
      title: 'Novo Fornecedor',
      breadcrumb: [
        { label: 'Home', to: '/' },
        { label: 'Fornecedores', to: '/suppliers' }
      ]
    }
  },
  {
    path: '/suppliers/:id/edit',
    name: 'suppliers.edit',
    component: () => import('./views/SuppliersEditPage.vue'),
    meta: {
      auth: true,
      layout: 'default',
      title: 'Editar Fornecedor',
      breadcrumb: [
        { label: 'Home', to: '/' },
        { label: 'Fornecedores', to: '/suppliers' }
      ]
    }
  }
]
