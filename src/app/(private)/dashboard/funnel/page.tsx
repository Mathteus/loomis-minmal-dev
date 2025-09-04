'use client';
import {
	Search,
	SlidersHorizontal,
	EllipsisVertical,
	Share2,
	PlusCircle,
	SquarePen,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { NoOpportunity } from '@/components/dashboard/funnel/no-opportunity';
import { useState } from 'react';
import { NewOpportunityModal } from '@/components/dashboard/funnel/new-opportunity';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import PipeItemDialog from '@/components/dashboard/funnel/pipe-item-dialog';
import { CreatePipe } from '@/components/dashboard/funnel/create-pipe';
import ConfigColumnsDialog from '@/components/dashboard/funnel/config-pipes';
import { Pipe } from '@/components/dashboard/funnel/pipe';

const pipesMock = [
	{
		title: 'Abordagem',
		Value: 'R$ 24.000,00',
		notify: 3,
		colorHead: '#000',
		items: [
			{
				username: 'Henrique Souza',
				phone: '(11) 98745-6123',
				amount: 'R$ 4.000,00',
				message:
					'Olá! Aqui é o Henrique. Gostaria de entender melhor quais soluções sua empresa oferece para utilizar em meus negócios',
				tags: ['Whatsapp'],
			},
			{
				username: 'Henrique Souza',
				phone: '(11) 98745-6123',
				amount: 'R$ 4.000,00',
				message:
					'Olá! Aqui é o Henrique. Gostaria de entender melhor quais soluções sua empresa oferece para utilizar em meus negócios',
				tags: ['Whatsapp'],
			},
			{
				username: 'Henrique Souza',
				phone: '(11) 98745-6123',
				amount: 'R$ 4.000,00',
				message:
					'Olá! Aqui é o Henrique. Gostaria de entender melhor quais soluções sua empresa oferece para utilizar em meus negócios',
				tags: ['Whatsapp'],
			},
		],
	},
	{
		title: 'Qualificação',
		Value: 'R$ 10.000,00',
		colorHead: '#194E37',
		notify: 3,
		items: [
			{
				username: 'Henrique Souza',
				phone: '(11) 98745-6123',
				amount: 'R$ 4.000,00',
				message:
					'Olá! Aqui é o Henrique. Gostaria de entender melhor quais soluções sua empresa oferece para utilizar em meus negócios',
				tags: ['Whatsapp'],
			},
			{
				username: 'Henrique Souza',
				phone: '(11) 98745-6123',
				amount: 'R$ 4.000,00',
				message:
					'Olá! Aqui é o Henrique. Gostaria de entender melhor quais soluções sua empresa oferece para utilizar em meus negócios',
				tags: ['Whatsapp'],
			},
			{
				username: 'Henrique Souza',
				phone: '(11) 98745-6123',
				amount: 'R$ 4.000,00',
				message:
					'Olá! Aqui é o Henrique. Gostaria de entender melhor quais soluções sua empresa oferece para utilizar em meus negócios',
				tags: ['Whatsapp'],
			},
		],
	},
	{
		title: 'Follow Up',
		Value: 'R$ 800,00',
		colorHead: '#21814C',
		notify: 1,
		items: [
			{
				username: 'Henrique Souza',
				phone: '(11) 98745-6123',
				amount: 'R$ 4.000,00',
				message:
					'Olá! Aqui é o Henrique. Gostaria de entender melhor quais soluções sua empresa oferece para utilizar em meus negócios',
				tags: ['Whatsapp'],
			},
		],
	},
];

export default function FunnelPage() {
	const [showNewOpportunity, setModalNewOpportunity] = useState<boolean>(false);
	const [showPipeItem, setModalPipeItem] = useState<boolean>(false);
	const [showCreatePipe, setModalCreatePipe] = useState<boolean>(false);
	const [showConfigColumns, setModalConfigColumns] = useState<boolean>(false);
	const [showProfile, setModalProfile] = useState<boolean>(false);
	const [showPopover, setShowPopover] = useState<boolean>(false);

	return (
		<main className='p-6 space-y-6 bg-gray-50 w-full'>
			<section className='flex items-center justify-between'>
				<h1 className='text-title-loomis'>Funil de vendas</h1>
				<div className='flex items-center gap-2 rounded-md border bg-[#111B210F] px-4 py-2 text-sm text-gray-700 shadow-xs'>
					<span className='text-gray-600'>Valor total do funil:</span>
					<strong className='text-gray-900'>R$ 0,00</strong>
				</div>
			</section>

			<section className='flex items-center gap-3'>
				<div className='relative flex-1'>
					<Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400' />
					<Input placeholder='Pesquisar' className='pl-10 bg-white' />
				</div>
				<Button variant='outline'>
					<SlidersHorizontal className='size-4' />
					Filtros
				</Button>
				<Button variant='outline'>
					<Share2 className='size-4' />
					Automatizar
				</Button>
				<Button
					className='bg-green-loomis cursor-pointer hover:bg-green-loomis-light hover:text-green-loomis active:scale-90'
					type='button'
					onClick={() => setModalNewOpportunity(true)}>
					<PlusCircle className='size-4' />
					Nova oportunidade
				</Button>
				<Popover open={showPopover} onOpenChange={setShowPopover}>
					<PopoverTrigger asChild>
						<Button variant='outline' size='icon' aria-label='Mais opções'>
							<EllipsisVertical className='size-4' />
						</Button>
					</PopoverTrigger>
					<PopoverContent className='w-48' align='end'>
						<div className='space-y-1'>
							<Button
								variant='ghost'
								className='w-full hover:bg-transparent active:scale-90 cursor-pointer'
								onClick={() => {
									setShowPopover(false);
									setModalConfigColumns(true);
								}}>
								<SquarePen /> Configurar colunas
							</Button>
						</div>
						<div className='text-center text-green-loomis'>
							<Button
								variant='ghost'
								className='w-full hover:bg-transparent hover:text-green-loomis active:scale-90 cursor-pointer'
								onClick={() => {
									setShowPopover(false);
									setModalCreatePipe(true);
								}}>
								Adcionar Funil <PlusCircle />
							</Button>
						</div>
					</PopoverContent>
				</Popover>
			</section>

			{/* <NoOpportunity /> */}
			<section className='flex gap-4 h-[80%]'>
				{pipesMock &&
					pipesMock.map((e) => {
						return (
							<Pipe
								title={e.title}
								Value={e.Value}
								notify={e.notify}
								items={e.items}
								colorHead={e.colorHead}
								openProfilePipe={() => setModalProfile(true)}
							/>
						);
					})}
			</section>
			{showNewOpportunity && (
				<NewOpportunityModal
					show={showNewOpportunity}
					onClose={() => setModalNewOpportunity(false)}
				/>
			)}

			{showPipeItem && (
				<PipeItemDialog
					show={showPipeItem}
					onClose={() => setModalPipeItem(false)}
				/>
			)}

			{showCreatePipe && (
				<CreatePipe
					show={showCreatePipe}
					onClose={() => setModalCreatePipe(false)}
				/>
			)}

			{showConfigColumns && (
				<ConfigColumnsDialog
					show={showConfigColumns}
					onClose={() => setModalConfigColumns(false)}
				/>
			)}

			{showProfile && (
				<PipeItemDialog
					show={showProfile}
					onClose={() => setModalProfile(false)}
				/>
			)}
		</main>
	);
}
