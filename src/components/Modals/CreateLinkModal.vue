<script setup>
import { Form } from '@primevue/forms'
import { Button, Checkbox, Dialog, InputText, Message, Select, Textarea, Toast } from 'primevue'
import { ref, watch } from 'vue'
import z from 'zod'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { supabase } from '@/lib/supabaseClient'
import { useToastNotification } from '@/composables/useToastNotifications'
import Loader from '../Loader.vue'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()

const modelValue = defineModel()
const isLoading = ref(false)
const isLoadingBtn = ref(false)
const { showToast } = useToastNotification()

const rules = z.object({
  name: z.string().min(1, { message: 'Название обязательно для заполнения' }),
  url: z.url({ message: 'Некорректная ссылка' }),
})

const resolver = ref(zodResolver(rules))

const formInputs = ref({
  name: '',
  url: '',
  description: '',
  category: null,
  isFavorite: false,
})

const clear = () => {
  formInputs.value = {
    name: '',
    url: '',
    description: '',
    category: null,
    isFavorite: false,
  }
}

const listCategories = ref([{ id: 1, name: 'test' }])

const getCategories = async () => {
  try {
    const { data, error } = await supabase.from('categories').select()

    if (error) throw error
    listCategories.value = data
    formInputs.value.category = listCategories.value[0]
  } catch {
    showToast('error', 'Ошибка', 'Не удалось получить категории')
  }
}

const loadModal = async () => {
  isLoading.value = true
  await getCategories()
  isLoading.value = false
}

const getDomain = (url) => {
  const { hostname } = new URL(url)
  const parts = hostname.split('.')
  if (parts.length > 2) {
    return parts.slice(-2).join('.')
  }
  return hostname
}

const addNewLink = async () => {
  isLoadingBtn.value = true

  const hostname = getDomain(formInputs.value.url)

  const payload = {
    name: formInputs.value.name,
    url: formInputs.value.url,
    description: formInputs.value.description,
    category: formInputs.value.category.id,
    click_count: 0,
    is_favorite: formInputs.value.isFavorite,
    preview_image: `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${hostname}&size=32`,
    user_id: userStore.user.id,
  }

  try {
    const { error } = await supabase.from('links').insert(payload).select()

    if (error) throw error
    modelValue.value = false
    clear()
    showToast('success', 'Успех', 'Ссылка добавлена')
  } catch {
    showToast('error', 'Ошибка', 'Не удалось добавить ссылку')
  } finally {
    isLoadingBtn.value = false
  }
}

const submitForm = async () => {
  await addNewLink()
}

watch(modelValue, async (newValue) => {
  if (newValue) {
    await loadModal()
  }
})
</script>

<template>
  <Toast />
  <Dialog modal header="Создание ссылки" v-model:visible="modelValue" :style="{ width: '25rem' }">
    <Form
      v-slot="$form"
      :initial-values="formInputs"
      :resolver="resolver"
      :validate-on-submit="true"
      :validate-on-value-update="false"
      @submit="submitForm"
    >
      <Loader v-if="isLoading" />
      <template v-else>
        <div class="mb-3">
          <InputText
            v-model="formInputs.name"
            name="name"
            class="w-full"
            autocomplete="off"
            placeholder="Название ссылки"
          />
          <Message v-if="$form.name?.invalid" severity="error" variant="simple" size="small">
            {{ $form.name.error.message }}
          </Message>
        </div>
        <div class="mb-3">
          <InputText
            v-model="formInputs.url"
            name="url"
            class="w-full"
            autocomplete="off"
            placeholder="Ссылка"
          />
          <Message v-if="$form.url?.invalid" severity="error" variant="simple" size="small">
            {{ $form.url.error.message }}
          </Message>
        </div>
        <div class="mb-3">
          <Select
            v-model="formInputs.category"
            :options="listCategories"
            option-label="name"
            placeholder="Выберите категорию"
            class="w-full"
          />
        </div>
        <div class="mb-3">
          <Textarea
            v-model="formInputs.description"
            class="w-full"
            style="resize: none"
            placeholder="Описание"
          />
        </div>
        <div class="mb-3 flex items-center gap-2">
          <Checkbox v-model="formInputs.isFavorite" input-id="isFavorite" binary />
          <label for="isFavorite">Добавить в избранное</label>
        </div>
        <div class="flex justify-end gap-2 mt-4">
          <Button label="Добавить" type="submit" :loading="isLoadingBtn" />
        </div>
      </template>
    </Form>
  </Dialog>
</template>
