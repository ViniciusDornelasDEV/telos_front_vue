<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/modules/auth/store/authStore'
import DefaultLayout from '@/shared/layouts/DefaultLayout.vue'

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
