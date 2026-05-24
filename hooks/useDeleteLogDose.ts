import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { useState } from 'react'

export function useDeleteLogDose(onSuccess: () => void) {
  const { profile, refreshDoseLogs } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleDeleteLogDose(
    dose_log_id: string
  ) {
    if (!profile) return

    setLoading(true)
    setError('')

    const { error: logError } = await supabase
      .from('dose_logs')
      .delete()
      .eq('id',dose_log_id)
    
    if (logError) {
      setError(logError.message)
      setLoading(false)
      return
    }

    setLoading(false)
    await refreshDoseLogs()
    onSuccess()
  }

  return { loading, error, handleDeleteLogDose }
}