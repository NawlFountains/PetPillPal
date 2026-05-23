import { useAuth } from '@/context/AuthContext'
import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import ExitFamilyModal from '../components/modals/ExitFamilyModal'
import AnimalScheduleCard from '../components/ui/AnimalScheduleCard'

export default function HomeScreen() {
  const { families } = useAuth()
  const [ exitModal, setExitModal ] = useState<{ name: string, id: string} | null> (null)
  
  return (
      <View className='flex-1 pt-20 bg-white px-6'>
        <ExitFamilyModal
          visible={exitModal !== null}
          familyName={exitModal?.name ?? ''}
          familyId={exitModal?.id ?? ''}
          onClose={() => setExitModal(null)}/>          
        <View>
          <Text className='text-5xl font-bold'>{families.length > 1 ? 'Families' : 'Family'}</Text>
        </View>
          {families.map(family => (
            <View key={family.id} className='gap-6 mt-10'>
              <TouchableOpacity
                onLongPress={() => setExitModal({ name: family.name, id: family.id})}>
                <Text className='text-3xl font-bold text-gray-600'>
                  {(family.animals?.length ?? 0) > 0 ? family.name + " " : family.name + " doesn't have any animals "} 
                    <Text className='text-3xl font-bold text-gray-600'>
                      {family.code}
                      <Ionicons name='copy-outline' size={14} color='#6b7280' />
                  </Text>
                </Text>
              </TouchableOpacity>
              {/* Add clipboard for copying family code using expo-clipboard requires rebuild */}
                  {family.animals?.map(animal => (
                    <AnimalScheduleCard key={animal.id} animal={animal}/>
                  ))}
              </View>
            ))}
        <TouchableOpacity
          className='absolute bottom-6 right-6 w-14 h-14 bg-black rounded-full items-center justify-center shadow-md'
          onPress={() => null}
          >
          <Text className='text-white text-3xl font-light'>+</Text>
        </TouchableOpacity>
      </View>
  )
}

