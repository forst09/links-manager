<script setup>
import { RouterView } from 'vue-router'
import TheHeader from './components/TheHeader.vue'
import { useUserStore } from './stores/userStore'
import { onMounted } from 'vue'

const authStore = useUserStore()

onMounted(async () => {
  authStore.getUser()
})
</script>

<template>
  <TheHeader v-if="authStore.user" />
  <RouterView />
</template>

<style scoped></style>
