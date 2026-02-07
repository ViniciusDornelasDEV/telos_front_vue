<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrdersStore } from '@/stores/orders'
import { useSuppliersStore } from '@/stores/suppliers'
import { useProductsStore } from '@/stores/products'
import MoneyInput from '@/components/MoneyInput.vue'

const route = useRoute()
const router = useRouter()

const ordersStore = useOrdersStore()
const suppliersStore = useSuppliersStore()
const productsStore = useProductsStore()

const orderId = route.params.id

const supplierId = ref(null)
const date = ref('')
const status = ref('')
const observation = ref('')
const items = ref([])
const originalOrder = ref(null)

const isReadOnly = computed(() => {
    if (!originalOrder.value) return true
    return originalOrder.value.status !== 'Pendente'
})

onMounted(async () => {
    await suppliersStore.fetchSuppliers()

    const order = ordersStore.fetchById(orderId)
    if (!order) return

    originalOrder.value = order

    supplierId.value = order.supplier?.id ?? null
    date.value = order.date
    status.value = order.status
    observation.value = order.observation

    // 🔥 NOVO: busca produtos do fornecedor do pedido
    if (supplierId.value) {
        await productsStore.fetchBySupplier(supplierId.value)
    }

    items.value = order.items.map(i => ({
        productId: i.productId,
        unitPrice: Number(i.unitPrice),
        quantity: Number(i.quantity)
    }))
})

// 🔥 NOVO: ao trocar fornecedor, refaz a busca
watch(supplierId, async (newValue, oldValue) => {
    if (isReadOnly.value) return
    if (newValue !== oldValue) {
        items.value = []
        await productsStore.fetchBySupplier(newValue)
    }
})

const totalValue = computed(() =>
    items.value.reduce(
        (total, item) =>
            total + (Number(item.unitPrice) || 0) * (Number(item.quantity) || 0),
        0
    )
)

function addItem() {
    if (isReadOnly.value) return

    items.value.push({
        productId: null,
        unitPrice: 0,
        quantity: 1
    })
}

function handleProductChange(item) {
    if (isReadOnly.value || !item.productId) return

    const product = productsStore.items.find(p => p.id === item.productId)
    if (product) {
        item.unitPrice = Number(product.price) || 0
    }
}

function removeItem(index) {
    if (isReadOnly.value) return
    items.value.splice(index, 1)
}

async function submit() {
    if (isReadOnly.value) return

    await ordersStore.update({
        id: Number(orderId),
        date: date.value,
        status: status.value,
        observation: observation.value,
        products: items.value.map(i => ({
            id: i.productId,
            unitPrice: i.unitPrice,
            quantity: i.quantity
        }))
    })

    productsStore.clear()
    router.push('/orders')
}
</script>
<template>
    <div class="space-y-6">
        <h2 class="text-xl font-semibold">
            Pedido #{{ orderId }}
            <span class="text-sm font-normal ml-2">
                ({{ status }})
            </span>
        </h2>

        <div class="grid grid-cols-2 gap-4">
            <div>
                <label class="label">Fornecedor</label>
                <select v-model.number="supplierId" class="select select-bordered w-full" :disabled="isReadOnly">
                    <option :value="null" disabled>Selecione</option>
                    <option v-for="s in suppliersStore.items" :key="s.id" :value="s.id">
                        {{ s.name }}
                    </option>
                </select>
            </div>

            <div>
                <label class="label">Data</label>
                <input type="date" v-model="date" class="input input-bordered w-full" :readonly="isReadOnly" />
            </div>

            <div>
                <label class="label">Status</label>
                <select v-model="status" class="select select-bordered w-full" :disabled="isReadOnly">
                    <option>Pendente</option>
                    <option>Concluído</option>
                    <option>Cancelado</option>
                </select>
            </div>

            <div class="col-span-2">
                <label class="label">Observação</label>
                <textarea v-model="observation" class="textarea textarea-bordered w-full" :readonly="isReadOnly" />
            </div>
        </div>

        <div class="space-y-2">
            <div class="flex justify-between items-center">
                <h3 class="font-semibold">Produtos</h3>

                <button v-if="!isReadOnly" class="btn btn-sm btn-outline" @click="addItem">
                    Adicionar Produto
                </button>
            </div>

            <table class="table w-full">
                <thead>
                    <tr>
                        <th>Produto</th>
                        <th>Valor Unitário</th>
                        <th>Quantidade</th>
                        <th>Total</th>
                        <th v-if="!isReadOnly"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in items" :key="index">
                        <td>
                            <select v-model="item.productId" class="select select-bordered w-full"
                                :disabled="isReadOnly" @change="handleProductChange(item)">
                                <option :value="null" disabled>Selecione</option>
                                <option v-for="p in productsStore.items" :key="p.id" :value="p.id">
                                    {{ p.name }}
                                </option>
                            </select>
                        </td>

                        <td>
                            <MoneyInput v-model="item.unitPrice" class="input input-bordered w-full"
                                :disabled="isReadOnly" />
                        </td>

                        <td>
                            <input type="number" min="1" v-model.number="item.quantity"
                                class="input input-bordered w-full" :readonly="isReadOnly" />
                        </td>

                        <td>
                            R$ {{
                                (Number(item.unitPrice) * Number(item.quantity))
                                    .toFixed(2)
                                    .replace('.', ',')
                            }}
                        </td>

                        <td v-if="!isReadOnly">
                            <button class="btn btn-xs btn-ghost text-error" @click="removeItem(index)">
                                Remover
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="flex justify-end gap-4">
            <span class="font-semibold">
                Total: R$ {{ totalValue.toFixed(2).replace('.', ',') }}
            </span>

            <button v-if="!isReadOnly" class="btn btn-primary" @click="submit">
                Salvar Alterações
            </button>
        </div>
    </div>
</template>
