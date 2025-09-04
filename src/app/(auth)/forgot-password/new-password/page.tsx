'use client';
import { useState } from 'react';
import { SuccessModal } from '@/components/auth/success-modal';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@/components/ui/label';
import { LoomisButton } from '@/components/generics/loomis-button';
import { LoomisPasswordInput } from '@/components/generics/loomis-password-input';
import { buildPasswordRegex } from '@/utils/utilities';
import { standardRulesPassword } from '@/config';
import { ErrorMensageComponent } from '@/components/generics/error-message-inputs';
import { useMutation } from '@tanstack/react-query';
import { resetPassword } from '@/services/auth/reset';
import { toast } from 'sonner';

const UpdateSchema = z
	.object({
		password: z
			.string({
				error: 'Senha é obrigatória',
			})
			.min(8, {
				message: 'Senha deve ter no mínimo 8 caracteres',
			})
			.refine((value) => buildPasswordRegex(standardRulesPassword).test(value)),
		confirmPassword: z
			.string({
				error: 'Confirmar senha é obrigatório!',
			})
			.min(8, {
				message: 'As senhas devem ser iguais',
			}),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'As senhas não são iguais',
		path: ['confirmPassword'],
	});

type UserUpdate = z.infer<typeof UpdateSchema>;

export default function NewPasswordPage() {
	const [showModal, setShowModal] = useState(false);
	const { register, handleSubmit, formState } = useForm<UserUpdate>({
		resolver: zodResolver(UpdateSchema),
	});

	const { errors } = formState;
	const { isPending, mutateAsync } = useMutation({
		mutationKey: ['verify-email'],
		mutationFn: async (newPassword: string) => {
			await resetPassword(newPassword);
		},
		onError: (err: Error) => {
			toast(err.message);
		},
		onSuccess: () => {
			setShowModal(true);
		},
	});

	const handlerChangePassword = async (user: UserUpdate) => {
		const { password } = user;
		await mutateAsync(password);
	};

	return (
		<>
			{showModal && (
				<SuccessModal type='RECOVERY' onClose={() => setShowModal(false)} />
			)}
			<div className='space-y-2'>
				<h1 className='text-title-loomis'>Crie uma nova senha</h1>
				<p className='text-medium-loomis text-gray-400'>
					Insira o código que foi enviado no seu e-mail para alterar sua senha
				</p>
			</div>

			<form
				className='space-y-4'
				onSubmit={handleSubmit(handlerChangePassword)}>
				<div>
					<Label className='text-small-loomis text-gray-600 py-2'>
						Nova Senha
					</Label>
					<LoomisPasswordInput
						placeholder='Digite sua senha'
						disabled={isPending}
						{...register('password')}
					/>
					{errors.password && (
						<ErrorMensageComponent messageError={errors.password.message} />
					)}
				</div>

				<div>
					<Label className='text-small-loomis text-gray-600 py-2'>
						Confirmar senha
					</Label>
					<LoomisPasswordInput
						placeholder='Confirme sua senha'
						disabled={isPending}
						{...register('confirmPassword')}
					/>
					{errors.confirmPassword && (
						<ErrorMensageComponent
							messageError={errors.confirmPassword.message}
						/>
					)}
				</div>

				<LoomisButton className='w-full' type='submit' disabled={isPending}>
					Criar nova senha
				</LoomisButton>
			</form>
		</>
	);
}
