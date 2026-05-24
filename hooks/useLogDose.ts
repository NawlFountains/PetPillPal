import { useAuth } from '@/context/AuthContext'
import { Medication, Schedule } from '@/lib/definitions'
import { supabase } from '@/lib/supabase'
import { useState } from 'react'

export function useLogDose(onSuccess: () => void) {
  const { profile, refreshDoseLogs } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogDose(
    familyId: string,
    medication: Medication,
    schedule: Schedule,
    note?: string
  ) {
    if (!profile) return

    setLoading(true)
    setError('')

    const { error: logError } = await supabase
      .from('dose_logs')
      .insert({
        medication_id: medication.id,
        schedule_id: schedule.id,
        family_id: familyId,
        given_by: profile.id,
        given_at: new Date().toISOString(),
        scheduled_time: schedule.time,
        note: note ?? null
      })
    
    console.log('login dose ',logError?.message)

    if (logError) {
      setError(logError.message)
      setLoading(false)
      return
    }

    setLoading(false)
    await refreshDoseLogs()
    onSuccess()
  }

  return { loading, error, handleLogDose }
}