import { SquareKanban } from 'lucide-react';

export function NoOpportunity() {
	return (
		<section className='rounded-xl border bg-white shadow-sm p-16'>
			<div className='flex flex-col items-center justify-center text-center gap-3'>
				<SquareKanban className='size-16 text-green-loomis' />
				<h2 className='text-lg font-semibold text-gray-800'>
					Nenhuma oportunidade adicionada
				</h2>
				<p className='text-gray-500'>
					Clique em “Nova oportunidade” acima para criar novas oportunidades
				</p>
			</div>
		</section>
	);
}
