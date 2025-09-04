'use client';
import { useRouter } from 'next/navigation';
import StepIndicator from '@/components/auth/step-indicator';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from 'recharts';
import { LoomisPasswordInput } from '@/components/generics/loomis-password-input';
import { LoomisButton } from '@/components/generics/loomis-button';
import { LoomisInputText } from '@/components/generics/loomis-input-text';
import { useAuthStore } from '@/contexts/first-access';
import { ErrorMensageComponent } from '@/components/generics/error-message-inputs';
import { useMutation } from '@tanstack/react-query';
import { verifyCrendentials } from '@/services/auth/signup';
import { AuthUserNotFound, AuthInvalidInputs } from '@/errors/auth';
import { toast } from 'sonner';
import { useEffect } from 'react';

const FirstStepSchema = z
	.object({
		name: z
			.string({
				error: 'Nome é obrigatório!',
			})
			.min(3, {
				message: 'Nome deve conter no mínimo 3 caracteres!',
			}),
		email: z.email({
			error: 'E-mail é obrigatório!',
		}),
		password: z
			.string({
				error: 'Senha é obrigatória',
			})
			.min(8, {
				message: 'Senha deve ter no mínimo 8 caracteres',
			}),
		confirmPassword: z
			.string({
				error: 'Confirmar senha é obrigatório!',
			})
			.min(8, {
				message: 'As senhas não são iguais',
			}),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'As senhas não são iguais',
		path: ['confirmPassword'],
	});

type FirstStep = z.infer<typeof FirstStepSchema>;

const steps = [
	{ label: 'Seus dados', active: true, completed: false },
	{ label: 'Sobre a empresa', active: false, completed: false },
	{ label: 'Sua equipe', active: false, completed: false },
];

interface IHandlerNextStep {
	username: string;
	email: string;
}

export default function FirstAccessPage() {
	const router = useRouter();
	const { setSelfData, eraseDatas } = useAuthStore();
	const { register, handleSubmit, formState, watch } = useForm<FirstStep>({
		resolver: zodResolver(FirstStepSchema),
	});
	const { errors } = formState;
	const { isError, error, isPending, mutateAsync } = useMutation({
		mutationFn: (currentUser: IHandlerNextStep) => {
			verifyCrendentials(currentUser.username, currentUser.email);
		},
		onSuccess: () => {
			setSelfData({
				username: watch('name'),
				password: watch('password'),
				email: watch('email'),
			});
			router.push('/first-access/about-company');
		},
	});
	const handlerNextStep = async (user: FirstStep) => {
		await mutateAsync({
			username: user.name,
			email: user.email,
		});
	};

	useEffect(() => {
		eraseDatas();
	}, []);

	return (
		<>
			<div className='flex items-center gap-2'>
				<StepIndicator steps={steps} />
			</div>

			<div className='space-y-2'>
				<h1 className='text-title-loomis'>Seus dados</h1>
				<p className='text-medium-loomis text-gray-600'>
					Para começar a utilizar a plataforma, insira suas informações abaixo
				</p>
			</div>

			<form className='space-y-4' onSubmit={handleSubmit(handlerNextStep)}>
				<div>
					<Label className='text-small-loomis text-gray-600'>Nome</Label>
					<LoomisInputText
						type='text'
						placeholder='Digite seu nome'
						id='name'
						{...register('name')}
					/>
					{errors.name && (
						<ErrorMensageComponent messageError={errors.name.message} />
					)}
				</div>

				<div>
					<Label className='text-small-loomis text-gray-600'>E-mail</Label>
					<LoomisInputText
						type='email'
						placeholder='Digite seu e-mail'
						id='email'
						{...register('email')}
					/>
					{errors.email && (
						<ErrorMensageComponent messageError={errors.email.message} />
					)}
				</div>

				<div>
					<Label className='text-small-loomis text-gray-600'>Senha</Label>
					<LoomisPasswordInput
						placeholder='Digite sua senha'
						{...register('password')}
					/>
					{errors.password && (
						<ErrorMensageComponent messageError={errors.password.message} />
					)}
				</div>

				<div>
					<Label className='text-small-loomis text-gray-600'>
						Confirmar senha
					</Label>
					<LoomisPasswordInput
						placeholder='Confirme sua senha'
						{...register('confirmPassword')}
					/>
					{errors.confirmPassword && (
						<ErrorMensageComponent
							messageError={errors.confirmPassword.message}
						/>
					)}
				</div>

				<div>
					<LoomisButton type='submit' disabled={isPending}>
						Avançar
					</LoomisButton>
				</div>
				{isError && <ErrorMensageComponent messageError={error.message} />}
			</form>
		</>
	);
}
