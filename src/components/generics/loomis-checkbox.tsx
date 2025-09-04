import { Checkbox } from '@/components/ui/checkbox';
import clsx from 'clsx';

export function LoomisCheckbox({ className = '', ...props }) {
	const styleBase =
		'data-[state=checked]:border-green-loomis data-[state=checked]:bg-green-loomis data-[state=checked]:text-white dark:data-[state=checked]:border-green-loomis dark:data-[state=checked]:bg-green-loomis';
	return <Checkbox {...props} className={clsx(styleBase, className)} />;
}
