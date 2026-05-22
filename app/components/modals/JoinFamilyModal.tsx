import { useState } from 'react'
import { Modal, Text, TextInput, TouchableOpacity, View } from 'react-native'

type Props = {
  visible: boolean
  onClose: () => void
}

export default function JoinFamilyModal({ visible, onClose }: Props) {
    const [familyCode, setFamilyCode] = useState('')

  return (
    <Modal visible={visible} animationType='fade' transparent>
      <View className='flex-1 justify-center px-6'>

        <TouchableOpacity
          className='absolute inset-0 bg-black/40'
          onPress={onClose}
        />

        <View className='bg-white rounded-3xl px-6 pt-6 pb-8 gap-2'>
          <Text className='text-2xl font-bold mb-1'>Join an existing family </Text>
          <TextInput
            className='h-12 border rounded-xl px-4 text-xl my-2'
            placeholder='family_code'
            placeholderTextColor="#5c5c5c"
            value={familyCode}
            onChangeText={setFamilyCode}
          />
          <TouchableOpacity className='h-12 bg-black rounded-xl items-center justify-center'>
            <Text className='text-white font-semibold'>Join</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}
