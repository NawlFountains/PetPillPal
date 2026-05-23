import { useAuth } from '@/context/AuthContext'
import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

type Props = {
  selectedId: string
  familyId: string
  onSelect: (id: string, name: string) => void
}

export default function AnimalDropdown({ selectedId, familyId, onSelect }: Props) {
  const { families } = useAuth()
  const [open, setOpen] = useState(false)

  const family = families.find(f => f.id === familyId)
  const animals = family?.animals ?? []
  const selected = animals.find(a => a.id === selectedId)

  if (!familyId) {
    return (
      <View className='h-12 border border-gray-200 rounded-xl px-4 justify-center'>
        <Text className='text-2xl text-gray-400'>Select a family first</Text>
      </View>
    )
  }

  return (
    <View className='relative z-10'>
      <TouchableOpacity
        className='h-12 border rounded-xl px-4 flex-row items-center justify-between'
        onPress={() => setOpen(!open)}
      >
        <Text className={`text-2xl ${selected ? 'text-gray-900' : 'text-gray-400'}`}>
          {selected ? selected.name : 'Select an animal'}
        </Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={16} color='#9ca3af' />
      </TouchableOpacity>

      {open && (
        <View className='absolute top-14 left-0 right-0 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md'>
          {animals.length === 0 ? (
            <View className='px-4 py-3'>
              <Text className='text-gray-400'>No animals in this family</Text>
            </View>
          ) : (
            animals.map(animal => (
              <TouchableOpacity
                key={animal.id}
                className='px-4 py-3 border-b border-gray-100'
                onPress={() => {
                  onSelect(animal.id, animal.name)
                  setOpen(false)
                }}
              >
                <Text className={`text-base ${animal.id === selectedId ? 'font-bold text-black' : 'text-gray-700'}`}>
                  {animal.name}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      )}
    </View>
  )
}