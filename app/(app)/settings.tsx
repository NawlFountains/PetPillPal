import { useAuth } from '@/context/AuthContext'
import { useLogout } from '@/hooks/useLogout'
import { useColorScheme } from 'nativewind'
import { scheduleAllNotifications } from '@/lib/notifications'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { REMINDER_OPTIONS } from '@/lib/constants'
import { obscureEmail } from '@/lib/utils'
import { useEffect } from 'react'

export default function HomeScreen() {
    const { profile , session} = useAuth()
    const { loading, handleLogout } = useLogout()
    const { colorScheme, setColorScheme } = useColorScheme()

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

    // Save on change
    const handleThemeChange = async (val: boolean) => {
        const scheme = val ? 'dark' : 'light'
        setColorScheme(scheme)
        await AsyncStorage.setItem('colorScheme', scheme)
    }

    return (
        <ScrollView className='bg-white dark:bg-black'>
            <View className='flex-1 pt-20 px-6 gap-8'>
                <Text className='text-5xl font-bold dark:text-white'>Settings</Text>
                <View className='flex-row items-center justify-between rounded-2xl px- py-4 dark:bg-black'>
                <Text className='text-4xl font-bold dark:text-white'>Dark mode</Text>
                <Switch
                    value={colorScheme === 'dark'}
                    onValueChange={handleThemeChange}
                />
                </View>

                <Text className='text-4xl font-bold dark:text-white'>Profile</Text>
                <View className='bg-white rounded-2xl border border-gray-500 dark:border-white dark:bg-black'>
                    <View className='flex-row'>
                        <Text className='w-32 text-2xl bg-black dark:bg-white rounded-tl-[13] text-white dark:text-black p-5 flex-2 border-b border-r'>Name</Text>
                        <TextInput 
                            className='text-2xl p-5 flex-1 border-b dark:border-white'
                            placeholder={profile?.display_name}
                            placeholderTextColor='#5c5c5c'
                            editable={false}>
                        </TextInput>
                    </View>
                    <View className='flex-row'>
                        <Text className='w-32 text-2xl bg-black dark:bg-white rounded-bl-[13] p-5 text-white dark:text-black flex-2 border-r'>Email</Text>
                        <TextInput 
                            className='text-2xl p-5 flex-1'
                            placeholder={obscuredEmail}
                            placeholderTextColor='#5c5c5c'
                            editable={false}>
                        </TextInput>
                    </View>
                </View>
                
                <Text className='text-4xl font-bold dark:text-white'>Notifications</Text>
                <View className='bg-white dark:bg-black rounded-2xl border border-gray-500 dark:border-white mb-6'>
                    <View className='px-4 py-4'>
                        <Text className='text-xl font-semibold mb-3 dark:text-white'>Reminder before dose</Text>
                        <View className='flex-row gap-2'>
                            {REMINDER_OPTIONS.map(option => (
                                <TouchableOpacity
                                key={option.value}
                                onPress={() => handleReminderChange(option.value)}
                                className={`px-4 py-2 rounded-[15] border flex-1 ${
                                    reminderMinutes === option.value 
                                    ? 'bg-black dark:bg-white border-black dark:border-white' 
                                    : 'border-gray-200'
                                }`}
                                >
                                <Text 
                                    className={`text-xl ${reminderMinutes === option.value ? 'text-white dark:text-black' : 'text-gray-600'}`}>
                                    {option.label}
                                </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>

                <Text className='text-4xl font-bold dark:text-white'>Account</Text>
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

