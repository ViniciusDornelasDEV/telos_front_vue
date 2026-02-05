<script setup>
import { reactive, ref, onMounted, computed } from 'vue'
import { useProductsStore } from '@/stores/products'
import { useSuppliersStore } from '@/stores/suppliers'
import { useRouter } from 'vue-router'

const router = useRouter()
const productsStore = useProductsStore()
const suppliersStore = useSuppliersStore()

const form = reactive({
    supplierId: '',
    reference: '',
    name: '',
    color: '',
    price: ''
})

const suppliers = computed(() => suppliersStore.items)

onMounted(async () => {
    await suppliersStore.fetchSuppliers()
})

function submit() {
    productsStore.create(form)
    router.push('/products')
}
</script>

<template>
    <div class="max-w-xl space-y-6">
        <h2 class="text-xl font-semibold">Novo Produto</h2>

        <form class="space-y-4" @submit.prevent="submit">
            <select v-model="form.supplierId" class="select select-bordered w-full" required>
                <option value="" disabled>Selecione o fornecedor</option>
                <option v-for="s in suppliers" :key="s.id" :value="s.id">{{ s.name }}</option>
            </select>

            <input v-model="form.reference" placeholder="Referência" class="input input-bordered w-full" required />
            <input v-model="form.name" placeholder="Nome do produto" class="input input-bordered w-full" required />
            <input v-model="form.color" placeholder="Cor" class="input input-bordered w-full" required />

            <input v-model="form.price" type="text" placeholder="Preço" class="input input-bordered w-full" v-mask-money
                required />

            <div class="flex gap-2">
                <button class="btn btn-primary" type="submit">Salvar</button>
                <RouterLink to="/products" class="btn btn-ghost">Cancelar</RouterLink>
            </div>
        </form>
    </div>
</template>
