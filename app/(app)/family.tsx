import { useAuth } from '@/context/AuthContext'
import { Animal, Medication, Schedule } from '@/lib/definitions'
import { Ionicons } from '@expo/vector-icons'
import * as Clipboard from 'expo-clipboard'
import { useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import CreateAnimalModal from '../components/modals/CreateAnimalModal'
import CreateMedicationScheduleModal from '../components/modals/CreateMedicationScheduleModal'
import DeleteMedicationScheduleModal from '../components/modals/DeleteMedicationScheduleModal'
import EditMedicationScheduleModal from '../components/modals/EditMedicationScheduleModal'
import ExitFamilyModal from '../components/modals/ExitFamilyModal'
import AnimalScheduleCard from '../components/ui/AnimalScheduleCard'

export default function HomeScreen() {
  const { families } = useAuth()
  const [ exitModal, setExitModal ] = useState<{ name: string, id: string} | null> (null)
  const [ deleteScheduleModal, setDeleteScheduleModal ] = useState<{ animal: Animal, medication: Medication, schedule: Schedule} | null> (null)
  const [ editScheduleModal, setEditScheduleModal ] = useState<{ animal: Animal, medication: Medication, schedule: Schedule} | null> (null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [showCreateAnimal, setShowCreateAnimal] = useState(false)
  const [showCreateMedicationSchedule, setShowCreateMedicationSchedule] = useState(false)

const handleCopy = async (code: string, familyId: string) => {
  await Clipboard.setStringAsync(code)
  setCopiedId(familyId)
  setTimeout(() => setCopiedId(null), 2000)
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
        <CreateMedicationScheduleModal
          visible={showCreateMedicationSchedule}
          onClose={() => setShowCreateMedicationSchedule(false)}/>
        {deleteScheduleModal && (
          <DeleteMedicationScheduleModal
            visible={true}
            animal={deleteScheduleModal.animal}
            medication={deleteScheduleModal.medication}
            schedule={deleteScheduleModal.schedule}
            onClose={() => setDeleteScheduleModal(null)}
          />
        )}
        {editScheduleModal && (
          <EditMedicationScheduleModal
            visible={true}
            animal={editScheduleModal.animal}
            medication={editScheduleModal.medication}
            schedule={editScheduleModal.schedule}
            onClose={() => setEditScheduleModal(null)}
          />
        )}
        <ScrollView>
          <View>
            <Text className='text-5xl font-bold'>{families.length > 1 ? 'Families' : 'Family'}</Text>
          </View>
            {families.map(family => (
              <View key={family.id} className='gap-6 mt-10'>
                <View className='flex-row justify-between item-center'>
                  <View className='flex-row item-center gap-2 flex-1'>
                  <TouchableOpacity
                    onPress={() => handleCopy(family.code, family.id)}>

                      <Text className='text-3xl text-gray-600'>
                        <Text className='font-bold'>
                          {family.name}
                        </Text>
                          {(family.animals?.length ?? 0) > 0 ? " " : " doesn't have any animals "} 
                        <Ionicons name={copiedId == family.id ? 'checkmark-outline' : 'copy-outline'} size={30} color='#5c5c5c' />
                      </Text>
                  </TouchableOpacity>
                    </View>
                  <TouchableOpacity
                    onPress={() => setExitModal({ name: family.name, id: family.id})}>
                    <Ionicons name='exit-outline' size={36} color='#f56565' />
                  </TouchableOpacity>
                </View>
                    {family.animals?.map(animal => (
                      animal.medications?.map(medication => (
                        medication.medication_schedules?.map( schedule => (
                          <View 
                            key={`${animal.id}-${medication.id}-${schedule.id}`}
                            className='flex-row items-center gap-3'
                            >
                            <TouchableOpacity
                              className='flex-1'
                              onLongPress={() => setEditScheduleModal({ animal, medication, schedule })}
                            >
                              <AnimalScheduleCard
                                animal={animal}
                                medication={medication}
                                schedule={schedule}
                                onEdit={() => setEditScheduleModal({ animal, medication, schedule })}
                                onDelete={() => setDeleteScheduleModal({ animal, medication, schedule })}

                              />
                            </TouchableOpacity>
                          </View>
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
                setShowCreateMedicationSchedule(true)
                setMenuOpen(false)}}>
              <Text className='text-base font-semibold'>Add medication schedule</Text>
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

