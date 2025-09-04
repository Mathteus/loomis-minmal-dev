'use server';
import { ServerFailed } from '@/errors/generics';
import { cookies } from 'next/headers';
import { fecthRequest } from '../config';

interface ITokenResponse {
	tokenTemp: string;
}

export async function verifyCode(codeRecovery: string) {
	const cookieStore = await cookies();
	const response = await fecthRequest({
		url: '/auth/verify-code',
		method: 'POST',
		body: JSON.stringify({ code: codeRecovery }),
		token: cookieStore.get('access_token')?.value,
	});

	if (response.status === 200) {
		const cookieStore = await cookies();
		const data = (await response.json()) as ITokenResponse;
		cookieStore.set('access_token', String(data.tokenTemp));
		return true;
	}

	const bodyError = await response.text();
	console.log(response.status, bodyError);

	throw new ServerFailed();
}
