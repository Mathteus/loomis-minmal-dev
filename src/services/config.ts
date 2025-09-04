export function readJSON<T>(key: string, fallback: T): T {
	if (typeof window === 'undefined') return fallback;
	const data = localStorage.getItem(key);
	if (!data) return fallback;
	try {
		return JSON.parse(data) as T;
	} catch {
		return fallback;
	}
}

export function writeJSON<T>(key: string, value: T): void {
	if (typeof window === 'undefined') return;
	localStorage.setItem(key, JSON.stringify(value));
}
