import { supabase } from '@/lib/supabase'
import { isValidEmail } from '@/lib/validation'
import { useState } from 'react'

export function useForgotPassword() {
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [sent, setSent] = useState(false)
    const [loading, setLoading] = useState(false)

    function validate() {
        let newErrors = ''
        
        if (!email.trim()) {
            newErrors = 'Email is required'
        } else if (!isValidEmail(email)) {
            newErrors = 'Enter a valid email'
        }

        setError(newErrors)
        return Object.keys(newErrors).length == 0
    }
    async function handleForgotPassword() {
        if (!validate()) return

        setLoading(true)
	const { error } = await supabase.auth.resetPasswordForEmail(
		email, 
		{ redirectTo: 'petpillpal://reset-password'} 
	)

        setLoading(false)

        if ( error ) {
            setError('Invalid email')
        } else {
		setSent(true)
	}
    }	
    return { email, setEmail, error, loading, sent, handleForgotPassword}
}
