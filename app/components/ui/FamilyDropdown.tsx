import { useAuth } from '@/context/AuthContext'
import { Ionicons } from '@expo/vector-icons'
import React, { useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import Text from '../ui/Text'

export default function FamilyDropdown({ 
  selectedId, 
  onSelect 
}: { 
  selectedId: string, 
  onSelect: (id: string, name: string) => void 
}) {
  const { families } = useAuth()
  const [open, setOpen] = useState(false)
  const selected = families.find(f => f.id === selectedId)

  return (
    <View className='relative z-10'>
      <TouchableOpacity
        className='h-14 border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 rounded-xl px-2 flex-row items-center justify-between'
        onPress={() => setOpen(!open)}
      >
        <Text className={`text-2xl ${selected ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
          {selected ? selected.name : 'Select a family'}
        </Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={16} color='#9ca3af' />
      </TouchableOpacity>

      {/* Options */}
      {open && (
        <View className='absolute top-14 left-0 right-0 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl overflow-hidden shadow-md'>
          {families.map(family => (
            <TouchableOpacity
              key={family.id}
              className='px-2 py-3 border-b border-neutral-200 dark:border-neutral-700'
              onPress={() => {
                onSelect(family.id, family.name)
                setOpen(false)
              }}
            >
              <Text className={`text-base ${family.id === selectedId ? 'font-bold text-black dark:text-white' : 'text-gray-700 dark:text-gray-200'}`}>
                {family.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  )
}
