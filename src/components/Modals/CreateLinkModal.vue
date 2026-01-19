<script setup>
import { Form } from '@primevue/forms'
import { Button, Checkbox, Dialog, InputText, Message, Select, Textarea } from 'primevue'
import { ref } from 'vue'
import z from 'zod'
import { zodResolver } from '@primevue/forms/resolvers/zod'

const modelValue = defineModel()

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

const listCategories = ref([{ id: 1, name: 'test' }])

const submitForm = () => {
  console.log('save')
}
</script>

<template>
  <Dialog modal header="Создание ссылки" v-model:visible="modelValue" :style="{ width: '25rem' }">
    <Form
      v-slot="$form"
      :initial-values="formInputs"
      :resolver="resolver"
      :validate-on-submit="true"
      :validate-on-value-update="false"
      @submit="submitForm"
    >
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
        <Button label="Добавить" type="submit" />
      </div>
    </Form>
  </Dialog>
</template>
