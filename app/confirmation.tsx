import { supabase } from '@/lib/supabase'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { View } from 'react-native'
import Text from './components/ui/Text'
import ScreenContainer from './components/ui/ScreenContainer'

export default function ConfirmScreen() {
    const router = useRouter()
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

   useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session) {
            setStatus('success')
            setTimeout(() => router.replace('/(app)/'), 2000)
        }
    })

    // timeout fallback
    const timeout = setTimeout(() => {
        setStatus('error')
    }, 10000)

    return () => {
        subscription.unsubscribe()
        clearTimeout(timeout)
    }
}, [])


    return (
	    <ScreenContainer>
            <View className='bg-white dark:bg-black p-4 shadow-sm border rounded-[15] w-full'>
                <View className='mx-12 my-6 items-center gap-10'>
                    {status === 'loading' && (
                        <Text className='text-3xl text-gray-500 dark:text-gray-400 text-center'>
                            Confirming your email...
                        </Text>
                    )}
                    {status === 'success' && (
                        <Text className='text-5xl font-bold text-gray-900 dark:text-gray-200 text-center'>
                            Email confirmed! 🎉
                        </Text>
                    )}
                    {status === 'error' && (
                        <Text className='text-3xl text-gray-500 dark:text-gray-400 text-center'>
                            Something went wrong. Please try again.
                        </Text>
                    )}
                </View>
            </View>
	    </ScreenContainer>
    )
}
