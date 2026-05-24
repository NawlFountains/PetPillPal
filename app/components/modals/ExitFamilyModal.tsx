import { useExitFamily } from '@/hooks/useExitFamily'
import { Modal, Text, TouchableOpacity, View } from 'react-native'

type Props = {
    familyName: String
    familyId: string
    visible: boolean
    onClose: () => void
}

export default function CreateFamilyModal({ familyName, familyId, visible, onClose }: Props) {
  const { loading, error, handleExitFamily} = useExitFamily(onClose)

  return (
    <Modal visible={visible} animationType='fade' transparent>
      <View className='flex-1 justify-center px-6'>
        <TouchableOpacity
          className='absolute inset-0 bg-black/40'
          onPress={onClose}
        />

        <View className='bg-white rounded-t-3xl border-b px-6 pt-6 pb-4'>
          <Text className='text-2xl font-bold text-center'>Are you sure you want to exit {familyName} ? </Text>
        </View>
        <View className='bg-white rounded-b-3xl px-6 pt-6 pb-6 gap-2'>
          {error ? <Text className='text-red-500'> {error} </Text> : null}
          <View className='flex-row justify-center gap-6 mt-4'>
            <TouchableOpacity 
                className='h-12 rounded-xl border items-center justify-center w-1/2'
                onPress={onClose}
                disabled={loading}>
                <Text className='font-semibold'>
                    Cancel
                </Text>
            </TouchableOpacity>
            <TouchableOpacity 
                className='h-12 bg-red-600 rounded-xl items-center justify-center w-1/2'
                onPress={ () => handleExitFamily(familyId)}
                    disabled={loading}>
                <Text className='text-white font-semibold'>
                {loading ? 'Exiting...' : 'Confirm'}
                </Text>
                </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}
