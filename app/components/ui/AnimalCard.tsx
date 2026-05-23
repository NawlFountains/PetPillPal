import { Animal, Family, Medication, Schedule } from '@/lib/definitions';
import { Text, View } from 'react-native';


export default function AnimalCard({
    family,
    animal,
    medication,
    schedule
}: {
    family: Family;
    animal: Animal;
    medication: Medication;
    schedule: Schedule;
}) {
    return (
        <View className='bg-white rounded-2xl border border-black w-full'>
            <View className='mx-4 mt-4 mb-1'>
                <Text className='text-2xl font-bold mb-3'>{family.name}</Text>
            </View>
            <View className='h-px bg-black'/>
            <View className='m-4'>
                    <Text className='text-xl text-gray-500'>
                        <Text className='text-black font-bold'>{animal.name} </Text>                     
                        schedule to take 
                        <Text className='text-black font-bold'> {medication.name} {medication.dose == '' ? '' : `(${medication.dose}) `}</Text> 
                        {schedule.frequency == 'daily' ? `at ${schedule.time}` : `weekly at ${schedule.time}`}                    
                    </Text>
            </View>
        </View>
    )
}
