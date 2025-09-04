export class PasswordMinLength extends Error {
	constructor(minLength: number) {
		super(`Senha deve Conter ao menos ${minLength} Caracteres !`);
	}
}

export class PasswordMaxLength extends Error {
	constructor(maxLength: number) {
		super(`Senha deve Conter no máximo ${maxLength} Caracteres !`);
	}
}

export class PasswordMinUppercase extends Error {
	constructor(minLength: number) {
		super(`Senha deve Conter ao menos ${minLength} letra(s) maiúscula(s) !`);
	}
}

export class PasswordMinLowercase extends Error {
	constructor(minLength: number) {
		super(`Senha deve Conter ao menos ${minLength} letra(s) minúscula(s) !`);
	}
}

export class PasswordMinNumber extends Error {
	constructor(minLength: number) {
		super(`Senha deve Conter ao menos ${minLength} número(s) !`);
	}
}

export class PasswordMinSymbol extends Error {
	constructor(minLength: number) {
		super(`Senha deve Conter ao menos ${minLength} simbolo(s) !`);
	}
}
