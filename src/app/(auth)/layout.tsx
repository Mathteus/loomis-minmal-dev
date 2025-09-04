'use client';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Inter } from 'next/font/google';
import LoginImage from '@/components/auth/login-image';

const inter = Inter({
	subsets: ['latin'],
});

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();

	return (
		<main
			className={`${inter.className} antialiased h-screen grid grid-cols-1 md:grid-cols-2 w-screen`}>
			<section className='m-auto p-8 w-[60%] space-y-6'>
				{pathname !== '/login' && (
					<Link
						href='/login'
						className='text-small-loomis text-gray-600 hover:underline flex items-center gap-2'>
						<ArrowLeft /> Voltar para o início
					</Link>
				)}
				{children}
			</section>
			<section className='hidden md:block'>
				<LoginImage />
			</section>
		</main>
	);
}
