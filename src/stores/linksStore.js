import { supabase } from '@/lib/supabaseClient'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref } from 'vue'

const LIMIT = 1

export const useLinksStore = defineStore('links', () => {
    const isLoading = ref(false)
    const links = ref([])
    const onlyFavorites = ref(false)
    const sortByPopular = ref(false)
    const totalLinks = ref(0)
    const hasMore = ref(true)
    const offset = ref(0)

    const fetchLinks = async (resetPages = false, resetFilters = false) => {
        isLoading.value = true

        if (resetPages) {
            offset.value = 0
            links.value = []
            hasMore.value = true
        }

        if (resetFilters) {
            sortByPopular.value = false
            onlyFavorites.value = false
        }

        try {
            let query = supabase
                .from('links')
                .select(
                    'id, name, url, description, is_favorite, preview_image, click_count, categories (id, name)', { count: 'exact' }
                ).range(offset.value, offset.value + LIMIT - 1)

            if (onlyFavorites.value) query.eq('is_favorite', true)
            if (sortByPopular.value) {
                query.order('click_count', { ascending: false })
            } else {
                query.order('created_at', { ascending: false })
            }

            const { data, error, count } = await query
            if (error) throw error
            totalLinks.value = count
            offset.value += data.length
            console.log(count)
            links.value.push(...data)
            hasMore.value = offset.value < totalLinks.value
        } catch (e) {
            console.error('Ошибка загрузки', e)
        } finally {
            isLoading.value = false
        }
    }

    const changeIsFavorite = async (id) => {
        const index = links.value.findIndex((link) => link.id === id)
        if (index !== -1) {
            const newFavorite = !links.value[index].is_favorite

            const { error } = await supabase
                .from('links')
                .update({ is_favorite: newFavorite })
                .eq('id', id)

            if (error) throw error
            links.value[index].is_favorite = newFavorite
        }
    }

    const removeLink = async (id) => {
        const { error } = await supabase.from('links').delete().eq('id', id)
        if (error) throw error
        links.value = links.value.filter((link) => link.id !== id)
    }

    const addClickCount = async (id) => {
        const index = links.value.findIndex((link) => link.id === id)
        if (index !== -1) {
            const newClickCount = links.value[index].click_count + 1

            const { error } = await supabase
                .from('links')
                .update({ click_count: newClickCount })
                .eq('id', id)

            if (error) throw error
            links.value[index].click_count = newClickCount
        }
    }

    return { isLoading, links, onlyFavorites, sortByPopular, hasMore, offset, fetchLinks, changeIsFavorite, removeLink, addClickCount }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useLinksStore, import.meta.hot))
}
