import { Text } from 'react-native'

type Props = {
    error?: string
}

export default function ErrorMessage({error } : Props) {
    if (!error) return null
    return <Text className='text-red-500 p-1 pt-2'>{error}</Text>
}
