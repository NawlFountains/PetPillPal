import { useAuth } from '@/context/AuthContext'
import { isOverdue, isScheduledToday } from '@/lib/utils'
import { useFocusEffect } from 'expo-router'
import { useCallback } from 'react'
import { ScrollView, Text, View } from 'react-native'
import PendingLogDoseCard from '../components/ui/PendingLogDoseCard'
import FABModals from '../components/modals/FABModal'

export default function HomeScreen() {
  const { profile, families, doseLogs, refreshDoseLogs } = useAuth()

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
      <View className='flex-1 pt-20 bg-white dark:bg-black px-6'>

          
        <ScrollView>
          <View>
            <Text className='text-5xl font-bold dark:text-white'>Welcome back</Text>
            <Text className='text-5xl text-gray-700 dark:text-gray-100'>{profile?.display_name}</Text>
          </View>
          {/* Pending */}
            {pending.length > 0 && (
              <View className='gap-4 mt-10'>
                <Text className='text-2xl font-bold text-gray-800 dark:text-gray-200'>Pending</Text>
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
                <Text className='text-2xl font-bold text-gray-800 dark:text-gray-100'>Given today</Text>
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
                <Text className='text-gray-400 text-lg dark:text-gray-100'>No medications scheduled for today</Text>
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
        
        <FABModals/>
    
      </View>
  )
}

