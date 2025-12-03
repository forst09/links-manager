
import { supabase } from '@/lib/supabaseClient'
import { useRequest } from './useRequest'

export function useAuth() {
    const { loading, errorMessage, handleRequest } = useRequest();

    const signUp = async ({ email, password, firstname }) => {
        return await handleRequest(async () => {
            const { data, error } = await supabase.auth.signUp({ email, password })

            await supabase.from('users').insert([{ id: data.user.id, firstname, email }])

            if (error) throw error

            return data
        });
    }

    const signIn = async ({ email, password }) => {
        return await handleRequest(async () => {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password })

            if (error) throw error

            return data
        });
    }

    const resetPassword = async (email) => {
        return await handleRequest(async () => {
            const { data, error } = await supabase.auth.resetPasswordForEmail(email)

            if (error) throw error

            return data
        });
    }

    return { signUp, signIn, resetPassword, loading, errorMessage }
}