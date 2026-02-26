<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSuppliersStore } from '@/stores/suppliers'
import { useProductsStore } from '@/stores/products'

const router = useRouter()
const suppliersStore = useSuppliersStore()
const productsStore = useProductsStore()

const file = ref(null)
const uploading = ref(false)
const supplierId = ref('')

const suppliers = computed(() => suppliersStore.items)

onMounted(async () => {
    await suppliersStore.fetchSuppliers()
})

function handleFileChange(event) {
    file.value = event.target.files[0]
}

async function submit() {
    if (!file.value || !supplierId.value) {
        alert('Selecione um fornecedor e um arquivo CSV')
        return
    }

    uploading.value = true

    try {
        await productsStore.importCsv({
            file: file.value,
            supplierId: supplierId.value
        })

        alert('Upload iniciado! Você receberá um email quando o processamento terminar.')
        router.push('/products')
    } catch (error) {
        console.error(error)
        alert('Erro ao enviar o arquivo')
    } finally {
        uploading.value = false
    }
}

</script>

<template>
    <div class="max-w-md space-y-4">
        <h2 class="text-xl font-semibold">Upload de Produtos</h2>

        <select v-model="supplierId" class="select select-bordered w-full" required>
            <option value="" disabled>Selecione o fornecedor</option>
            <option v-for="s in suppliers" :key="s.id" :value="s.id">{{ s.name }}</option>
        </select>

        <input type="file" accept=".csv" @change="handleFileChange" class="file-input file-input-bordered w-full" />

        <button class="btn btn-primary w-full" :disabled="uploading" @click="submit">
            {{ uploading ? 'Enviando...' : 'Enviar CSV' }}
        </button>

        <RouterLink to="/products" class="btn btn-ghost w-full">Cancelar</RouterLink>
    </div>
</template>
