import { useAuth } from "@/context/AuthContext"
import { supabase } from "@/lib/supabase"
import { useState } from "react"

export function useExitFamily(onSuccess: () => void) {
    const { profile, refreshFamilies } = useAuth()
    const [loading, setLoading] = useState(false)
    const[error, setError] = useState('')

    async function handleExitFamily(familyId: string) {
        // If user not logged in 
        if (!profile) return
        
        setLoading(true)
        setError('')

        const { error: exitError } = await supabase
            .from('family_member')
            .delete()
            .eq('user_id', profile.id)
            .eq('family_id', familyId)
            
        if (exitError) {
            setError(exitError.message)
            setLoading(false)
            return
        }
    
        setLoading(false)
        await refreshFamilies()
        onSuccess()
    }

    return { loading, error, handleExitFamily }
}