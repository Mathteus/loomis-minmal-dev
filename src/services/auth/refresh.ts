import { readJSON } from '../config';

export function refreshToken() {
	return readJSON<boolean>('loggedIn', false);
}
