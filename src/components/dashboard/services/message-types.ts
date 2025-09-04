export type MessageBase = {
	id: string;
	from: 'myself' | 'contact';
	time: Date;
	isRead: boolean;
};

export type TextMessage = MessageBase & {
	kind: 'text';
	text: string;
};

export type AudioMessage = MessageBase & {
	kind: 'audio';
	// Data URL for playback/persistence
	audioDataUrl: string;
	text?: '';
};

export type MediaKind = 'image' | 'video';

export type MediaMessage = MessageBase & {
	kind: MediaKind;
	mediaUrl: string; // data URL
	mimeType: string;
	name?: string;
};

export type FileMessage = MessageBase & {
	kind: 'file';
	fileUrl: string; // data URL
	mimeType: string;
	name: string;
	size: number;
};

export type ChatMessage =
	| TextMessage
	| AudioMessage
	| MediaMessage
	| FileMessage;
