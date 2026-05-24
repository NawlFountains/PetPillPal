import { useCreateFamily } from '@/hooks/useCreateFamily'
import { Modal, Text, TextInput, TouchableOpacity, View } from 'react-native'

type Props = {
  visible: boolean
  onClose: () => void
}

export default function CreateFamilyModal({ visible, onClose }: Props) {
  const {familyName, setFamilyName, loading, error, handleCreateFamily } = useCreateFamily(onClose)

  return (
    <Modal visible={visible} animationType='fade' transparent>
      <View className='flex-1 justify-center px-6'>

        <TouchableOpacity
          className='absolute inset-0 bg-black/40'
          onPress={onClose}
        />

        <View className='bg-white rounded-t-3xl border-b px-6 pt-6 pb-4'>
          <Text className='text-2xl font-bold'>Create a new family </Text>
        </View>
        <View className='bg-white rounded-b-3xl px-6 pt-2 pb-8 gap-2'>
          <TextInput
            className='h-12 border rounded-xl px-4 text-2xl my-2'
            placeholder='family_name'
            placeholderTextColor='#5c5c5c'
            value={familyName}
            onChangeText={setFamilyName}
          />
          {error ? <Text className='text-red-500'> {error} </Text> : null}
          <TouchableOpacity 
            className='h-12 bg-black rounded-xl items-center justify-center'
            onPress={handleCreateFamily}
            disabled={loading}>
            <Text className='text-white font-semibold'>
              {loading ? 'Creating...' : 'Create'}
              </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}
