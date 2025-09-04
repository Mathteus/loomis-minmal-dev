'use server';
interface IconfigProps {
	url: string;
	method: 'POST' | 'GET' | 'PUT' | 'DELETE';
	body?: string;
	token?: string;
}

export async function fecthRequest({ url, method, body, token }: IconfigProps) {
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
	};

	if (process.env.X_API_KEY) {
		headers['x-api-key'] = process.env.X_API_KEY;
	}

	if (token) {
		headers.Authorization = `Bearer ${token}`;
	}

	return await fetch(`${process.env.API_URL}${url}`, {
		method,
		headers,
		body: body ?? null,
	});
}
