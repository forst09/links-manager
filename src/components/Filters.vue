<script setup>
import { useLinksStore } from '@/stores/linksStore'
import { Checkbox } from 'primevue'

const linksStore = useLinksStore()

const updateFilters = () => {
  linksStore.fetchLinks()
}
</script>

<template>
  <div class="md:flex gap-5 justify-center block">
    <div class="mb-3 flex items-center gap-2">
      <Checkbox
        v-model="linksStore.sortByPopular"
        input-id="sortByPopular"
        name="sortByPopular"
        binary
        @change="updateFilters"
      />
      <label for="sortByPopular">Сначала популярные</label>
    </div>
    <div class="mb-3 flex items-center gap-2">
      <Checkbox
        v-model="linksStore.onlyFavorites"
        input-id="onlyFavorites"
        name="onlyFavorites"
        binary
        @change="updateFilters"
      />
      <label for="onlyFavorites">Только избранные</label>
    </div>
  </div>
</template>
