<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useOrdersStore } from '@/stores/orders'
import DataTable from '@/components/DataTable.vue'
import { Pencil, Trash2 } from 'lucide-vue-next'

const router = useRouter()
const ordersStore = useOrdersStore()

const columns = [
  { label: 'Fornecedor', key: 'supplierName' },
  { label: 'Data', key: 'date' },
  { label: 'Produtos', key: 'productsCount' },
  { label: 'Valor Total', key: 'total' },
  { label: 'Status', key: 'status' }
]

const rows = computed(() =>
  ordersStore.items.map(order => {
    const totalValue = order.products.reduce(
      (sum, p) => sum + p.unitPrice * p.quantity,
      0
    )

    return {
      id: order.id,
      supplierName: order.supplier?.name ?? '—',
      date: order.date,
      productsCount: order.products.length,
      total: `R$ ${totalValue.toFixed(2)}`,
      status: order.status
    }
  })
)

function editOrder(id) {
  router.push(`/orders/${id}/edit`)
}

function removeOrder(id) {
  if (confirm('Tem certeza que deseja excluir este pedido?')) {
    ordersStore.remove(id)
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-semibold">Pedidos</h2>
      <RouterLink to="/orders/create" class="btn btn-primary">
        Novo Pedido
      </RouterLink>
    </div>

    <DataTable :columns="columns" :rows="rows" :loading="ordersStore.loading" :per-page="5">
      <template #actions="{ row }">
        <div class="flex justify-end gap-2">
          <div class="tooltip" data-tip="Editar">
            <button class="btn btn-xs btn-ghost" @click="editOrder(row.id)">
              <Pencil class="w-4 h-4" />
            </button>
          </div>

          <div class="tooltip" data-tip="Excluir">
            <button class="btn btn-xs btn-ghost text-error" @click="removeOrder(row.id)">
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
      </template>
    </DataTable>
  </div>
</template>
