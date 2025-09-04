import { EllipsisVertical } from 'lucide-react';
import styles from './pipe.module.css';
import { useDroppable } from '@dnd-kit/core';
import {
	SortableContext,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { DraggablePipeItem } from './draggable-pipe-item';

export type PipeItem = {
	id: string;
	username: string;
	phone: string;
	amount: string;
	message: string;
	tags: string[];
};

export interface IPipeProps {
	id: string;
	title: string;
	Value: string;
	notify: number;
	colorHead: string;
	items: PipeItem[];
	openProfilePipe: (item: PipeItem) => void;
}

export function Pipe({
	id,
	title,
	Value,
	notify,
	colorHead,
	openProfilePipe,
	items,
}: IPipeProps) {
	const { isOver, setNodeRef } = useDroppable({
		id: id,
	});

	const style = {
		backgroundColor: isOver ? '#f0f9ff' : undefined,
		borderColor: isOver ? '#3b82f6' : undefined,
	};

	return (
		<main
			ref={setNodeRef}
			style={style}
			className={`w-[16vw] overflow-y-scroll h-full bg-[#111B211A] p-4 rounded-lg border-2 border-transparent transition-all duration-200 ${styles.HideScroolBar}`}>
			<section
				style={{ backgroundColor: colorHead }}
				className={`text-white p-2 rounded-lg flex justify-between mb-4 items-center`}>
				<div>
					<h1 className='font-medium'>{title}</h1>
					<span className='text-sm opacity-90'>{Value}</span>
				</div>
				<div className='bg-[#FFFFFF29] flex p-3 rounded-full size-4 justify-center items-center text-xs'>
					{notify}
				</div>
			</section>
			<section>
				<SortableContext
					id={id}
					items={items.map((item) => item.id)}
					strategy={verticalListSortingStrategy}>
					{items.map((item) => (
						<DraggablePipeItem
							key={item.id}
							item={item}
							onItemClick={() => openProfilePipe(item)}
						/>
					))}
				</SortableContext>
				{items.length === 0 && (
					<div className='text-center py-8 text-gray-400 text-sm'>
						Arraste cards aqui
					</div>
				)}
			</section>
		</main>
	);
}
