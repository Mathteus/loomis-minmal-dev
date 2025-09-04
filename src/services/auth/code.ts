import { ServerFailed } from '@/errors/generics';
import { readJSON } from '../config';

interface ITokenResponse {
	email: string;
	code: string;
}

export function verifyCode(codeRecovery: string) {
	const data = readJSON<ITokenResponse>('reset-code', { email: '', code: '' });
	if (data.code === codeRecovery) {
		return true;
	}
	throw new ServerFailed();
}
