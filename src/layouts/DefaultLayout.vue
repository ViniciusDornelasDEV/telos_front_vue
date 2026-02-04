<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { usePage } from '@/composables/usePage'
const auth = useAuthStore()
const router = useRouter()
const { title, breadcrumbs } = usePage()

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
      <!-- Topbar -->
      <header class="navbar bg-base-100 shadow px-6">
        <!-- Mobile menu button -->
        <div class="flex-none lg:hidden">
          <label for="main-drawer" class="btn btn-square btn-ghost">
            ☰
          </label>
        </div>

        <!-- Title + breadcrumb -->
        <div class="flex-1 flex flex-col">
          <h1 class="text-lg font-semibold">
            {{ title }}
          </h1>

          <div class="text-sm breadcrumbs">
            <ul>
              <li
                v-for="(item, index) in breadcrumbs"
                :key="index"
              >
                <RouterLink :to="item.to">
                  {{ item.label }}
                </RouterLink>
              </li>
            </ul>
          </div>
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

    <!-- SIDEBAR / DRAWER -->
    <div class="drawer-side">
      <label for="main-drawer" class="drawer-overlay"></label>

      <aside class="w-64 bg-base-100 shadow-xl">
        <div class="p-4 text-xl font-bold border-b">
          TelosCRM
        </div>

        <ul class="menu px-4">
          <li>
            <RouterLink
              to="/"
              class="rounded-lg"
              active-class="active"
              exact-active-class="active"
            >
              Dashboard
            </RouterLink>
          </li>

          <li>
            <RouterLink to="/suppliers" class="rounded-lg" active-class="active">
              Fornecedores
            </RouterLink>
          </li>

          <li>
            <RouterLink to="/products" class="rounded-lg" active-class="active">
              Produtos
            </RouterLink>
          </li>

          <li>
            <RouterLink to="/orders" class="rounded-lg" active-class="active">
              Pedidos
            </RouterLink>
          </li>

          <li>
            <RouterLink to="/reports" class="rounded-lg" active-class="active">
              Relatórios
            </RouterLink>
          </li>
        </ul>
      </aside>
    </div>
  </div>
</template>

