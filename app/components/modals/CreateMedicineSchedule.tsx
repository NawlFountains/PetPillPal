import { useCreateAnimal } from '@/hooks/useCreateAnimal'
import { useState } from 'react'
import { Modal, Text, TextInput, TouchableOpacity, View } from 'react-native'
import AnimalDropdown from '../ui/AnimalDropdown'
import FamilyDropdown from '../ui/FamilyDropdown'

type Props = {
  visible: boolean
  onClose: () => void
}

export default function CreateMedicineSchedule({ visible, onClose }: Props) {
    const [selectedFamilyId, setSelectedFamilyId] = useState('')
    const [selectedFamilyName, setSelectedFamilyName] = useState('')
    const [selectedAnimalId, setSelectedAnimalId] = useState('')
    const [selectedAnimalName, setSelectedAnimalName] = useState('')

    const { animalName, setAnimalName, species, setSpecies, loading, errors, handleCreateAnimal } = useCreateAnimal(selectedFamilyId, onClose)
    const [ frequency, setFrequency ] = useState('')
    const frequencies = ['daily', 'weekly', 'custom']
    const days = [
  { label: 'M', value: 1 },
  { label: 'T', value: 2 },
  { label: 'W', value: 3 },
  { label: 'T', value: 4 },
  { label: 'F', value: 5 },
  { label: 'S', value: 6 },
  { label: 'S', value: 7 },
]

    // State
    const [selectedDays, setSelectedDays] = useState<number[]>([])

    function toggleDay(value: number) {
      setSelectedDays(prev =>
        prev.includes(value)
          ? prev.filter(d => d !== value)
          : [...prev, value]
      )
    }

  return (
    <Modal visible={visible} animationType='fade' transparent>
      <View className='flex-1 justify-center px-6'>

        <TouchableOpacity
          className='absolute inset-0 bg-black/40'
          onPress={onClose}
        />

        <View className='bg-white rounded-3xl px-6 pt-6 pb-8 gap-2'>
          <Text className='text-2xl font-bold mb-1'>Add new med schedule </Text>
          <FamilyDropdown
            selectedId={selectedFamilyId}
            onSelect={(id, name) => {
                setSelectedFamilyId(id)
                setSelectedFamilyName(name)
            }}
            />
            <AnimalDropdown
              selectedId={selectedAnimalId}
              familyId={selectedFamilyId}
              onSelect={(id, name) => {
                setSelectedAnimalId('')
                setSelectedAnimalName('')
                setSelectedAnimalId(id)
                setSelectedAnimalName(name)
            }}
            />
            {/* TODO change each field for their hooks either useCreateMedication or useCreateMedicationSchedule */}
          <View className='flex-row justify-between'>
            <TextInput
              className='h-12 border rounded-xl px-4 text-2xl my-2 w-3/4'
              placeholder='medicine_name'
              placeholderTextColor='#5c5c5c'
              value={animalName}
              onChangeText={setAnimalName}
            />
            <TextInput
              className='h-12 border rounded-xl px-4 text-2xl my-2 w-1/4'
              placeholder='dose'
              placeholderTextColor='#5c5c5c'
              value={species}
              onChangeText={setSpecies}
            />
          </View>
          <TextInput
            className='h-12 border rounded-xl px-4 text-2xl my-2'
            placeholder='medicine_note'
            placeholderTextColor='#5c5c5c'
            value={species}
            onChangeText={setSpecies}
          />
          <View className='gap-2'>
            <View className='flex-row gap-2 justify-between'>
              {frequencies.map(f => (
                <TouchableOpacity
                  key={f}
                  onPress={() => setFrequency(f)}
                  className={`px-4 py-2 rounded-[10] w-1/4 border ${frequency === f ? 'bg-black' : ''}`}
                >
                  <Text className={`text-2xl ${frequency === f ? 'text-white font-semibold' : 'text-gray-600'}`}>
                    {f}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {frequency === 'weekly'  && (
              <View className='flex-row gap-2 justify-between'>
                {days.map(day => (
                  <TouchableOpacity
                    key={day.value}
                    onPress={() => toggleDay(day.value)}
                    className={`w-14 h-9 rounded-[10] items-center justify-center border ${
                      selectedDays.includes(day.value)
                        ? 'bg-black'
                        : ''
                    }`}
                  >
                    <Text className={selectedDays.includes(day.value) ? 'text-white font-semibold' : 'text-gray-600'}>
                      {day.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          <TextInput
            className='h-12 text-2xl border rounded-xl px-4'
            placeholder='HH:MM (e.g. 08:00)'
            placeholderTextColor='#5c5c5c'
            // value={time}
            // onChangeText={setTime}
            keyboardType='numeric'
            maxLength={5}
          />
          <Text className='text-2xl font-bold mb-1'>Optional </Text>
          <View className='flex-row justify-between'>
            <TextInput
              className='h-12 text-2xl border rounded-xl px-4 w-1/2'
              placeholder='Start-date YYYY-MM-DD'
              placeholderTextColor='#5c5c5c'
              // value={startsOn}
              // onChangeText={setStartsOn}
            />
            <TextInput
              className='h-12 text-2xl border rounded-xl px-4 w-1/2'
              placeholder='End-date YYYY-MM-DD'
              placeholderTextColor='#5c5c5c'
              // value={startsOn}
              // onChangeText={setStartsOn}
            />
          </View>
          <TouchableOpacity 
            className='h-12 text-2xl bg-black rounded-xl items-center justify-center'
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
