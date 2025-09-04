'use client';
import { ReactQueryClientProvider } from './reactquery-client-provider';
import { Toaster } from '@/components/ui/sonner';
export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ReactQueryClientProvider>
			{children}
			<Toaster />
		</ReactQueryClientProvider>
	);
}
