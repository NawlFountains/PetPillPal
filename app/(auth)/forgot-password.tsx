import {useForgotPassword} from '@/hooks/useForgotPassword'
import { View, TouchableOpacity } from 'react-native'
import Text from '../components/ui/Text'
import ErrorMessage from '../components/ui/ErrorMessage'
import {useBreakpoint} from '@/hooks/useBreakpoint'
import ScreenContainer from '../components/ui/ScreenContainer'
import Input from '../components/ui/Input'

export default function ForgotPassword() {
	const { isNative } = useBreakpoint()
	const { email, setEmail, loading, error, sent, handleForgotPassword} = useForgotPassword()

    return (
	    <ScreenContainer>
	<View className ={`flex-1 items-center justify-center ${ isNative ? 'bg-light-gray' : 'bg-gray-900/60'} px-6`}>
            <View className='bg-white dark:bg-black p-4 shadow-sm border rounded-[15] w-full gap-15 max-w-lg mx-auto'>
                <View className='mx-12 my-6 items-center'>

		    {sent? (
			    <View className='mb-4 mt-3 gap-5 w-full'>
				<Text className='text-5xl font-bold text-gray-900 dark:text-gray-200 mb-3 text-center'>Password reset!</Text>
				<Text className='text-5xl font-bold text-gray-900 dark:text-gray-400 mb-3 text-center'>Check your email</Text>
			    </View>
		    ) : (
		    <>
			    <View className='mb-14 mt-3 gap-5 w-full'>
				<Text className='text-5xl font-bold text-gray-900 dark:text-gray-200 mb-3 text-center'>Password reset</Text>
			    </View>
			    <View className='mt-4 gap-10 w-full'>
				<View>
				 <Input
				 	placeholder='email@example.com'
					value={email}
					onChangeText={setEmail}
					keyboardType='email-address'
					autoCapitalize='none'/>
				 <ErrorMessage error={error}/>
				</View>

				<TouchableOpacity
				    className='py-3 bg-black dark:bg-white w-full rounded-[15]'
				    onPress={handleForgotPassword}
				    disabled={loading}    
				>
					<Text className='text-white dark:text-black text-2xl font-bold text-center'
					>{loading ? 'Reseting password...' : 'Reset password'}</Text>
				</TouchableOpacity> 
			    </View>
		    </>)}
                </View>
            </View>
        </View>
	    </ScreenContainer>
    )
}
