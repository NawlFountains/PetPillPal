import { TextInput, TextInputProps } from 'react-native'

type Props = TextInputProps & {
	classname?: string
}

export default function Input({classname, ...props}: Props) {
	return (
		<TextInput
			className={`w-full h-14 text-2xl text-gray-500 border border-gray-400 rounded-[15] px-2 dark:border-gray-200 dark:text-white ${classname ?? ''}`}
			placeholderTextColor='#5c5c5c'
			{...props}
			value={props.value ?? ''}
		/>
	)
}
