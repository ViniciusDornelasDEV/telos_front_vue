<script setup>
import { onMounted } from 'vue'
import { useSuppliersStore } from '@/stores/suppliers'
import DataTable from '@/components/DataTable.vue'
import { Pencil, Trash2 } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const suppliersStore = useSuppliersStore()
const router = useRouter()

const columns = [
  { label: 'Nome', key: 'name' },
  { label: 'CNPJ', key: 'cnpj' },
  { label: 'Status', key: 'status' }
]

onMounted(() => {
  suppliersStore.fetchSuppliers()
})

function editSupplier(id) {
  router.push(`/suppliers/${id}/edit`)
}

async function removeSupplier(supplier) {
  const confirmed = confirm(
    `Deseja desativar o fornecedor "${supplier.name}"?`
  )
  if (!confirmed) return

  await suppliersStore.update({
    ...supplier,
    status: false
  })
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-semibold">Fornecedores</h2>

      <RouterLink to="/suppliers/create" class="btn btn-primary">
        Novo Fornecedor
      </RouterLink>
    </div>

    <DataTable :columns="columns" :rows="suppliersStore.items" :loading="suppliersStore.loading" :per-page="5">
      <template #cell-status="{ row }">
        <span class="badge" :class="row.status ? 'badge-success' : 'badge-error'">
          {{ row.status ? 'Ativo' : 'Inativo' }}
        </span>
      </template>

      <template #actions="{ row }">
        <div class="flex justify-end gap-2">
          <div class="tooltip" data-tip="Editar">
            <button class="btn btn-xs btn-ghost" @click="editSupplier(row.id)">
              <Pencil class="w-4 h-4" />
            </button>
          </div>

          <div class="tooltip" data-tip="Excluir">
            <button class="btn btn-xs btn-ghost text-error" @click="removeSupplier(row)">
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
      </template>
    </DataTable>
  </div>
</template>
