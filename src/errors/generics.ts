export class ServerFailed extends Error {
	constructor() {
		super(
			'Ocorreu um erro no servidor! tente novamente mais tarde, ou entre em contato com suporte responsável para mais inforções!',
		);
	}
}

export class BodyRequestInvalid extends Error {
	constructor(fieldError: string) {
		super(fieldError);
	}
}
