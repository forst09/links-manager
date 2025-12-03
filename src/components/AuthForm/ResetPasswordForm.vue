<script setup>
import { ref } from 'vue'
import { z } from 'zod'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { Form } from '@primevue/forms'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'
import { useToastNotification } from '@/composables/useToastNotifications'
import { useAuth } from '@/composables/useAuth'

const { showToast } = useToastNotification()
const { resetPassword, loading, errorMessage } = useAuth()

const email = ref('')

const rules = z.object({
  email: z.email({ message: 'Некорректный email' }),
})

const resolver = ref(zodResolver(rules))

const submitForm = async ({ valid }) => {
  if (!valid) return

  try {
    await resetPassword(email.value)
    showToast('success', 'Ссылка на сброс пароля уже на вашей почте')
  } catch {
    showToast('error', 'Ошибка входа', errorMessage.value)
  }
}
</script>

<template>
  <Form
    v-slot="$form"
    :initial-values="{ email }"
    :resolver="resolver"
    :validate-on-blur="true"
    :validate-on-value-update="false"
    @submit="submitForm"
  >
    <div class="mb-3">
      <InputText
        v-model="email"
        name="email"
        placeholder="Введите email"
        type="text"
        class="w-full"
      />
      <Message v-if="$form.email?.invalid" severity="error" variant="simple" size="small">
        {{ $form.email.error.message }}
      </Message>
    </div>
    <div class="grid">
      <Button type="submit" class="w-full" label="Сброс пароля" :loading="loading" />
    </div>
  </Form>
</template>
