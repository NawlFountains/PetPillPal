import { Animal } from '@/lib/definitions';
import { Text, View } from 'react-native';


export default function AnimalScheduleCard({
    animal
}: {
    animal: Animal;
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
                        <Text className='text-black font-bold'> med_name </Text>                     
                        every Thursday before 18:00
                    </Text>
            </View>
        </View>
    )
}
