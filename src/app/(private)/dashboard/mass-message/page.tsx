'use client';
import { useRequireAuth } from '@/hooks/use-require-auth';

export default function MassMessagePage() {
	useRequireAuth();
	return (
		<div className='flex items-center justify-center flex-1 bg-gray-100'>
			<span className='text-xl font-semibold text-gray-600'>
				Página mensagens em massa está em construção 🚧
			</span>
		</div>
	);
}
