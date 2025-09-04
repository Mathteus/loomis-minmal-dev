import type { ChatMessage } from './message-types';
import { MessageTextBubble } from './messages-text';
import { MessageAudioBubble } from './message-audio';
import { MessageMediaBubble } from './message-media';
import { MessageFileBubble } from './message-file';

export function MessagesList({ messages }: { messages: ChatMessage[] }) {
	return (
		<section className='flex-1 overflow-y-auto p-6 space-y-4 w-full'>
			{messages.map((msg) => {
				switch (msg.kind) {
					case 'audio':
						return <MessageAudioBubble key={msg.id} message={msg} />;
					case 'image':
					case 'video':
						return <MessageMediaBubble key={msg.id} message={msg} />;
					case 'file':
						return <MessageFileBubble key={msg.id} message={msg} />;
					default:
						return <MessageTextBubble key={msg.id} message={msg} />;
				}
			})}
		</section>
	);
}
