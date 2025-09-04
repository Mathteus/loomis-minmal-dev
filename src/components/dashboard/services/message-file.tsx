import type { FileMessage } from './message-types';
import { getHorary } from '@/utils/utilities';
import { File } from 'lucide-react';

function getStyleMessage(from: string) {
	return {
		backgroundColor: from === 'myself' ? '#E6FFDA' : '#fff',
		borderRadius: '8px',
		padding: '10px',
		maxWidth: '520px',
	} as React.CSSProperties;
}

export function MessageFileBubble({ message }: { message: FileMessage }) {
	return (
		<div
			className={`flex ${message.from === 'myself' ? 'justify-end' : 'justify-start'}`}>
			<div
				style={getStyleMessage(message.from)}
				className='flex items-center gap-3'>
				<div className='h-10 w-10 rounded bg-white border border-gray-200 text-gray-500 flex items-center justify-center'>
					<File />
				</div>
				<div className='flex-1'>
					<a
						href={message.fileUrl}
						download={message.name}
						className='text-green-700 hover:underline'>
						{message.name}
					</a>
					<div className='text-[11px] text-gray-500 mt-1 text-right'>
						{getHorary(message.time)}
					</div>
				</div>
			</div>
		</div>
	);
}
