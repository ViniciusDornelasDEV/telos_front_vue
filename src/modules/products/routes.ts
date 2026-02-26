import type { RouteRecordRaw } from 'vue-router'

export const productsRoutes: RouteRecordRaw[] = [
  {
    path: '/products',
    name: 'products.index',
    component: () => import('./views/ProductsIndexPage.vue'),
    meta: {
      auth: true,
      layout: 'default',
      title: 'Produtos',
      breadcrumb: [{ label: 'Home', to: '/' }]
    }
  },
  {
    path: '/products/create',
    name: 'products.create',
    component: () => import('./views/ProductsCreatePage.vue'),
    meta: {
      auth: true,
      layout: 'default',
      title: 'Novo Produto',
      breadcrumb: [
        { label: 'Home', to: '/' },
        { label: 'Produtos', to: '/products' }
      ]
    }
  },
  {
    path: '/products/:id/edit',
    name: 'products.edit',
    component: () => import('./views/ProductsEditPage.vue'),
    meta: {
      auth: true,
      layout: 'default',
      title: 'Editar Produto',
      breadcrumb: [
        { label: 'Home', to: '/' },
        { label: 'Produtos', to: '/products' }
      ]
    }
  },
  {
    path: '/products/upload',
    name: 'products.upload',
    component: () => import('./views/ProductsUploadPage.vue'),
    meta: {
      auth: true,
      layout: 'default',
      title: 'Upload CSV de Produtos',
      breadcrumb: [
        { label: 'Home', to: '/' },
        { label: 'Produtos', to: '/products' }
      ]
    }
  }
]
