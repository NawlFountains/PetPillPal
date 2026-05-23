import { useAuth } from "@/context/AuthContext"
import { supabase } from "@/lib/supabase"
import { useState } from "react"

export function useDeleteMedication(onSuccess: () => void) {
    const { profile, refreshFamilies } = useAuth()
    const [loading, setLoading] = useState(false)
    const[error, setError] = useState('')

    async function handleDeleteMedication(medication_id: string, schedule_id: string) {
        // If user not logged in 
        console.log('About to delete medication ',medication_id)
        if (!profile) return
        
        setLoading(true)
        setError('')

        const { error: scheduleError } = await supabase
            .from('medication_schedules')
            .delete()
            .eq('id', schedule_id)
            
        if (scheduleError) {
            setError(scheduleError.message)
            setLoading(false)
            return
        }
        console.log('After deleting entries errors are ',scheduleError)

        const { error: medicationError } = await supabase
            .from('medications')
            .delete()
            .eq('id', medication_id)

        if (medicationError) {
            setError(medicationError.message)
            setLoading(false)
            return
        }

        console.log('After deleting entries errors are ',medicationError)
        setLoading(false)
        await refreshFamilies()
        onSuccess()
    }

    return { loading, error, handleDeleteMedication }
}