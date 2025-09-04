import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AreaInputs } from './area-inputs';
import { MessagesList } from './messages-list';
import { ProfileChat } from './sidebar-profile/profile';
import { HeadChat } from './head-chat';
import {
	addMessage,
	getMessages,
	addAudioMessage,
	addFileMessage,
} from '@/services/dashboard/chat/messages';
import { getContacts } from '@/services/dashboard/chat/contacts';
import type { Contact } from './contacts';
import type { ChatMessage } from './message-types';
import { DialogSendFastMessage } from './dialog-send-fast-message';

interface IChatAreaProps {
	selectedContactId: string | null;
}

export function ChatArea({ selectedContactId }: IChatAreaProps) {
	const [messageText, setMessageText] = useState<string>('');
	const [searchTerm, setSearchTerm] = useState<string>('');

	const queryClient = useQueryClient();

	const mutation = useMutation<void, Error, string>({
		mutationFn: (text: string) => {
			addMessage(selectedContactId as string, text);
			return Promise.resolve();
		},
		onSuccess: (_data, newMessage) => {
			void queryClient.invalidateQueries({
				queryKey: ['messages', selectedContactId],
			});

			queryClient.setQueryData<Contact[]>(['contacts'], (oldContacts) => {
				if (!oldContacts) return oldContacts;

				return oldContacts.map((contact) =>
					contact.id === selectedContactId
						? {
								...contact,
								lastMessage: newMessage,
								timeofLastMessage: new Date(),
							}
						: contact,
				);
			});
		},
	});

	const audioMutation = useMutation<void, Error, string>({
		mutationFn: (dataUrl: string) => {
			addAudioMessage(selectedContactId as string, dataUrl);
			return Promise.resolve();
		},
		onSuccess: (_data, dataUrl) => {
			// Optimistic add so user sees it immediately
			queryClient.setQueryData<ChatMessage[]>(
				['messages', selectedContactId],
				(old = []) => [
					...old,
					{
						id: Date.now().toString(),
						from: 'myself',
						kind: 'audio',
						audioDataUrl: dataUrl,
						time: new Date(),
						isRead: true,
					},
				],
			);
			void queryClient.invalidateQueries({
				queryKey: ['messages', selectedContactId],
			});

			queryClient.setQueryData<Contact[]>(['contacts'], (oldContacts) => {
				if (!oldContacts) return oldContacts;

				return oldContacts.map((contact) =>
					contact.id === selectedContactId
						? {
								...contact,
								lastMessage: '[Áudio]',
								timeofLastMessage: new Date(),
							}
						: contact,
				);
			});
		},
	});

	const handleSendMessage = () => {
		const text = messageText.trim();
		if (!text) return;
		mutation.mutate(text);
		setMessageText('');
	};

	const fileMutation = useMutation<
		void,
		Error,
		{ name: string; type: string; size: number; dataUrl: string }
	>({
		mutationFn: (file: {
			name: string;
			type: string;
			size: number;
			dataUrl: string;
		}) => {
			addFileMessage(selectedContactId as string, file);
			return Promise.resolve();
		},
		onSuccess: (_data, file) => {
			// optimistic insert
			queryClient.setQueryData<ChatMessage[]>(
				['messages', selectedContactId],
				(old = []) => [
					...old,
					file.type.startsWith('image/') || file.type.startsWith('video/')
						? {
								id: Date.now().toString(),
								from: 'myself',
								kind: file.type.startsWith('image/') ? 'image' : 'video',
								mediaUrl: file.dataUrl,
								mimeType: file.type,
								name: file.name,
								time: new Date(),
								isRead: true,
							}
						: {
								id: Date.now().toString(),
								from: 'myself',
								kind: 'file',
								fileUrl: file.dataUrl,
								mimeType: file.type,
								name: file.name,
								size: file.size,
								time: new Date(),
								isRead: true,
							},
				],
			);
			void queryClient.invalidateQueries({
				queryKey: ['messages', selectedContactId],
			});

			queryClient.setQueryData<Contact[]>(['contacts'], (oldContacts) => {
				if (!oldContacts) return oldContacts;
				const preview = file.type.startsWith('image/')
					? '[Imagem]'
					: file.type.startsWith('video/')
						? '[Vídeo]'
						: `📄 ${file.name}`;
				return oldContacts.map((c) =>
					c.id === selectedContactId
						? { ...c, lastMessage: preview, timeofLastMessage: new Date() }
						: c,
				);
			});
		},
	});

	const { data: messages = [] } = useQuery<ChatMessage[]>({
		queryKey: ['messages', selectedContactId],
		queryFn: () => getMessages(selectedContactId as string),
		enabled: !!selectedContactId,
	});

	useEffect(() => {
		if (!messages || messages.length === 0) return;
		const last = messages[messages.length - 1];
		queryClient.setQueryData<Contact[]>(['contacts'], (oldContacts) => {
			if (!oldContacts) return oldContacts;
			return oldContacts.map((contact) =>
				contact.id === selectedContactId
					? {
							...contact,
							lastMessage:
								last.kind === 'audio'
									? '[Áudio]'
									: last.kind === 'image'
										? '[Imagem]'
										: last.kind === 'video'
											? '[Vídeo]'
											: last.kind === 'file'
												? '📄 ' + last.name
												: last.kind === 'text'
													? last.text
													: '',
							timeofLastMessage: last.time,
						}
					: contact,
			);
		});
	}, [messages, selectedContactId, queryClient]);

	const { data: contacts = [] } = useQuery<Contact[]>({
		queryKey: ['contacts'],
		queryFn: getContacts,
	});

	const selectedContact = contacts.find((c) => c.id === selectedContactId);

	const filteredMessages: ChatMessage[] = messages.filter(
		(msg: ChatMessage) => {
			if (msg.kind !== 'text') {
				return searchTerm.trim() === '';
			}
			return msg.text.toLowerCase().includes(searchTerm.toLowerCase());
		},
	);

	if (!selectedContactId) {
		return <main className='flex bg-slate-100 w-full'></main>;
	}

	return (
		<main className='flex bg-slate-100 w-full h-screen'>
			<div className='w-full flex flex-col min-h-0'>
				<HeadChat
					avatar={selectedContact?.avatar ?? ''}
					name={selectedContact?.name ?? ''}
					searchTerm={searchTerm}
					setSearchTerm={(value: string) => setSearchTerm(value)}
				/>
				<MessagesList messages={filteredMessages} />
				<AreaInputs
					messageText={messageText}
					setMessageText={(value: string) => setMessageText(value)}
					onSendMessage={handleSendMessage}
					onSendAudio={(dataUrl) => audioMutation.mutate(dataUrl)}
					onSendFiles={(files) => files.forEach((f) => fileMutation.mutate(f))}
				/>
				<DialogSendFastMessage onSend={(text) => mutation.mutate(text)} />
			</div>
			<ProfileChat selectedContactId={selectedContactId} />
		</main>
	);
}
