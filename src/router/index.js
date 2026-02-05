import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/login',
    component: () => import('@/views/auth/Login.vue'),
    meta: { layout: 'auth' }
  },
  {
    path: '/',
    component: () => import('@/views/Home.vue'),
    meta: { auth: true, layout: 'default', title: 'Dashboard' }
  },
  {
    path: '/suppliers',
    name: 'suppliers.index',
    component: () => import('@/views/suppliers/Index.vue'),
    meta: {
      auth: true,
      layout: 'default',
      title: 'Fornecedores',
      breadcrumb: [
        { label: 'Home', to: '/' }
      ]
    }
  },
  {
    path: '/suppliers/create',
    name: 'suppliers.create',
    component: () => import('@/views/suppliers/Create.vue'),
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
    component: () => import('@/views/suppliers/Edit.vue'),
    meta: {
      auth: true,
      layout: 'default',
      title: 'Editar Fornecedor',
      breadcrumb: [
        { label: 'Home', to: '/' },
        { label: 'Fornecedores', to: '/suppliers' }
      ]
    }
  },
  {
    path: '/users',
    name: 'users.index',
    component: () => import('@/views/users/Index.vue'),
    meta: {
      auth: true,
      layout: 'default',
      title: 'Usuários',
      breadcrumb: [
        { label: 'Home', to: '/' }
      ]
    }
  },
  {
    path: '/users/create',
    name: 'users.create',
    component: () => import('@/views/users/Create.vue'),
    meta: {
      auth: true,
      layout: 'default',
      title: 'Novo Usuário',
      breadcrumb: [
        { label: 'Home', to: '/' },
        { label: 'Usuários', to: '/users' }
      ]
    }
  },
  {
    path: '/users/:id/edit',
    name: 'users.edit',
    component: () => import('@/views/users/Edit.vue'),
    meta: {
      auth: true,
      layout: 'default',
      title: 'Editar Usuário',
      breadcrumb: [
        { label: 'Home', to: '/' },
        { label: 'Usuários', to: '/users' }
      ]
    }
  },
  {
    path: '/products',
    name: 'products.index',
    component: () => import('@/views/products/Index.vue'),
    meta: {
      auth: true,
      layout: 'default',
      title: 'Produtos',
      breadcrumb: [
        { label: 'Home', to: '/' }
      ]
    }
  },

  {
    path: '/products/create',
    name: 'products.create',
    component: () => import('@/views/products/Create.vue'),
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
    component: () => import('@/views/products/Edit.vue'),
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
    component: () => import('@/views/products/Upload.vue'),
    meta: {
      auth: true,
      layout: 'default',
      title: 'Upload CSV de Produtos',
      breadcrumb: [
        { label: 'Home', to: '/' },
        { label: 'Produtos', to: '/products' }
      ]
    }
  },
  {
    path: '/orders',
    component: () => import('@/views/orders/Index.vue'),
    meta: { auth: true, layout: 'default', title: 'Pedidos' }
  },
  {
    path: '/orders/create',
    name: 'orders.create',
    component: () => import('@/views/orders/Create.vue'),
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
    component: () => import('@/views/orders/Edit.vue'),
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
