import { MoveUpRight } from 'lucide-react';

interface QuickActionCardProps {
	icon: React.ReactNode;
	title: string;
	description: string;
}

export function QuickActionCard({
	icon,
	title,
	description,
}: QuickActionCardProps) {
	return (
		<div className='p-4 bg-white rounded-xl shadow-sm hover:shadow-md cursor-pointer transition-shadow w-full'>
			<div className='text-green-loomis-dark flex justify-between'>
				<div className='p-2 bg-green-100 rounded-lg text-green-700'>{icon}</div>
				<MoveUpRight className='size-6 text-green-loomis-dark' />
			</div>
			<div className='mt-3'>
				<p className='text-large-loomis text-gray-700'>{title}</p>
				<p className='text-small-loomis text-gray-700'>{description}</p>
			</div>
		</div>
	);
}
