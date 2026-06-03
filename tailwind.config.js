module.exports = {
  content: ['./app/**/*.tsx', './components/**/*.tsx'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
	extend: {
		fontFamily: {
			sans: ['Inter_400Regular'],
			bold: ['Inter_700Bold'],
		}
	}
  }
}
