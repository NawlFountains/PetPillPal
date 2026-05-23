import { useAuth } from "@/context/AuthContext"
import { supabase } from "@/lib/supabase"
import { useState } from "react"

export function useJoinFamily(onSuccess: () => void) {
    const { profile, refreshFamilies } = useAuth()
    const [familyCode, setFamilyCode] = useState('')
    const [loading, setLoading] = useState(false)
    const[error, setError] = useState('')

    async function handleJoinFamily() {
        if (!familyCode.trim()) {
            setError('Family code is required')
            return
        }

        // If user not logged in 
        if (!profile) return
        
        setLoading(true)
        setError('')

        const { data: family, error: familyError } = await supabase
            .from('families')
            .select(`
                id,
                code`)
            .eq('code', familyCode)
            .single()

            
        if (familyError || !family) {
            setError('Family not found — check the code and try again')
            setLoading(false)
            return
        }

        const { error: memberError } = await supabase
            .from('family_member')
            .insert({
                user_id: profile.id,
                family_id: family!.id
            })
        
        if (memberError) {
            if (memberError.code === '23505') {  // unique constraint violation
                setError('You are already a member of this family')
            } else {
                setError('This is a member error: ' + memberError.message)
            }
            setLoading(false)
            return
        }
    
        setLoading(false)
        setFamilyCode('')
        await refreshFamilies()
        onSuccess()
    }

    return { familyCode, setFamilyCode, loading, error, handleJoinFamily }
}