import { View } from 'react-native'

type Props = {
	children: React.ReactNode
	className?: string
}

export default function ModalContainer({children, className} : Props) {
	return (
	     <View className={`bg-gray-50 dark:bg-zinc-800 rounded-3xl w-full max-w-2xl ${className}`}>
		     {children}
	     </View>
	)
}
