import { Slot, useRouter, useSegments } from 'expo-router'
import { useEffect } from 'react'
import { AuthProvider, useAuth } from '../context/AuthContext'
import { useColorScheme } from 'nativewind' 
import '../global.css'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Linking from 'expo-linking'
import { supabase } from '@/lib/supabase'

function RootLayoutNav() {
  const { session, loading} = useAuth()
  const router = useRouter()
  const segments = useSegments()
  const { setColorScheme } = useColorScheme()

  useEffect(() => {
    AsyncStorage.getItem('colorScheme').then(val => {
      if (val) setColorScheme(val as 'light' | 'dark')
    })
  }, [])

  useEffect(() => {
    const handleDeepLink = async (url: string) => {
	    console.log('Deep link received', url)
	    
	    const urlObj = new URL(url)
	    const token = urlObj.searchParams.get('token')
	    const type = urlObj.searchParams.get('type')
	    const email = urlObj.searchParams.get('email')

	    if (token && type && email) {
		// OTP flow (email confirmation)
		const { data, error } = await supabase.auth.verifyOtp({ 
		    email,
		    token, 
		    type: type as any 
		})
		console.log('OTP result:', data, error)
	    } else {
		// PKCE flow (password reset)
		const { data, error } = await supabase.auth.exchangeCodeForSession(url)
		console.log('Exchange result:', data, error)
	    }
    }



    // app already open when link is tapped
    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url)
    })

    // app was closed when link was tapped
    Linking.getInitialURL().then(url => {
      if (url) handleDeepLink(url)
    })

    return () => subscription.remove()
  }, [])

  useEffect(() => {
    if (loading) return
    const inAuthGroup = segments[0] === '(auth)'
    const inResetPassword =  segments[0] === 'reset-password'
    const inConfirmation = segments[0] === 'confirmation'

    if (!session && !inAuthGroup && !inResetPassword && !inConfirmation) {
      router.replace('/(auth)/login')
    } else if (session && inAuthGroup) {
      router.replace('/(app)/')
    }
  }, [session, loading])

  return <Slot />
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav/>
    </AuthProvider>
  )
}
