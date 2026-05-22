import { useAuth } from "@/context/AuthContext"
import { supabase } from "@/lib/supabase"
import { useState } from "react"

function generateCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
}

export function useCreateFamily(onSuccess: () => void) {
    const { profile } = useAuth()
    const [familyName, setFamilyName] = useState('')
    const [loading, setLoading] = useState(false)
    const[error, setError] = useState('')

    async function handleCreateFamily() {
        const { data: { session } } = await supabase.auth.getSession()

        if (!familyName.trim()) {
            setError('Family name is required')
            return
        }

        // If user not logged in 
        if (!profile) return
        
        setLoading(true)
        setError('')

        const { data: family, error: familyError } = await supabase
            .from('families')
            .insert({
                name: familyName.trim(),
                code: generateCode(),
                created_by: profile.id
            })
            .select()
            .single()

        
        if (familyError) {
            setError('This is a family error'+familyError.message)
            setLoading(false)
            return
        }

        const { error: memberError } = await supabase
            .from('family_member')
            .insert({
                user_id: profile.id,
                family_id: family.id
            })
        
        if (memberError) {
            setError('This is a member error'+memberError.message)
            setLoading(false)
            return
        }
    
        setLoading(false)
        setFamilyName('')
        onSuccess()
    }

    return { familyName, setFamilyName, loading, error, handleCreateFamily }
}