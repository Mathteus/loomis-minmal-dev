import {
	ChatMessage,
	TextMessage,
	MediaMessage,
	FileMessage,
	MediaKind,
} from '@/components/dashboard/services/message-types';
import { makeDelay } from '@/utils/utilities';

const makeKey = (contactId: string) => `messages-${contactId}`;

export function addMessage(contactId: string, text: string): void {
	const key = makeKey(contactId);
	const stored = localStorage.getItem(key);
	const messages: ChatMessage[] = stored
		? (JSON.parse(stored) as ChatMessage[])
		: [];

	const msg: TextMessage = {
		id: Date.now().toString(),
		from: 'myself',
		text,
		time: new Date(),
		isRead: true,
		kind: 'text',
	};

	messages.push(msg);

	localStorage.setItem(key, JSON.stringify(messages));
}

/**
 * Marks all messages of a contact as read in localStorage.
 */
export function markMessagesAsRead(contactId: string): void {
	const key = makeKey(contactId);
	const stored = localStorage.getItem(key);
	if (!stored) return;

	const messages: ChatMessage[] = JSON.parse(stored) as ChatMessage[];
	const updated = messages.map((message) => ({ ...message, isRead: true }));

	localStorage.setItem(key, JSON.stringify(updated));
}

type StoredBase = {
	id: string;
	from: 'myself' | 'contact';
	time: string | number | Date;
	isRead: boolean;
};

type StoredText = StoredBase & {
	kind?: 'text';
	text: string;
};

type StoredAudio = StoredBase & {
	kind: 'audio';
	audioDataUrl: string;
};

type StoredMedia = StoredBase & {
	kind: 'image' | 'video';
	mediaUrl: string;
	mimeType?: string;
	name?: string;
};

type StoredFileMsg = StoredBase & {
	kind: 'file';
	fileUrl: string;
	mimeType?: string;
	name?: string;
	size?: number;
};

function reviveMessage(raw: unknown): ChatMessage | null {
	if (typeof raw !== 'object' || raw === null) return null;
	const o = raw as Partial<
		StoredText | StoredAudio | StoredMedia | StoredFileMsg
	>;
	const base: {
		id: string;
		from: 'myself' | 'contact';
		time: Date;
		isRead: boolean;
	} = {
		id: String((o as StoredBase).id ?? Date.now().toString()),
		from: (o as StoredBase).from === 'contact' ? 'contact' : 'myself',
		time: new Date((o as StoredBase).time ?? Date.now()),
		isRead: Boolean((o as StoredBase).isRead),
	};
	const anyRec = o as Record<string, unknown>;
	if (
		(o as StoredAudio).kind === 'audio' ||
		typeof anyRec.audioDataUrl === 'string'
	) {
		const audioUrl =
			typeof anyRec.audioDataUrl === 'string'
				? String(anyRec.audioDataUrl)
				: '';
		return {
			...base,
			kind: 'audio',
			audioDataUrl: audioUrl,
		};
	}
	if (
		(o as StoredMedia).kind === 'image' ||
		(o as StoredMedia).kind === 'video' ||
		(o as Record<string, unknown>).mediaUrl !== undefined
	) {
		const kind = (o as StoredMedia).kind ?? 'image';
		const mediaUrl = String((o as StoredMedia).mediaUrl ?? '');
		const mimeType = String((o as StoredMedia).mimeType ?? '');
		const name = (o as StoredMedia).name
			? String((o as StoredMedia).name)
			: undefined;
		return {
			...base,
			kind,
			mediaUrl,
			mimeType,
			name,
		} as MediaMessage;
	}
	if (
		(o as StoredFileMsg).kind === 'file' ||
		typeof anyRec.fileUrl === 'string'
	) {
		return {
			...base,
			kind: 'file',
			fileUrl: String((o as StoredFileMsg).fileUrl ?? ''),
			mimeType: String((o as StoredFileMsg).mimeType ?? ''),
			name: String((o as StoredFileMsg).name ?? ''),
			size: Number((o as StoredFileMsg).size ?? 0),
		} as FileMessage;
	}
	// default to text
	const text = String((o as StoredText).text ?? '');
	return {
		...base,
		kind: 'text',
		text,
	};
}

