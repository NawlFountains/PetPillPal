import { useAuth } from '@/context/AuthContext'
import { useLogout } from '@/hooks/useLogout'
import { Text, TouchableOpacity, View } from 'react-native'

export default function HomeScreen() {
  const { profile } = useAuth()
  const { loading, handleLogout } = useLogout()
  
  return (
      <View className='flex-1 items-center justify-center bg-white px-6'>
          <Text className='text-5xl'>See your settings here</Text>
          <Text className='text-3xl '>{profile?.display_name}</Text>
          <TouchableOpacity
              className='py-3 bg-black w-full rounded-[15]'
              onPress={handleLogout}
          >
            <Text className='text-white text-2xl font-bold text-center'>
              {loading? 'Loggin out...' : 'Log out'}
              </Text>
          </TouchableOpacity>
      </View>
  )
}

