import { AuthUserAlreadyExists } from '@/errors/auth';
import { CompanyType } from '@/app/(auth)/first-access/about-company/page';
import { getStoredUsers, setStoredUsers, StoredUser } from './storage';
import { writeJSON } from '../config';

export interface IAccountSignup {
	username: string;
	password: string;
	email: string;
	company: CompanyType;
	invites?: Array<string>;
}

export function registerAccount(newUser: IAccountSignup) {
	const users = getStoredUsers();
	if (users.some((u) => u.email === newUser.email)) {
		throw new AuthUserAlreadyExists();
	}

	const stored: StoredUser = {
		username: newUser.username,
		email: newUser.email,
		password: newUser.password,
	};

	users.push(stored);
	setStoredUsers(users);
	writeJSON('loggedIn', true);
	return true;
}

export function verifyCrendentials(username: string, email: string) {
	const users = getStoredUsers();
	if (users.some((u) => u.username === username || u.email === email)) {
		throw new AuthUserAlreadyExists();
	}
	return true;
}
