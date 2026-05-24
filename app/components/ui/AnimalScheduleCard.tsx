import { Animal, Medication, Schedule } from '@/lib/definitions';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';


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
    return (
        <View className='bg-white rounded-2xl border border-black w-full'>
            <View className='flex-row mx-4 mt-4 mb-1 justify-between'>
                <View>
                    <Text className='text-2xl font-bold mb-3'>{animal.name}</Text>
                </View>
                <View className='flex-row gap-5'>
                    {onEdit && (
                        <TouchableOpacity
                            onPress={onEdit}
                            >
                            <Ionicons name='pencil' size={30} color='#1c1c1c' />
                        </TouchableOpacity>
                    )}
                    {onDelete && (
                        <TouchableOpacity
                            onPress={onDelete}
                            >
                            <Ionicons name='trash-outline' size={30} color='#f56565' />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
            <View className='h-px bg-black'/>
            <View className='m-4'>
                    <Text className='text-xl text-gray-500'>                
                        Schedule to take 
                        <Text className='text-black font-bold'> {medication.name} {medication.dose == '' ? '' : `(${medication.dose}) `}</Text> 
                        {schedule.frequency === 'daily' 
                            ? `everyday at ${schedule.time}`
                            : `every ${schedule.days_of_week
                                ?.map(d => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][d - 1])
                                .join(', ')} at ${schedule.time}`
                            }      
                    </Text>
                    {medication.note && (
                        <Text className='text-xl text-gray-500'> 
                        Notes: {medication.note}
                        </Text>
                    )}
                    {(schedule.starts_on || schedule.ends_on) && (
                        <View className='flex-row justify-between'>
                            <Text className='text-xl text-gray-500'> 
                                {schedule.starts_on && (
                                    `From: ${schedule.starts_on}`
                                )}
                            </Text>
                            <Text className='text-xl text-gray-500'> 
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
