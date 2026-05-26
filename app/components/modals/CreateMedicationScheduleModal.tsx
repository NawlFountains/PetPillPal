import { useCreateMedication } from '@/hooks/useCreateMedication'
import { useState } from 'react'
import { Modal, Text, TextInput, TouchableOpacity, View } from 'react-native'
import AnimalDropdown from '../ui/AnimalDropdown'
import FamilyDropdown from '../ui/FamilyDropdown'
import { DAYS_OF_WEEK, FREQUENCIES } from '@/lib/constants'
import ErrorMessage from '../ui/ErrorMessage'

type Props = {
  visible: boolean
  onClose: () => void
}

export default function CreateMedicationScheduleModal({ visible, onClose }: Props) {
    const [selectedFamilyId, setSelectedFamilyId] = useState('')
    const [selectedFamilyName, setSelectedFamilyName] = useState('')
    const [selectedAnimalId, setSelectedAnimalId] = useState('')
    const [selectedAnimalName, setSelectedAnimalName] = useState('')

    const {medicationName, setMedicationName,
        dose, setDose,
        note, setNote,
        time, setTime,
        frequency, setFrequency,
        selectedDays, toggleDay,
        startsOn, setStartsOn,
        endsOn, setEndsOn,
        loading, errors,
        handleCreateMedication} = useCreateMedication(onClose)

  return (
    <Modal visible={visible} animationType='fade' transparent>
      <View className='flex-1 justify-center px-6'>

        <TouchableOpacity
          className='absolute inset-0 bg-black/40'
          onPress={onClose}
        />

        <View className='bg-white dark:bg-black rounded-t-3xl border dark:border-white px-6 pt-6 pb-4'>
          <Text className='text-2xl font-bold dark:text-white'>Add new med schedule </Text>
        </View>
        <View className='bg-white dark:bg-black rounded-b-3xl border dark:border-white px-6 pt-6 pb-8 gap-4'>
          <View style={{ zIndex: 2}}>
            <FamilyDropdown
              selectedId={selectedFamilyId}
              onSelect={(id, name) => {
                  setSelectedFamilyId(id)
                  setSelectedFamilyName(name)
              }}/>
          </View>
          <View style={{ zIndex: 1}}>
            <AnimalDropdown
              selectedId={selectedAnimalId}
              familyId={selectedFamilyId}
              onSelect={(id, name) => {
                setSelectedAnimalId('')
                setSelectedAnimalName('')
                setSelectedAnimalId(id)
                setSelectedAnimalName(name)
            }}/>
          </View>
          <ErrorMessage error={errors.animalId}/>
          <View className='flex-row justify-between w-full gap-3'>
            <View className='flex-1'>
              <TextInput
                className='h-12 text-2xl border dark:border-white dark:text-white rounded-xl px-4'
                placeholder='medication_name'
                placeholderTextColor='#5c5c5c'
                value={medicationName}
                onChangeText={setMedicationName}
              />
              <ErrorMessage error={errors.medicationName}/>
            </View>
            <View className='flex-1'>
              <TextInput
                className='h-12 text-2xl border dark:border-white dark:text-white rounded-xl px-4'
                placeholder='HH:MM (e.g. 08:00)'
                placeholderTextColor='#5c5c5c'
                value={time}
                onChangeText={setTime}
                maxLength={5}
                />
              <ErrorMessage error={errors.time}/>
            </View>
          </View>
          <View className='gap-2'>
            <View className='flex-row gap-2 justify-between'>
              {FREQUENCIES.map(f => (
                <TouchableOpacity
                  key={f}
                  onPress={() => setFrequency(f)}
                  className={`flex-1 px-4 py-2 rounded-[10] w-1/4 border dark:border-white ${frequency === f ? 'bg-black dark:bg-white' : ''}`}
                >
                  <Text className={`text-2xl ${frequency === f ? 'text-white font-semibold dark:text-black' : 'text-gray-600'}`}>
                    {f}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {frequency === 'weekly'  && (
              <View className='flex-row gap-2 justify-between'>
                {DAYS_OF_WEEK.map(day => (
                  <TouchableOpacity
                    key={day.value}
                    onPress={() => toggleDay(day.value)}
                    className={`w-14 h-9 rounded-[10] items-center justify-center border dark:border-white ${
                      selectedDays.includes(day.value)
                        ? 'bg-black dark:bg-white'
                        : ''
                    }`}
                  >
                    <Text className={selectedDays.includes(day.value) ? 'text-white font-semibold dark:text-black' : 'text-gray-600'}>
                      {day.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            <ErrorMessage error={errors.days}/>
          </View>
          <Text className='text-2xl font-bold mb-1 dark:text-white'>Optional</Text>
          <View className='flex-row gap-2'>
            <TextInput
              className='h-12 border dark:border-white dark:text-white rounded-xl px-4 text-2xl flex-1'
              placeholder='note'
              placeholderTextColor='#5c5c5c'
              value={note}
              onChangeText={setNote}
            />
            <TextInput
              className='h-12 border dark:border-white dark:text-white rounded-xl px-4 text-2xl flex-1'
              placeholder='dose'
              placeholderTextColor='#5c5c5c'
              value={dose}
              onChangeText={setDose}
            />
          </View>
          <View className='flex-row gap-2'>
            <View className='flex-1'>
            <TextInput
              className='h-12 text-2xl dark:border-white dark:text-white border rounded-xl px-4'
              placeholder='Start-date YYYY-MM-DD'
              placeholderTextColor='#5c5c5c'
              value={startsOn}
              onChangeText={setStartsOn}
            />
            <ErrorMessage error={errors.startsOn}/>
            </View>
            <View className='flex-1'>
            <TextInput
              className='h-12 text-2xl dark:border-white dark:text-white border rounded-xl px-4'
              placeholder='End-date YYYY-MM-DD'
              placeholderTextColor='#5c5c5c'
              value={endsOn}
              onChangeText={setEndsOn}
            />
            <ErrorMessage error={errors.endsOn}/>
            </View>
          </View>
          <TouchableOpacity 
            className='h-12 text-2xl bg-black dark:bg-white rounded-xl items-center justify-center'
            onPress={ () => handleCreateMedication(selectedAnimalId)}
            disabled={loading}>
            <Text className='text-white dark:text-black font-semibold'>
              {loading ? 'Adding...' : 'Add'}
              </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}
