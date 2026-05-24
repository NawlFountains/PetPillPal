import { useAuth } from '@/context/AuthContext'
import { useDeleteLogDose } from '@/hooks/useDeleteLogDose'
import { useLogDose } from '@/hooks/useLogDose'
import { Animal, Family, Medication, Schedule } from '@/lib/definitions'
import { formatLocalTime } from '@/lib/utils'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

type Props = {
    family: Family
    animal: Animal
    medication: Medication
    schedule: Schedule
    onDelete?: () => void
}

export default function PendingLogDoseCard({ family, animal, medication, schedule, onDelete }: Props) {
    const { doseLogs, profile } = useAuth()
    const { handleLogDose, loading } = useLogDose(() => {})
    const { handleDeleteLogDose } = useDeleteLogDose(() => {})

    const log = doseLogs.find(l => l.schedule_id === schedule.id)
    const isGiven = !!log
    const isMyLog = log?.given_by === profile?.id

    return (
    <View className='bg-white rounded-2xl border border-black w-full'>
        <View className='mx-4 my-4 flex-row justify-between items-center'>
        <Text className='text-2xl font-bold'>{animal.name}</Text>
        {onDelete && (
            <TouchableOpacity onPress={onDelete}>
            <Ionicons name='trash-bin-outline' size={24} color='#f56565' />
            </TouchableOpacity>
        )}
        </View>
        <View className='h-px bg-black' />
        <View className='m-4 gap-3'>
        <Text className='text-xl text-gray-500'>
            Schedule to take
            <Text className='text-black font-bold'> {medication.name} </Text>
            {schedule.frequency === 'daily'
            ? `everyday at ${schedule.time.substring(0, 5)}`
            : `every ${schedule.days_of_week
                ?.map(d => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][d - 1])
                .join(', ')} at ${schedule.time.substring(0, 5)}`}
        </Text>

        {isGiven ? (
            <View className='flex-row items-center justify-between bg-green-50 rounded-xl p-3'>
                <View className='flex-row items-center gap-2'>
                <Ionicons name='checkmark-circle' size={20} color='#22c55e' />
                <Text className='text-lg text-green-700 font-semibold'>
                    Given by {log.profiles?.display_name ?? 'Unknown'} {formatLocalTime(log.given_at)}
                </Text>
                </View>
                {isMyLog && (
                <TouchableOpacity 
                    className='border border-red-500 bg-white rounded-[7] p-1'
                    onPress={() => handleDeleteLogDose(log.id)}>
                    <Text className='text-red-500 text-lg font-bold'>Undo</Text>
                </TouchableOpacity>
                )}
            </View>
            ) : (
            <TouchableOpacity
                className='h-12 bg-black rounded-xl items-center justify-center'
                onPress={() => handleLogDose(family.id, medication, schedule)}
                disabled={loading}
            >
                <Text className='text-white font-semibold'>
                {loading ? 'Logging...' : 'Mark as given'}
                </Text>
            </TouchableOpacity>
            )}
        </View>
    </View>
    )
}