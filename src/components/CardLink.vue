<script setup>
import { useToastNotification } from '@/composables/useToastNotifications'
import { useLinksStore } from '@/stores/linksStore'
import { Card, SpeedDial } from 'primevue'
import { computed, ref } from 'vue'
import CreateLinkModal from './Modals/CreateLinkModal.vue'

const linksStore = useLinksStore()
const { showToast } = useToastNotification()

const props = defineProps({
  link: {
    type: Object,
    required: true,
  },
})

const createLinkDialogVisible = ref(false)

const itemsMenuButton = ref([
  {
    label: 'Избранное',
    icon: 'pi pi-star',
    command: async () => {
      try {
        await linksStore.changeIsFavorite(props.link.id)
        showToast('success', 'Успешно', 'Изменения сохранены')
      } catch {
        showToast('error', 'Ошибка')
      }
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
      createLinkDialogVisible.value = true
    },
  },
  {
    label: 'Удалить',
    icon: 'pi pi-trash',
    command: async () => {
      try {
        await linksStore.removeLink(props.link.id)
        showToast('success', 'Успешно', 'Ссылка удалена')
      } catch {
        showToast('error', 'Ошибка')
      }
    },
  },
])

const openLink = () => {
  linksStore.addClickCount(props.link.id)
}

const isFavoriteBgCard = computed(() => {
  return props.link.is_favorite ? 'var(--p-button-outlined-warn-hover-background)' : ''
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
  <CreateLinkModal v-model="createLinkDialogVisible" is-edit :id="link.id" />
  <Card class="relative" :style="{ backgroundColor: isFavoriteBgCard }">
    <template #title>
      <div class="flex items-center gap-2 pr-10">
        <img :src="link.preview_image" :alt="link.name" />
        <a :href="link.url" target="_blank" @click="openLink">{{ link.name }}</a>
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
