
import { supabase } from '@/lib/supabaseClient'
import { useRequest } from './useRequest'

export function useAuth() {
    const { loading, errorMessage, handleRequest } = useRequest();

    const signUp = async ({ email, password }) => {
        return await handleRequest(async () => {
            const { data, error } = await supabase.auth.signUp({ email, password })

            if (error) throw error

            return data
        });

    }

    return { signUp, loading, errorMessage }
}