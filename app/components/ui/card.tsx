import { Text, View } from 'react-native';

export default function Card({
    title,
    subtitle
}: {
    title: string;
    subtitle: string;
}) {
    return (
        <View className='bg_white rounded-2xl p-7 shadow-sm border border-gray-100 w-full'>
            <Text className='text-2xl font-bold text-gray-900 mb-1'>{title}</Text>
            <Text className='text-xl text-gray-500'>{subtitle}</Text>
        </View>
    )
}