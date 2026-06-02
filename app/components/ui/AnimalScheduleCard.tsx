import { Animal, Medication, Schedule } from '@/lib/definitions';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useColorScheme } from 'nativewind'


export default function AnimalScheduleCard({
    animal,
    medication,
    schedule,
    onEdit,
    onDelete
}: {
    animal: Animal;
    medication: Medication;
    schedule: Schedule;
    onEdit?: () => void
    onDelete?: () => void
}) {
    const { colorScheme } = useColorScheme()
    const isDark = colorScheme === 'dark'

    return (
        <View className='bg-white dark:bg-zinc-900 rounded-2xl border border-black dark:border-gray-400 w-full'>
            <View className='flex-row mx-4 my-2 justify-between'>
                <View className='justify-center'>
                    <Text className='text-2xl font-bold dark:text-white'>{animal.name}</Text>
                </View>
                <View className='flex-row gap-5 justify-center'>
                    {onEdit ? (
                        <TouchableOpacity
                            onPress={onEdit}
                            >
                            <Ionicons name='pencil' size={30} color={ isDark ? '#c5c5c5' : '#1c1c1c'} />
                        </TouchableOpacity>
                    ) : null}
                    {onDelete ? (
                        <TouchableOpacity
                            onPress={onDelete}
                            >
                            <Ionicons name='trash-outline' size={30} color='#f56565' />
                        </TouchableOpacity>
                    ) : null}
                </View>
            </View>
            <View className='h-px bg-black dark:bg-gray-400'/>
            <View className='m-4'>
                    <Text className='text-xl text-gray-500 dark:text-gray-200'>                
                        Schedule to take 
                        <Text className='text-black font-bold dark:text-white'> {medication.name} {medication.dose == '' ? '' : `(${medication.dose}) `}</Text> 
                        {schedule.frequency === 'daily' 
                            ? `everyday at ${schedule.time}`
                            : `every ${schedule.days_of_week
                                ?.map(d => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][d - 1])
                                .join(', ')} at ${schedule.time}`
                            }      
                    </Text>
                    {medication.note ? (
                        <Text className='text-xl text-gray-500 dark:text-gray-200'> 
                        Notes: {medication.note}
                        </Text>
                    ) : null}
                    {(schedule.starts_on || schedule.ends_on) && (
                        <View className='flex-row justify-between'>
                            <Text className='text-xl text-gray-500 dark:text-gray-200'> 
                                {schedule.starts_on && (
                                    `From: ${schedule.starts_on}`
                                )}
                            </Text>
                            <Text className='text-xl text-gray-500 dark:text-gray-200'> 
                                {schedule.ends_on && (
                                    `Till: ${schedule.ends_on}`
                                )}
                            </Text>
                        </View>
                    )}
            </View>
        </View>
    )
}
