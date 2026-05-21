import { View, Text } from 'react-native'

export default function Card({
    title,
    subtitle
}: {
    title: string;
    subtitle: string;
}) {
    return (
        <View>
            <Text>{title}</Text>
            <Text>{subtitle}</Text>
        </View>
    )
}