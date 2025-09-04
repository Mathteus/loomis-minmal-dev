'use client';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { useMemo, useState } from 'react';

type TabsType = 'dateTime' | 'formatMessage' | 'chooseMessage';

import * as React from 'react';
import {
	ChevronDownIcon,
	Send,
	SquarePen,
	Calendar as CalendarIcon,
	Clock as ClockIcon,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { useScheduleDialogStore } from '@/contexts/schedule-message-dialog';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { addScheduled } from '@/services/dashboard/chat/scheduled';
import { useQueryClient } from '@tanstack/react-query';

interface ScheduledMessageProps {
	contactName?: string;
	contactId: string;
}

export function ScheduledMessage({
	contactName = 'Contato',
	contactId,
}: ScheduledMessageProps) {
	const [tab, setTab] = useState<TabsType>('dateTime');
	const [date, setDate] = useState<Date | undefined>(new Date());
	const [timeStr, setTimeStr] = useState<string>('00:00');
	const [open, setOpen] = useState<boolean>(false);
	const { showModalSchedule, setModalSchedule } = useScheduleDialogStore();
	const [show, setShow] = useState<boolean>(showModalSchedule);
	const [text, setText] = useState<string>('');
	const [messageFormat, setMessageFormat] = useState<'quick' | 'create' | null>(
		null,
	);
	const [selectedQuickId, setSelectedQuickId] = useState<string>('');
	const [withSignature, setWithSignature] = useState<boolean>(false);
	const [cancelOnContact, setCancelOnContact] = useState<boolean>(false);
	const [cancelOnAgent, setCancelOnAgent] = useState<boolean>(false);

	const quickOptions = useMemo(
		() => [
			{ id: 'q1', title: 'Saudação 1', text: 'Olá! Como posso ajudar?' },
			{
				id: 'q2',
				title: 'Follow-up',
				text: 'Passando para lembrar do nosso horário.',
			},
			{
				id: 'q3',
				title: 'Agradecimento',
				text: 'Obrigado pelo contato! Qualquer dúvida, avise.',
			},
		],
		[],
	);

	const HeadTabs = () => {
		const step = tab === 'dateTime' ? 1 : tab === 'formatMessage' ? 2 : 3;
		return (
			<section className='w-full'>
				<div className='flex items-center gap-5 justify-center text-center pt-2 pb-3 border-b border-gray-200'>
					<div
						className={`text-center ${step >= 1 ? 'text-green-loomis' : 'text-gray-400'}`}>
						<span>Data e Hora</span>
						<div
							className={`w-[150%] h-1 rounded-l text-transparent mt-2 translate-x-[-20%] ${
								step >= 1 ? 'bg-green-loomis' : 'bg-gray-400'
							}`}>
							.
						</div>
					</div>
					<div
						className={`text-center ${step >= 2 ? 'text-green-loomis' : 'text-gray-400'}`}>
						<span>Formato da Mensagem</span>
						<div
							className={`w-[115%] h-1 text-transparent mt-2  translate-x-[-6%] ${
								step >= 2 ? 'bg-green-loomis' : 'bg-gray-400'
							}`}>
							.
						</div>
					</div>
					<div
						className={`text-center ${step >= 3 ? 'text-green-loomis' : 'text-gray-400'}`}>
						<span>Escolha a mensagem</span>
						<div
							className={`w-[115%] h-1 rounded-r text-transparent  mt-2  translate-x-[-6%] ${
								step >= 3 ? 'bg-green-loomis' : 'bg-gray-400'
							}`}>
							.
						</div>
					</div>
				</div>
			</section>
		);
	};

	const BodyDateTime = () => {
		return (
			<div className='flex flex-col gap-6 mt-6 text-left items-center'>
				<div className='flex flex-col gap-2 w-full'>
					<Label htmlFor='date-picker' className='px-1'>
						Informe a data de envio
					</Label>
					<Popover open={open} onOpenChange={setOpen} modal={true}>
						<PopoverTrigger asChild>
							<button
								id='date-picker'
								className='w-full h-11 rounded-xl bg-white border border-gray-200 text-gray-700 px-4 flex items-center justify-between shadow-[inset_0_0_0_1px_rgba(0,0,0,0)]'>
								<span className='text-sm'>
									{date ? date.toLocaleDateString() : 'Selecione a data'}
								</span>
								<CalendarIcon className='text-gray-400' size={18} />
							</button>
						</PopoverTrigger>
						<PopoverContent
							className='w-full overflow-hidden p-0'
							align='start'>
							<Calendar
								mode='single'
								selected={date}
								captionLayout='dropdown'
								className='w-full'
								onSelect={(date) => {
									setDate(date);
									setOpen(false);
								}}
							/>
						</PopoverContent>
					</Popover>
				</div>
				<div className='flex flex-col gap-2 w-full'>
					<Label htmlFor='time-picker' className='px-1'>
						Informe a hora de envio
					</Label>
					<div className='relative'>
						<Input
							type='time'
							id='time-picker'
							step='60'
							value={timeStr}
							onChange={(e) => setTimeStr(e.target.value)}
							inputMode='numeric'
							placeholder='00:00'
							className='bg-white w-full h-11 rounded-xl border border-gray-200 pr-10'
						/>
						<ClockIcon
							className='text-gray-400 absolute right-3 top-1/2 -translate-y-1/2'
							size={18}
						/>
					</div>
				</div>
			</div>
		);
	};

	const BodyFormatMesg = () => {
		const baseCard =
			'w-full text-left rounded-xl border p-4 flex gap-3 items-start transition-colors';
		const selectedCard = 'border-green-loomis bg-green-loomis-light';
		const idleCard = 'border-gray-200 bg-white';
		const iconBox = 'h-9 w-9 rounded flex items-center justify-center';
		return (
			<main>
				<h2 className='mb-3'>Escolha um dos formato de envio abaixo:</h2>
				<div className='flex flex-col gap-3'>
					<button
						className={`${baseCard} cursor-pointer ${
							messageFormat === 'quick' ? selectedCard : idleCard
						}`}
						onClick={() => setMessageFormat('quick')}>
						<div
							className={`${iconBox} ${
								messageFormat === 'quick'
									? 'bg-green-loomis/20 text-green-loomis'
									: 'bg-gray-loomis-50 text-gray-400'
							}`}
							aria-hidden>
							<Send size={18} />
						</div>
						<div>
							<h3 className='font-semibold text-gray-800'>
								Enviar mensagem rápida
							</h3>
							<p className='text-sm text-gray-500 mt-1'>
								Escolha uma das mensagens salvas por você na plataforma
							</p>
						</div>
					</button>

					<button
						className={`${baseCard} cursor-pointer ${
							messageFormat === 'create' ? selectedCard : idleCard
						}`}
						onClick={() => setMessageFormat('create')}>
						<div
							className={`${iconBox} ${
								messageFormat === 'create'
									? 'bg-green-loomis/20 text-green-loomis'
									: 'bg-gray-loomis-50 text-gray-400'
							}`}
							aria-hidden>
							<SquarePen size={18} />
						</div>
						<div>
							<h3 className='font-semibold text-gray-800'>Criar mensagem</h3>
							<p className='text-sm text-gray-500 mt-1'>
								Crie uma mensagem personalizada para programar o envio
							</p>
						</div>
					</button>
				</div>
			</main>
		);
	};

	const BodyCreateMessage = () => {
		return (
			<div>
				<Textarea value={text} onChange={(e) => setText(e.target.value)} />
				<p>{`${text.length}/1024 Caracteres`}</p>
			</div>
		);
	};

	const BodySelectMessage = () => {
		return (
			<>
				<div className='mb-3'>
					<Label htmlFor='search-quick'>Pesquisar mensagem rápida</Label>
					<Input
						id='search-quick'
						type='search'
						placeholder='Digite para pesquisar'
						onChange={(e) => {
							const q = e.target.value.toLowerCase();
							const found = quickOptions.find(
								(m) =>
									m.title.toLowerCase().includes(q) ||
									m.text.toLowerCase().includes(q),
							);
							if (found) setSelectedQuickId(found.id);
						}}
						className='mt-1'
					/>
				</div>
				<div className='space-y-2 max-h-40 overflow-y-auto'>
					{quickOptions.map((m) => (
						<label
							key={m.id}
							className='flex items-start gap-2 border rounded p-2 cursor-pointer'>
							<input
								type='radio'
								name='quick-msg'
								checked={selectedQuickId === m.id}
								onChange={() => setSelectedQuickId(m.id)}
							/>
							<div>
								<div className='font-medium'>{m.title}</div>
								<div className='text-sm text-gray-600'>{m.text}</div>
							</div>
						</label>
					))}
				</div>
			</>
		);
	};

	const BodyChooseMessage = () => {
		return (
			<section>
				<div className='mb-4'>
					{messageFormat === 'create' && BodyCreateMessage()}
					{messageFormat === 'quick' && BodySelectMessage()}
				</div>
				<div className='bg-[#FAFAFA] flex items-center justify-between border rounded-xl p-3 mb-3'>
					<div>
						<h3 className='font-medium'>Adicionar assinatura</h3>
						<p className='text-sm text-gray-500'>{contactName}</p>
					</div>
					<Switch
						id='with-signature'
						checked={withSignature}
						onCheckedChange={(v) => setWithSignature(Boolean(v))}
						className='data-[state=checked]:bg-green-loomis'
					/>
				</div>
				<div className='space-y-3 pt-3 border-t border-gray-200'>
					<div className='flex items-start gap-2'>
						<Checkbox
							id='cancel-user'
							checked={cancelOnContact}
							onCheckedChange={(v) => setCancelOnContact(Boolean(v))}
							className='data-[state=checked]:bg-green-loomis data-[state=checked]:border-green-loomis'
						/>
						<Label htmlFor='cancel-user'>
							Cancelar se <span className='text-green-loomis'>contato</span>{' '}
							enviar nova mensagem
						</Label>
					</div>
					<div className='flex items-start gap-2'>
						<Checkbox
							id='cancel-agent'
							checked={cancelOnAgent}
							onCheckedChange={(v) => setCancelOnAgent(Boolean(v))}
							className='data-[state=checked]:bg-green-loomis data-[state=checked]:border-green-loomis'
						/>
						<Label htmlFor='cancel-agent'>
							Cancelar se <span className='text-green-loomis'>atendente</span>{' '}
							enviar nova mensagem
						</Label>
					</div>
				</div>
			</section>
		);
	};

	const handlerShow = (state: boolean) => {
		setShow(state);
		setModalSchedule(state);
	};

	const canNext = (): boolean => {
		if (tab === 'dateTime') return Boolean(date) && Boolean(timeStr);
		if (tab === 'formatMessage') return messageFormat !== null;
		if (tab === 'chooseMessage') {
			if (messageFormat === 'create') return text.trim().length > 0;
			if (messageFormat === 'quick') return Boolean(selectedQuickId);
			return false;
		}
		return false;
	};

	const queryClient = useQueryClient();

	const buildScheduledAt = (): Date | null => {
		if (!date || !timeStr) return null;
		const [hh, mm] = timeStr.split(':').map((v) => Number(v));
		const when = new Date(date);
		when.setHours(hh || 0, mm || 0, 0, 0);
		return when;
	};

	const resolveText = (): string => {
		if (messageFormat === 'create') return text.trim();
		if (messageFormat === 'quick') {
			const found = quickOptions.find((q) => q.id === selectedQuickId);
			return (found?.text ?? '').trim();
		}
		return '';
	};

	const resetForm = () => {
		setTab('dateTime');
		setDate(new Date());
		setTimeStr('00:00');
		setText('');
		setMessageFormat(null);
		setSelectedQuickId('');
		setWithSignature(false);
		setCancelOnAgent(false);
		setCancelOnContact(false);
	};

	const goNext = () => {
		if (!canNext()) return;
		if (tab === 'dateTime') setTab('formatMessage');
		else if (tab === 'formatMessage') setTab('chooseMessage');
		else if (tab === 'chooseMessage') {
			console.debug('[Scheduled] Finalizing', {
				contactId,
				date,
				timeStr,
				messageFormat,
				selectedQuickId,
				withSignature,
			});
			const when = buildScheduledAt();
			const baseText = resolveText();
			if (!when || !baseText) return;
			const finalText = withSignature
				? `${baseText}\n\n— ${contactName}`
				: baseText;
			addScheduled(contactId, { text: finalText, scheduledAt: when });
			void queryClient.invalidateQueries({
				queryKey: ['scheduled', contactId],
			});
			setModalSchedule(false);
			resetForm();
		}
	};

	return (
		<Dialog open={show} onOpenChange={handlerShow} modal={true}>
			<DialogContent className='w-[640px] max-w-[92vw]'>
				<DialogHeader>
					<DialogTitle>Mensagens agendadas</DialogTitle>
				</DialogHeader>
				<main>
					{HeadTabs()}
					{tab === 'dateTime' && BodyDateTime()}
					{tab === 'formatMessage' && BodyFormatMesg()}
					{tab === 'chooseMessage' && BodyChooseMessage()}
				</main>
				<DialogFooter className='flex items-center justify-between'>
					{tab === 'dateTime' ? (
						<DialogClose asChild>
							<Button
								type='button'
								variant='ghost'
								className='cursor-pointer active:scale-90 text-green-loomis'>
								Cancelar
							</Button>
						</DialogClose>
					) : (
						<Button
							type='button'
							variant='ghost'
							className='cursor-pointer active:scale-90 text-green-loomis'
							onClick={() =>
								setTab(tab === 'chooseMessage' ? 'formatMessage' : 'dateTime')
							}>
							Voltar
						</Button>
					)}
					<Button
						type='button'
						disabled={!canNext()}
						className={`cursor-pointer active:scale-95 bg-green-loomis hover:bg-green-loomis-dark text-white rounded-xl px-6 ${
							canNext() ? '' : 'opacity-50 pointer-events-none'
						}`}
						onClick={goNext}>
						{tab === 'chooseMessage' ? 'Programar envio' : 'Avançar'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
