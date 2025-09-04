import React, { useState } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LoomisInputText } from './loomis-input-text';

type PasswordInputProps = React.InputHTMLAttributes<HTMLInputElement>;

const LoomisPasswordInput = React.forwardRef<
	HTMLInputElement,
	PasswordInputProps
>(({ className, ...props }, ref) => {
	const [showPassword, setShowPassword] = useState<boolean>(false);

	return (
		<div className='relative'>
			<LoomisInputText
				type={showPassword ? 'text' : 'password'}
				className={cn('pr-10', className)}
				ref={ref}
				{...props}
			/>
			<button
				type='button'
				onClick={() => setShowPassword(!showPassword)}
				className='absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 select-none cursor-pointer'>
				{showPassword ? (
					<EyeOffIcon className='size-4' />
				) : (
					<EyeIcon className='size-4' />
				)}
			</button>
		</div>
	);
});

LoomisPasswordInput.displayName = 'PasswordInput';

export { LoomisPasswordInput };
