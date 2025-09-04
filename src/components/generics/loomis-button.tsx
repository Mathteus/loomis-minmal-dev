import { VariantProps } from 'class-variance-authority';
import { Button, buttonVariants } from '../ui/button';
import clsx from 'clsx';

export function LoomisButton({
	children,
	className = '',
	disabled = false,
	...props
}: React.ComponentProps<'button'> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
		disabled?: boolean;
	}) {
	const styleBase =
		'w-full bg-green-loomis hover:bg-green-loomis-light hover:text-green-loomis cursor-pointer active:scale-90';
	const disabledStyle = 'bg-gray-200 text-gray-400 w-full cursor-standard';
	const setStyleBase = () => {
		return disabled ? disabledStyle : styleBase;
	};

	return (
		<Button
			disabled={disabled}
			className={clsx(setStyleBase(), className)}
			{...props}>
			{children}
		</Button>
	);
}
