import { useAuth } from '@/context/AuthContext'
import { useLogout } from '@/hooks/useLogout'
import { scheduleAllNotifications } from '@/lib/notifications'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { REMINDER_OPTIONS } from '@/lib/constants'
import { obscureEmail } from '@/lib/utils'

export default function HomeScreen() {
    const { profile , session} = useAuth()
    const { loading, handleLogout } = useLogout()

    let obscuredEmail = ''

    if (session?.user.email) {
        obscuredEmail = obscureEmail(session?.user.email)
    }
    
    const { reminderMinutes, setReminderMinutes, families, doseLogs } = useAuth()

    async function handleReminderChange(minutes: number) {
        setReminderMinutes(minutes)
        await AsyncStorage.setItem('reminderMinutes', String(minutes))
        await scheduleAllNotifications(families, doseLogs, minutes)
    }

    return (
        <ScrollView>
            <View className='flex-1 pt-20 bg-white px-6 gap-5'>
                <Text className='text-5xl font-bold'>Settings</Text>

                <Text className='text-4xl font-bold'>Profile</Text>
                <View className='bg-white rounded-2xl border border-gray-500 '>
                    <View className='flex-row'>
                        <Text className='w-32 text-2xl bg-black rounded-tl-[15] text-white p-5 flex-2 border-b border-r'>Name</Text>
                        <TextInput 
                            className='text-2xl p-5 flex-1 border-b'
                            placeholder={profile?.display_name}
                            placeholderTextColor='#5c5c5c'
                            editable={false}>
                        </TextInput>[DEBUG] Expo push response: {"data":[{"status":"error","message":"Unable to retrieve the FCM server key for the recipient's app. Make sure you have provided a server key as directed by the Expo FCM documentation.","details":{"error":"InvalidCredentials","fault":"developer"}}]}

                    </View>
                    <View className='flex-row'>
                        <Text className='w-32 text-2xl bg-black rounded-bl-[15] p-5 text-white flex-2 border-r'>Email</Text>
                        <TextInput 
                            className='text-2xl p-5 flex-1'
                            placeholder={obscuredEmail}
                            placeholderTextColor='#5c5c5c'
                            editable={false}>
                        </TextInput>
                    </View>
                </View>
                
                <Text className='text-4xl font-bold'>Notifications</Text>
                <View className='bg-white rounded-2xl border border-gray-500 mb-6'>
                    <View className='px-4 py-4'>
                        <Text className='text-xl font-semibold mb-3'>Reminder before dose</Text>
                        <View className='flex-row gap-2'>
                            {REMINDER_OPTIONS.map(option => (
                                <TouchableOpacity
                                key={option.value}
                                onPress={() => handleReminderChange(option.value)}
                                className={`px-4 py-2 rounded-[15] border flex-1 ${
                                    reminderMinutes === option.value 
                                    ? 'bg-black border-black' 
                                    : 'border-gray-200'
                                }`}
                                >
                                <Text 
                                    className={`text-xl ${reminderMinutes === option.value ? 'text-white' : 'text-gray-600'}`}>
                                    {option.label}
                                </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
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

