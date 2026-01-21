<script setup>
import { useToastNotification } from '@/composables/useToastNotifications'
import { useLinksStore } from '@/stores/linksStore'
import { Card, SpeedDial } from 'primevue'
import { ref } from 'vue'

const linksStore = useLinksStore()
const { showToast } = useToastNotification()

const itemsMenuButton = ref([
  {
    label: 'Избранное',
    icon: 'pi pi-star',
    command: () => {
      console.log('add to fav')
    },
  },
  {
    label: 'Скопировать',
    icon: 'pi pi-link',
    command: () => {
      copyToClipboard()
    },
  },
  {
    label: 'Редактировать',
    icon: 'pi pi-pencil',
    command: () => {
      console.log('edit link')
    },
  },
  {
    label: 'Удалить',
    icon: 'pi pi-trash',
    command: () => {
      console.log('remove link')
    },
  },
])

const props = defineProps({
  link: {
    type: Object,
    required: true,
  },
})

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(props.link.url)
    showToast('success', 'Успешно', `Скопировано ${props.link.name}`)
  } catch {
    showToast('error', 'Ошибка при копировании')
  }
}
</script>

<template>
  <Card class="relative">
    <template #title>
      <div class="flex items-center gap-2 pr-10">
        <img :src="link.preview_image" :alt="link.name" />
        <a :href="link.url" target="_blank">{{ link.name }}</a>
        <SpeedDial
          :model="itemsMenuButton"
          :tooltip-options="{ position: 'left' }"
          :direction="'down'"
          style="position: absolute; right: 20px; top: 20px"
        />
      </div>
    </template>
    <template #content>
      <div class="flex gap-2 flex-col">
        <div class="font-bold">{{ link.categories.name }}</div>
        <div v-if="link.description" class="w-fill">{{ link.description }}</div>
      </div>
    </template>
  </Card>
</template>
