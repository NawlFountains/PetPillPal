import { useAuth } from "@/context/AuthContext"
import { supabase } from "@/lib/supabase"
import { isDateBefore, isValidDate, isValidTime } from "@/lib/validation"
import { useState } from "react"

export function useEditMedication(onSuccess: () => void) {
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
    const [errors, setErrors] = useState<{ medicationName?: string, animalId?: string, time?: string , days?: string , startsOn?: string, endsOn?: string}> ({}) 

    function toggleDay(value: number) {
        setSelectedDays(prev =>
        prev.includes(value) ? prev.filter(d => d !== value) : [...prev, value]
        )
    }

    function validate() {
        const newErrors:  { medicationName?: string, animalId?: string, time?: string , days?: string, startsOn?: string, endsOn?: string } = {} 
        
        if (!medicationName.trim()) newErrors.medicationName = 'Name is required'
        if (!time.trim()) {
            newErrors.time = 'Time is required'
        } else if (!isValidTime(time)) {
            newErrors.time = 'Time must be in HH:MM format'
        }
        if (frequency === 'weekly' && selectedDays.length === 0) {
            newErrors.days = 'Select at least one day'
        }

        if (startsOn && !isValidDate(startsOn)) {
            newErrors.startsOn = 'Invalid date format (YYYY-MM-DD)'
        }

        if (endsOn && !isValidDate(endsOn)) {
            newErrors.endsOn = 'Invalid date format (YYYY-MM-DD)'
        }

        if (startsOn && endsOn && isValidDate(startsOn) && isValidDate(endsOn)) {
            if (!isDateBefore(startsOn, endsOn)) {
            newErrors.endsOn = 'End date must be after start date'
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length == 0
    }

    async function handleEditMedication(medication_id : string, schedule_id: string) {

        if (!validate()) return
        if (!profile) return

        
        setLoading(true)


        const { error: medicationError } = await supabase
            .from('medications')
            .update({
                name: medicationName,
                dose: dose,
                note: note
            })
            .eq('id', medication_id)

        
        if (medicationError) {
            setErrors({ medicationName : medicationError.message})
            setLoading(false)
            return
        }

        const { error: scheduleError } = await supabase
            .from('medication_schedules')
            .update({
                time: time,
                frequency: frequency,
                days_of_week: frequency == 'weekly' ? selectedDays : null,
                starts_on : startsOn || null,
                ends_on : endsOn || null
            })
            .eq('id', schedule_id)
        
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
        selectedDays, setSelectedDays, toggleDay,
        startsOn, setStartsOn,
        endsOn, setEndsOn,
        loading, errors,
        handleEditMedication
    }
}