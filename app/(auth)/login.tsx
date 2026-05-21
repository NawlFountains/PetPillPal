import { useLogin } from '@/hooks/useLogin'
import { useRouter } from 'expo-router'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'


export default function LoginScreen() {
    const router = useRouter()
    const { email, setEmail, password, setPassword, errors, loading, handleLogin} = useLogin()

    return (
        <View className ='flex-1 items-center justify-center bg-light-gray px-6'>
            <View className='bg-white p-4 shadow-sm border rounded-[15] w-full gap-15'>
                <View className='mx-12 my-6 items-center'>
                    <View className='mb-14 mt-3 gap-5 w-full'>
                        <Text className='text-5xl font-bold text-gray-900 mb-3 text-center'>Welcome back</Text>
                        <Text className='text-3xl text-gray-500 text-center'>Sign in your account</Text>
                    </View>
                    <View className='mt-4 gap-10 w-full'>
                        <View className=''>
                            <TextInput 
                                className='text-2xl text-gray-500 border rounded-[15] px-5'
                                placeholder='email@example.com' 
                                placeholderTextColor="#5c5c5c"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType='email-address'
                                autoCapitalize='none'
                                />
                                {errors.email && (
                                    <Text className='text-red-500 pt-2 px-5'>{errors.email}</Text>
                                )}
                        </View>
                        <View>
                            <TextInput 
                                className='text-2xl text-gray-500 border rounded-[15] px-5'
                                placeholder='password'
                                placeholderTextColor="#5c5c5c"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                />
                                {errors.password && (
                                    <Text className='text-red-500 pt-2 px-5'>{errors.password}</Text>
                                )}
                        </View>
                        <TouchableOpacity
                            className='py-3 bg-black w-full rounded-[15]'
                            onPress={handleLogin}
                            disabled={loading}    
                        >
                                <Text className='text-white text-2xl font-bold text-center'
                                >{loading ? 'Signin in...' : 'Sign in'}</Text>
                        </TouchableOpacity>
                        <View className='flex-row justify-center mt-2'>
                            <Text className='text-2xl '>Don't have an account? </Text>
                            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                                <Text className='text-2xl font-bold'>Register</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}