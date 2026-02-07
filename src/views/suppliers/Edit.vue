<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useSuppliersStore } from '@/stores/suppliers'
import { useUsersStore } from '@/stores/users'
import { useRouter, useRoute } from 'vue-router'
import { fetchAddressByCep } from '@/services/viacep'
import { validateCnpj } from '@/utils/validateCnpj'

const route = useRoute()
const router = useRouter()
const suppliersStore = useSuppliersStore()
const usersStore = useUsersStore()
const form = reactive({
  id: null,
  name: '',
  cnpj: '',
  cep: '',
  address: '',
  status: 'active',
  sellers: []
})

const loadingCep = ref(false)
const cnpjError = ref('')
const sellersOptions = ref([])
const selectedSellerId = ref('')

onMounted(async () => {
  const supplierId = Number(route.params.id)
  const supplier = suppliersStore.items.find(s => s.id === supplierId)
  if (supplier) {
    Object.assign(form, supplier)
    form.sellers = supplier.sellers || []
  }
  if (usersStore.items.length === 0) {
    await usersStore.fetchUsers()
  }
  sellersOptions.value = usersStore.items.filter(u => u.type === 'vendedor')
})

async function handleCepBlur() {
  try {
    loadingCep.value = true
    const address = await fetchAddressByCep(form.cep)
    if (address) {
      form.address = `${address.street}, ${address.district} - ${address.city}/${address.state}`
    }
  } catch (e) {
    alert('CEP inválido ou não encontrado')
    form.address = ''
  } finally {
    loadingCep.value = false
  }
}

function handleCnpjBlur() {
  if (!validateCnpj(form.cnpj)) {
    cnpjError.value = 'CNPJ inválido'
  } else {
    cnpjError.value = ''
  }
}

function addSeller() {
  if (!selectedSellerId.value) return
  const sellerId = Number(selectedSellerId.value)
  if (!form.sellers.includes(sellerId)) {
    form.sellers.push(sellerId)
  }
  selectedSellerId.value = ''
}

function removeSeller(id) {
  form.sellers = form.sellers.filter(s => s !== id)
}

async function submit() {
  if (!validateCnpj(form.cnpj)) {
    cnpjError.value = 'CNPJ inválido'
    return
  }
  cnpjError.value = ''
  const updatedSupplier = await suppliersStore.update({
    ...form,
    sellers: [...form.sellers]
  })
  Object.assign(form, updatedSupplier)
  router.push('/suppliers')
}

</script>

<template>
  <div class="max-w-xl space-y-6">
    <h2 class="text-xl font-semibold">Editar Fornecedor</h2>

    <form class="space-y-4" @submit.prevent="submit">
      <input v-model="form.name" placeholder="Name" class="input input-bordered w-full" required />

      <input v-model="form.cnpj" placeholder="CNPJ" class="input input-bordered w-full" @blur="handleCnpjBlur"
        v-mask="'99.999.999/9999-99'" required />
      <div v-if="cnpjError" class="text-red-500 text-sm">{{ cnpjError }}</div>

      <input v-model="form.cep" placeholder="CEP" class="input input-bordered w-full" @blur="handleCepBlur"
        v-mask="'99999-999'" required />

      <input v-model="form.address" placeholder="Address" class="input input-bordered w-full" :disabled="loadingCep"
        required />

      <div v-if="loadingCep" class="text-sm text-base-content/60">
        carregando endereço...
      </div>

      <select v-model="form.status" class="select select-bordered w-full">
        <option value="active">Ativo</option>
        <option value="inactive">Inativo</option>
      </select>

      <!-- sellers subform -->
      <div class="space-y-2 mt-4">
        <h3 class="font-semibold">Vendedores</h3>
        <div class="flex gap-2 items-center">
          <select v-model="selectedSellerId" class="select select-bordered flex-1">
            <option value="" disabled>Selecione um vendedor</option>
            <option v-for="s in sellersOptions" :key="s.id" :value="s.id">{{ s.name }}</option>
          </select>
          <button type="button" class="btn btn-sm btn-primary" @click="addSeller">Add</button>
        </div>

        <ul class="mt-2">
          <li v-for="id in form.sellers" :key="id" class="flex justify-between items-center border p-2 rounded">
            {{usersStore.items.find(u => u.id === id)?.name || 'Unknown'}}
            <button type="button" class="btn btn-xs btn-ghost text-error" @click="removeSeller(id)">Remove</button>
          </li>
        </ul>
      </div>

      <div class="flex gap-2 mt-4">
        <button class="btn btn-primary" type="submit">Save</button>
        <RouterLink to="/suppliers" class="btn btn-ghost">Cancel</RouterLink>
      </div>
    </form>
  </div>
</template>
