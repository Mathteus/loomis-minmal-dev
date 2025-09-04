import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useRequireAuth() {
	const router = useRouter();

	useEffect(() => {
		const loggedIn = localStorage.getItem('loggedIn');

		if (loggedIn !== 'true') {
			router.replace('/login');
		}
	}, [router]);
}
