import { useAuth } from '@/context/AuthContext'
import { useLogout } from '@/hooks/useLogout'
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'

export default function HomeScreen() {
    const { profile } = useAuth()
    const { loading, handleLogout } = useLogout()

    return (
    <ScrollView>
        <View className='flex-1 pt-20 bg-white px-6'>
            <Text className='text-5xl font-bold'>Settings</Text>

            <Text className='text-4xl font-bold'>Profile</Text>
            <View className='bg-white rounded-2xl border border-gray-500 '>
                <View className='flex-row'>
                    <Text className='text-2xl p-5 flex-2 border-b border-r'>Name</Text>
                    <TextInput 
                        className='text-2xl p-5 flex-1 border-b'
                        placeholder={profile?.display_name}
                        placeholderTextColor='#5c5c5c'>
                    </TextInput>
                </View>
                <View className='flex-row'>
                    <Text className='text-2xl p-5 flex-2 border-b border-r'>Email</Text>
                    <TextInput 
                        className='text-2xl p-5 flex-1 border-b'
                        placeholder='********'
                        placeholderTextColor='#5c5c5c'>
                    </TextInput>
                </View>
            </View>

            <Text className='text-3xl font-bold'>Account</Text>
            <TouchableOpacity
                className='py-3 bg-red-500 w-full rounded-[15]'
                onPress={handleLogout}
                >
                <Text className='text-white text-2xl font-bold text-center'>
                {loading? 'Loggin out...' : 'Log out'}
                </Text>
            </TouchableOpacity>
        </View>
    </ScrollView>
    )
}

