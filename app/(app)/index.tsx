import { useAuth } from '@/context/AuthContext'
import { isOverdue, isScheduledToday } from '@/lib/utils'
import { useFocusEffect } from 'expo-router'
import { useCallback, useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import CreateAnimalModal from '../components/modals/CreateAnimalModal'
import CreateFamilyModal from '../components/modals/CreateFamilyModal'
import CreateMedicationScheduleModal from '../components/modals/CreateMedicationScheduleModal'
import JoinFamilyModal from '../components/modals/JoinFamilyModal'
import PendingLogDoseCard from '../components/ui/PendingLogDoseCard'

export default function HomeScreen() {
  const { profile, families, doseLogs, refreshDoseLogs } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [showCreateFamily, setShowCreateFamily] = useState(false)
  const [showJoinFamily, setShowJoinFamily] = useState(false)
  const [showCreateAnimal, setShowCreateAnimal] = useState(false)
  const [showCreateMedicationSchedule, setShowCreateMedicationSchedule] = useState(false)

  const todaySchedules = families.flatMap(family =>
  (family.animals ?? []).flatMap(animal =>
    (animal.medications ?? []).flatMap(medication =>
      (medication.medication_schedules ?? [])
        .filter(schedule => isScheduledToday(schedule))
        .map(schedule => ({ family, animal, medication, schedule }))
    )
  )
)

  const overdueSchedules = families.flatMap(family =>
    (family.animals ?? []).flatMap(animal =>
      (animal.medications ?? []).flatMap(medication =>
        (medication.medication_schedules ?? [])
          .filter(schedule => 
            !isScheduledToday(schedule) && isOverdue(schedule, doseLogs)
          )
          .map(schedule => ({ family, animal, medication, schedule }))
      )
    )
  )

  const pending = todaySchedules.filter(
    item => !doseLogs.some(log => log.schedule_id === item.schedule.id)
  )
  const given = todaySchedules.filter(
    item => doseLogs.some(log => log.schedule_id === item.schedule.id)
  )

  
  useFocusEffect(
    useCallback(() => {
      refreshDoseLogs()
    }, [])
  )

  return (
      <View className='flex-1 pt-20 bg-white px-6'>

        <CreateAnimalModal
          visible={showCreateAnimal}
          onClose={() => setShowCreateAnimal(false)}/>   
        <CreateMedicationScheduleModal
          visible={showCreateMedicationSchedule}
          onClose={() => setShowCreateMedicationSchedule(false)}/>
        <CreateFamilyModal
          visible={showCreateFamily}
          onClose={() => setShowCreateFamily(false)}/>
        <JoinFamilyModal
          visible={showJoinFamily}
          onClose={() => setShowJoinFamily(false)}/>
          
        <ScrollView>
          <View>
            <Text className='text-5xl font-bold'>Welcome back</Text>
            <Text className='text-5xl text-gray-700'>{profile?.display_name}</Text>
          </View>
          {/* Pending */}
            {pending.length > 0 && (
              <View className='gap-4 mt-10'>
                <Text className='text-2xl font-bold text-gray-800'>Pending</Text>
                {pending.map(({ family, animal, medication, schedule }) => (
                  <PendingLogDoseCard
                    key={`${animal.id}-${medication.id}-${schedule.id}`}
                    family={family}
                    animal={animal}
                    medication={medication}
                    schedule={schedule}
                  />
                ))}
              </View>
            )}

            {/* Given */}
            {given.length > 0 && (
              <View className='gap-4 mt-10'>
                <Text className='text-2xl font-bold text-gray-800'>Given today</Text>
                {given.map(({ family, animal, medication, schedule }) => (
                  <PendingLogDoseCard
                    key={`${animal.id}-${medication.id}-${schedule.id}`}
                    family={family}
                    animal={animal}
                    medication={medication}
                    schedule={schedule}
                  />
                ))}
              </View>
            )}
            
            {/* Overdue */}
            {overdueSchedules.length > 0 && (
              <View className='gap-4 mt-10'>
                <Text className='text-2xl font-bold text-red-500'>Overdue</Text>
                {overdueSchedules.map(({ family, animal, medication, schedule }) => (
                  <PendingLogDoseCard
                    key={`overdue-${animal.id}-${medication.id}-${schedule.id}`}
                    family={family}
                    animal={animal}
                    medication={medication}
                    schedule={schedule}
                  />
                ))}
              </View>
            )}

            {/* Empty state */}
            {families.length > 0 && todaySchedules.length === 0 && (
              <View className='mt-20 items-center'>
                <Text className='text-gray-400 text-lg'>No medications scheduled for today</Text>
              </View>
            )}

            {/* No families */}
            {families.length === 0 && (
              <View className='mt-20 items-center'>
                <Text className='text-gray-400 text-2xl'>
                  You're not in any family, join or create one.

                </Text>
              </View>
            )}
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
            <TouchableOpacity 
              className='px-6 py-4 border-b border-gray-100'
              onPress={() => {
                setShowCreateFamily(true)
                setMenuOpen(false)}}>
              <Text className='text-base font-semibold'>Create a family</Text>
            </TouchableOpacity>
            <TouchableOpacity 
            className='px-6 py-4'
              onPress={() => {
                setShowJoinFamily(true)
                setMenuOpen(false)}}>
              <Text className='text-base font-semibold'>Join a family</Text>
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

