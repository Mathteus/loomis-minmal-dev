export class AuthUserNotFound extends Error {
	constructor() {
		super('Usuário não encontrado ! verifique seu email e Senha !');
	}
}

export class AuthUserAlreadyExists extends Error {
	constructor() {
		super('Usuário já existe!');
	}
}

export class AuthInvalidInputs extends Error {
	constructor() {
		super('Dados inseridos são inválidos ! Insira dados válidos para entrar !');
	}
}
