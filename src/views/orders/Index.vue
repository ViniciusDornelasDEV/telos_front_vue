<script setup>
import { computed, onMounted } from 'vue'
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

onMounted(() => {
  ordersStore.fetchOrders()
})

const rows = computed(() =>
  ordersStore.items.map(order => ({
    id: order.id,
    supplierName: order.supplier?.name ?? '—',
    date: order.date,
    productsCount: order.items.length,
    total: `R$ ${order.total.toFixed(2)}`,
    status: order.status
  }))
)

function editOrder(id) {
  router.push(`/orders/${id}/edit`)
}

async function cancelOrder(id) {
  const order = ordersStore.fetchById(id)
  if (!order) return

  if (order.status !== 'Pendente') {
    alert('Apenas pedidos pendentes podem ser cancelados.')
    return
  }

  const confirmed = confirm(
    `Deseja cancelar o pedido #${order.id}?`
  )

  if (!confirmed) return

  await ordersStore.update({
    id: order.id,
    date: order.date,
    observation: order.observation,
    status: 'Cancelado',
    products: order.items.map(i => ({
      id: i.productId,
      unitPrice: i.unitPrice,
      quantity: i.quantity
    }))
  })
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
            <button class="btn btn-xs btn-ghost text-error" :disabled="row.status !== 'Pendente'"
              @click="cancelOrder(row.id)">
              <Trash2 class="w-4 h-4" />
            </button>

          </div>
        </div>
      </template>
    </DataTable>
  </div>
</template>
