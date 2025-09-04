import { makeDelay } from '@/utils/utilities';

export type ScheduledStatus = 'scheduled' | 'sent' | 'canceled';

export interface ScheduledMessageItem {
	id: string;
	contactId: string;
	text: string;
	scheduledAt: Date;
	status: ScheduledStatus;
	createdAt: Date;
	updatedAt: Date;
}

export interface CreateScheduledInput {
	text: string;
	scheduledAt: Date;
}

export interface UpdateScheduledInput {
	text?: string;
	scheduledAt?: Date;
	status?: ScheduledStatus;
}

const makeKey = (contactId: string) => `scheduled-${contactId}`;

function revive(item: any): ScheduledMessageItem {
	// Accept raw JSON object and coerce date-like fields to Date
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
	const scheduledAt = item?.scheduledAt ?? new Date();
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
	const createdAt = item?.createdAt ?? new Date();
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
	const updatedAt = item?.updatedAt ?? new Date();

	return {
		...item,
		scheduledAt: new Date(scheduledAt),
		createdAt: new Date(createdAt),
		updatedAt: new Date(updatedAt),
	} as ScheduledMessageItem;
}

function serialize(items: ScheduledMessageItem[]): string {
	// Store ISO strings for dates
	const plain = items.map((i) => ({
		...i,
		scheduledAt: i.scheduledAt.toISOString(),
		createdAt: i.createdAt.toISOString(),
		updatedAt: i.updatedAt.toISOString(),
	}));
	return JSON.stringify(plain);
}

export async function getScheduled(
	contactId: string,
): Promise<ScheduledMessageItem[]> {
	await makeDelay(300);
	const stored = localStorage.getItem(makeKey(contactId));
	if (!stored) return [];
	try {
		const parsed = JSON.parse(stored) as any[];
		return parsed.map(revive);
	} catch {
		return [];
	}
}

export function addScheduled(
	contactId: string,
	input: CreateScheduledInput,
): ScheduledMessageItem {
	const key = makeKey(contactId);
	const stored = localStorage.getItem(key);
	const list: ScheduledMessageItem[] = stored
		? (JSON.parse(stored) as any[]).map(revive)
		: [];

	const now = new Date();
	const item: ScheduledMessageItem = {
		id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
		contactId,
		text: input.text,
		scheduledAt: new Date(input.scheduledAt),
		status: 'scheduled',
		createdAt: now,
		updatedAt: now,
	};

	list.push(item);
	localStorage.setItem(key, serialize(list));
	return item;
}

export function updateScheduled(
	contactId: string,
	id: string,
	patch: UpdateScheduledInput,
): ScheduledMessageItem | null {
	const key = makeKey(contactId);
	const stored = localStorage.getItem(key);
	if (!stored) return null;
	const list: ScheduledMessageItem[] = (JSON.parse(stored) as any[]).map(
		revive,
	);
	const idx = list.findIndex((i) => i.id === id);
	if (idx === -1) return null;
	const prev = list[idx];
	const next: ScheduledMessageItem = {
		...prev,
		text: patch.text ?? prev.text,
		scheduledAt: patch.scheduledAt
			? new Date(patch.scheduledAt)
			: prev.scheduledAt,
		status: patch.status ?? prev.status,
		updatedAt: new Date(),
	};
	list[idx] = next;
	localStorage.setItem(key, serialize(list));
	return next;
}

export function updateScheduledStatus(
	contactId: string,
	id: string,
	status: ScheduledStatus,
): ScheduledMessageItem | null {
	return updateScheduled(contactId, id, { status });
}

export function deleteScheduled(contactId: string, id: string): void {
	const key = makeKey(contactId);
	const stored = localStorage.getItem(key);
	if (!stored) return;
	const list: ScheduledMessageItem[] = (JSON.parse(stored) as any[]).map(
		revive,
	);
	const filtered = list.filter((i) => i.id !== id);
	localStorage.setItem(key, serialize(filtered));
}
