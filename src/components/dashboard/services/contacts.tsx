import { getHorary } from '@/utils/utilities';
import { ChatItem } from 'react-chat-elements';

export type Contact = {
	id: string;
	name: string;
	avatar: string;
	phone?: string;
	lastMessage: string;
	timeofLastMessage: Date;
	isSelected: boolean;
	unreadMessages: number;
};

export interface IContactsProps {
	contacts: Contact[];
	selectedContactId: string | null;
	onSelectContact: (id: string) => void;
}

export function Contacts({
	contacts,
	selectedContactId,
	onSelectContact,
}: IContactsProps) {
	return (
		<div className='flex-1 overflow-y-auto w-full'>
			{contacts.map((contact: Contact) => {
				return (
					<ChatItem
						key={contact.id}
						id={contact.id}
						avatar={contact.avatar}
						alt={contact.name}
						title={contact.name}
						subtitle={contact.lastMessage}
						dateString={getHorary(contact.timeofLastMessage)}
						unread={contact.unreadMessages}
						statusColor='#238E52'
						statusColorType='encircle'
						className={`rounded-lg cursor-pointer ${
							selectedContactId === contact.id ? 'bg-gray-100' : ''
						}`}
						onClick={() => onSelectContact(contact.id)}
					/>
				);
			})}
		</div>
	);
}
