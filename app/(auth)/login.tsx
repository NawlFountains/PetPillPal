import { View } from 'react-native'
import Card from '../components/ui/card'

export default function LoginScreen() {
    return (
        <View className ='flex-1 items-center justify-center bg-white px-6'>
            <Card title='Login' subtitle='Log into your account please'></Card>
        </View>
    )
}