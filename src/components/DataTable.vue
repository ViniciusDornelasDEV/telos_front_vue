<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  columns: {
    type: Array,
    required: true
  },
  rows: {
    type: Array,
    required: true
  },
  perPage: {
    type: Number,
    default: 10
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const currentPage = ref(1)

const totalPages = computed(() => {
  return Math.ceil(props.rows.length / props.perPage)
})

const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * props.perPage
  const end = start + props.perPage
  return props.rows.slice(start, end)
})

watch(
  () => props.rows,
  () => {
    currentPage.value = 1
  }
)
</script>

<template>
  <div class="card bg-base-100 shadow">
    <div class="card-body p-0">
      <div class="overflow-x-auto">
        <table class="table">
          <thead>
            <tr>
              <th
                v-for="column in columns"
                :key="column.key"
              >
                {{ column.label }}
              </th>

              <th v-if="$slots.actions" class="text-right">
                Ações
              </th>
            </tr>
          </thead>

          <tbody>
            <!-- SKELETON -->
            <template v-if="loading">
                <tr v-for="n in perPage" :key="n">
                <td
                    v-for="column in columns"
                    :key="column.key"
                >
                    <div class="skeleton h-4 w-full"></div>
                </td>

                <td v-if="$slots.actions">
                    <div class="skeleton h-4 w-20 ml-auto"></div>
                </td>
                </tr>
            </template>

            <!-- DADOS -->
            <template v-else>
                <tr
                v-for="row in paginatedRows"
                :key="row.id"
                class="hover"
                >
                <td
                    v-for="column in columns"
                    :key="column.key"
                >
                    {{ row[column.key] }}
                </td>

                <td v-if="$slots.actions" class="text-right">
                    <slot name="actions" :row="row" />
                </td>
                </tr>

                <!-- Estado vazio -->
                <tr v-if="paginatedRows.length === 0">
                <td
                    :colspan="columns.length + ($slots.actions ? 1 : 0)"
                    class="text-center py-6 text-gray-500"
                >
                    Nenhum registro encontrado
                </td>
                </tr>
            </template>
            </tbody>

        </table>
      </div>

      <!-- Paginação -->
      <div
        v-if="totalPages > 1"
        class="flex justify-end p-4"
      >
        <div class="join">
          <button
            class="join-item btn btn-sm"
            :disabled="currentPage === 1"
            @click="currentPage--"
          >
            «
          </button>

          <button class="join-item btn btn-sm">
            Página {{ currentPage }} de {{ totalPages }}
          </button>

          <button
            class="join-item btn btn-sm"
            :disabled="currentPage === totalPages"
            @click="currentPage++"
          >
            »
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
