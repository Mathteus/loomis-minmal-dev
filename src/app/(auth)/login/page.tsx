'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Label } from '@/components/ui/label';
import { LoomisInputText } from '@/components/generics/loomis-input-text';
import { LoomisCheckbox } from '@/components/generics/loomis-checkbox';
import { LoomisButton } from '@/components/generics/loomis-button';
import { toast } from 'sonner';
import { AuthUserNotFound, AuthInvalidInputs } from '@/errors/auth';
import { LoadingComponent } from '@/components/generics/loading-component';
import { verifyLogin } from '@/services/auth/signin';
import { LoomisPasswordInput } from '@/components/generics/loomis-password-input';

const LoginSchema = z.object({
	email: z.email(),
	password: z.string().min(3),
});

type UserLogin = z.infer<typeof LoginSchema>;

export default function LoginPage() {
	const router = useRouter();
	const { register, handleSubmit } = useForm<UserLogin>({
		resolver: zodResolver(LoginSchema),
	});

	const errorFunc = (error: Error) => {
		if (error instanceof AuthUserNotFound) {
			toast(error.message);
			return;
		}

		if (error instanceof AuthInvalidInputs) {
			toast(error.message);
			return;
		}

		if (error instanceof Error) {
			toast(error.message);
			return;
		}

		toast('Erro Inesperado!');
	};

	const { isPending, mutateAsync } = useMutation({
		mutationFn: async (user: UserLogin) => {
			// eslint-disable-next-line @typescript-eslint/await-thenable
			await verifyLogin({
				email: user.email,
				password: user.password,
			});
		},
		onError: errorFunc,
		onSuccess: () => {
			localStorage.setItem('loggedIn', 'true');
			toast.success('Login realizado com sucesso!', {
				duration: 2000,
			});
			setTimeout(() => router.push('/dashboard'), 1000);
		},
	});

	const handlerLogin = async (user: UserLogin) => {
		await mutateAsync(user);
	};

	return (
		<>
			<LoadingComponent show={isPending} />
			<div className='space-y-2'>
				<div className='mb-4'>
					<Image src='/short-logo.svg' alt='Logo' width={40} height={40} />
				</div>
				<h1 className='text-title-loomis'>Seja bem vindo</h1>
				<p className='text-medium-loomis text-gray-400'>
					Faça login e acesse sua conta
				</p>
			</div>

			<form onSubmit={handleSubmit(handlerLogin)} className='space-y-4'>
				<div>
					<Label htmlFor='email' className='text-small-loomis p-1'>
						E-mail
					</Label>
					<LoomisInputText
						required
						type='email'
						id='email'
						placeholder='Digite seu e-mail'
						disabled={isPending}
						{...register('email')}
					/>
				</div>
				<div>
					<Label htmlFor='password' className='text-small-loomis p-1'>
						Senha
					</Label>
					<LoomisPasswordInput
						required
						id='password'
						placeholder='Digite sua senha'
						disabled={isPending}
						{...register('password')}
					/>
				</div>
				<div className='flex items-center justify-between text-sm'>
					<div className='flex gap-2 items-center'>
						<LoomisCheckbox id='remeber' />
						<Label
							className='text-small-loomis text-gray-400'
							htmlFor='remeber'>
							Lembre-se de mim
						</Label>
					</div>
					<Link
						href='/forgot-password'
						className='text-green-loomis-dark text-small-loomis hover:underline'>
						Esqueceu sua senha ?
					</Link>
				</div>
				<LoomisButton type='submit' disabled={isPending}>
					Entrar
				</LoomisButton>
			</form>

			<p className='text-small-loomis text-gray-400'>
				Não tem uma conta ?{' '}
				<Link
					href='/'
					className='text-small-loomis text-green-loomis-dark hover:underline'>
					Conheça nossos planos
				</Link>
			</p>
		</>
	);
}
