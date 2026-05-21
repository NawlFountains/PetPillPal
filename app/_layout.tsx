import { Slot, useRouter, useSegments } from 'expo-router'
import { useEffect } from 'react'
import { AuthProvider, useAuth } from '../context/AuthContext'
import '../global.css'


function RootLayoutNav() {
  const { session, loading} = useAuth()
  const router = useRouter()
  const segments = useSegments()

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
