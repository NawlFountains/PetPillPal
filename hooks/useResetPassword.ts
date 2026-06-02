import { supabase } from '@/lib/supabase'
import { isValidPassword } from '@/lib/validation'
import { useState } from 'react'
import { router } from 'expo-router'

export function useResetPassword() {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errors, setErrors] = useState<{ password?: string , confirmPassword?: string }>({})
    const [loading, setLoading] = useState(false)

    function validate() {

        const newErrors: { password?: string , confirmPassword?: string } = {}
        
        if (!password.trim()) {
            newErrors.password = 'Password is required'
        } else if (!isValidPassword(password)) {
            newErrors.password = 'Enter a valid password'
        }

	if (password != confirmPassword) {
	   newErrors.confirmPassword = 'Passwords must match'
	}

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }
    async function handleResetPassword() {
        if (!validate()) return

        setLoading(true)
	const { error } = await supabase.auth.updateUser({password})
        setLoading(false)

        if ( error ) {
            setErrors({ password : error.message})
        } else {
		router.replace('/(app)/')
	}
    }	
    return { password, setPassword, confirmPassword, setConfirmPassword, errors, loading , handleResetPassword}
}
