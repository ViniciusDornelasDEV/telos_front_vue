<script setup>
import { onMounted } from 'vue'
import { useUsersStore } from '@/stores/users'
import DataTable from '@/components/DataTable.vue'
import { Pencil, Trash2 } from 'lucide-vue-next'

const usersStore = useUsersStore()

const columns = [
  { label: 'Nome', key: 'name' },
  { label: 'Email', key: 'email' },
  { label: 'Status', key: 'status' },
  { label: 'Tipo', key: 'type' }
]

onMounted(() => {
  usersStore.fetchUsers()
})

async function removeUser(user) {
  const confirmed = confirm(
    `Deseja desativar o usuário "${user.name}"?`
  )
  if (!confirmed) return

  await usersStore.update({
    ...user,
    status: false
  })
}
</script>
<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-semibold">Usuários</h2>
      <RouterLink to="/users/create" class="btn btn-primary">Novo Usuário</RouterLink>
    </div>

    <DataTable :columns="columns" :rows="usersStore.items" :loading="usersStore.loading" :per-page="5">
      <template #cell-status="{ row }">
        <span class="badge" :class="row.status ? 'badge-success' : 'badge-error'">
          {{ row.status ? 'Ativo' : 'Inativo' }}
        </span>
      </template>

      <template #actions="{ row }">
        <div class="flex justify-end gap-2">
          <RouterLink :to="`/users/${row.id}/edit`" class="btn btn-xs btn-ghost">
            <Pencil class="w-4 h-4" />
          </RouterLink>

          <button class="btn btn-xs btn-ghost text-error" @click="removeUser(row)">
            <Trash2 class="w-4 h-4" />
          </button>
        </div>
      </template>
    </DataTable>
  </div>
</template>
