import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
	return (
		<>
			<main className='flex flex-col justify-center items-center h-screen space-y-2 gap-2'>
				<div className='margin-auto'>
					<Image
						alt='Logo Loomis'
						src='/short-logo.svg'
						width={80}
						height={80}
					/>
				</div>
				<div className='text-title-loomis-not-found'>Página não encontrada</div>
				<div className='text-medium-loomis text-gray-400'>
					Parece que a página que você está buscando não existe
				</div>
				<Button type='button' className='bg-button-not-found'>
					<Link href='/' className='text-white'>
						Ir para a tela inicial
					</Link>
				</Button>
			</main>
		</>
	);
}
