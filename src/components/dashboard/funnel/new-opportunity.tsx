import { LoomisButton } from '@/components/generics/loomis-button';
import { LoomisInputText } from '@/components/generics/loomis-input-text';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogClose,
	DialogHeader,
	DialogFooter,
} from '@/components/ui/dialog';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { getContacts } from '@/services/dashboard/chat/contacts';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { MoneyMask, toMoney } from '@/utils/utilities';
import { useState } from 'react';

interface INewOpportunityModalProps {
	onClose: () => void;
	show: boolean;
}

export function NewOpportunityModal({
	onClose,
	show,
}: INewOpportunityModalProps) {
	const { data, isLoading } = useQuery({
		queryKey: ['contacts'],
		queryFn: getContacts,
	});

	const Contacts = () => {
		return (
			<>
				{data ? (
					data.map((e) => {
						return (
							<SelectItem className='cursor-pointer' value={e.name}>
								{e.name}
							</SelectItem>
						);
					})
				) : (
					<></>
				)}
			</>
		);
	};

	const SkeletonDialog = () => {
		return (
			<main className='flex flex-col gap-4'>
				<hr className='border-gray-200 my-4' />
				<div>
					<Skeleton className='p-2 pl-0 h-3 w-1/2'></Skeleton>
					<Skeleton className='h-6 w-full'></Skeleton>
					<Skeleton className='my-2 h2 w-1/2'></Skeleton>
				</div>
				<div>
					<Skeleton className='p-2 pl-0 h-3 w-1/2'></Skeleton>
					<Skeleton className='h-6 w-full'></Skeleton>
				</div>
				<div>
					<Skeleton className='p-2 pl-0 h-3 w-1/2'></Skeleton>
					<Skeleton className='h-6 w-full'></Skeleton>
				</div>
				<div>
					<Skeleton className='p-2 pl-0 h-3 w-1/2'></Skeleton>
					<Skeleton className='h-6 w-full'></Skeleton>
				</div>
			</main>
		);
	};

	const BodyDialog = () => {
		const [amount, setAmount] = useState<string>('');

		return (
			<main className='flex flex-col gap-4'>
				<hr className='border-gray-200 my-4' />

				<div>
					<h2 className='text-gray-600 text-small-loomis p-2 pl-0'>Cliente</h2>
					<Select>
						<SelectTrigger className='w-full cursor-pointer'>
							<SelectValue placeholder='Selecione uma opção' />
						</SelectTrigger>
						<SelectContent>
							<Contacts />
						</SelectContent>
					</Select>
					<p className='text-gray-400 my-2 text-details-loomis'>
						Caso não encontre o cliente na lista, crie o contato dele aqui:{' '}
						<button className='underline text-green-loomis cursor-pointer'>
							Criar Contato
						</button>{' '}
					</p>
				</div>
				<div>
					<h2 className='text-gray-600 text-small-loomis p-2 pl-0'>
						Colaborardo Vinculado
					</h2>
					<Select>
						<SelectTrigger className='w-full cursor-pointer'>
							<SelectValue placeholder='Selecione uma opção' />
						</SelectTrigger>
						<SelectContent>
							{/* TODO: Adicionar lista de Colaborardo Vinculado */}
						</SelectContent>
					</Select>
				</div>
				<div>
					<h2 className='text-gray-600 text-small-loomis p-2 pl-0'>Valor</h2>
					<LoomisInputText
						type='text'
						placeholder={toMoney(0)}
						onChange={(e) => setAmount(MoneyMask(e.target.value))}
						value={amount}
					/>
				</div>
				<div>
					<h2 className='text-gray-600 text-small-loomis p-2 pl-0'>Tags</h2>
					<LoomisInputText />
				</div>
			</main>
		);
	};

	return (
		<Dialog onOpenChange={onClose} modal={true} open={show}>
			<DialogContent className='min-w-[30vw]'>
				<DialogHeader>
					<DialogTitle>Nova Oportunidade</DialogTitle>
				</DialogHeader>
				{isLoading ? <SkeletonDialog /> : <BodyDialog />}
				<DialogFooter>
					<DialogClose asChild>
						<Button
							className='bg-transparent text-green-loomis cursor-pointer hover:bg-green-loomis-light hover:text-green-loomis active:scale-90 border-0'
							variant='outline'>
							Cancel
						</Button>
					</DialogClose>
					<LoomisButton className='w-max' type='submit'>
						Adcionar oportunidade
					</LoomisButton>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
