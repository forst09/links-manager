<script setup>
import { ref } from 'vue'
import { Form } from '@primevue/forms'
import { Button, Dialog, InputText, Toast } from 'primevue'
import { useToastNotification } from '@/composables/useToastNotifications'
import { supabase } from '@/lib/supabaseClient'

const { showToast } = useToastNotification()

const isLoading = ref(false)

const modelValue = defineModel()

const categoryName = ref('')
const listCategories = ref([
  {
    id: 1,
    name: 'test',
  },
  {
    id: 2,
    name: 'test 2',
  },
])

const saveCategory = async () => {
  isLoading.value = true

  try {
    const { data, error } = await supabase.from('categories').insert({ name: categoryName.value })

    if (error) throw error

    categoryName.value = ''
    showToast('success', 'Успех', 'Категория добавлена')
  } catch {
    showToast('error', 'Ошибка', 'Не удалось добавить категорию')
  } finally {
    isLoading.value = false
  }
}

const deleteCategory = (id) => {
  console.log(id)
}
</script>

<template>
  <Toast />
  <Dialog header="Категории" v-model:visible="modelValue" :style="{ width: '25rem' }">
    <Form @submit="saveCategory">
      <div class="mb-2">
        <InputText
          v-model="categoryName"
          placeholder="Название новой категории"
          class="flex-auto w-full"
          autocomplete="off"
        />
      </div>
      <div class="flex justify-end gap-2 mt-4">
        <Button type="button" label="Добавить" :loading="isLoading" @click="saveCategory" />
      </div>
      <div
        class="grid mt-3 grid-cols-[1fr_32px] mb-1 gap-5"
        v-for="category in listCategories"
        :key="category.id"
      >
        {{ category.name }}
        <Button
          type="button"
          rounded
          size="small"
          variant="text"
          icon="pi pi-times"
          @click="deleteCategory(category.id)"
        />
      </div>
    </Form>
  </Dialog>
</template>
