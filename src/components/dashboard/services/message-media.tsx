import type { MediaMessage } from './message-types';
import { getHorary } from '@/utils/utilities';

function getStyleMessage(from: string) {
	return {
		backgroundColor: from === 'myself' ? '#E6FFDA' : '#fff',
		borderRadius: '8px',
		padding: '8px',
		maxWidth: '520px',
	} as React.CSSProperties;
}

export function MessageMediaBubble({ message }: { message: MediaMessage }) {
	return (
		<div
			className={`flex ${message.from === 'myself' ? 'justify-end' : 'justify-start'}`}>
			<div style={getStyleMessage(message.from)}>
				{message.kind === 'image' ? (
					<img
						src={message.mediaUrl}
						alt={message.name ?? 'imagem'}
						className='rounded max-w-full h-auto max-h-[60vh]'
					/>
				) : (
					<video
						src={message.mediaUrl}
						className='rounded max-w-full max-h-[60vh]'
						controls
					/>
				)}
				<div className='text-right text-[11px] text-gray-500 mt-1'>
					{getHorary(message.time)}
				</div>
			</div>
		</div>
	);
}
