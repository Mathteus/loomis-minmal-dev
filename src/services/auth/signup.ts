'use server';
import { AuthUserAlreadyExists } from '@/errors/auth';
import { BodyRequestInvalid, ServerFailed } from '@/errors/generics';
import { CompanyType } from '@/app/(auth)/first-access/about-company/page';
import { fecthRequest } from '../config';

export interface IAccountSignup {
	username: string;
	password: string;
	email: string;
	company: CompanyType;
	invites?: Array<string>;
}

export async function registerAccount(newUser: IAccountSignup) {
	const response = await fecthRequest({
		url: '/auth/signup',
		method: 'POST',
		body: JSON.stringify({
			username: newUser.username,
			password: newUser.password,
			email: newUser.email,
			companyname: newUser.company.companyName,
			companycnpj: newUser.company.companyCNPJ,
			companytype: newUser.company.typeCompany,
			companycustomers: newUser.company.customersCompany,
			companyemployees: newUser.company.employeesCompany,
			emailsinvites: newUser.invites ?? [],
		}),
	});

	if (response.status === 201) {
		return true;
	}

	if (response.status === 409) {
		throw new AuthUserAlreadyExists();
	}

	if (response.status === 400) {
		const error = String(await response.json());
		throw new BodyRequestInvalid(error);
	}

	throw new ServerFailed();
}

export async function verifyCrendentials(username: string, email: string) {
	const response = await fetch(`${process.env.API_URL}/auth/verify-profile`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'x-api-key':
				'x_3f7a9b2e5c8d1f6a0e4c7b9d2a5f8e3c1b6d9e0a7f4c2b5d8e1f3a6c9b0e2d7f1a4c8b3e6d9',
		},
		body: JSON.stringify({
			username: username,
			email: email,
		}),
	});

	if (response.status === 200) {
		return true;
	}

	if (response.status === 409) {
		throw new AuthUserAlreadyExists();
	}

	throw new ServerFailed();
}
