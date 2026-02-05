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
    component: () => import('@/views/products/Index.vue'),
    meta: { auth: true, layout: 'default', title: 'Produtos' }
  },
  {
    path: '/orders',
    component: () => import('@/views/orders/Index.vue'),
    meta: { auth: true, layout: 'default', title: 'Pedidos' }
  },
  {
    path: '/reports',
    component: () => import('@/views/reports/Index.vue'),
    meta: { auth: true, layout: 'default', title: 'Relatórios' }
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
