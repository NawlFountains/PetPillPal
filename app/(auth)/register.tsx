import { useRegister } from '@/hooks/useRegister'
import { useRouter } from 'expo-router'
import { TouchableOpacity, View } from 'react-native'
import Text from '../components/ui/Text'
import ErrorMessage from '../components/ui/ErrorMessage'
import {useBreakpoint} from '@/hooks/useBreakpoint'
import ScreenContainer from '../components/ui/ScreenContainer'
import Input from '../components/ui/Input'


export default function RegisterScreen() {
    const router = useRouter()
    const { isNative } = useBreakpoint()
    const { name, setName, email, setEmail, password, setPassword, confirmPassword, setConfirmPassword, errors, loading, handleRegister, registered } = useRegister()

    if (registered) {
	    return (
		    <ScreenContainer>
		    <View className='bg-white dark:bg-black p-4 shadow-sm border rounded-[15] w-full max-w-lg mx-auto'>
			<View className='mx-12 my-6 items-center gap-10'>
			    <Text className='text-5xl font-bold text-gray-900 dark:text-gray-200 text-center'>Check your email</Text>
			    <Text className='text-3xl text-gray-500 dark:text-gray-400 text-center'>
				We sent a confirmation link to{'\n'}{email}
			    </Text>
			    <TouchableOpacity
				className='py-3 bg-black dark:bg-white w-full rounded-[15]'
				onPress={() => router.push('/(auth)/login')}>
				<Text className='text-white dark:text-black text-2xl font-bold text-center'>
				    Go to login (Currently disabled login as normal)
				</Text>
			    </TouchableOpacity>
			</View>
		    </View>
		    </ScreenContainer>
	    )
    }

    return (
	    <ScreenContainer>
            <View className ={`flex-1 justify-center ${ isNative ? 'bg-light-gray' : 'bg-gray-900/60'} px-6`}>
            <View className='bg-white dark:bg-black p-4 shadow-sm border rounded-[15] w-full gap-15 max-w-lg mx-auto'>
                <View className='mx-12 my-6 items-center'>
                    <View className='mb-14 mt-3 gap-5 w-full'>
                        <Text className='text-5xl font-bold text-gray-900 dark:text-gray-200 mb-3 text-center'>Create account</Text>
                        <Text className='text-3xl text-gray-500 dark:text-gray-400 text-center'>Start tracking your pets meds</Text>
                    </View>
                    <View className='mt-4 gap-10 w-full'>
                        <View>
			 <Input
				placeholder='name'
				value={name}
				onChangeText={setName}/>
                         <ErrorMessage error={errors.name}/>
                        </View>
                        <View>
			 <Input
			 	placeholder='email@example.com'
				value={email}
				onChangeText={setEmail}
				keyboardType='email-address'
				autoCapitalize='none'/>
                         <ErrorMessage error={errors.email}/>
                        </View>
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
	    </ScreenContainer>
    )
}
