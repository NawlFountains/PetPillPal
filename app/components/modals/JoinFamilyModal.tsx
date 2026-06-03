import { useJoinFamily } from '@/hooks/useJoinFamily'
import { Modal, TouchableOpacity, View } from 'react-native'
import Text from '../ui/Text'
import ErrorMessage from '../ui/ErrorMessage'
import Input from '../ui/Input'
import ModalContainer from '../ui/ModalContainer'

type Props = {
  visible: boolean
  onClose: () => void
}

export default function JoinFamilyModal({ visible, onClose }: Props) {
    const {familyCode, setFamilyCode, loading, error, handleJoinFamily } = useJoinFamily(onClose)

  return (
    <Modal visible={visible} animationType='fade' transparent>
        <View className='flex-1 justify-center items-center px-6'>

        <TouchableOpacity
          className='absolute inset-0 bg-black/40'
          onPress={onClose}
        />

	<ModalContainer>
		<View className='rounded-t-3xl border dark:border-white px-6 pt-6 pb-4'>
		  <Text className='text-2xl font-bold dark:text-white'>Join an existing family </Text>
		</View>
		<View className='rounded-b-3xl border dark:border-white px-6 pt-2 pb-8 gap-2'>
		<View className='py-2'>
		 <Input
		 	placeholder='family_code'
			value={familyCode}
			onChangeText={setFamilyCode}/>
		  <ErrorMessage error={error}/>
		</View>
		  <TouchableOpacity 
		    className='h-12 bg-black dark:bg-white rounded-xl items-center justify-center'
		    onPress={handleJoinFamily}
		    disabled={loading}>
		    <Text className='text-white dark:text-black font-semibold'>
			{loading ? 'Joining...' : 'Join'}</Text>
		  </TouchableOpacity>
		</View>
	</ModalContainer>
      </View>
    </Modal>
  )
}
