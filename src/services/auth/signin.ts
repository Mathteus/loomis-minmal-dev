import { AuthUserNotFound } from '@/errors/auth';
import { getStoredUsers } from './storage';
import { writeJSON } from '../config';

export interface IAccountSignin {
	email: string;
	password: string;
}

export function verifyLogin(userVerify: IAccountSignin) {
	const users = getStoredUsers();
	const user = users.find(
		(u) => u.email === userVerify.email && u.password === userVerify.password,
	);

	if (!user) {
		throw new AuthUserNotFound();
	}

	writeJSON('loggedIn', true);
	return true;
}
