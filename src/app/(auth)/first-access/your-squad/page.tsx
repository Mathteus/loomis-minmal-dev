'use client';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { SuccessModal } from '@/components/auth/success-modal';
import StepIndicator from '@/components/auth/step-indicator';
import { LoomisInputText } from '@/components/generics/loomis-input-text';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { LoomisButton } from '@/components/generics/loomis-button';
import { CirclePlus, X } from 'lucide-react';
import { toValidateEmail } from '@/utils/utilities';
import { toast } from 'sonner';
import { IAccountSignup, registerAccount } from '@/services/auth/signup';
import { useAuthStore } from '@/contexts/first-access';
import { CompanyType } from '../about-company/page';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const steps = [
	{ label: 'Seus dados', active: false, completed: true },
	{ label: 'Sobre a empresa', active: false, completed: true },
	{ label: 'Sua equipe', active: true, completed: false },
];

const schemaInvites = z.object({
	email: z.email('Digite um email válido!').optional(),
	inviteEmails: z.array(z.email('Digite um email válido!')).optional(),
	isSubmit: z.boolean().optional(),
});

type inivteType = z.infer<typeof schemaInvites>;

export default function YourSquadPage() {
	const router = useRouter();
	const [showModal, setShowModal] = useState(false);
	const { company, user } = useAuthStore();
	const { register, watch, resetField, setValue } = useForm<inivteType>({
		resolver: zodResolver(schemaInvites),
		defaultValues: {
			inviteEmails: [],
		},
	});
	const invites = watch('inviteEmails') ?? [];
	const isSubmit = watch('isSubmit') ?? false;
	const { isPending, mutateAsync } = useMutation({
		mutationFn: async (newAccount: IAccountSignup) => {
			// eslint-disable-next-line @typescript-eslint/await-thenable
			await registerAccount(newAccount);
		},
		onError: (err) => {
			toast(err.message);
		},
		onSuccess: () => {
			setShowModal(true);
		},
	});

	useEffect(() => {
		const isDontHasUserOrCompany =
			user === null ||
			user === undefined ||
			company === null ||
			company === undefined;
		if (isDontHasUserOrCompany) {
			router.push('/first-access');
		}
	}, []);

	const handlerYourSquad = async (formData: inivteType) => {
		const databody: IAccountSignup = {
			username: String(user?.username),
			password: String(user?.password),
			email: String(user?.email),
			company: company as CompanyType,
		};

		if (formData.isSubmit) {
			databody.invites = formData.inviteEmails;
			await mutateAsync(databody);
		}

		await mutateAsync(databody);
	};

	const addEmail = () => {
		const currentEmail = String(watch('email'));
		const isInvalidEmail = !toValidateEmail(currentEmail);
		if (isInvalidEmail) {
			toast('Digite email válidos para enviar convite!');
		}

		const ifInviteIsEqualsMyEmail = currentEmail === String(user?.email);
		if (ifInviteIsEqualsMyEmail) {
			return toast('Você não pode enviar convite para si mesmo!');
		}

		const include = invites.includes(currentEmail);
		if (include) {
			return toast('Email já está na lista para ser enviado!', {
				style: {
					fontWeight: 700,
					fontSize: '1rem',
				},
			});
		}

		const allEmails = [...invites, currentEmail];
		setValue('inviteEmails', allEmails);
		resetField('email');
	};

	const removeEmail = (emailInvite: string) => {
		const aotherEmail = invites.filter((e) => e !== emailInvite);
		setValue('inviteEmails', aotherEmail);
	};

	interface IEmailComponent {
		email: string;
	}
	const EmailsComponent = ({ email }: IEmailComponent) => {
		return (
			<div className='flex justify-between items-center'>
				{email}
				<Button className='bg-trasparent text-green-loomis-dark hover:bg-green-loomis-light cursor-pointer'>
					<X className='size-4' onClick={() => removeEmail(email)} />
				</Button>
			</div>
		);
	};

	const toShip = async () => {
		await handlerYourSquad({
			isSubmit: isSubmit,
			email: '',
			inviteEmails: invites,
		});
	};

	const toSubmit = async () => {
		if (!invites.length) {
			toast('Necessário colocar email para enviar convite!');
		}
		setValue('isSubmit', true);
		await handlerYourSquad({
			isSubmit: isSubmit,
			email: '',
			inviteEmails: invites,
		});
	};

	return (
		<>
			{showModal && (
				<SuccessModal type='REGISTER' onClose={() => setShowModal(false)} />
			)}
			<div className='flex items-center gap-2'>
				<StepIndicator steps={steps} />
			</div>

			<div className='space-y-2'>
				<h1 className='text-title-loomis'>Sua equipe</h1>
				<p className='text-medium text-gray-400'>
					Convide os membros da sua equipe para colaborarem com você
				</p>
			</div>

			<form className='space-y-4'>
				<div>
					<Label
						htmlFor='email'
						className='text-small-loomis text-gray-600 mb-2 ml-1'>
						Convidar pessoal
					</Label>
					<LoomisInputText
						id='email'
						placeholder='Digite o nome da pessoa'
						disabled={isPending}
						{...register('email')}
					/>

					<Button
						type='button'
						className='bg-green-loomis-light text-green-loomis-dark mt-2 hover:bg-green-loomis-light cursor-pointer active:scale-95'
						disabled={isPending}
						onClick={addEmail}>
						<CirclePlus className='size-4' /> Adicionar novo e-mail
					</Button>
				</div>

				<div className='flex justify-between gap-4 pt-2'>
					<LoomisButton
						className='bg-green-loomis-light text-green-loomis-dark w-1/2'
						type='button'
						onClick={toShip}
						disabled={isPending}>
						Pular
					</LoomisButton>

					<LoomisButton
						className='w-1/2'
						type='submit'
						onClick={toSubmit}
						disabled={isPending}>
						Criar conta
					</LoomisButton>
				</div>

				<div>
					{invites.length > 0 && (
						<div>
							<p className='text-medium-loomis text-green-loomis-dark my-2'>
								Convites que serão enviados
							</p>
							{invites.map((e: string, i: number) => {
								return <EmailsComponent email={e} key={String(e + i)} />;
							})}
						</div>
					)}
				</div>
			</form>
		</>
	);
}
