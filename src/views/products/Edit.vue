<script setup>
import { reactive, ref, onMounted, computed } from 'vue'
import { useProductsStore } from '@/stores/products'
import { useSuppliersStore } from '@/stores/suppliers'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const productsStore = useProductsStore()
const suppliersStore = useSuppliersStore()

const form = reactive({
    id: null,
    supplierId: '',
    reference: '',
    name: '',
    color: '',
    price: 0
})

const suppliers = computed(() => suppliersStore.items)

onMounted(async () => {
    await suppliersStore.fetchSuppliers()

    const id = Number(route.params.id)
    const product = productsStore.items.find(p => p.id === id)
    if (product) Object.assign(form, product)
})

function submit() {
    if (!form.supplierId || !form.reference || !form.name || !form.price) {
        alert('Preencha todos os campos obrigatórios')
        return
    }

    productsStore.update(form)
    router.push('/products')
}
</script>

<template>
    <div class="max-w-xl space-y-6">
        <h2 class="text-xl font-semibold">Editar Produto</h2>

        <form class="space-y-4" @submit.prevent="submit">
            <select v-model="form.supplierId" class="select select-bordered w-full" required>
                <option value="" disabled>Selecione o fornecedor</option>
                <option v-for="s in suppliers" :key="s.id" :value="s.id">{{ s.name }}</option>
            </select>

            <input v-model="form.reference" placeholder="Referência" class="input input-bordered w-full" required />
            <input v-model="form.name" placeholder="Nome do produto" class="input input-bordered w-full" required />
            <input v-model="form.color" placeholder="Cor" class="input input-bordered w-full" />

            <input v-model.number="form.price" type="text" placeholder="Preço" class="input input-bordered w-full"
                min="0" step="0.01" v-mask-money required />

            <div class="flex gap-2">
                <button class="btn btn-primary" type="submit">Salvar</button>
                <RouterLink to="/products" class="btn btn-ghost">Cancelar</RouterLink>
            </div>
        </form>
    </div>
</template>
