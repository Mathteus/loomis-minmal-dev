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
import { Pipe, PipeItem } from '@/components/dashboard/funnel/pipe';
import { useFunnelData } from '@/hooks/use-funnel-data';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { toast } from 'sonner';

export default function FunnelPage() {
	const [showNewOpportunity, setModalNewOpportunity] = useState<boolean>(false);
	const [showPipeItem, setModalPipeItem] = useState<boolean>(false);
	const [showCreatePipe, setModalCreatePipe] = useState<boolean>(false);
	const [showConfigColumns, setModalConfigColumns] = useState<boolean>(false);
	const [showProfile, setModalProfile] = useState<boolean>(false);
	const [showPopover, setShowPopover] = useState<boolean>(false);
	const [selectedItem, setSelectedItem] = useState<PipeItem | null>(null);

	const {
		columns,
		totalValue,
		isLoading,
		moveItem,
		addOpportunity,
		addColumn,
		removeItem,
	} = useFunnelData();

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (!over) return;

		const activeId = active.id as string;
		const overId = over.id as string;

		// Find source column
		const sourceColumn = columns.find((column) =>
			column.items.some((item) => item.id === activeId),
		);

		if (!sourceColumn) return;

		// If dropping on the same column, do nothing
		if (sourceColumn.id === overId) return;

		// Move item to new column
		moveItem(activeId, sourceColumn.id, overId);
		toast.success('Card movido com sucesso!');
	};

	const handleOpenProfile = (item: PipeItem) => {
		setSelectedItem(item);
		setModalProfile(true);
	};

	const handleNewOpportunity = (opportunityData: Omit<PipeItem, 'id'>) => {
		addOpportunity(opportunityData);
		setModalNewOpportunity(false);
		toast.success('Nova oportunidade adicionada!');
	};

	const handleCreatePipe = (pipeData: { title: string }) => {
		addColumn(pipeData);
		setModalCreatePipe(false);
		toast.success('Nova coluna criada!');
	};

	if (isLoading) {
		return (
			<main className='p-6 space-y-6 bg-gray-50 w-full'>
				<div className='animate-pulse space-y-6'>
					<div className='h-8 bg-gray-200 rounded w-1/4'></div>
					<div className='flex gap-4 h-96'>
						{[1, 2, 3, 4].map((i) => (
							<div key={i} className='w-[16vw] bg-gray-200 rounded-lg'></div>
						))}
					</div>
				</div>
			</main>
		);
	}

	return (
		<main className='p-6 space-y-6 bg-gray-50 w-full'>
			<section className='flex items-center justify-between'>
				<h1 className='text-title-loomis'>Funil de vendas</h1>
				<div className='flex items-center gap-2 rounded-md border bg-[#111B210F] px-4 py-2 text-sm text-gray-700 shadow-xs'>
					<span className='text-gray-600'>Valor total do funil:</span>
					<strong className='text-gray-900'>
						R$ {totalValue.toLocaleString('pt-BR')}
					</strong>
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

			{columns.length === 0 && <NoOpportunity />}

			{columns.length > 0 && (
				<DndContext
					collisionDetection={closestCenter}
					onDragEnd={handleDragEnd}>
					<section className='flex gap-4 h-[80%] overflow-x-auto pb-4'>
						{columns.map((column) => (
							<Pipe
								key={column.id}
								id={column.id}
								title={column.title}
								Value={column.value}
								notify={column.notify}
								items={column.items}
								colorHead={column.colorHead}
								openProfilePipe={handleOpenProfile}
							/>
						))}
					</section>
				</DndContext>
			)}

			{showNewOpportunity && (
				<NewOpportunityModal
					show={showNewOpportunity}
					onClose={() => setModalNewOpportunity(false)}
					onSubmit={handleNewOpportunity}
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
					onSubmit={handleCreatePipe}
				/>
			)}

			{showConfigColumns && (
				<ConfigColumnsDialog
					show={showConfigColumns}
					onClose={() => setModalConfigColumns(false)}
				/>
			)}

			{showProfile && selectedItem && (
				<PipeItemDialog
					show={showProfile}
					onClose={() => setModalProfile(false)}
					item={selectedItem}
				/>
			)}
		</main>
	);
}
