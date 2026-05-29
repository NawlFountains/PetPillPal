import { Platform, useWindowDimensions} from 'react-native'

export function useBreakpoint() {
	const { width } = useWindowDimensions()
	const isWeb = Platform.OS === 'web'
	const cutoffWidth = 1024

	return {
		isNative: !isWeb,
		isMobileBrowser: isWeb && width < cutoffWidth,
		isDesktop: isWeb && width >= cutoffWidth,
	}
}
