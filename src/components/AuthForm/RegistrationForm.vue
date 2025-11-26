<script setup>
import { ref } from 'vue'
import { z } from 'zod'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { useToast } from 'primevue/usetoast'
import { Form } from '@primevue/forms'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'
import Toast from 'primevue/toast'
import { supabase } from '@/lib/supabaseClient'

const toast = useToast()

const formData = ref({
  email: '',
  password: '',
  firstname: '',
})

const rules = z.object({
  firstname: z.string().min(1, { message: 'Имя обязательно для заполнения' }),
  email: z.email({ message: 'Некорректный email' }),
  password: z.string().min(6, { message: 'Должно быть минимум 6 символов' }),
})

const resolver = ref(zodResolver(rules))

const submitForm = async ({ valid }) => {
  console.log(valid)
  if (!valid) return

  const { data, error } = await supabase.auth.signUp({
    email: formData.value.email,
    password: formData.value.password,
  })

  if (error) {
    toast.add({ severity: 'error', summary: 'Ошибка', detail: error, life: 3000 })
  } else {
    toast.add({
      severity: 'success',
      summary: 'Регистрация',
      detail: 'Вы успешно зарегистрированы',
      life: 3000,
    })
  }

  console.log(data, error)
}
</script>

<template>
  <Toast />
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
    <div class="mb-3">
      <InputText
        v-model="formData.firstname"
        name="firstname"
        placeholder="Введите свое имя"
        type="text"
        class="w-full"
      />
      <Message v-if="$form.firstname?.invalid" severity="error" variant="simple" size="small">
        {{ $form.firstname.error.message }}
      </Message>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <Button type="submit" class="w-full" label="Регистрация" />
      <Button type="submit" icon="pi pi-github" class="w-full" label="Github" severity="contrast" />
    </div>
  </Form>
</template>
