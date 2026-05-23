import { useAuth } from '@/context/AuthContext'
import { useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import CreateFamilyModal from '../components/modals/CreateFamilyModal'
import JoinFamilyModal from '../components/modals/JoinFamilyModal'
import AnimalCard from '../components/ui/AnimalCard'
import EmptyAnimalCard from '../components/ui/EmptyAnimalCard'

export default function HomeScreen() {
  const { profile, families } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [showCreateFamily, setShowCreateFamily] = useState(false)
  const [showJoinFamily, setShowJoinFamily] = useState(false)
  
  console.log(families[0]?.animals[0]?.medications)
  return (
      <View className='flex-1 pt-20 bg-white px-6'>

        <CreateFamilyModal
          visible={showCreateFamily}
          onClose={() => setShowCreateFamily(false)}/>

        <JoinFamilyModal
          visible={showJoinFamily}
          onClose={() => setShowJoinFamily(false)}/>
        <ScrollView>
          <View>
            <Text className='text-5xl font-bold'>Welcome back</Text>
            <Text className='text-5xl text-gray-700'>{profile?.display_name}</Text>
          </View>
          <View className='gap-6 mt-10'>
              {families.map(family => (
                family.animals && family.animals.length > 0 ? (
                    family.animals.map(animal => (
                      animal.medications.map ( medication => (
                        medication.medication_schedules.map ( schedule => (
                          <AnimalCard key={`${animal.id}-${medication.id}-${schedule.id}`}
                            family={family}
                            animal={animal}
                            medication={medication}
                            schedule={schedule}/>
                        ))
                      ))
                    ))
                ) : (
                      <EmptyAnimalCard key={family.id} familyName={family.name}/>
                )
              ))}
          </View>
        </ScrollView>

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

