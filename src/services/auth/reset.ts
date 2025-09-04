'use server';
import { ServerFailed } from '@/errors/generics';
import { cookies } from 'next/headers';
import { fecthRequest } from '../config';

export async function resetPassword(newPassword: string) {
	const cookieStore = await cookies();
	const response = await fecthRequest({
		url: '/auth/reset-password',
		method: 'POST',
		body: JSON.stringify({ newpassword: newPassword }),
		token: cookieStore.get('access_token')?.value,
	});

	if (response.status === 200) {
		cookieStore.delete('access_token');
		return true;
	}

	throw new ServerFailed();
}
