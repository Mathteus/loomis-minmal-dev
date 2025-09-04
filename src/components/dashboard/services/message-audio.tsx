import type { AudioMessage } from './message-types';
import { getHorary } from '@/utils/utilities';

function getStyleMessage(from: string) {
	return {
		backgroundColor: from === 'myself' ? '#E6FFDA' : '#fff',
		fontWeight: 500,
		fontSize: 14,
		letterSpacing: 0,
		verticalAlign: 'center',
		borderRadius: '8px',
		minWidth: '80px',
		maxWidth: '647px',
		gap: '8px',
		padding: '8px',
	} as React.CSSProperties;
}

export function MessageAudioBubble({ message }: { message: AudioMessage }) {
	const msg = message;
	return (
		<div
			className={`flex ${msg.from === 'myself' ? 'justify-end' : 'justify-start'}`}>
			<div style={getStyleMessage(msg.from)}>
				<audio
					controls
					src={msg.audioDataUrl}
					className='max-w-[420px] w-[320px] sm:w-[360px] md:w-[420px]'>
					Your browser does not support the audio element.
				</audio>
				<div className='text-right text-[11px] text-gray-500 mt-1'>
					{getHorary(msg.time)}
				</div>
			</div>
		</div>
	);
}
