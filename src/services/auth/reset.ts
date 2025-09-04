import { ServerFailed } from '@/errors/generics';
import { getStoredUsers, setStoredUsers } from './storage';
import { readJSON } from '../config';

export function resetPassword(newPassword: string) {
	const { email } = readJSON<{ email: string; code: string }>('reset-code', {
		email: '',
		code: '',
	});
	if (!email) {
		throw new ServerFailed();
	}

	const users = getStoredUsers();
	const index = users.findIndex((u) => u.email === email);
	if (index === -1) {
		throw new ServerFailed();
	}

	users[index].password = newPassword;
	setStoredUsers(users);
	if (typeof window !== 'undefined') {
		localStorage.removeItem('reset-code');
	}
	return true;
}
