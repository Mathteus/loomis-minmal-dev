'use client';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useFastMessageDialogStore } from '@/contexts/fast-message-dialog';

interface DialogSendFastMessageProps {
	onSend: (text: string) => void;
}

export function DialogSendFastMessage({ onSend }: DialogSendFastMessageProps) {
	const { showModalFastMessage, setModalFastMessage } =
		useFastMessageDialogStore();

	const [selectedId, setSelectedId] = useState<string>('');

	const options = useMemo(
		() => [
			{
				id: 'm1',
				label: 'Bom dia personalizado',
				text: 'Bom dia! Como posso ajudar?',
			},
			{
				id: 'm2',
				label: 'Boa tarde',
				text: 'Boa tarde! Precisa de algo agora?',
			},
			{
				id: 'm3',
				label: 'Agradecimento',
				text: 'Obrigado pelo contato! Fico à disposição.',
			},
		],
		[],
	);

	const handlerShow = (state: boolean) => {
		if (!state) setSelectedId('');
		setModalFastMessage(state);
	};

	const handleSend = () => {
		const found = options.find((o) => o.id === selectedId);
		if (!found) return;
		onSend(found.text);
		setModalFastMessage(false);
		setSelectedId('');
	};

	return (
		<Dialog open={showModalFastMessage} onOpenChange={handlerShow} modal={true}>
			<DialogContent className='w-[520px] max-w-[92vw]'>
				<DialogHeader>
					<DialogTitle>Mensagens rápidas</DialogTitle>
				</DialogHeader>
				<main className='mt-2'>
					<Label className='block mb-2'>Mensagem rápida</Label>
					<Select value={selectedId} onValueChange={setSelectedId}>
						<SelectTrigger className='w-full'>
							<SelectValue placeholder='Escolha uma opção' />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								{options.map((o) => (
									<SelectItem key={o.id} value={o.id}>
										{o.label}
									</SelectItem>
								))}
							</SelectGroup>
						</SelectContent>
					</Select>
				</main>
				<DialogFooter className='text-right'>
					<DialogClose asChild>
						<Button
							type='button'
							variant='secondary'
							className='cursor-pointer active:scale-90'>
							Cancelar
						</Button>
					</DialogClose>
					<Button
						type='button'
						variant='secondary'
						className='cursor-pointer active:scale-90 text-white bg-green-loomis hover:bg-green-loomis-dark'
						onClick={handleSend}
						disabled={!selectedId}>
						Enviar mensagem
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
