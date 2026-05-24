import { useAuth } from "@/context/AuthContext"
import { supabase } from "@/lib/supabase"
import { isValidTime } from "@/lib/validation"
import { useState } from "react"

export function useCreateMedication(onSuccess: () => void) {
    const { profile, refreshFamilies } = useAuth()

    const [ medicationName, setMedicationName] = useState('')
    const [ dose, setDose] = useState('')
    const [ note, setNote] = useState('')

    const [time, setTime] = useState('')
    const [frequency, setFrequency] = useState('')
    const [selectedDays, setSelectedDays] = useState<number []>([])
    const [startsOn, setStartsOn] = useState('')
    const [endsOn, setEndsOn] = useState('')

    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<{ medicationName?: string, animalId?: string, time?: string , days?: string }> ({}) 

    function toggleDay(value: number) {
        setSelectedDays(prev =>
        prev.includes(value) ? prev.filter(d => d !== value) : [...prev, value]
        )
    }

    function validate() {
        const newErrors:  { medicationName?: string, animalId?: string, time?: string , days?: string } = {} 
        
        if (!medicationName.trim()) newErrors.medicationName = 'Name is required'
        if (!time.trim()) {
            newErrors.time = 'Time is required'
        } else if (!isValidTime(time)) {
            newErrors.time = 'Time must be in HH:MM format'
        }
        if (frequency === 'weekly' && selectedDays.length === 0) {
            newErrors.days = 'Select at least one day'
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length == 0
    }

    async function handleCreateMedication(animalId: string) {
        if (!validate()) return
        if (!profile) return

        if (!animalId.trim()) setErrors({animalId : 'Animal is required'})
        
        setLoading(true)



        const { data: med,  error: medicationError } = await supabase
            .from('medications')
            .insert({
                animal_id: animalId,
                name: medicationName,
                dose: dose,
                note: note
            })
            .select()
            .single()

        
        if (medicationError) {
            setErrors({ animalId : 'Animal is required'})
            setLoading(false)
            return
        }

        const { error: scheduleError } = await supabase
            .from('medication_schedules')
            .insert({
                medication_id: med.id,
                time: time,
                frequency: frequency,
                days_of_week: frequency == 'weekly' ? selectedDays : null,
                starts_on : startsOn || null,
                ends_on : endsOn || null
            })
        
        if (scheduleError) {
            setErrors({ medicationName : scheduleError.message})
            setLoading(false)
            return
        }

    
        setLoading(false)
        setMedicationName('')
        setDose('')
        setNote('')
        setTime('')
        setFrequency('daily')
        setSelectedDays([])
        setStartsOn('')
        setEndsOn('')
        await refreshFamilies()
        onSuccess()
        
    }
    return {
        medicationName, setMedicationName,
        dose, setDose,
        note, setNote,
        time, setTime,
        frequency, setFrequency,
        selectedDays, toggleDay,
        startsOn, setStartsOn,
        endsOn, setEndsOn,
        loading, errors,
        handleCreateMedication
    }
}