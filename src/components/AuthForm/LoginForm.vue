<script setup>
import { ref } from 'vue'
import { z } from 'zod'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { Form } from '@primevue/forms'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'
import { useToastNotification } from '@/composables/useToastNotifications'
import { useAuth } from '@/composables/useAuth'

const emits = defineEmits(['resetPassword'])

const { showToast } = useToastNotification()
const { signIn, loading, errorMessage } = useAuth()

const formData = ref({
  email: '',
  password: '',
})

const rules = z.object({
  email: z.email({ message: 'Некорректный email' }),
  password: z.string().min(6, { message: 'Должно быть минимум 6 символов' }),
})

const resolver = ref(zodResolver(rules))

const submitForm = async ({ valid }) => {
  if (!valid) return

  try {
    await signIn({
      email: formData.value.email,
      password: formData.value.password,
    })
  } catch {
    showToast('error', 'Ошибка входа', errorMessage.value)
  }
}
</script>

<template>
  <Form
    v-slot="$form"
    :initial-values="formData"
    :resolver="resolver"
    :validate-on-blur="true"
    :validate-on-value-update="false"
    @submit="submitForm"
  >
    <div class="mb-3">
      <InputText
        v-model="formData.email"
        name="email"
        placeholder="Введите email"
        type="text"
        class="w-full"
      />
      <Message v-if="$form.email?.invalid" severity="error" variant="simple" size="small">
        {{ $form.email.error.message }}
      </Message>
    </div>
    <div class="mb-3">
      <InputText
        v-model="formData.password"
        name="password"
        placeholder="Введите пароль"
        type="password"
        class="w-full"
      />
      <Message v-if="$form.password?.invalid" severity="error" variant="simple" size="small">
        {{ $form.password.error.message }}
      </Message>
    </div>
    <span class="cursor-pointer mb-3 block" @click="emits('resetPassword')">Забыли пароль?</span>
    <div class="grid grid-cols-2 gap-3">
      <Button type="submit" class="w-full" label="Вход" />
      <Button type="submit" icon="pi pi-github" class="w-full" label="Github" severity="contrast" />
    </div>
  </Form>
</template>
