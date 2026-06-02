import { supabase } from '@/lib/supabase'
import { isValidEmail, isValidPassword } from '@/lib/validation'
import { useState } from 'react'

export function useRegister(){
    const [registered, setRegistered] = useState(false)
    const [name, setName ] = useState('')
    const [email, setEmail ] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errors, setErrors] = useState<{ name?: string, email?: string, password?: string, confirmPassword?: string }> ({}) 
    const [loading, setLoading] = useState(false)

    function validate() {
        const newErrors:  { name?: string, email?: string, password?: string, confirmPassword?: string } = {} 
        
        if (!name.trim()) {
            newErrors.name = 'Name is required'
        }
        
        if (!email.trim()) {
            newErrors.email = 'Email is required'
        } else if (!isValidEmail(email)) {
            newErrors.email = 'Enter a valid email'
        }

        if (!password.trim()) {
            newErrors.password = 'Password is required'
        } else if (!isValidPassword(password)) {
            newErrors.password = 'Enter a valid password'
        }

        if (password != confirmPassword) {
            newErrors.confirmPassword = 'Password must match'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length == 0
    }

    async function handleRegister() {
        if (!validate()) return

        setLoading(true)
        const { error } = await supabase.auth.signUp({
            email, 
            password, 
            options: {
                data: {
                    display_name: name
                },
		emailRedirectTo: 'petpillpal://confirmation'
            }
        })
        
        setLoading(false)

        if ( error ) {
            setErrors({ email: error.message})
        } else {
	    setRegistered(true)
	}
    }
    return { name, setName, email, setEmail, password, setPassword, confirmPassword, setConfirmPassword, errors, loading, handleRegister, registered }
}
