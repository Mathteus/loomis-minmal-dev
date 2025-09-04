import { randomString, Replace } from '@/utils/utilities';

const makeKeyPipe = (contactId: string) => 'funnel-pipes';

export type PipeItem = {
	itemId: string;
	username: string;
	phone: string;
	amount: number;
	message: string;
	tags: string[];
	createAt: Date;
};

export interface IPipeFunnel {
	pipeId: string;
	pipeName: string;
	amount: number;
	notify: number;
	items: Array<PipeItem>;
}

export function getPipes() {
	const stored = localStorage.getItem('funnel-pipes');
	if (!stored) return [];
	const parsed = JSON.parse(stored) as unknown;
	const arr = Array.isArray(parsed) ? parsed : [];
	return arr;
}

export interface ICreatePipeProps {
	pipe: Replace<
		IPipeFunnel,
		{
			pipeId: undefined;
			pipeName: string;
			amount: undefined;
			notify: undefined;
			items: undefined;
		}
	>;
}

export function createPipe({ pipe }: ICreatePipeProps) {
	const currentPipe = {
		pipeId: `pipe-${randomString(5)}`,
		pipeName: pipe.pipeName,
		amount: 0,
		notify: 0,
		items: [],
	};

	const stored = localStorage.getItem('funnel-pipes');
	if (!stored) return null;

	localStorage.setItem(
		makeKeyPipe(currentPipe.pipeId),
		JSON.stringify(currentPipe),
	);
}

export function getPipe(pipeid: string) {
	const stored = localStorage.getItem(makeKeyPipe(pipeid));
	if (!stored) return null;
	return JSON.parse(stored) as IPipeFunnel;
}

export function removePipe(pipeid: string) {
	// const stored = localStorage.getItem(makeKeyPipe(pipeid));
	// if (!stored) return;
	// const messages: PipeItem[] = JSON.parse(stored) as PipeItem[];
	// const updated = messages.filter((m) => m.id !== pipe.id);
	// localStorage.setItem(key, JSON.stringify(updated));
}
