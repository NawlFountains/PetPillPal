import { TextInput, TextInputProps } from 'react-native'

type Props = TextInputProps & {
	classname?: string
}

export default function Input({classname, ...props}: Props) {
	return (
		<TextInput
			className={`w-full h-14 text-2xl text-gray-500 border rounded-[15] px-5 dark:border-gray-200 dark:text-white ${classname ?? ''}`}
			placeholder='#5c5c5c'
			{...props}
		/>
	)
}
