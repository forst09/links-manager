<script setup>
import { RouterView } from 'vue-router'
import TheHeader from './components/TheHeader.vue'
import { useUserStore } from './stores/userStore'
import { onMounted } from 'vue'
import Toast from 'primevue/toast'

const authStore = useUserStore()

onMounted(async () => {
  authStore.getUser()
})
</script>

<template>
  <Toast />
  <TheHeader v-if="authStore.user" />
  <RouterView />
</template>

<style scoped></style>
