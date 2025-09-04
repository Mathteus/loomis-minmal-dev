export class JwtExpired extends Error {
	constructor() {
		super('Sua Sessão Acabou porfavor entre novamente!');
	}
}
