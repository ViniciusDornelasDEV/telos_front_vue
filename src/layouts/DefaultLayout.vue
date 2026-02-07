<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { usePage } from '@/composables/usePage'

const auth = useAuthStore()
const router = useRouter()
const { title, breadcrumbs } = usePage()
const isAdmin = computed(() => auth.user?.type === 'admin')
const isSeller = computed(() => auth.user?.type === 'seller')

function logout() {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <div class="drawer lg:drawer-open min-h-screen bg-base-200">
    <!-- Toggle mobile -->
    <input id="main-drawer" type="checkbox" class="drawer-toggle" />

    <!-- CONTEÚDO PRINCIPAL -->
    <div class="drawer-content flex flex-col">
      <!-- Header -->
      <header class="navbar bg-base-100 shadow-sm px-6">
        <!-- Mobile menu -->
        <div class="flex-none lg:hidden">
          <label for="main-drawer" class="btn btn-square btn-ghost">
            ☰
          </label>
        </div>

        <!-- Title + breadcrumb -->
        <div class="flex-1 flex flex-col gap-1">
          <nav class="text-sm breadcrumbs">
            <ul>
              <li v-for="(item, index) in breadcrumbs" :key="index">
                <RouterLink v-if="item.to" :to="item.to" class="hover:underline">
                  {{ item.label }}
                </RouterLink>

                <span v-else class="text-base-content/70">
                  {{ item.label }}
                </span>
              </li>
            </ul>
          </nav>
        </div>

        <!-- Actions -->
        <button class="btn btn-sm btn-outline" @click="logout">
          Logout
        </button>
      </header>

      <!-- Conteúdo -->
      <main class="p-6 flex-1 overflow-y-auto">
        <router-view />
      </main>
    </div>

    <!-- SIDEBAR -->
    <div class="drawer-side">
      <label for="main-drawer" class="drawer-overlay"></label>

      <aside class="w-64 bg-base-100 shadow-xl">
        <!-- Logo -->
        <div class="p-4 text-xl font-bold border-b">
          TelosCRM
        </div>

        <!-- Menu -->
        <ul class="menu px-4 py-4 gap-1">
          <li>
            <RouterLink to="/" class="rounded-lg transition-colors" active-class="active" exact-active-class="active">
              Dashboard
            </RouterLink>
          </li>

          <li v-if="isAdmin">
            <RouterLink to="/users" class="rounded-lg transition-colors" active-class="active">
              Usuários
            </RouterLink>
          </li>

          <li v-if="isAdmin">
            <RouterLink to="/suppliers" class="rounded-lg transition-colors" active-class="active">
              Fornecedores
            </RouterLink>
          </li>

          <li>
            <RouterLink to="/products" class="rounded-lg transition-colors" active-class="active">
              Produtos
            </RouterLink>
          </li>

          <li>
            <RouterLink to="/orders" class="rounded-lg transition-colors" active-class="active">
              Pedidos
            </RouterLink>
          </li>
        </ul>
      </aside>
    </div>
  </div>
</template>
