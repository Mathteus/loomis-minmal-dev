import { MessageSquareMore, SquarePen, Trash } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertCancelMessage } from '../alert-cancel-message';
import {
	getScheduled,
	updateScheduledStatus,
	ScheduledMessageItem,
} from '@/services/dashboard/chat/scheduled';

interface Props {
	selectedContactId: string | null;
}

export function ProfileScheduledMessages({ selectedContactId }: Props) {
	const queryClient = useQueryClient();
	const { data = [], isLoading } = useQuery<ScheduledMessageItem[]>({
		queryKey: ['scheduled', selectedContactId],
		queryFn: () => getScheduled(selectedContactId as string),
		enabled: !!selectedContactId,
	});

	const cancelMutation = useMutation({
		mutationFn: (id: string) =>
			Promise.resolve(
				updateScheduledStatus(selectedContactId as string, id, 'canceled'),
			),
		onSuccess: () =>
			void queryClient.invalidateQueries({
				queryKey: ['scheduled', selectedContactId],
			}),
	});

	const scheduled = data.filter((i) => i.status === 'scheduled');

	if (!selectedContactId) {
		return <div className='text-gray-400 text-sm'>Selecione um contato.</div>;
	}

	if (isLoading) {
		return <div className='text-gray-400 text-sm'>Carregando mensagens...</div>;
	}

	if (scheduled.length === 0) {
		return (
			<div className='text-gray-500 text-sm'>Nenhuma mensagem agendada.</div>
		);
	}

	return (
		<div className='space-y-4'>
			{scheduled.map((item) => (
				<main
					key={item.id}
					className='h-max border border-gray-200 p-4 rounded-2xl shadow-sm'>
					<section className='flex justify-between mb-4'>
						<div className='bg-[#25D3661A] rounded text-green-loomis p-2'>
							<MessageSquareMore />
						</div>
						<div className='flex items-center gap-2 justify-center'>
							<div
								className='bg-[#f2f20854] rounded text-yellow-600 p-2 cursor-pointer active:scale-90'
								role='button'
								aria-label='Editar mensagem agendada'>
								<SquarePen />
							</div>

							<AlertCancelMessage
								onConfirm={() => cancelMutation.mutate(item.id)}>
								<div className='bg-[#F044381A] rounded text-error-600 p-2 cursor-pointer active:scale-90'>
									<Trash />
								</div>
							</AlertCancelMessage>
						</div>
					</section>
					<div className='bg-[#FAFAFA] p-2 rounded-lg mb-4'>
						<p className='text-justify mb-2 text-gray-600'>{item.text}</p>
						<span className='text-gray-400 block text-right text-details-loomis'>
							{`Agendado para ${item.scheduledAt.toLocaleDateString()} ${item.scheduledAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
						</span>
					</div>
				</main>
			))}
		</div>
	);
}
