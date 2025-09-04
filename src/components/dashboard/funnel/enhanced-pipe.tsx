import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { EnhancedDraggableItem } from './enhanced-draggable-item';
import { PipeItem } from './pipe';
import styles from './pipe.module.css';

export interface EnhancedPipeProps {
  id: string;
  title: string;
  Value: string;
  notify: number;
  colorHead: string;
  items: PipeItem[];
  openProfilePipe: (item: PipeItem) => void;
  isOverDropZone?: boolean;
}

export function EnhancedPipe({
  id,
  title,
  Value,
  notify,
  colorHead,
  openProfilePipe,
  items,
  isOverDropZone = false,
}: EnhancedPipeProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: id,
  });

  const dropZoneStyle = {
    backgroundColor: isOver || isOverDropZone ? '#f0f9ff' : undefined,
    borderColor: isOver || isOverDropZone ? '#3b82f6' : '#e5e7eb',
    borderWidth: '2px',
    borderStyle: 'dashed',
    transition: 'all 0.2s ease-in-out',
  };

  return (
    <div
      ref={setNodeRef}
      style={dropZoneStyle}
      className={`w-80 flex-shrink-0 bg-gray-50 rounded-lg ${styles.HideScroolBar}`}
    >
      {/* Header */}
      <div
        style={{ backgroundColor: colorHead }}
        className="text-white p-4 rounded-t-lg flex justify-between mb-4 items-center sticky top-0 z-10"
      >
        <div>
          <h1 className="font-medium text-lg">{title}</h1>
          <span className="text-sm opacity-90">{Value}</span>
        </div>
        <div className="bg-white/20 flex p-2 rounded-full min-w-[2rem] h-8 justify-center items-center text-xs font-medium">
          {notify}
        </div>
      </div>

      {/* Items */}
      <div className="px-4 pb-4 space-y-3 funnel-column overflow-y-auto max-h-[500px]">
        <SortableContext
          id={id}
          items={items.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          {items.map((item) => (
            <EnhancedDraggableItem
              key={`item-${item.id}-${items.length}`}
              item={item}
              onItemClick={() => openProfilePipe(item)}
            />
          ))}
        </SortableContext>
        
        {items.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg bg-white">
            <div className="space-y-2">
              <div className="text-lg">📋</div>
              <div>Arraste cards aqui</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}