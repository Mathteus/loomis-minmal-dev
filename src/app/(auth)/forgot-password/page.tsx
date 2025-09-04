'use client';

import { useRouter } from 'next/navigation';
import { LoomisInputText } from '@/components/generics/loomis-input-text';
import { Label } from '@/components/ui/label';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoomisButton } from '@/components/generics/loomis-button';
import { useMutation } from '@tanstack/react-query';
import { forgetPassword } from '@/services/auth/forget';
import { toast } from 'sonner';

const UpdateSchema = z.object({
	email: z.email(),
});

type UserUpdate = z.infer<typeof UpdateSchema>;

export default function ForgotPasswordPage() {
	const router = useRouter();
	const { register, handleSubmit, formState } = useForm<UserUpdate>({
		resolver: zodResolver(UpdateSchema),
	});

	const { isPending, mutateAsync } = useMutation({
		mutationKey: ['verify-email'],
		mutationFn: async (formData: UserUpdate) => {
			// eslint-disable-next-line @typescript-eslint/await-thenable
			await forgetPassword(formData);
		},
		onSuccess: () => {
			router.push('/forgot-password/verify-code');
		},
		onError: (err: Error) => {
			toast(err.message);
		},
	});

	const handlerForgetPassword = async (user: UserUpdate) => {
		await mutateAsync(user);
	};

	return (
		<>
			<section className='space-y-2'>
				<h1 className='text-title-loomis mt-6'>Esqueceu sua senha?</h1>
				<p className='text-medium-loomis text-gray-400'>
					Insira seu e-mail e verifique sua caixa de entrada
				</p>
			</section>

			<form
				className='space-y-6'
				onSubmit={handleSubmit(handlerForgetPassword)}>
				<div>
					<Label htmlFor='email' className='text-small-loomis pb-2 pl-1'>
						E-mail
					</Label>
					<LoomisInputText
						id='email'
						type='email'
						placeholder='Digite seu nome'
						disabled={isPending}
						{...register('email')}
					/>
				</div>

				<div>
					<LoomisButton
						type='submit'
						disabled={!formState.isValid || isPending}>
						Recuperar acesso
					</LoomisButton>
				</div>
			</form>
		</>
	);
}
