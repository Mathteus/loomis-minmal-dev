import { makeDelay } from '@/utils/utilities';

export type Collaborator = {
	id: string;
	name: string;
};

export async function fetchCollaborators(): Promise<Collaborator[]> {
	await makeDelay(500);
	return [
		{ id: '1', name: 'Fernanda Kipper' },
		{ id: '2', name: 'Cherno' },
		{ id: '3', name: 'Diego Gomes' },
	];
}
