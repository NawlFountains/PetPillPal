import { useAuth } from '@/context/AuthContext'
import { Ionicons } from '@expo/vector-icons'
import * as Clipboard from 'expo-clipboard'
import { useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import CreateAnimalModal from '../components/modals/CreateAnimalModal'
import CreateMedicineSchedule from '../components/modals/CreateMedicineSchedule'
import ExitFamilyModal from '../components/modals/ExitFamilyModal'
import AnimalScheduleCard from '../components/ui/AnimalScheduleCard'

export default function HomeScreen() {
  const { families } = useAuth()
  const [ exitModal, setExitModal ] = useState<{ name: string, id: string} | null> (null)
  const [copied, setCopied] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [showCreateAnimal, setShowCreateAnimal] = useState(false)
  const [showCreateMedicineSchedule, setShowCreateMedicineSchedule] = useState(false)

const handleCopy = async (code: string) => {
  await Clipboard.setStringAsync(code)
  setCopied(true)
  setTimeout(() => setCopied(false), 2000)
}
  return (
      <View className='flex-1 pt-20 bg-white px-6'>
        <ExitFamilyModal
          visible={exitModal !== null}
          familyName={exitModal?.name ?? ''}
          familyId={exitModal?.id ?? ''}
          onClose={() => setExitModal(null)}/>      
          <CreateAnimalModal
            visible={showCreateAnimal}
            onClose={() => setShowCreateAnimal(false)}/>   
          <CreateMedicineSchedule
          visible={showCreateMedicineSchedule}
          onClose={() => setShowCreateMedicineSchedule(false)}/>
          <ScrollView>
        <View>
          <Text className='text-5xl font-bold'>{families.length > 1 ? 'Families' : 'Family'}</Text>
        </View>
          {families.map(family => (
            <View key={family.id} className='gap-6 mt-10'>
              <View className='flex-row justify-between'>
                <TouchableOpacity
                  onPress={() => handleCopy(family.code)}>
                  <Text className='text-3xl font-bold text-gray-600'>
                    {(family.animals?.length ?? 0) > 0 ? family.name + " " : family.name + " doesn't have any animals "} 
                    <Ionicons name={copied ? 'checkmark-outline' : 'copy-outline'} size={30} color='#5c5c5c' />
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setExitModal({ name: family.name, id: family.id})}>
                  <Ionicons name='exit-outline' size={36} color='#f56565' />
                </TouchableOpacity>
              </View>

                  {family.animals?.map(animal => (
                    animal.medications?.map(medication => (
                      medication.medication_schedules?.map( schedule => (
                        <TouchableOpacity
                          key={`${animal.id}-${medication.id}-${schedule.id}`}
                          // onLongPress={() => setEditOrDeleteScheduleModal({ id: schedule.id})}
                          >
                        <AnimalScheduleCard 
                          key={`${animal.id}-${medication.id}-${schedule.id}`} 
                          animal={animal} 
                          medication = {medication} 
                          schedule={schedule}/>
                        </TouchableOpacity>

                      ))
                    ))
                  ))}
              </View>
            ))}
        </ScrollView>
           {menuOpen && (
          <View className='absolute bottom-24 right-6 bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden'>
            <TouchableOpacity 
              className='px-6 py-4 border-b border-gray-100'
              onPress={() => {
                setShowCreateAnimal(true)
                setMenuOpen(false)}}>
              <Text className='text-base font-semibold'>Add animal</Text>
            </TouchableOpacity>
            <TouchableOpacity 
            className='px-6 py-4'
              onPress={() => {
                setShowCreateMedicineSchedule(true)
                setMenuOpen(false)}}>
              <Text className='text-base font-semibold'>Add medicine schedule</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          className='absolute bottom-6 right-6 w-14 h-14 bg-black rounded-full items-center justify-center shadow-md'
          onPress={() => setMenuOpen(!menuOpen)}
          >
          <Text className='text-white text-3xl font-light'>+</Text>
        </TouchableOpacity>
        
      </View>
  )
}

