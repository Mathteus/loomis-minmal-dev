'use server';
import { AuthUserNotFound } from '@/errors/auth';
import { BodyRequestInvalid, ServerFailed } from '@/errors/generics';
import { cookies } from 'next/headers';
import { fecthRequest } from '../config';

export interface IAccountSignin {
	email: string;
	password: string;
}

interface IResponseAPI {
	accessToken: string;
	refreshToken: string;
}

export async function verifyLogin(userVerify: IAccountSignin) {
	const response = await fecthRequest({
		url: '/auth/signin',
		method: 'POST',
		body: JSON.stringify(userVerify),
	});

	if (response.status === 200) {
		const cookieStore = await cookies();
		const { accessToken, refreshToken } =
			(await response.json()) as IResponseAPI;
		cookieStore.set('access_token', String(accessToken));
		cookieStore.set('refresh_token', String(refreshToken));
		return true;
	}

	if (response.status === 401) {
		throw new AuthUserNotFound();
	}

	if (response.status === 400) {
		const error = String(await response.json());
		throw new BodyRequestInvalid(error);
	}

	throw new ServerFailed();
}
