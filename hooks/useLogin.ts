import { supabase } from '@/lib/supabase'
import { isValidEmail, isValidPassword } from '@/lib/validation'
import { useState } from 'react'

export function useLogin() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState<{ email?: string, password?: string}> ({})
    const [loading, setLoading] = useState(false)

    function validate() {
        const newErrors: { email?: string, password?: string } = {}
        
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
        setErrors(newErrors)
        return Object.keys(newErrors).length == 0
    }
    async function handleLogin() {
        if (!validate()) return

        setLoading(true)
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        setLoading(false)

        if ( error ) {
            setErrors({ email: error.message})
        }
    }
    return { email, setEmail, password, setPassword, errors, loading, handleLogin }
}