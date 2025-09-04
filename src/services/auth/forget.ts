import { ServerFailed } from '@/errors/generics';
import { getStoredUsers } from './storage';
import { writeJSON } from '../config';

interface IForgetPasswordProps {
	email: string;
}

export function forgetPassword({ email }: IForgetPasswordProps) {
	const users = getStoredUsers();
	const user = users.find((u) => u.email === email);
	if (!user) {
		throw new ServerFailed();
	}

	const code = Math.floor(100000 + Math.random() * 900000).toString();
	writeJSON('reset-code', { email, code });
	return code;
}
