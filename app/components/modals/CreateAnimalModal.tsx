import { useCreateAnimal } from '@/hooks/useCreateAnimal'
import { useState } from 'react'
import { Modal, Text, TextInput, TouchableOpacity, View } from 'react-native'
import FamilyDropdown from '../ui/FamilyDropdown'
import ErrorMessage from '../ui/ErrorMessage'

type Props = {
  visible: boolean
  onClose: () => void
}

export default function CreateAnimalModal({ visible, onClose }: Props) {
    const [selectedFamilyId, setSelectedFamilyId] = useState('')
    const [selectedFamilyName, setSelectedFamilyName] = useState('')
    const { animalName, setAnimalName, species, setSpecies, loading, errors, handleCreateAnimal } = useCreateAnimal(selectedFamilyId, onClose)

  return (
    <Modal visible={visible} animationType='fade' transparent>
      <View className='flex-1 justify-center px-6'>

        <TouchableOpacity
          className='absolute inset-0 bg-black/40'
          onPress={onClose}
        />

        <View className='bg-white rounded-t-3xl border-b px-6 pt-6 pb-4'>
          <Text className='text-2xl font-bold'>Add new animal</Text>
        </View>
        <View className='bg-white rounded-b-3xl px-6 pt-6 pb-8 gap-2'>
          <FamilyDropdown
            selectedId={selectedFamilyId}
            onSelect={(id, name) => {
                setSelectedFamilyId(id)
                setSelectedFamilyName(name)
            }}
            />
          <ErrorMessage error={errors.animalName}/>
          <TextInput
            className='h-12 border rounded-xl px-4 text-2xl my-2'
            placeholder='animal_name'
            placeholderTextColor='#5c5c5c'
            value={animalName}
            onChangeText={setAnimalName}
          />
          <ErrorMessage error={errors.animalName}/>
          <TextInput
            className='h-12 border rounded-xl px-4 text-2xl my-2'
            placeholder='species'
            placeholderTextColor='#5c5c5c'
            value={species}
            onChangeText={setSpecies}
          />
          <ErrorMessage error={errors.species}/>
          <TouchableOpacity 
            className='h-12 bg-black rounded-xl items-center justify-center'
            onPress={ () => handleCreateAnimal(selectedFamilyId)}
            disabled={loading}>
            <Text className='text-white font-semibold'>
              {loading ? 'Adding...' : 'Add'}
              </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}
