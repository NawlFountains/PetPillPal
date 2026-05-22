import { useAuth } from '@/context/AuthContext'
import { Text, View } from 'react-native'
import FamilyPetCard from '../components/ui/family_pet_card'

export default function HomeScreen() {
  const { profile } = useAuth()
  
  return (
      <View className='flex-1 pt-20 bg-white px-6'>
        <View>
          <Text className='text-5xl font-bold'>Welcome back</Text>
          <Text className='text-5xl text-gray-700'>{profile?.display_name}</Text>
        </View>
        <View className='gap-6 mt-10'>
            <FamilyPetCard family_name='{familiy_name_1}' pet_name='{pet_name_1}' med_name='{med_name}'/>
            <FamilyPetCard family_name='{familiy_name_1}' pet_name='{pet_name_2}' med_name='{med_name}'/>
            <FamilyPetCard family_name='{familiy_name_2}' pet_name='{pet_name_1}' med_name='{med_name}'/>
        </View>
      </View>
  )
}

