<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useOrdersStore } from '@/stores/orders'
import { useSuppliersStore } from '@/stores/suppliers'
import { useProductsStore } from '@/stores/products'
import MoneyInput from '@/components/MoneyInput.vue'

const router = useRouter()
const ordersStore = useOrdersStore()
const suppliersStore = useSuppliersStore()
const productsStore = useProductsStore()

const supplierId = ref(null)
const date = ref(new Date().toISOString().substring(0, 10))
const status = ref('Pendente')
const observation = ref('')
const items = ref([])

onMounted(async () => {
    await suppliersStore.fetchSuppliers()
    await productsStore.fetchProducts()

})

const filteredProducts = computed(() => {
    if (!supplierId.value) return []
    return productsStore.items.filter(p => p.supplierId === supplierId.value)
})

const totalValue = computed(() => {
    return items.value.reduce((total, item) => {
        return total + (Number(item.unitPrice) || 0) * (Number(item.quantity) || 0)
    }, 0)
})

watch(supplierId, (newValue, oldValue) => {
    if (oldValue !== null && newValue !== oldValue && items.value.length) {
        items.value = []

    }
})

function addItem() {
    items.value.push({
        productId: null,
        unitPrice: 0,
        quantity: 1,
    })
}

function handleProductChange(item) {
    if (!item.productId) return

    const product = productsStore.items.find(
        p => p.id === item.productId
    )

    if (product) {
        item.unitPrice = Number(product.price) || 0
    }
}

function removeItem(index) {
    items.value.splice(index, 1)
}

async function submit() {
    await ordersStore.create({
        supplierId: supplierId.value,
        date: date.value,
        status: status.value,
        observation: observation.value,
        products: items.value,
    })

    router.push('/orders')
}
</script>

<template>
    <div class="space-y-6">
        <h2 class="text-xl font-semibold">Novo Pedido</h2>

        <div class="grid grid-cols-2 gap-4">
            <div>
                <label class="label">Fornecedor</label>
                <select v-model.number="supplierId" class="select select-bordered w-full">
                    <option :value="null" disabled>Selecione</option>
                    <option v-for="s in suppliersStore.items" :key="s.id" :value="s.id">
                        {{ s.name }}
                    </option>
                </select>
            </div>

            <div>
                <label class="label">Data</label>
                <input type="date" v-model="date" class="input input-bordered w-full" />
            </div>

            <div class="col-span-2">
                <label class="label">Observação</label>
                <textarea v-model="observation" class="textarea textarea-bordered w-full" />
            </div>
        </div>

        <div class="space-y-2">
            <div class="flex justify-between items-center">
                <h3 class="font-semibold">Produtos</h3>
                <button class="btn btn-sm btn-outline" @click="addItem" :disabled="!supplierId">
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
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in items" :key="index">
                        <td>
                            <select v-model="item.productId" class="select select-bordered w-full"
                                @change="handleProductChange(item)">
                                <option :value="null" disabled>Selecione</option>
                                <option v-for="p in filteredProducts" :key="p.id" :value="p.id">
                                    {{ p.name }}
                                </option>
                            </select>
                        </td>
                        <td>
                            <MoneyInput v-model="item.unitPrice" required class="input input-bordered w-full" />
                        </td>
                        <td>
                            <input type="number" min="1" v-model.number="item.quantity"
                                class="input input-bordered w-full" />
                        </td>
                        <td>
                            R$ {{
                                (Number(item.unitPrice) * Number(item.quantity))
                                    .toFixed(2)
                                    .replace('.', ',')
                            }}
                        </td>
                        <td>
                            <button class="btn btn-xs btn-ghost text-error" @click="removeItem(index)">Remover</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="flex justify-end gap-4">
            <span class="font-semibold">Total: R$ {{ totalValue.toFixed(2).replace('.', ',') }}</span>
            <button class="btn btn-primary" @click="submit" :disabled="!items.length">
                Salvar Pedido
            </button>
        </div>
    </div>
</template>
