'use client';

import React, { useState } from 'react';
import {
	DndContext,
	DragOverlay,
	PointerSensor,
	useSensor,
	useSensors,
	DragStartEvent,
	DragEndEvent,
	DragOverEvent,
	closestCorners,
} from '@dnd-kit/core';
import {
	SortableContext,
	arrayMove,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';
import { useFunnelData } from '@/hooks/use-funnel-data';
import { PipeItem } from './pipe';
import { EnhancedPipe } from './enhanced-pipe';
import { EnhancedDraggableItem } from './enhanced-draggable-item';

interface EnhancedKanbanBoardProps {
	openProfilePipe: (item: PipeItem) => void;
}

export function EnhancedKanbanBoard({
	openProfilePipe,
}: EnhancedKanbanBoardProps) {
	const { columns, moveItem, isLoading } = useFunnelData();
	const [activeItem, setActiveItem] = useState<PipeItem | null>(null);
	const [overId, setOverId] = useState<string | null>(null);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		}),
	);

	const handleDragStart = (event: DragStartEvent) => {
		const { active } = event;

		// Find the active item across all columns
		let foundItem: PipeItem | null = null;
		for (const column of columns) {
			const item = column.items.find((item) => item.id === active.id);
			if (item) {
				foundItem = item;
				break;
			}
		}

		setActiveItem(foundItem);
	};

	const handleDragOver = (event: DragOverEvent) => {
		const { over } = event;
		setOverId((over?.id as string) || null);
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		setActiveItem(null);
		setOverId(null);

		if (!over) return;

		const activeId = active.id as string;
		const overId = over.id as string;

		// Find source column
		const sourceColumn = columns.find((col) =>
			col.items.some((item) => item.id === activeId),
		);

		if (!sourceColumn) return;

		// Check if dropped on a column directly
		const targetColumn = columns.find((col) => col.id === overId);

		if (targetColumn) {
			// Dropped on column - move to end of that column
			if (sourceColumn.id !== targetColumn.id) {
				moveItem(activeId, sourceColumn.id, targetColumn.id);
			}
			return;
		}

		// Check if dropped on an item
		let targetColumnFromItem = null;
		for (const column of columns) {
			if (column.items.some((item) => item.id === overId)) {
				targetColumnFromItem = column;
				break;
			}
		}

		if (targetColumnFromItem && sourceColumn.id !== targetColumnFromItem.id) {
			moveItem(activeId, sourceColumn.id, targetColumnFromItem.id);
		}
	};

	if (isLoading) {
		return (
			<div className='flex gap-4 p-4 h-full overflow-x-auto'>
				{[1, 2, 3, 4].map((i) => (
					<div
						key={i}
						className='w-80 bg-gray-100 rounded-lg animate-pulse h-96'
					/>
				))}
			</div>
		);
	}

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCorners}
			onDragStart={handleDragStart}
			onDragOver={handleDragOver}
			onDragEnd={handleDragEnd}>
			<div className='flex gap-4 p-4 h-full overflow-x-auto min-h-[600px]'>
				{columns.map((column) => (
					<SortableContext
						key={column.id}
						id={column.id}
						items={column.items.map((item) => item.id)}
						strategy={verticalListSortingStrategy}>
						<EnhancedPipe
							id={column.id}
							title={column.title}
							Value={column.value}
							notify={column.notify}
							colorHead={column.colorHead}
							items={column.items}
							openProfilePipe={openProfilePipe}
							isOverDropZone={overId === column.id}
						/>
					</SortableContext>
				))}
			</div>

			{typeof window !== 'undefined' &&
				createPortal(
					<DragOverlay>
						{activeItem && (
							<EnhancedDraggableItem
								item={activeItem}
								onItemClick={() => {}}
								isDragOverlay
							/>
						)}
					</DragOverlay>,
					document.body,
				)}
		</DndContext>
	);
}
