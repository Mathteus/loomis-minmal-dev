'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { LoomisButton } from '../generics/loomis-button';

export interface ISuccessModal {
	onClose: () => void;
	type: 'REGISTER' | 'RECOVERY';
}

const texts = {
	REGISTER: {
		title: 'Tudo pronto para iniciar!',
		label:
			'Com nossa tecnologia você vai ganhar tempo, organizar processos e focar no que realmente importa para o crescimento da sua empresa.',
	},
	RECOVERY: {
		title: 'Senha alterada!',
		label:
			'Acesse a área de login novamente e preencha os campos de e-mail e utilize sua nova senha para acessar a plataforma.',
	},
} as const;

export function SuccessModal({ onClose, type }: ISuccessModal) {
	const router = useRouter();
	const handleClick = () => {
		onClose();
		router.push('/login');
	};

	return (
		<div className='fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50'>
			<div className='bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl text-center space-y-4'>
				<div className='flex justify-center items-center space-x-2'>
					<div className='bg-green-100 p-2 rounded-full'>
						<Image
							src='/icon-confirm.svg'
							alt='Icone de confirmação'
							width={70}
							height={70}
						/>
					</div>
				</div>
				<h2 className='text-title-loomis-not-found'>
					{type === 'REGISTER' ? texts.REGISTER.title : texts.RECOVERY.title}
				</h2>
				<p className='text-medium-loomis text-gray-500'>
					{type === 'REGISTER' ? texts.REGISTER.label : texts.RECOVERY.label}
				</p>
				<LoomisButton onClick={handleClick}>Acessar plataforma</LoomisButton>
			</div>
		</div>
	);
}
