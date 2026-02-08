<script setup>
import { onMounted } from 'vue'
import { useProductsStore } from '@/stores/products'
import { useSuppliersStore } from '@/stores/suppliers'
import DataTable from '@/components/DataTable.vue'
import { Pencil, Trash2 } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()
const productsStore = useProductsStore()
const suppliersStore = useSuppliersStore()

onMounted(async () => {
  await suppliersStore.fetchSuppliers()
  await productsStore.fetchProducts()
})

const columns = [
  { label: 'Fornecedor', key: 'supplierName' },
  { label: 'Referência', key: 'reference' },
  { label: 'Nome', key: 'name' },
  { label: 'Cor', key: 'color' },
  { label: 'Preço', key: 'price' },
  { label: 'Status', key: 'status' }
]

function getSupplierName(supplierId) {
  const supplier = suppliersStore.items.find(s => s.id === supplierId)
  return supplier ? supplier.name : '—'
}

function editProduct(id) {
  router.push(`/products/${id}/edit`)
}

async function removeProduct(product) {
  const confirmed = confirm(
    `Deseja desativar o produto "${product.name}"?`
  )
  if (!confirmed) return
  await productsStore.update({
    ...product,
    status: false
  })
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-semibold">Produtos</h2>
      <div class="flex gap-2">
        <RouterLink to="/products/create" class="btn btn-primary">Novo Produto</RouterLink>
        <RouterLink to="/products/upload" class="btn btn-secondary">Upload CSV</RouterLink>
      </div>
    </div>

    <DataTable :columns="columns"
      :rows="productsStore.items.map(p => ({ ...p, supplierName: getSupplierName(p.supplierId) }))"
      :loading="productsStore.loading" :per-page="5">
      <template #cell-status="{ row }">
        <span class="badge" :class="row.status ? 'badge-success' : 'badge-error'">
          {{ row.status ? 'Ativo' : 'Inativo' }}
        </span>
      </template>

      <template #actions="{ row }">
        <div class="flex justify-end gap-2">
          <div class="tooltip" data-tip="Editar">
            <button class="btn btn-xs btn-ghost" @click="editProduct(row.id)">
              <Pencil class="w-4 h-4" />
            </button>
          </div>

          <div class="tooltip" data-tip="Excluir">
            <button class="btn btn-xs btn-ghost text-error" @click="removeProduct(row)">
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
      </template>
    </DataTable>
  </div>
</template>
