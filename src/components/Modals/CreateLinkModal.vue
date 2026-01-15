<script setup>
import { Button, Checkbox, Dialog, InputText, Select, Textarea } from 'primevue'
import { ref } from 'vue'

const modelValue = defineModel()

const formInputs = ref({
  name: '',
  url: '',
  description: '',
  category: null,
  isFavorite: false,
})

const listCategories = ref([{ id: 1, name: 'test' }])

const saveLink = () => {
  console.log('save')
}
</script>

<template>
  <Dialog modal header="Создание ссылки" v-model:visible="modelValue" :style="{ width: '25rem' }">
    <div class="mb-3">
      <InputText
        v-model="formInputs.name"
        class="w-full"
        autocomplete="off"
        placeholder="Название ссылки"
      />
    </div>
    <div class="mb-3">
      <InputText v-model="formInputs.url" class="w-full" autocomplete="off" placeholder="Ссылка" />
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
      <Button label="Добавить" @click="saveLink" />
    </div>
  </Dialog>
</template>
