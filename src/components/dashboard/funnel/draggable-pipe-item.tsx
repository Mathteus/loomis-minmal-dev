import { EllipsisVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PipeItem } from './pipe';
import styles from './pipe.module.css';

interface DraggablePipeItemProps {
  item: PipeItem;
  onItemClick: () => void;
}

export function DraggablePipeItem({ item, onItemClick }: DraggablePipeItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  return (
    <section
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white p-4 rounded-lg my-2 flex flex-col gap-2 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow duration-200 ${
        isDragging ? 'shadow-lg ring-2 ring-blue-300' : ''
      }`}
      onClick={onItemClick}>
      <section className='flex justify-between items-center'>
        <div>
          <div className='text-gray-700 text-medium-loomis font-medium'>
            {item.username}
          </div>
          <div className='text-gray-500 text-small-loomis'>
            {item.phone}
          </div>
          <div className='text-gray-700 text-small-loomis font-semibold'>
            {item.amount}
          </div>
        </div>
        <div className="text-gray-400 hover:text-gray-600">
          <EllipsisVertical size={16} />
        </div>
      </section>
      <div className='bg-green-loomis-light text-green-loomis w-max py-1 px-2 my-2 text-details-loomis rounded-2xl'>
        {item.tags[0]}
      </div>
      <div className={styles.cutText}>{item.message}</div>
    </section>
  );
}