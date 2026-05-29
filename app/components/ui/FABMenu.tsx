import { TouchableOpacity, View, Text} from "react-native"
import { useBreakpoint } from '@/hooks/useBreakpoint'

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
	const { isNative, isMobileBrowser } = useBreakpoint()
	const fabBottom = isNative 
		  ? 'bottom-6' 
		  : isMobileBrowser 
		    ? 'bottom-[200px]' 
		    : 'bottom-[70px]'

	const fabMenuBottom = isNative
		? 'bottom-20'
		: isMobileBrowser
		  ? 'bottom-[260px]'
		  : 'bottom-[130px]'
	
    return (
    <>
      {open && (
        <View className={`absolute ${fabMenuBottom} right-6 bg-white dark:bg-black rounded-2xl border border-gray-200 shadow-md overflow-hidden`}>
          {items.map((item, index) => (
            <TouchableOpacity
              key={item.label}
              className={`px-6 py-4 ${index < items.length - 1 ? 'border-b border-gray-100' : ''}`}
              onPress={item.onPress}
            >
              <Text className='text-base font-semibold dark:text-white'>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <TouchableOpacity
        className={`absolute ${fabBottom} right-6 w-14 h-14 bg-black dark:bg-white rounded-full items-center justify-center shadow-md`}
        onPress={onToggle}
      >
        <Text className='text-white dark:text-black text-3xl font-light'>+</Text>
      </TouchableOpacity>
    </>
  )
}
