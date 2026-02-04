<script setup>
import DefaultLayout from '@/layouts/DefaultLayout.vue'
</script>

<template>
  <DefaultLayout v-if="$route.meta.layout === 'default'">
    <router-view />
  </DefaultLayout>

  <router-view v-else />
</template>
