import { useRouter } from 'expo-router'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'


export default function RegisterScreen() {
    const router = useRouter()

    return (
        <View className ='flex-1 items-center justify-center bg-light-gray px-6'>
            <View className='bg-white p-4 shadow-sm border rounded-[15] w-full gap-15'>
                <View className='mx-12 my-6 items-center'>
                    <View className='mb-14 mt-3 gap-5 w-full'>
                        <Text className='text-5xl font-bold text-gray-900 mb-3 text-center'>Create account</Text>
                        <Text className='text-3xl text-gray-500 text-center'>Start tracking your pets meds</Text>
                    </View>
                    <View className='mt-4 gap-10 w-full'>
                        <TextInput className='text-2xl text-gray-500 border rounded-[15] px-5' placeholder='name' placeholderTextColor="#5c5c5c"></TextInput>
                        <TextInput className='text-2xl text-gray-500 border rounded-[15] px-5' placeholder='email@example.com' placeholderTextColor="#5c5c5c"></TextInput>
                        <TextInput className='text-2xl text-gray-500 border rounded-[15] px-5' placeholder='password' placeholderTextColor="#5c5c5c"></TextInput>
                        <TextInput className='text-2xl text-gray-500 border rounded-[15] px-5' placeholder='confirm_password' placeholderTextColor="#5c5c5c"></TextInput>
                        <TouchableOpacity
                            className='py-3 bg-black w-full rounded-[15]'>
                                <Text className='text-white text-2xl font-bold text-center'
                                >Create account</Text>
                        </TouchableOpacity>
                        <View className='flex-row justify-center mt-2'>
                            <Text className='text-2xl '>Already have an account? </Text>
                            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                                <Text className='text-2xl font-bold'>Sign in</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}