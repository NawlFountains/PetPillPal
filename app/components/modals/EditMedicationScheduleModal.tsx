import { useEditMedication } from '@/hooks/useEditMedication'
import { Animal, Medication, Schedule } from '@/lib/definitions'
import { useEffect } from 'react'
import { Modal, Text, TextInput, TouchableOpacity, View } from 'react-native'

type Props = {
  animal: Animal
  medication: Medication
  schedule: Schedule
  visible: boolean
  onClose: () => void
}

export default function EditMedicationScheduleModal({ animal, medication, schedule, visible, onClose }: Props) {

    const {medicationName, setMedicationName,
        dose, setDose,
        note, setNote,
        time, setTime,
        frequency, setFrequency,
        selectedDays, setSelectedDays, toggleDay,
        startsOn, setStartsOn,
        endsOn, setEndsOn,
        loading, errors,
        handleEditMedication} = useEditMedication(onClose)
    const frequencies = ['daily', 'weekly']
    const days = [
      { label: 'M', value: 1 },
      { label: 'T', value: 2 },
      { label: 'W', value: 3 },
      { label: 'T', value: 4 },
      { label: 'F', value: 5 },
      { label: 'S', value: 6 },
      { label: 'S', value: 7 },
    ]
    useEffect(() => {
      if (visible) {
        setMedicationName(medication.name)
        setDose(medication.dose ?? '')
        setNote(medication.note ?? '')
        setTime(schedule.time.substring(0, 5))  // "08:00:00" → "08:00"
        setFrequency(schedule.frequency)
        setSelectedDays(schedule.days_of_week ?? [])
        setStartsOn(schedule.starts_on ?? '')
        setEndsOn(schedule.ends_on ?? '')
      }
    }, [visible])

  return (
      <Modal visible={visible} animationType='fade' transparent>
        <View className='flex-1 justify-center px-6'>
  
          <TouchableOpacity
            className='absolute inset-0 bg-black/40'
            onPress={onClose}
          />
  

        <View className='bg-white rounded-t-3xl border-b px-6 pt-6 pb-4'>
            <Text className='text-2xl font-bold'>Edit med schedule for {animal.name} </Text>
        </View>
          <View className='bg-white rounded-b-3xl px-6 pt-6 pb-8 gap-4'>
            <View className='flex-row justify-between w-full gap-2'>
              <View className='flex-1'>
                <TextInput
                  className='h-12 text-2xl border rounded-xl px-4'
                  defaultValue={medication.name}
                  value={medicationName}
                  onChangeText={setMedicationName}
                />
                {errors.medicationName && (
                  <Text className='text-red-500'>{errors.medicationName}</Text>
                  )}
              </View>
              <View className='flex-1'>
                <TextInput
                  className='h-12 text-2xl border rounded-xl px-4'
                  placeholder='HH:MM (e.g. 08:00)'
                  placeholderTextColor='#5c5c5c'
                  value={time}
                  onChangeText={setTime}
                  maxLength={5}
                />
                {errors.time && (
                  <Text className='text-red-500'>{errors.time}</Text>
                  )}
              </View>
            </View>
            <View className='gap-2'>
              <View className='flex-row gap-2 justify-between'>
                {frequencies.map(f => (
                  <TouchableOpacity
                    key={f}
                    onPress={() => setFrequency(f)}
                    className={`flex-1 px-4 py-2 rounded-[10] w-1/4 border ${frequency === f ? 'bg-black' : ''}`}
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
            <Text className='text-2xl font-bold mb-1'>Optional </Text>
            <View className='flex-row gap-2'>
             <TextInput
              className='h-12 border rounded-xl px-4 text-2xl flex-1'
              placeholder='note'
              placeholderTextColor='#5c5c5c'
              value={note}
              onChangeText={setNote}
            />
            <TextInput
              className='h-12 border rounded-xl px-4 text-2xl flex-1'
              placeholder='dose'
              placeholderTextColor='#5c5c5c'
              value={dose}
              onChangeText={setDose}
            />
            </View>
              
            <View className='flex-row gap-2'>
              <View className='flex-1'>
              <TextInput
                className='h-12 border rounded-xl px-4 text-2xl'
                placeholder='Start-date YYYY-MM-DD'
                placeholderTextColor='#5c5c5c'
                value={startsOn}
                onChangeText={setStartsOn}
              />
              {errors.startsOn && (
                <Text className='text-red-500'>{errors.startsOn}</Text>
              )}
              </View>
              <View className='flex-1'>
              <TextInput
                className='h-12 border rounded-xl px-4 text-2xl flex-1'
                placeholder='End-date YYYY-MM-DD'
                placeholderTextColor='#5c5c5c'
                value={endsOn}
                onChangeText={setEndsOn}
              />
              {errors.endsOn && (
                <Text className='text-red-500'>{errors.endsOn}</Text>
              )}
            </View>
            </View>
            <TouchableOpacity 
              className='h-12 text-2xl bg-black rounded-xl items-center justify-center'
              onPress={ () => handleEditMedication(medication.id, schedule.id)}
              disabled={loading}>
              <Text className='text-white font-semibold'>
                {loading ? 'Editing...' : 'Edit'}
                </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    )
  
}
