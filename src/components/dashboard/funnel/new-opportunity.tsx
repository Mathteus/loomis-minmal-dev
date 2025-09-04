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

import { PipeItem } from './pipe';

interface INewOpportunityModalProps {
	onClose: () => void;
	show: boolean;
	onSubmit?: (data: Omit<PipeItem, 'id'>) => void;
}

export function NewOpportunityModal({
	onClose,
	show,
	onSubmit,
}: INewOpportunityModalProps) {
	const [formData, setFormData] = useState({
		username: '',
		phone: '',
		amount: '',
		message: '',
		tags: ['Novo Lead'],
	});

	const handleSubmit = () => {
		if (formData.username && formData.phone && formData.amount && onSubmit) {
			onSubmit({
				username: formData.username,
				phone: formData.phone,
				amount: formData.amount,
				message: formData.message || 'Nova oportunidade criada',
				tags: formData.tags,
			});
			setFormData({
				username: '',
				phone: '',
				amount: '',
				message: '',
				tags: ['Novo Lead'],
			});
		}
	};
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
		return (
			<main className='flex flex-col gap-4'>
				<hr className='border-gray-200 my-4' />

				<div>
					<h2 className='text-gray-600 text-small-loomis p-2 pl-0'>Cliente</h2>
					<Select
						onValueChange={(value) => {
							// Find the contact by name and set both username and phone
							const contact = data?.find((contact) => contact.name === value);
							setFormData((prev) => ({
								...prev,
								username: value,
								phone: contact?.phone || '',
							}));
						}}>
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
						Colaborador Vinculado
					</h2>
					<Select>
						<SelectTrigger className='w-full cursor-pointer'>
							<SelectValue placeholder='Selecione uma opção' />
						</SelectTrigger>
						<SelectContent>
							{/* TODO: Adicionar lista de Colaborador Vinculado */}
						</SelectContent>
					</Select>
				</div>
				<div>
					<h2 className='text-gray-600 text-small-loomis p-2 pl-0'>Valor</h2>
					<LoomisInputText
						type='text'
						placeholder={toMoney(0)}
						onChange={(e) => {
							const value = MoneyMask(e.target.value);
							setFormData((prev) => ({ ...prev, amount: value }));
						}}
						value={formData.amount}
					/>
				</div>
				<div>
					<h2 className='text-gray-600 text-small-loomis p-2 pl-0'>Tags</h2>
					<LoomisInputText
						placeholder='Digite as tags separadas por vírgula'
						onChange={(e) =>
							setFormData((prev) => ({
								...prev,
								tags: e.target.value
									.split(',')
									.map((tag) => tag.trim())
									.filter(Boolean),
							}))
						}
					/>
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
					<LoomisButton
						className='w-max'
						type='submit'
						disabled={!formData.username || !formData.amount}
						onClick={handleSubmit}>
						Adicionar oportunidade
					</LoomisButton>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
