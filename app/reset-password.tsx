import { Text, TextInput, View, TouchableOpacity } from 'react-native'
import ErrorMessage from './components/ui/ErrorMessage'
import {useResetPassword} from '@/hooks/useResetPassword'
import ScreenContainer  from './components/ScreenContainer'

export default function ForgotPassword() {
	const { password, setPassword, confirmPassword, setConfirmPassword, loading, errors, handleResetPassword } = useResetPassword()

    return (
	    <ScreenContainer>
            <View className='bg-white dark:bg-black p-4 shadow-sm border rounded-[15] w-full gap-15'>
                <View className='mx-12 my-6 items-center'>
                    <View className='mb-14 mt-3 gap-5 w-full'>
                        <Text className='text-5xl font-bold text-gray-900 dark:text-gray-200 mb-3 text-center'>Reset password</Text>
                    </View>
                    <View className='mt-4 gap-10 w-full'>
                        <View>
                            <TextInput 
                                className='h-14 text-2xl text-gray-500 border rounded-[15] px-5 dark:border-gray-200 dark:text-white'
                                placeholder='password'
                                placeholderTextColor="#5c5c5c"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                />
				<View className='flex flex-col flex-wrap'>
                                 <ErrorMessage error={errors.password}/>
				</View>
                        </View>
			<View>
                            <TextInput 
                                className='h-14 text-2xl text-gray-500 border rounded-[15] px-5 dark:border-gray-200 dark:text-white'
                                placeholder='password'
                                placeholderTextColor="#5c5c5c"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry
                                />
				<View className='flex flex-col flex-wrap'>
                                 <ErrorMessage error={errors.confirmPassword}/>
				</View>
                        </View>
                        <TouchableOpacity
                            className='py-3 bg-black dark:bg-white w-full rounded-[15]'
                            onPress={handleResetPassword}
                            disabled={loading}    
                        >
                                <Text className='text-white dark:text-black text-2xl font-bold text-center'
                                >{loading ? 'Reseting...' : 'Reset'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
	    </ScreenContainer>
    )
}
