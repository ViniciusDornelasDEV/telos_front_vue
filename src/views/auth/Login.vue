<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)

async function login() {
  loading.value = true

  // fake delay só pra UX
  setTimeout(() => {
    auth.loginFake()
    router.push('/')
  }, 600)
}
</script>
<template>
  <div class="min-h-screen flex items-center justify-center bg-base-200">
    <div class="card w-full max-w-sm shadow-xl bg-base-100">
      <div class="card-body space-y-4">
        <h1 class="text-2xl font-bold text-center">
          Entrar no sistema
        </h1>

        <p class="text-sm text-center text-base-content/70">
          Protótipo • Login fictício
        </p>

        <div class="form-control">
          <label class="label">
            <span class="label-text">E-mail</span>
          </label>
          <input v-model="email" type="email" placeholder="seu@email.com" class="input input-bordered" />
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">Senha</span>
          </label>
          <input v-model="password" type="password" placeholder="••••••••" class="input input-bordered" />
        </div>

        <button class="btn btn-primary w-full" :class="{ loading }" @click="login">
          Entrar
        </button>
      </div>
    </div>
  </div>
</template>
