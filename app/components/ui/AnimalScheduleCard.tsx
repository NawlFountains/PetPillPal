import { Animal, Medication, Schedule } from '@/lib/definitions';
import { Text, View } from 'react-native';


export default function AnimalScheduleCard({
    animal,
    medication,
    schedule
}: {
    animal: Animal;
    medication: Medication;
    schedule: Schedule;
}) {
    return (
        <View className='bg-white rounded-2xl border border-black w-full'>
            <View className='mx-4 mt-4 mb-1'>
                <Text className='text-2xl font-bold mb-3'>{animal.name}</Text>
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
