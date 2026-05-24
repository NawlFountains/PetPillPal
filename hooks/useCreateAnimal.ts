import { useAuth } from "@/context/AuthContext"
import { supabase } from "@/lib/supabase"
import { useState } from "react"

export function useCreateAnimal(familyId: string, onSuccess: () => void) {
    const { profile, refreshFamilies } = useAuth()
    const [animalName, setAnimalName] = useState('')
    const [familyName, setFamilyName] = useState('')
    const [species, setSpecies] = useState('')
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<{ animalName?: string, familyId?: string, species?: string }> ({}) 

    function validate() {
        const newErrors:  { animalName?: string, familyId?: string, species?: string } = {} 
        
        if (!animalName.trim()) {
            newErrors.animalName = 'Name is required'
        }

        if (!familyId.trim()) {
            newErrors.familyId = 'Familiy ID is required'
        }
        
        if (!species.trim()) {
            newErrors.species = 'Species is required'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length == 0
        }

    async function handleCreateAnimal(familyId: string) {
        if (!validate()) return

        // If user not logged in 
        if (!profile) return

        
        setLoading(true)

        const { error: animalError } = await supabase
            .from('animals')
            .insert({
                family_id: familyId,
                name: animalName,
                species: species
            })
            .select()
            .single()

        
        if (animalError) {
            setErrors({ animalName : animalError.message})
            setLoading(false)
            return
        }
    
        setLoading(false)
        setFamilyName('')
        await refreshFamilies()
        onSuccess()
        
    }

    return { animalName, setAnimalName, species, setSpecies, familyName, setFamilyName, familyId, loading, errors, handleCreateAnimal }
}