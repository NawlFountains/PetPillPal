import { Slot, useRouter, useSegments } from 'expo-router'
import { useEffect } from 'react'
import { AuthProvider, useAuth } from '../context/AuthContext'
import { useColorScheme } from 'nativewind' 
import '../global.css'
import AsyncStorage from '@react-native-async-storage/async-storage'


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
    if (loading) return
    const inAuthGroup = segments[0] === '(auth)'

    if (!session && !inAuthGroup) {
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