export async function getMessages(contactId: string): Promise<ChatMessage[]> {
	await makeDelay(500);
	const key = makeKey(contactId);
	const stored = localStorage.getItem(key);

	if (stored) {
		const parsed = JSON.parse(stored) as unknown;
		const arr = Array.isArray(parsed) ? parsed : [];
		const revived = arr
			.map((msg) => reviveMessage(msg))
			.filter((m): m is ChatMessage => m !== null);
		return revived;
	}

	const mockMessages: ChatMessage[] = [
		{
			id: '1',
			from: 'myself',
			text: `Mensagem para contato ${contactId}`,
			time: new Date(),
			isRead: true,
			kind: 'text',
		},
		{
			id: '2',
			from: 'contact',
			text: 'Olá! Esta é uma mensagem de teste.',
			time: new Date(),
			isRead: true,
			kind: 'text',
		},
	];

	localStorage.setItem(key, JSON.stringify(mockMessages));

	return mockMessages;
}

export function addAudioMessage(contactId: string, audioDataUrl: string): void {
	const key = makeKey(contactId);
	const stored = localStorage.getItem(key);
	const messages: ChatMessage[] = stored
		? (JSON.parse(stored) as ChatMessage[])
		: [];

	messages.push({
		id: Date.now().toString(),
		from: 'myself',
		kind: 'audio',
		audioDataUrl,
		time: new Date(),
		isRead: true,
	});

	localStorage.setItem(key, JSON.stringify(messages));
}

export type UploadedFile = {
	name: string;
	type: string;
	size: number;
	dataUrl: string;
};

export function addFileMessage(contactId: string, file: UploadedFile): void {
	const key = makeKey(contactId);
	const stored = localStorage.getItem(key);
	const messages: ChatMessage[] = stored
		? (JSON.parse(stored) as ChatMessage[])
		: [];

	const base = {
		id: Date.now().toString(),
		from: 'myself' as const,
		time: new Date(),
		isRead: true,
	};

	let toPush: ChatMessage;
	if (file.type.startsWith('image/')) {
		toPush = {
			...base,
			kind: 'image',
			mediaUrl: file.dataUrl,
			mimeType: file.type,
			name: file.name,
		} as MediaMessage;
	} else if (file.type.startsWith('video/')) {
		toPush = {
			...base,
			kind: 'video',
			mediaUrl: file.dataUrl,
			mimeType: file.type,
			name: file.name,
		} as MediaMessage;
	} else {
		toPush = {
			...base,
			kind: 'file',
			fileUrl: file.dataUrl,
			mimeType: file.type,
			name: file.name,
			size: file.size,
		} as FileMessage;
	}

	messages.push(toPush);
	localStorage.setItem(key, JSON.stringify(messages));
}

export function getLastMessagePreview(
	contactId: string,
): { text: string; time: Date } | null {
	const key = makeKey(contactId);
	let stored = localStorage.getItem(key);
	// Seed default messages for contacts that haven't been opened yet
	if (!stored) {
		const mock: ChatMessage[] = [
			{
				id: '1',
				from: 'myself',
				kind: 'text',
				text: `Mensagem para contato ${contactId}`,
				time: new Date(),
				isRead: true,
			},
			{
				id: '2',
				from: 'contact',
				kind: 'text',
				text: 'Olá! Esta é uma mensagem de teste.',
				time: new Date(),
				isRead: true,
			},
		];
		localStorage.setItem(key, JSON.stringify(mock));
		stored = JSON.stringify(mock);
	}
	try {
		const parsed = JSON.parse(stored) as unknown;
		const arr = Array.isArray(parsed) ? parsed : [];
		if (arr.length === 0) return null;
		const last = arr[arr.length - 1] as unknown;
		if (typeof last !== 'object' || last === null) return null;
		const obj = last as Partial<
			StoredText | StoredAudio | StoredMedia | StoredFileMsg
		>;
		const time = new Date(
			(obj as { time?: string | number | Date }).time ?? Date.now(),
		);

		if (obj.kind === 'audio') return { text: '[Áudio]', time };
		if (obj.kind === 'image') return { text: '[Imagem]', time };
		if (obj.kind === 'video') return { text: '[Vídeo]', time };
		if (obj.kind === 'file') {
			const nameVal = obj.name ? String(obj.name) : '';
			return { text: nameVal ? `📄 ${nameVal}` : '[Arquivo]', time };
		}
		const text =
			typeof (obj as StoredText).text === 'string'
				? (obj as StoredText).text
				: '';
		return { text, time };
	} catch {
		return null;
	}
}
