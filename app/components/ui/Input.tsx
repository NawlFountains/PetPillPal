import { TextInput, TextInputProps } from 'react-native'

type Props = TextInputProps & {
	classname?: string
}

export default function Input({classname, ...props}: Props) {
	return (
		<TextInput
			className={`w-full h-14 text-2xl bg-neutral-100 dark:bg-neutral-800 text-gray-500 border border-neutral-200 rounded-[15] px-2 dark:border-neutral-700 dark:text-white ${classname ?? ''}`}
			placeholderTextColor='#5c5c5c'
			{...props}
			value={props.value ?? ''}
		/>
	)
}
