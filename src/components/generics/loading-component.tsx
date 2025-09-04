'use client';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

interface ILoadingComponent {
	show: boolean;
}

export function LoadingComponent({ show }: ILoadingComponent) {
	return (
		<Dialog open={show} modal>
			<DialogContent>
				<DialogTitle>Carregando...</DialogTitle>
				<main className='flex flex-col items-center justify-center min-h-max text-center bg-white'>
					<div className='p-4 mb-4 animate-spin size-[50px] rounded-full bg-green-loomis'>
						<Image src={'/reload.svg'} alt='Reload' width={100} height={100} />
					</div>

					<h2 className='text-title-loomis-not-found'>
						Carregando conteúdo...
					</h2>
					<p className='text-medium-loomis  text-gray-500'>
						Aguarde alguns instantes enquanto carregamos o conteúdo
					</p>
				</main>
			</DialogContent>
		</Dialog>
	);
}
