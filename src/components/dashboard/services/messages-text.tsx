import { getHorary } from '@/utils/utilities';
import { MessageBox } from 'react-chat-elements';
import type { TextMessage } from './message-types';
export interface IMessagesTextProps {
	messages: Array<TextMessage>;
}

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
	};
}

export function MessageTextBubble({ message }: { message: TextMessage }) {
	const msg = message;
	return (
		<MessageBox
			key={msg.id}
			id={msg.id}
			position={msg.from === 'myself' ? 'right' : 'left'}
			title=''
			type='text'
			text={msg.text}
			date={msg.time}
			dateString={getHorary(msg.time)}
			replyButton={true}
			removeButton={true}
			forwarded={false}
			focus={false}
			titleColor='#000'
			status='read'
			notch
			notchStyle={{ fill: msg.from === 'myself' ? '#E6FFDA' : '#fff' }}
			retracted={false}
			styles={getStyleMessage(msg.from)}
		/>
	);
}
