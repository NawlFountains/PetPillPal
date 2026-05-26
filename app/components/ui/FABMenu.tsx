import { TouchableOpacity, View, Text } from "react-native"

type FABMenuItem = {
    label: string
    onPress: () => void
}

type Props = {
    items: FABMenuItem[]
    open: boolean
    onToggle: () => void
}

export default function FABMenu({items, open, onToggle}: Props) {
    return (
    <>
      {open && (
        <View className='absolute bottom-24 right-6 bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden'>
          {items.map((item, index) => (
            <TouchableOpacity
              key={item.label}
              className={`px-6 py-4 ${index < items.length - 1 ? 'border-b border-gray-100' : ''}`}
              onPress={item.onPress}
            >
              <Text className='text-base font-semibold'>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <TouchableOpacity
        className='absolute bottom-6 right-6 w-14 h-14 bg-black rounded-full items-center justify-center shadow-md'
        onPress={onToggle}
      >
        <Text className='text-white text-3xl font-light'>+</Text>
      </TouchableOpacity>
    </>
  )
}