'use client';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { ptBR } from 'date-fns/locale/pt-BR';
import Cookies from 'js-cookie';

export type Replace<T, U> = Omit<T, keyof U> & U;
type TurnMutableType<T> = {
	-readonly [P in keyof T]: T[P];
};

export function toTurnMutable<T>(anyData: T): T {
	const aux: TurnMutableType<T> = { ...anyData };
	return aux;
}

export function toValidateEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

export type PasswordPolicy = {
	minLength?: number;
	maxLength?: number;
	minUppercase?: number;
	minLowercase?: number;
	minNumbers?: number;
	minSymbols?: number;
};

export interface IValidatePassword {
	password: string;
	policy: PasswordPolicy;
}

export interface IPasswordValidedResponse {
	minLength?: boolean;
	maxLength?: boolean;
	minUppercase?: boolean;
	minLowercase?: boolean;
	minNumbers?: boolean;
	minSymbols?: boolean;
}

export function toValidatePassword({
	password,
	policy,
}: IValidatePassword): IPasswordValidedResponse {
	const countUppercase = (password.match(/[A-Z]/g) || []).length;
	const countLowercase = (password.match(/[a-z]/g) || []).length;
	const countNumbers = (password.match(/[0-9]/g) || []).length;
	const countSymbols = (password.match(/[^A-Za-z0-9]/g) || []).length;

	const response: IPasswordValidedResponse = {
		minLength: false,
		maxLength: false,
		minUppercase: undefined,
		minLowercase: undefined,
		minNumbers: undefined,
		minSymbols: undefined,
	};

	if (policy.minLength) {
		response.minLength = password.length < policy.minLength;
	}

	if (policy.maxLength) {
		response.maxLength = password.length > policy.maxLength;
	}

	if (policy.minUppercase) {
		response.minUppercase = countUppercase < policy.minUppercase;
	}

	if (policy.minLowercase) {
		response.minLowercase = countLowercase < policy.minLowercase;
	}

	if (policy.minNumbers) {
		response.minNumbers = countNumbers < policy.minNumbers;
	}

	if (policy.minSymbols) {
		response.minSymbols = countSymbols < policy.minSymbols;
	}

	console.log('validatePassword=', response, policy);
	return response;
}

export function buildPasswordRegex(rules: PasswordPolicy): RegExp {
	const lookaheads: string[] = [];

	if (rules.minLowercase && rules.minLowercase > 0) {
		lookaheads.push(`(?=(?:.*[a-z]){${rules.minLowercase},})`);
	}
	if (rules.minLowercase && rules.minLowercase > 0) {
		lookaheads.push(`(?=(?:.*[A-Z]){${rules.minUppercase},})`);
	}
	if (rules.minLowercase && rules.minLowercase > 0) {
		lookaheads.push(`(?=(?:.*\\d){${rules.minNumbers},})`);
	}
	if (rules.minLowercase && rules.minLowercase > 0) {
		lookaheads.push(`(?=(?:.*[^A-Za-z0-9]){${rules.minSymbols},})`);
	}

	const regexStr = `^${lookaheads.join('')}.{${rules.minLength},${rules.maxLength}}$`;
	return new RegExp(regexStr);
}

export function toFormatCNPJ(value: string) {
	return value
		.replace(/\D/g, '')
		.replace(/^(\d{2})(\d)/, '$1.$2')
		.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
		.replace(/\.(\d{3})(\d)/, '.$1/$2')
		.replace(/(\d{4})(\d)/, '$1-$2')
		.replace(/(-\d{2})\d+?$/, '$1');
}

export function validarCNPJ(cnpj: string): boolean {
	const numerosCNPJ = cnpj.replace(/\D/g, '');

	if (numerosCNPJ.length !== 14 || /^(\d)\1{13}$/.test(numerosCNPJ)) {
		return false;
	}

	let tamanho = numerosCNPJ.length - 2;
	let numeros = numerosCNPJ.substring(0, tamanho);
	const digitos = numerosCNPJ.substring(tamanho);
	let soma = 0;
	let pos = tamanho - 7;

	for (let i = tamanho; i >= 1; i--) {
		soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
		if (pos < 2) pos = 9;
	}

	let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
	if (resultado !== parseInt(digitos.charAt(0))) {
		return false;
	}
	tamanho = tamanho + 1;
	numeros = numerosCNPJ.substring(0, tamanho);
	soma = 0;
	pos = tamanho - 7;

	for (let i = tamanho; i >= 1; i--) {
		soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
		if (pos < 2) pos = 9;
	}

	resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
	if (resultado !== parseInt(digitos.charAt(1))) {
		return false;
	}

	return true;
}

export function makeDelay(ms: number = 1000): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

interface Duration {
	seconds?: number;
	minutes?: number;
	hours?: number;
	days?: number;
	weeks?: number;
	months?: number;
	years?: number;
}

export function getFutureDate(duration: Duration): Date {
	const futureDate = new Date();
	if (duration.years) {
		futureDate.setFullYear(futureDate.getFullYear() + duration.years);
	}
	if (duration.months) {
		futureDate.setMonth(futureDate.getMonth() + duration.months);
	}

	const totalDays = (duration.days || 0) + (duration.weeks || 0) * 7;
	if (totalDays) {
		futureDate.setDate(futureDate.getDate() + totalDays);
	}

	if (duration.hours) {
		futureDate.setHours(futureDate.getHours() + duration.hours);
	}
	if (duration.minutes) {
		futureDate.setMinutes(futureDate.getMinutes() + duration.minutes);
	}
	if (duration.seconds) {
		futureDate.setSeconds(futureDate.getSeconds() + duration.seconds);
	}

	return futureDate;
}

export function getStringDate(time: Date) {
	return formatDistanceToNow(time, {
		addSuffix: true,
		locale: ptBR,
	});
}

export function getHorary(time: Date) {
	return `${formatNumber(time.getHours())}:${formatNumber(time.getMinutes())}`;
}

export function formatNumber(n: number): string {
	return n.toString().padStart(2, '0');
}

export function deleteSession() {
	Cookies.remove('access_token');
	Cookies.remove('refresh_token');
}

export function randomNumber(max: number, min = 0) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomString(length: number): string {
	const characters =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';

	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * characters.length);
		result += characters[randomIndex];
	}

	return result;
}

export function isStringEmptyOrWhitespace(input: string): boolean {
	if (input.length === 0) {
		return true;
	}

	return /^\s*$/.test(input);
}

export function toMoney(
	amount: number,
	moeda: string = 'BRL',
	locale: string = 'pt-BR',
): string {
	return new Intl.NumberFormat(locale, {
		style: 'currency',
		currency: moeda,
	}).format(amount);
}

export function MoneyMask(
	amount: string,
	currency = 'BRL',
	locale = 'pt-BR',
): string {
	const amountWithoutLetters = amount.replace(/\D/g, '');
	const amountFormatted = (parseInt(amountWithoutLetters, 10) / 100).toFixed(2);
	return new Intl.NumberFormat(locale, {
		style: 'currency',
		currency,
	}).format(Number(amountFormatted));
}
