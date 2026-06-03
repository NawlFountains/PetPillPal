import { Text as RNText, TextProps } from 'react-native'

export default function Text({ style, ...props }: TextProps) {
	return (
		<RNText 
			style={[{ fontFamily: 'Inter_400Regular' }, style]}
			{...props}
			/>
	)
}
