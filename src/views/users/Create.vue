<script setup>
import { reactive, ref } from 'vue'
import { useUsersStore } from '@/stores/users'
import { useRouter } from 'vue-router'

const router = useRouter()
const usersStore = useUsersStore()

const form = reactive({
    name: '',
    email: '',
    password: '',
    status: 'active',
    type: 'vendedor'
})

function submit() {
    usersStore.create(form)
    router.push('/users')
}
</script>

<template>
    <div class="max-w-xl space-y-6">
        <h2 class="text-xl font-semibold">Novo Usuário</h2>

        <form class="space-y-4" @submit.prevent="submit">
            <input v-model="form.name" placeholder="Nome" class="input input-bordered w-full" required />

            <input v-model="form.email" type="email" placeholder="Email" class="input input-bordered w-full" required />

            <input v-model="form.password" type="password" placeholder="Senha" class="input input-bordered w-full"
                required />

            <select v-model="form.status" class="select select-bordered w-full">
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
            </select>

            <select v-model="form.type" class="select select-bordered w-full">
                <option value="vendedor">Vendedor</option>
                <option value="admin">Admin</option>
            </select>

            <div class="flex gap-2">
                <button class="btn btn-primary" type="submit">Salvar</button>
                <RouterLink to="/users" class="btn btn-ghost">Cancelar</RouterLink>
            </div>
        </form>
    </div>
</template>
