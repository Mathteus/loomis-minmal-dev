'use server';
import { ServerFailed } from '@/errors/generics';
import { cookies } from 'next/headers';
import { fecthRequest } from '../config';

interface IForgetPasswordProps {
	email: string;
}

interface ITokenResponse {
	tokenTemp: string;
	message: string;
}

export async function forgetPassword({ email }: IForgetPasswordProps) {
	const response = await fecthRequest({
		url: '/auth/forget-password',
		method: 'POST',
		body: JSON.stringify({ email }),
	});

	if (response.status === 200) {
		const cookieStore = await cookies();
		const { tokenTemp, message } = (await response.json()) as ITokenResponse;
		cookieStore.set('access_token', String(tokenTemp));
		return message;
	}

	throw new ServerFailed();
}
