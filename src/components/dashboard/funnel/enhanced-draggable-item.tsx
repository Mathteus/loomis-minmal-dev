import { EllipsisVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PipeItem } from './pipe';
import styles from './pipe.module.css';

interface EnhancedDraggableItemProps {
  item: PipeItem;
  onItemClick: () => void;
  isDragOverlay?: boolean;
}

export function EnhancedDraggableItem({ 
  item, 
  onItemClick, 
  isDragOverlay = false 
}: EnhancedDraggableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: item.id,
    disabled: isDragOverlay
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  const cardClasses = `
    bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-grab active:cursor-grabbing
    ${isDragging ? 'shadow-lg ring-2 ring-blue-300' : ''}
    ${isDragOverlay ? 'rotate-3 shadow-xl ring-2 ring-blue-400 scale-105' : ''}
  `;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cardClasses}
      onClick={onItemClick}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0">
          <div className="text-gray-900 font-medium text-sm mb-1 truncate">
            {item.username}
          </div>
          <div className="text-gray-500 text-xs mb-2">
            {item.phone}
          </div>
          <div className="text-gray-900 font-semibold text-sm">
            {item.amount}
          </div>
        </div>
        <div className="text-gray-400 hover:text-gray-600 ml-2 flex-shrink-0">
          <EllipsisVertical size={16} />
        </div>
      </div>
      
      {item.tags && item.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {item.tags.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className="bg-green-100 text-green-700 px-2 py-1 text-xs rounded-full font-medium"
            >
              {tag}
            </span>
          ))}
          {item.tags.length > 2 && (
            <span className="text-gray-400 text-xs px-2 py-1">
              +{item.tags.length - 2}
            </span>
          )}
        </div>
      )}
      
      <div className={`text-gray-600 text-xs leading-relaxed ${styles.cutText}`}>
        {item.message}
      </div>
    </div>
  );
}