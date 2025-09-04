import { Contact } from '@/components/dashboard/services/contacts';
import { getLastMessagePreview } from './messages';
import { makeDelay } from '@/utils/utilities';

export async function getContacts(): Promise<Contact[]> {
	await makeDelay(500);
	const base: Contact[] = [
		{
			id: '1',
			name: 'Fernanda Kipper',
			avatar: 'https://github.com/Fernanda-Kipper.png',
			phone: '+55 11 9999-0001',
			lastMessage: '',
			timeofLastMessage: new Date(),
			isSelected: true,
			unreadMessages: 0,
		},
		{
			id: '2',
			name: 'Cherno',
			avatar: 'https://github.com/TheCherno.png',
			phone: '+55 11 9999-0002',
			lastMessage: 'Lorem ipsum dolor sit amet co...',
			timeofLastMessage: new Date(),
			isSelected: false,
			unreadMessages: 2,
		},
		{
			id: '3',
			name: 'Diego Gomes',
			avatar: 'https://github.com/diego3g.png',
			phone: '+55 11 9999-0003',
			lastMessage: 'Lorem ipsum dolor sit amet co...',
			timeofLastMessage: new Date(),
			isSelected: false,
			unreadMessages: 2,
		},
		{
			id: '4',
			name: 'Lucas Montano',
			avatar: 'https://github.com/lucasmontano.png',
			phone: '+55 11 9999-0004',
			lastMessage: 'Lorem ipsum dolor sit amet co...',
			timeofLastMessage: new Date(),
			isSelected: false,
			unreadMessages: 2,
		},
		{
			id: '5',
			name: 'Filipe Deschamps',
			avatar: 'https://github.com/filipedeschamps.png',
			phone: '+55 11 9999-0005',
			lastMessage: 'Lorem ipsum dolor sit amet co...',
			timeofLastMessage: new Date(),
			isSelected: false,
			unreadMessages: 2,
		},
	];

	// Override preview with the last stored message if present
	return base.map((c) => {
		const snap = getLastMessagePreview(c.id);
		if (!snap) return c;
		return {
			...c,
			lastMessage: snap.text,
			timeofLastMessage: snap.time,
		};
	});
}
