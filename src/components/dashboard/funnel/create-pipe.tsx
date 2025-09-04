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
import { useState } from 'react';

export interface ICreatePipeProps {
	onClose: () => void;
	show: boolean;
	onSubmit?: (data: { title: string }) => void;
}

export function CreatePipe({ onClose, show, onSubmit }: ICreatePipeProps) {
	const [pipeName, setPipeName] = useState<string>('');
	
	const handleSubmit = () => {
		if (pipeName.trim() && onSubmit) {
			onSubmit({ title: pipeName.trim() });
			setPipeName('');
		}
	};
	return (
		<Dialog open={show} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Criar Funil</DialogTitle>
				</DialogHeader>
				<main>
					<h1 className='text-gray-600 text-small-loomis p-2 pl-0'>
						Nome do funil
					</h1>
					<LoomisInputText
						value={pipeName}
						onChange={(e) => setPipeName(e.target.value)}
					/>
				</main>
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
						disabled={!pipeName.trim()}
						onClick={handleSubmit}>
						Criar Funil
					</LoomisButton>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
