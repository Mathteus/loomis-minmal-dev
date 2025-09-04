'use server';
import { BodyRequestInvalid, ServerFailed } from '@/errors/generics';
import { JwtExpired } from '@/errors/jwt';
import { cookies } from 'next/headers';
import { fecthRequest } from '../config';

interface ITokenResponse {
	accessToken: string;
	refreshToken: string;
}

export async function refreshToken() {
	const cookieStore = await cookies();
	const response = await fecthRequest({
		url: '/auth/refresh',
		method: 'POST',
		body: JSON.stringify({
			refreshToken: cookieStore.get('refresh_token')?.value,
		}),
	});

	if (response.status === 200) {
		const cookieStore = await cookies();
		const { accessToken, refreshToken } =
			(await response.json()) as ITokenResponse;
		cookieStore.set('access_token', String(accessToken));
		cookieStore.set('refresh_token', String(refreshToken));
	}

	if (response.status === 400) {
		const error = String(await response.json());
		throw new BodyRequestInvalid(error);
	}

	if (response.status === 401) {
		throw new JwtExpired();
	}

	throw new ServerFailed();
}
