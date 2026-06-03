import { View } from 'react-native';
import Text from '../ui/Text'


export default function EmptyAnimalCard({
    familyName
}: {
    familyName: string;
}) {
    return (
        <View className='bg-white rounded-2xl border border-black w-full'>
            <View className='mx-4 mt-4 mb-1'>
                <Text className='text-2xl font-bold mb-3'>{familyName}</Text>
            </View>
            <View className='h-px bg-black'/>
            <View className='m-4'>
                    <Text className='text-xl text-gray-500'>
                        Doesn't have any animals, start adding!
                    </Text>
            </View>
        </View>
    )
}
