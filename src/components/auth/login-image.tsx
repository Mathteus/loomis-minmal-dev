import Image from 'next/image';
import woman from '@public/images/image-login.png';

export default function LoginImage() {
	return (
		<main className='h-full w-full relative'>
			<Image
				src={woman}
				alt='Mulher usando notebook'
				fill
				className='object-cover'
				priority
			/>
			<div className='absolute bottom-2 right-4 text-xs text-white'>
				© 2025 | Loomis
			</div>
		</main>
	);
}
