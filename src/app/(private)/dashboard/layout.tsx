'use client';
import { Inter } from 'next/font/google';
import { DashboardSidebar } from '@/components/dashboard/sidebar';

const inter = Inter({
	subsets: ['latin'],
});

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<main
			className={`${inter.className} antialiased flex max-h-screen max-w-screen overflow-hidden`}>
			<DashboardSidebar />
			{children}
		</main>
	);
}
