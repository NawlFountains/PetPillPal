import { useJoinFamily } from '@/hooks/useJoinFamily'
import { Modal, Text, TextInput, TouchableOpacity, View } from 'react-native'

type Props = {
  visible: boolean
  onClose: () => void
}

export default function JoinFamilyModal({ visible, onClose }: Props) {
    const {familyCode, setFamilyCode, loading, error, handleJoinFamily } = useJoinFamily(onClose)

  return (
    <Modal visible={visible} animationType='fade' transparent>
        <View className='flex-1 justify-center px-6'>

        <TouchableOpacity
          className='absolute inset-0 bg-black/40'
          onPress={onClose}
        />

        <View className='bg-white rounded-t-3xl border-b px-6 pt-6 pb-4'>
          <Text className='text-2xl font-bold'>Join an existing family </Text>
        </View>
        <View className='bg-white rounded-b-3xl px-6 pt-2 pb-8 gap-2'>
          <TextInput
            className='h-12 border rounded-xl px-4 text-xl my-2'
            placeholder='family_code'
            placeholderTextColor="#5c5c5c"
            value={familyCode}
            onChangeText={setFamilyCode}
          />
          {error ? <Text className='text-red-500'>{error} </Text> : null}
          <TouchableOpacity 
            className='h-12 bg-black rounded-xl items-center justify-center'
            onPress={handleJoinFamily}
            disabled={loading}>
            <Text className='text-white font-semibold'>
                {loading ? 'Joining...' : 'Join'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}
