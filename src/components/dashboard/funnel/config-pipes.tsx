import React, { useState } from 'react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from '@/components/ui/popover';
import { X, Info, Trash, ArrowRight } from 'lucide-react';

interface IConfigDialogProps {
	onClose: () => void;
	show: boolean;
}

export default function ConfigColumnsDialog({
	onClose,
	show,
}: IConfigDialogProps) {
	const colourOptions: string[] = [
		'#111b21',
		'#15342c',
		'#194e37',
		'#1d6842',
		'#21814c',
		'#399b61',
		'#64b47f',
		'#90cd9e',
		'#342f25',
		'#5b4122',
		'#8a4e20',
		'#b4561e',
		'#d46026',
		'#e7774c',
		'#f3906f',
	];

	const [selectedColour, setSelectedColour] = useState<string>(
		colourOptions[4],
	);
	const [showColourPicker, setShowColourPicker] = useState(false);
	const [newColumnName, setNewColumnName] = useState('');

	return (
		<Dialog open={show} onOpenChange={onClose} modal={true}>
			<DialogContent className='p-0 max-w-md rounded-2xl overflow-hidden shadow-xl'>
				<div className='flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white'>
					<DialogHeader className='flex flex-col space-y-1'>
						<DialogTitle className='text-lg font-semibold text-gray-800'>
							Configurar colunas
						</DialogTitle>
					</DialogHeader>
					<button
						onClick={onClose}
						aria-label='Fechar'
						className='text-gray-400 hover:text-gray-600 transition-colors'>
						<X className='w-5 h-5' />
					</button>
				</div>

				<div className='px-6 py-4 space-y-4 bg-white'>
					<div className='space-y-1'>
						<h3 className='text-sm font-semibold text-gray-800'>
							Configurar colunas
						</h3>
						<p className='text-sm text-gray-500'>
							Aqui você pode gerenciar cada coluna do kanban atual
						</p>
					</div>

					<div className='flex items-start space-x-2'>
						<Info className='w-4 h-4 text-red-500 flex-shrink-0 mt-0.5' />
						<span className='text-sm text-red-500'>
							Etapas criadas por nossa equipe não podem ser editadas
						</span>
					</div>

					<div className='space-y-3'>
						{['Abordagem', 'Qualificação', 'Follow Up'].map((item) => (
							<div
								key={item}
								className='bg-gray-100 border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-700'>
								{item}
							</div>
						))}
					</div>

					<div className='relative'>
						<div className='flex items-center border border-gray-200 rounded-md bg-white'>
							<Input
								value='Etapa 1'
								onChange={() => {}}
								className='flex-1 bg-transparent border-none focus-visible:ring-0 text-sm px-3 py-2'
							/>
							<Popover
								open={showColourPicker}
								onOpenChange={setShowColourPicker}>
								<PopoverTrigger asChild>
									<button
										className='h-6 w-6 rounded-full m-2 border border-gray-200'
										style={{ backgroundColor: selectedColour }}
										aria-label='Escolher cor'
									/>
								</PopoverTrigger>
								<PopoverContent
									align='start'
									className='p-4 bg-white rounded-md shadow-md border border-gray-100 w-[200px]'>
									<div className='text-sm font-medium text-gray-700 mb-2'>
										Cores disponíveis:
									</div>
									<div className='grid grid-cols-5 gap-2'>
										{colourOptions.map((c) => (
											<button
												key={c}
												onClick={() => {
													setSelectedColour(c);
													setShowColourPicker(false);
												}}
												className={`h-5 w-5 rounded-full focus:outline-none transition-all ${
													selectedColour === c
														? 'ring-2 ring-offset-1 ring-gray-300'
														: ''
												}`}
												style={{ backgroundColor: c }}
												aria-label={`Escolher cor ${c}`}
											/>
										))}
									</div>
								</PopoverContent>
							</Popover>
							<button
								aria-label='Remover etapa'
								className='p-2 text-gray-400 hover:text-red-500 transition-colors'>
								<Trash className='w-4 h-4' />
							</button>
						</div>
					</div>

					<div className='pt-4 border-t border-gray-200 space-y-2'>
						<h3 className='text-sm font-semibold text-gray-800'>Nova coluna</h3>
						<p className='text-sm text-gray-500'>
							Digite o nome de uma nova coluna
						</p>
						<div className='flex items-center border border-gray-200 rounded-md bg-white'>
							<Input
								placeholder='Digite o nome'
								value={newColumnName}
								onChange={(e) => setNewColumnName(e.target.value)}
								className='flex-1 bg-transparent border-none focus-visible:ring-0 text-sm px-3 py-2'
							/>
							<button
								aria-label='Adicionar nova coluna'
								className='p-2 text-gray-400 hover:text-gray-600 transition-colors'>
								<ArrowRight className='w-4 h-4' />
							</button>
						</div>
					</div>
				</div>

				<div className='flex justify-between items-center px-6 py-4 border-t border-gray-200 bg-white'>
					<Button
						variant='ghost'
						onClick={onClose}
						className='border border-green-600 text-green-600 hover:bg-green-50 px-4 py-2 rounded-md font-medium'>
						Cancelar
					</Button>
					<Button
						onClick={() => {}}
						className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium'>
						Salvar alterações
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
