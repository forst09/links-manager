import { supabase } from "@/lib/supabaseClient";
import { defineStore } from "pinia";
import { ref } from 'vue'

export const useUserStore = defineStore('auth', () => {
    const user = ref(null);

    async function getUser() {
        const { data } = await supabase.auth.getUser();
        console.log(data);

        user.value = data?.user || null
    }

    return { user, getUser }
})