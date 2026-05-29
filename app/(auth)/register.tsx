import { useRegister } from '@/hooks/useRegister'
import { useRouter } from 'expo-router'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import ErrorMessage from '../components/ui/ErrorMessage'


export default function RegisterScreen() {
    const router = useRouter()
    const { name, setName, email, setEmail, password, setPassword, confirmPassword, setConfirmPassword, errors, loading, handleRegister } = useRegister()

    return (
        <View className ='flex-1 items-center justify-center bg-light-gray px-6 mx-auto'>
            <View className='bg-white dark:bg-black p-4 shadow-sm border rounded-[15] w-full gap-15'>
                <View className='mx-12 my-6 items-center'>
                    <View className='mb-14 mt-3 gap-5 w-full'>
                        <Text className='text-5xl font-bold text-gray-900 dark:text-gray-200 mb-3 text-center'>Create account</Text>
                        <Text className='text-3xl text-gray-500 dark:text-gray-400 text-center'>Start tracking your pets meds</Text>
                    </View>
                    <View className='mt-4 gap-10 w-full'>
                        <View>
                            <TextInput 
                                className='h-14 text-2xl text-gray-500 border rounded-[15] px-5 dark:border-white dark:text-white' 
                                placeholder='name' 
                                placeholderTextColor="#5c5c5c"
                                value={name}
                                onChangeText={setName}
                                />
                                <ErrorMessage error={errors.name}/>
                        </View>
                        <View>
                            <TextInput 
                                className='h-14 text-2xl text-gray-500 border rounded-[15] px-5 dark:border-white dark:text-white' 
                                placeholder='email@example.com' 
                                placeholderTextColor="#5c5c5c"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType='email-address'
                                autoCapitalize='none'/>
                                <ErrorMessage error={errors.email}/>
                        </View>
                        <View>
                            <TextInput 
                                className='h-14 text-2xl text-gray-500 border rounded-[15] px-5 dark:border-white dark:text-white' 
                                placeholder='password' 
                                placeholderTextColor="#5c5c5c"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry/>
                                <ErrorMessage error={errors.password}/>
                        </View>
                        <View>
                            <TextInput 
                                className='h-14 text-2xl text-gray-500 border rounded-[15] px-5 dark:border-white dark:text-white' 
                                placeholder='confirm_password' 
                                placeholderTextColor="#5c5c5c"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry/>
                                <ErrorMessage error={errors.confirmPassword}/>
                        </View>
                        <TouchableOpacity
                            className='py-3 bg-black dark:bg-white w-full rounded-[15]'
                            onPress={handleRegister}
                            disabled={loading}>
                                <Text className='text-white dark:text-black text-2xl font-bold text-center'
                                >{loading ? 'Creating account...' : 'Create account'}</Text>
                        </TouchableOpacity>
                        <View className='flex-row justify-center mt-2'>
                            <Text className='text-2xl dark:text-white'>Already have an account? </Text>
                            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                                <Text className='text-2xl font-bold dark:text-white'>Sign in</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}
