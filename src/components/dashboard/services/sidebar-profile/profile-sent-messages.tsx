import { Funnel, MessageSquareMore } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import {
	ScheduledMessageItem,
	getScheduled,
} from '@/services/dashboard/chat/scheduled';
import { useMemo, useState } from 'react';

interface Props {
	selectedContactId: string | null;
}

export function ProfileSentMessages({ selectedContactId }: Props) {
	const [q, setQ] = useState('');
	const { data = [], isLoading } = useQuery<ScheduledMessageItem[]>({
		queryKey: ['scheduled', selectedContactId],
		queryFn: () => getScheduled(selectedContactId as string),
		enabled: !!selectedContactId,
	});

	const list = useMemo(() => {
		const items = data.filter(
			(i) => i.status === 'sent' || i.status === 'canceled',
		);
		if (!q) return items;
		return items.filter((i) => i.text.toLowerCase().includes(q.toLowerCase()));
	}, [data, q]);

	if (!selectedContactId) {
		return <div className='text-gray-400 text-sm'>Selecione um contato.</div>;
	}

	if (isLoading) {
		return <div className='text-gray-400 text-sm'>Carregando mensagens...</div>;
	}

	return (
		<div className='space-y-4'>
			<section className='flex items-center gap-2'>
				<input
					type='search'
					placeholder='Pesquisar'
					value={q}
					onChange={(e) => setQ(e.target.value)}
					className='border rounded px-2 py-1 text-sm w-full'
				/>
				<button className='p-2 text-gray-500'>
					<Funnel />
				</button>
			</section>

			{list.length === 0 ? (
				<div className='text-gray-500 text-sm'>
					Nenhuma mensagem enviada/cancelada.
				</div>
			) : null}

			{list.map((item) => (
				<div
					key={item.id}
					className='h-max border border-gray-200 p-4 rounded-2xl shadow-sm'>
					<section className='flex justify-between mb-4'>
						<div className='bg-[#25D3661A] rounded text-green-loomis p-2'>
							<MessageSquareMore />
						</div>
						<div className='flex items-center gap-2 justify-center'>
							{item.status === 'canceled' ? (
								<div className='bg-[#F044381A] text-error-600 rounded-lg px-3 py-1'>
									Cancelado
								</div>
							) : (
								<div className='bg-[#238E5214] text-green-loomis rounded-lg px-3 py-1'>
									Enviado
								</div>
							)}
						</div>
					</section>
					<div className='bg-[#FAFAFA] p-2 rounded-lg mb-4'>
						<p className='text-justify mb-2 text-gray-600'>{item.text}</p>
						<span className='text-gray-400 block text-right text-details-loomis'>
							{`Agendado para ${item.scheduledAt.toLocaleDateString()} ${item.scheduledAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
						</span>
					</div>
				</div>
			))}
		</div>
	);
}
