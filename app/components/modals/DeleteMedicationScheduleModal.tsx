import { useDeleteMedication } from '@/hooks/useDeleteMedication'
import { Animal, Medication, Schedule } from '@/lib/definitions'
import { Modal, Text, TouchableOpacity, View } from 'react-native'
import AnimalScheduleCard from '../ui/AnimalScheduleCard'

type Props = {
    animal: Animal
    medication: Medication
    schedule: Schedule
    visible: boolean
    onClose: () => void
}

export default function DeleteMedicationScheduleModal({ animal, medication, schedule, visible, onClose }: Props) {
  const { loading, error, handleDeleteMedication} = useDeleteMedication(onClose)

  return (
    <Modal visible={visible} animationType='fade' transparent>
      <View className='flex-1 justify-center px-6'>
        <TouchableOpacity
          className='absolute inset-0 bg-black/40'
          onPress={onClose}
        />

        <View className='bg-white rounded-t-3xl border-b px-6 pt-6 pb-4'>
          <Text className='text-2xl font-bold text-center'>Are you sure you want to delete the schedule ? </Text>
        </View>
        <View className='bg-white rounded-b-3xl px-6 pt-6 pb-6 gap-2'>
          {error ? <Text className='text-red-500'> {error} </Text> : null}
          <AnimalScheduleCard
            animal={animal}
            schedule={schedule}
            medication={medication}/>
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
                onPress={ () => handleDeleteMedication(medication.id, schedule.id)}
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
