<script setup>
import { reactive, onMounted } from 'vue'
import { useUsersStore } from '@/stores/users'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const usersStore = useUsersStore()

const form = reactive({
  id: null,
  name: '',
  email: '',
  password: '',
  status: 'active',
  type: 'vendedor'
})

onMounted(() => {
  const id = Number(route.params.id)
  const user = usersStore.items.find(u => u.id === id)
  if (user) Object.assign(form, user)
})

function submit() {
  usersStore.update(form)
  router.push('/users')
}
</script>

<template>
  <div class="max-w-xl space-y-6">
    <h2 class="text-xl font-semibold">Editar Usuário</h2>

    <form class="space-y-4" @submit.prevent="submit">
      <input v-model="form.name" placeholder="Nome" class="input input-bordered w-full" required />
      <input v-model="form.email" type="email" placeholder="Email" class="input input-bordered w-full" required />
      <input v-model="form.password" type="password" placeholder="Senha" class="input input-bordered w-full" />

      <select v-model="form.status" class="select select-bordered w-full">
        <option :value="true">Ativo</option>
        <option :value="false">Inativo</option>
      </select>

      <select v-model="form.type" class="select select-bordered w-full">
        <option value="seller">Vendedor</option>
        <option value="admin">Admin</option>
      </select>

      <div class="flex gap-2">
        <button class="btn btn-primary" type="submit">Salvar</button>
        <RouterLink to="/users" class="btn btn-ghost">Cancelar</RouterLink>
      </div>
    </form>
  </div>
</template>
