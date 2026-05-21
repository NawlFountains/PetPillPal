import { Text, View } from 'react-native';

export default function Card({
    title,
    subtitle
}: {
    title: string;
    subtitle: string;
}) {
    return (
        <View className='bg_white rounded-2xl p-4 shadow-sm border border-gray-100 w-full'>
            <View className='m-4'>
                <Text className='text-2xl font-bold text-gray-900 mb-3'>{title}</Text>
                <Text className='text-xl text-gray-500'>{subtitle}</Text>
            </View>
        </View>
    )
}
