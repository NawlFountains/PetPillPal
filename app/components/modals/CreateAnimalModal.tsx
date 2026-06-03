import { useCreateAnimal } from '@/hooks/useCreateAnimal'
import { useState } from 'react'
import { Modal, TouchableOpacity, View } from 'react-native'
import Text from '../ui/Text'
import FamilyDropdown from '../ui/FamilyDropdown'
import ErrorMessage from '../ui/ErrorMessage'
import Input from '../ui/Input'
import ModalContainer from '../ui/ModalContainer'

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
      <View className='flex-1 justify-center items-center px-6'>

        <TouchableOpacity
          className='absolute inset-0 bg-black/40'
          onPress={onClose}
        />

	<ModalContainer>
		<View className='rounded-t-3xl border dark:border-white px-6 pt-6 pb-4'>
		  <Text className='dark:text-white text-2xl font-bold'>Add new animal</Text>
		</View>
		<View className='rounded-b-3xl border border-l border-b dark:border-white px-6 py-6 gap-4'>
		<View className='gap-2'>
		  <FamilyDropdown
		    selectedId={selectedFamilyId}
		    onSelect={(id, name) => {
			setSelectedFamilyId(id)
			setSelectedFamilyName(name)
		    }}
		    />
		  <ErrorMessage error={errors.animalName}/>
		  <Input
		  	placeholder='animal_name'
			value={animalName}
			onChangeText={setAnimalName}/>
		  
		  <ErrorMessage error={errors.animalName}/>
		  <Input
		  	placeholder='species'
			value={species}
			onChangeText={setSpecies}/>
		  <ErrorMessage error={errors.species}/>
		</View>
		  <TouchableOpacity 
		    className='h-12 bg-black dark:bg-white rounded-xl items-center justify-center'
		    onPress={ () => handleCreateAnimal(selectedFamilyId)}
		    disabled={loading}>
		    <Text className='text-white font-semibold dark:text-black'>
		      {loading ? 'Adding...' : 'Add'}
		      </Text>
		  </TouchableOpacity>
		</View>
	</ModalContainer>
      </View>
    </Modal>
  )
}
