import { useRef } from 'react';
import { LoomisInputText } from './loomis-input-text';

export interface ICodeInput {
	length?: number;
	code: string[];
	setCode: (code: string[]) => void;
}

export function CodeInput({ length = 6, code, setCode }: ICodeInput) {
	const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

	const handleChange = (index: number, value: string) => {
		if (!/^\d?$/.test(value)) return;

		const newCode = [...code];
		newCode[index] = value;
		setCode(newCode);

		if (value && index < length - 1) {
			inputsRef.current[index + 1]?.focus();
		}
	};

	return (
		<div className='flex justify-between gap-2'>
			{code.map((value, index) => (
				<LoomisInputText
					key={index}
					ref={(el) => {
						inputsRef.current[index] = el;
					}}
					type='text'
					inputMode='numeric'
					maxLength={1}
					className='w-16 h-22 text-center text-3xl text-gray-loomis-700'
					value={value}
					onChange={(e) => handleChange(index, e.target.value)}
				/>
			))}
		</div>
	);
}
