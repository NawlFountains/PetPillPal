import { useAuth } from '@/context/AuthContext'
import { Ionicons } from '@expo/vector-icons'
import React, { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

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
    <View className='relative z-10 '>
      <TouchableOpacity
        className='h-12 border rounded-xl px-4 flex-row items-center justify-between'
        onPress={() => setOpen(!open)}
      >
        <Text className={`text-2xl ${selected ? 'text-gray-900' : 'text-gray-400'}`}>
          {selected ? selected.name : 'Select a family'}
        </Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={16} color='#9ca3af' />
      </TouchableOpacity>

      {/* Options */}
      {open && (
        <View className='absolute top-14 left-0 right-0 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md'>
          {families.map(family => (
            <TouchableOpacity
              key={family.id}
              className='px-4 py-3 border-b border-gray-100'
              onPress={() => {
                onSelect(family.id, family.name)
                setOpen(false)
              }}
            >
              <Text className={`text-base ${family.id === selectedId ? 'font-bold text-black' : 'text-gray-700'}`}>
                {family.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  )
}