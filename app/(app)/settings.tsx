import { useLogout } from '@/hooks/useLogout'
import { Text, TouchableOpacity, View } from 'react-native'

export default function HomeScreen() {
  const { loading, handleLogout } = useLogout()
  
  return (
      <View className='flex-1 pt-20 bg-white px-6'>
          <Text className='text-5xl font-bold'>Settings</Text>
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

