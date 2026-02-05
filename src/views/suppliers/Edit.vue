<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useSuppliersStore } from '@/stores/suppliers'
import { useRoute, useRouter } from 'vue-router'
import { fetchAddressByCep } from '@/services/viacep'
import { validateCnpj } from '@/utils/validateCnpj'

const route = useRoute()
const router = useRouter()
const suppliersStore = useSuppliersStore()
const supplierId = Number(route.params.id)
const supplier = suppliersStore.items.find(s => s.id === supplierId)
if (!supplier) {
  router.push('/suppliers')
}
const form = reactive({ ...supplier })
const loadingCep = ref(false)
const cnpjError = ref('')

async function handleCepBlur() {
  try {
    loadingCep.value = true
    const cleanCep = form.cep.replace(/\D/g, '')
    const address = await fetchAddressByCep(cleanCep)

    if (address) {
      form.address = `${address.street}, ${address.district} - ${address.city}/${address.state}`
    } else {
      form.address = ''
      alert('CEP inválido ou não encontrado')
    }
  } catch (e) {
    form.address = ''
    alert('Erro ao buscar CEP')
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

function submit() {
  if (!validateCnpj(form.cnpj)) {
    cnpjError.value = 'CNPJ inválido'
    return
  }

  cnpjError.value = ''
  suppliersStore.update(form)
  router.push('/suppliers')
}

</script>

<template>
  <div class="max-w-xl space-y-6">
    <h2 class="text-xl font-semibold">
      Editar Fornecedor
    </h2>

    <form class="space-y-4" @submit.prevent="submit">
        <input
          v-model="form.name"
          class="input input-bordered w-full"
          placeholder="Nome"
          required
        />

        <input
          v-model="form.cnpj"
          class="input input-bordered w-full"
          placeholder="CNPJ"
          @blur="handleCnpjBlur"
          v-mask="'99.999.999/9999-99'"
          required
        />
        <div v-if="cnpjError" class="text-red-500 text-sm">{{ cnpjError }}</div>

        <input
          v-model="form.cep"
          class="input input-bordered w-full"
          placeholder="CEP"
          @blur="handleCepBlur"
          v-mask="'99999-999'"
          required
        />

        <input
          v-model="form.address"
          class="input input-bordered w-full"
          placeholder="Endereço"
          :disabled="loadingCep"
          required
        />

        <div v-if="loadingCep" class="text-sm text-base-content/60">
            Buscando endereço...
        </div>

        <select
          v-model="form.status"
          class="select select-bordered w-full"
        >
          <option value="active">Ativo</option>
          <option value="inactive">Inativo</option>
        </select>

        <div class="flex gap-2">
          <button class="btn btn-primary" type="submit">
            Salvar
          </button>

          <RouterLink
            to="/suppliers"
            class="btn btn-ghost"
          >
            Cancelar
          </RouterLink>
        </div>
    </form>
  </div>
</template>
