import type { ChatMessage } from '@/components/dashboard/services/message-types';

/**
 * Replace the message history for a given contact in localStorage.
 * Intended for use after actions like editing or cancelling messages.
 */
export function updateMessageHistory(
	contactId: string,
	messages: ChatMessage[],
): void {
	if (typeof window === 'undefined') return;

	const storageKey = 'messages';
	const stored = window.localStorage.getItem(storageKey);
	const parsed = stored ? (JSON.parse(stored) as unknown) : {};

	const allMessages: Record<string, ChatMessage[]> =
		typeof parsed === 'object' && parsed !== null
			? (parsed as Record<string, ChatMessage[]>)
			: {};

	allMessages[contactId] = messages;
	window.localStorage.setItem(storageKey, JSON.stringify(allMessages));
}
