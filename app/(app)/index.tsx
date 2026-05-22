import { useAuth } from '@/context/AuthContext'
import { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import CreateFamilyModal from '../components/modals/CreateFamilyModal'
import JoinFamilyModal from '../components/modals/JoinFamilyModal'
import FamilyPetCard from '../components/ui/FamilyPetCard'

export default function HomeScreen() {
  const { profile } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [showCreateFamily, setShowCreateFamily] = useState(false)
  const [showJoinFamily, setShowJoinFamily] = useState(false)
  
  return (
      <View className='flex-1 pt-20 bg-white px-6'>

        <CreateFamilyModal
          visible={showCreateFamily}
          onClose={() => setShowCreateFamily(false)}/>

        <JoinFamilyModal
          visible={showJoinFamily}
          onClose={() => setShowJoinFamily(false)}/>

        <View>
          <Text className='text-5xl font-bold'>Welcome back</Text>
          <Text className='text-5xl text-gray-700'>{profile?.display_name}</Text>
        </View>
        <View className='gap-6 mt-10'>
            <FamilyPetCard family_name='{familiy_name_1}' pet_name='{pet_name_1}' med_name='{med_name}'/>
            <FamilyPetCard family_name='{familiy_name_1}' pet_name='{pet_name_2}' med_name='{med_name}'/>
            <FamilyPetCard family_name='{familiy_name_2}' pet_name='{pet_name_1}' med_name='{med_name}'/>
        </View>
        {menuOpen && (
          <View className='absolute bottom-24 right-6 bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden'>
            <TouchableOpacity 
              className='px-6 py-4 border-b border-gray-100'
              onPress={() => {
                setShowCreateFamily(true)
                setMenuOpen(false)}}>
              <Text className='text-base font-semibold'>Create a family</Text>
            </TouchableOpacity>
            <TouchableOpacity 
            className='px-6 py-4'
              onPress={() => {
                setShowJoinFamily(true)
                setMenuOpen(false)}}>
              <Text className='text-base font-semibold'>Join a family</Text>
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity
          className='absolute bottom-6 right-6 w-14 h-14 bg-black rounded-full items-center justify-center shadow-md'
          onPress={() => setMenuOpen(!menuOpen)}
          >
          <Text className='text-white text-3xl font-light'>+</Text>
        </TouchableOpacity>
      </View>
  )
}

