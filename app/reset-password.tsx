import { Text, View, TouchableOpacity } from 'react-native'
import ErrorMessage from './components/ui/ErrorMessage'
import {useResetPassword} from '@/hooks/useResetPassword'
import ScreenContainer  from './components/ui/ScreenContainer'
import Input from './components/ui/Input'

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
			 <Input
			 	placeholder='password'
				value={password}
				onChangeText={setPassword}
				secureTextEntry/>
			 <ErrorMessage error={errors.password}/>
                        </View>
			<View>
			 <Input
			 	placeholder='confirm_password'
				value={confirmPassword}
				onChangeText={setConfirmPassword}
				secureTextEntry/>
			 <ErrorMessage error={errors.confirmPassword}/>
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
