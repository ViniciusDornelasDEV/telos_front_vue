import type { RouteRecordRaw } from 'vue-router'

export const usersRoutes: RouteRecordRaw[] = [
  {
    path: '/users',
    name: 'users.index',
    component: () => import('./views/UsersIndexPage.vue'),
    meta: {
      auth: true,
      layout: 'default',
      title: 'Usuários',
      breadcrumb: [{ label: 'Home', to: '/' }]
    }
  },
  {
    path: '/users/create',
    name: 'users.create',
    component: () => import('./views/UsersCreatePage.vue'),
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
    component: () => import('./views/UsersEditPage.vue'),
    meta: {
      auth: true,
      layout: 'default',
      title: 'Editar Usuário',
      breadcrumb: [
        { label: 'Home', to: '/' },
        { label: 'Usuários', to: '/users' }
      ]
    }
  }
]
