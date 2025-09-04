'use client';
import { CodeInput } from '@/components/generics/code-input';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { LoomisButton } from '@/components/generics/loomis-button';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { verifyCode } from '@/services/auth/code';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';

export default function VerifyPasswordCodePage() {
	const [code, setCode] = useState<string[]>(Array(6).fill(''));
	const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
	const router = useRouter();

	const { handleSubmit } = useForm();

	const { isPending, mutateAsync } = useMutation({
		mutationKey: ['verify-email'],
		mutationFn: async (recoveryCode: string) => {
			// eslint-disable-next-line @typescript-eslint/await-thenable
			await verifyCode(recoveryCode);
		},
		onSuccess: () => {
			router.push('/forgot-password/new-password');
		},
		onError: (err: Error) => {
			toast(err.message);
		},
	});

	const handleClear = () => {
		setCode(['', '', '', '', '', '']);
		inputsRef.current[0]?.focus();
	};

	const handlerCheckCode = async () => {
		await mutateAsync(code.join(''));
	};

	const toDisabledButton = code.some((v) => v === '');

	return (
		<form
			onSubmit={handleSubmit(handlerCheckCode)}
			className='space-y-2 flex flex-col gap-2'>
			<div className='space-y-2'>
				<h1 className='text-4xl font-bold text-gray-700 font-inter mt-6'>
					Digite o código
				</h1>
				<p className='text-base font-medium text-gray-400 leading-6 font-inter'>
					Insira o código que foi enviado no seu e-mail para alterar sua senha.
				</p>
			</div>
			<div>
				<CodeInput code={code} setCode={setCode} />
			</div>

			<div className='text-sm text-gray-400 flex gap-2'>
				<p>Não recebeu um código? </p>
				<button
					type='button'
					className='text-green-loomis-dark cursor-pointer text-small-loomis'
					disabled={isPending}>
					Enviar novo código
				</button>
			</div>

			<div className='flex justify-between gap-2'>
				<Button
					onClick={handleClear}
					variant='outline'
					disabled={isPending}
					className='text-base text-semibold text-gray-700 hover:underline cursor-pointer'>
					Limpar
				</Button>

				<LoomisButton
					type='submit'
					disabled={toDisabledButton || isPending}
					className='max-w-[80%]'>
					Recuperar acesso
				</LoomisButton>
			</div>
		</form>
	);
}
