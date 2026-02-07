<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

const auth = useAuthStore()

onMounted(() => {
  auth.loadFromStorage()
})
</script>

<template>
  <DefaultLayout v-if="$route.meta.layout === 'default'">
    <router-view />
  </DefaultLayout>

  <router-view v-else />
</template>
