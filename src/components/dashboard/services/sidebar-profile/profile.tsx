'use client';
import { useProfileChatStore } from '@/contexts/open-profile-chat';
import {
	Calendar,
	ChevronRight,
	ChevronUp,
	Lightbulb,
	MessageCircle,
	MoreVertical,
	PhoneCall,
	Send,
	X,
} from 'lucide-react';
import { useState } from 'react';
import { Avatar } from 'react-chat-elements';
import { ProfileScheduledMessages } from './profile-scheduled-messages';
import { ProfileSentMessages } from './profile-sent-messages';
import { LoomisButton } from '@/components/generics/loomis-button';
import { useScheduleDialogStore } from '@/contexts/schedule-message-dialog';
import { useQuery } from '@tanstack/react-query';
import { getContacts } from '@/services/dashboard/chat/contacts';

interface ProfileChatProps {
	selectedContactId: string | null;
}

export function ProfileChat({ selectedContactId }: ProfileChatProps) {
	const { setProfileShow, showProfileChat } = useProfileChatStore();
	const [profilePage, setProfilePage] = useState<string>('standard');
	const [abaScheduledMessages, setAbaScheduledMessages] =
		useState<string>('scheduled-messages');
	const { setModalSchedule } = useScheduleDialogStore();
	const { data: contacts = [] } = useQuery({
		queryKey: ['contacts'],
		queryFn: getContacts,
	});
	const selected = contacts.find((c) => c.id === selectedContactId);

	const handlerClose = () => {
		if (profilePage === 'standard') {
			setProfileShow(false);
			return;
		}
		setProfilePage('standard');
	};

	const handlerOpenScheduledMessages = () => {
		setProfilePage('scheduled-messages');
	};

	const handlerShowScheduledMessages = () => {
		setAbaScheduledMessages('scheduled-messages');
	};

	const handlerShowSentMessages = () => {
		setAbaScheduledMessages('sent-messages');
	};

	const styleStandardArea =
		'border border-gray-200 rounded-2xl bg-white p-4 mb-3';

	const BodyStandard = () => {
		return (
			<>
				<section className='space-y-3'>
					<button className='w-full text-left rounded-2xl border border-gray-200 bg-white hover:border-green-loomis transition-colors p-4 flex items-start justify-between cursor-pointer'>
						<div className='flex items-start gap-3'>
							<div className='p-2.5 rounded-lg bg-green-loomis-light text-green-loomis'>
								<Lightbulb size={18} />
							</div>
							<div>
								<strong className='text-gray-800'>
									Oportunidades vinculadas
								</strong>
								<p className='text-gray-500 text-sm'>
									Acesse os status das oportunidades desse lead
								</p>
							</div>
						</div>
						<ChevronRight size={30} className='text-green-loomis self-center' />
					</button>
				</section>
				<section className='space-y-3'>
					<button
						className='w-full text-left rounded-2xl border border-gray-200 bg-white hover:border-green-loomis transition-colors p-4 flex items-start justify-between cursor-pointer'
						onClick={handlerOpenScheduledMessages}>
						<div className='flex items-start gap-3'>
							<div className='p-2.5 rounded-lg bg-green-loomis-light text-green-loomis'>
								<MessageCircle size={18} />
							</div>
							<div>
								<strong className='text-gray-800'>Mensagens agendadas</strong>
								<p className='text-gray-500 text-sm'>
									Acesse as mensagens programadas para envio neste contato
								</p>
							</div>
						</div>
						<ChevronRight size={30} className='text-green-loomis self-center' />
					</button>
				</section>
				<section className='border border-gray-200 rounded-2xl bg-white p-4'>
					<div className='flex items-center justify-between border-b w-full border-gray-100'>
						<div className='flex items-center gap-2 py-2'>
							<strong className='text-gray-800'>Etiquetas</strong>
							<span className='text-gray-400 text-xs translate-y-[1px]'>
								03
							</span>
						</div>
						<button className='text-gray-500'>
							<ChevronUp size={20} />
						</button>
					</div>
					<div className='flex flex-wrap gap-2 pt-3'>
						<span className='px-3 py-1 rounded-full text-sm bg-[#F2E7FA] text-[#7A3E9D]'>
							Lead qualificado
						</span>
						<span className='px-3 py-1 rounded-full text-sm bg-[#E6F0FF] text-[#1E48A5]'>
							Serviço A
						</span>
						<span className='px-3 py-1 rounded-full text-sm bg-green-loomis-light text-green-loomis'>
							Vendido
						</span>
					</div>
				</section>
				<section className='border border-gray-200 rounded-2xl bg-white p-4'>
					<div className='flex items-center justify-between border-b w-full border-gray-100'>
						<div className='flex items-center gap-2 py-2'>
							<strong className='text-gray-800'>Tarefas</strong>
							<span className='text-gray-400 text-xs translate-y-[1px]'>
								02
							</span>
						</div>
						<button className='text-gray-500'>
							<ChevronUp size={20} />
						</button>
					</div>
					<div className='mt-3 border rounded-xl p-3 bg-gray-loomis-50'>
						<p className='text-gray-700 text-sm mb-3'>
							Lorem ipsum dolor sit amet, consectetur.
						</p>
						<div className='flex items-center gap-2'>
							<Avatar
								src={selected?.avatar ?? ''}
								alt='avatar'
								size='large'
								type='circle'
								className='scale-75'
							/>
							<strong className='text-gray-700 text-sm'>
								{selected?.name ?? 'Atendente'}
							</strong>
							<span className='text-gray-400 text-xs ml-auto'>Hoje, 15:00</span>
						</div>
					</div>
				</section>
			</>
		);
	};

	const BodyScheduledMessages = () => {
		return (
			<>
				<section className='flex items-center justify-around my-2'>
					<button
						onClick={handlerShowScheduledMessages}
						className={`not-visited:flex items-center gap-2 cursor-pointer active:scale-90 ${
							abaScheduledMessages === 'scheduled-messages'
								? 'text-green-loomis'
								: 'text-gray-loomis-300'
						}`}>
						<Calendar />
						<strong>Agendadas</strong>
						<span className='text-gray-400 scale-75'>01</span>
					</button>
					<button
						onClick={handlerShowSentMessages}
						className={`not-visited:flex items-center gap-2 cursor-pointer active:scale-90 ${
							abaScheduledMessages === 'sent-messages'
								? 'text-green-loomis'
								: 'text-gray-loomis-300'
						}`}>
						<Send />
						<strong>Enviadas</strong>
						<span className='text-gray-400 scale-75'>01</span>
					</button>
				</section>
				<section className='flex items-center justify-center'>
					<div
						className={`w-full h-2 rounded-l text-transparent ${
							abaScheduledMessages === 'scheduled-messages'
								? 'bg-green-loomis'
								: 'bg-gray-loomis-300'
						}`}>
						.
					</div>
					<div
						className={`w-full h-2 rounded-r text-transparent ${
							abaScheduledMessages === 'sent-messages'
								? 'bg-green-loomis'
								: 'bg-gray-loomis-300'
						}`}>
						.
					</div>
				</section>
				<section className='border border-gray-200 rounded-lg p-4 my-2 space-y-3 h-full'>
					{abaScheduledMessages === 'scheduled-messages' && (
						<ProfileScheduledMessages selectedContactId={selectedContactId} />
					)}
					{abaScheduledMessages === 'sent-messages' && (
						<ProfileSentMessages selectedContactId={selectedContactId} />
					)}
				</section>
				<div>
					<LoomisButton
						onClick={() => setModalSchedule(true)}
						disabled={!selectedContactId}>
						Agendar Mensagem
					</LoomisButton>
				</div>
			</>
		);
	};

	return (
		<aside
			className={`bg-white border-l border-gray-100 h-screen p-3 overflow-y-auto ${
				showProfileChat
					? 'w-[380px] xl:w-[400px] flex flex-col space-y-3'
					: 'w-0 hidden'
			}`}>
			<section className='flex items-center gap-2 px-1 mb-1'>
				<button
					className='active:scale-95 cursor-pointer bg-[#F5F5F6] text-gray-500 rounded p-1 size-8 flex items-center justify-center'
					onClick={handlerClose}>
					{profilePage === 'standard' ? (
						<ChevronRight size={20} />
					) : (
						<X size={20} />
					)}
				</button>
				<h1 className='text-gray-700 font-semibold'>Perfil</h1>
			</section>
			<section className={styleStandardArea}>
				<div className='flex items-center justify-between'>
					<Avatar
						src={selected?.avatar ?? ''}
						alt={selected?.name ?? 'avatar'}
						size='xlarge'
						type='circle'
					/>
					<MoreVertical size={25} />
				</div>
				<strong className='text-gray-800 text-large-loomis'>
					{selected?.name ?? 'Contato'}
				</strong>
				<div className='flex items-center gap-2 text-gray-500 my-1'>
					<PhoneCall size={20} />
					<span>{selected?.phone ?? 'Sem telefone'}</span>
				</div>
			</section>
			{profilePage === 'standard' && <BodyStandard />}
			{profilePage === 'scheduled-messages' && <BodyScheduledMessages />}
		</aside>
	);
}
