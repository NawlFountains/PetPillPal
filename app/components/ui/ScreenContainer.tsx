import { View } from 'react-native'

type Props = {
	children: React.ReactNode
	className?: string
}

export default function ScreenContainer({children, className} : Props) {
	return (
	     <View className={`flex-1 bg-gray-200 dark:bg-zinc-950 min-h-screen ${className}`}>
		     {children}
	     </View>
	)
}
