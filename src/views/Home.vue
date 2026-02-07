<script setup>
import { onMounted } from 'vue'
import { useOrdersStore } from '@/stores/orders'
import { useDashboardStore } from '@/stores/dashboard'

const ordersStore = useOrdersStore()
const dashboard = useDashboardStore()

onMounted(() => {
  // o dashboard depende dos pedidos
  ordersStore.fetchOrders()
})

function money(value) {
  return `R$ ${Number(value).toFixed(2).replace('.', ',')}`
}
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold">Dashboard</h1>

    <!-- KPIs -->
    <div class="grid grid-cols-4 gap-4">
      <div class="stat bg-base-100 shadow rounded-box">
        <div class="stat-title">Total vendido (30 dias)</div>
        <div class="stat-value text-primary">
          {{ money(dashboard.summary.totalSales) }}
        </div>
      </div>

      <div class="stat bg-base-100 shadow rounded-box">
        <div class="stat-title">Pedidos</div>
        <div class="stat-value">
          {{ dashboard.summary.ordersCount }}
        </div>
      </div>

      <div class="stat bg-base-100 shadow rounded-box">
        <div class="stat-title">Ticket médio</div>
        <div class="stat-value">
          {{ money(dashboard.summary.avgTicket) }}
        </div>
      </div>

      <div class="stat bg-base-100 shadow rounded-box">
        <div class="stat-title">Produtos vendidos</div>
        <div class="stat-value">
          {{ dashboard.summary.productsSold }}
        </div>
      </div>
    </div>

    <!-- Gráficos / Listas -->
    <div class="grid grid-cols-2 gap-6">
      <div class="card bg-base-100 shadow">
        <div class="card-body">
          <h2 class="card-title">Vendas por dia</h2>

          <ul class="space-y-2">
            <li v-for="item in dashboard.summary.salesByDay" :key="item.date" class="flex justify-between">
              <span>{{ item.date }}</span>
              <span class="font-semibold">{{ money(item.total) }}</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="card bg-base-100 shadow">
        <div class="card-body">
          <h2 class="card-title">Vendas por fornecedor</h2>

          <ul class="space-y-2">
            <li v-for="item in dashboard.summary.salesBySupplier" :key="item.name" class="flex justify-between">
              <span>{{ item.name }}</span>
              <span class="font-semibold">{{ money(item.total) }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Últimos pedidos -->
    <div class="card bg-base-100 shadow">
      <div class="card-body">
        <h2 class="card-title">Últimos pedidos</h2>

        <table class="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Fornecedor</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in dashboard.summary.lastOrders" :key="order.id">
              <td>#{{ order.id }}</td>
              <td>{{ order.supplier }}</td>
              <td>{{ money(order.total) }}</td>
              <td>
                <span class="badge" :class="{
                  'badge-success': order.status === 'Concluído',
                  'badge-warning': order.status === 'Pendente',
                  'badge-error': order.status === 'Cancelado'
                }">
                  {{ order.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
