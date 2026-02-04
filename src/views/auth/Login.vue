<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

function login() {
  auth.loginFake()
  router.push('/')
}
</script>

<template>
  <div>
    <h1>Login</h1>
    <button @click="login">Entrar</button>
  </div>
</template>
