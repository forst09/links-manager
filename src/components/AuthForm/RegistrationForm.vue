<script setup>
import { ref } from 'vue'
import InputText from 'primevue/inputtext'

const formData = ref({
  email: '',
  password: '',
  firstname: '',
})
</script>

<template>
  <form>
    <div class="mb-3">
      <InputText
        v-model="formData.email"
        name="email"
        placeholder="Введите email"
        type="text"
        class="w-full"
      />
    </div>
    <div class="mb-3">
      <InputText
        v-model="formData.password"
        name="password"
        placeholder="Введите пароль"
        type="password"
        class="w-full"
      />
    </div>
    <div class="mb-3">
      <InputText
        v-model="formData.firstname"
        name="firstname"
        placeholder="Введите свое имя"
        type="text"
        class="w-full"
      />
    </div>
    <div class="grid grid-cols-2 gap-3">
      <Button type="submit" class="w-full" label="Регистрация" />
      <Button type="submit" icon="pi pi-github" class="w-full" label="Github" severity="contrast" />
    </div>
  </form>
</template>
