import { readJSON, writeJSON } from '../config';

export interface StoredUser {
	username: string;
	email: string;
	password: string;
}

export function getStoredUsers(): StoredUser[] {
	return readJSON<StoredUser[]>('mock-users', []);
}

export function setStoredUsers(users: StoredUser[]): void {
	writeJSON('mock-users', users);
}
