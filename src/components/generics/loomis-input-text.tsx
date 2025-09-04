import { Input } from '@/components/ui/input';
import clsx from 'clsx';

export function LoomisInputText({
	className,
	type,
	...props
}: React.ComponentProps<'input'>) {
	const styleBase =
		'w-full px-3 py-2 border rounded-md text-sm text-gray-loomis-700 shadow-sm focus-visible:outline-none focus-visible:border-green-loomis focus-visible:ring-green-loomis';
	return (
		<Input
			type={type ?? 'text'}
			className={clsx(styleBase, className)}
			{...props}
		/>
	);
}
