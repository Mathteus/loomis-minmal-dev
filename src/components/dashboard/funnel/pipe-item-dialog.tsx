import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface IPipeItemDialogProps {
	onClose: () => void;
	show: boolean;
}

export default function PipeItemDialog({
	onClose,
	show,
}: IPipeItemDialogProps) {
	return (
		<Dialog open={show} onOpenChange={onClose}>
			<DialogContent className='p-0 min-w-4xl rounded-2xl overflow-hidden shadow-xl'>
				<div className='flex items-center justify-between px-6 py-4'>
					<h2 className='text-white text-lg font-semibold'>
						Nova oportunidade
					</h2>
					<button
						onClick={onClose}
						aria-label='Fechar'
						className='text-gray-400 hover:text-gray-200 transition-colors'>
						<X className='w-5 h-5' />
					</button>
				</div>
				<div className='bg-white grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-gray-200'>
					<div className='md:col-span-4 p-6 space-y-6'>
						<div className='border border-gray-200 rounded-xl overflow-hidden'>
							<div className='flex flex-col items-center p-6 space-y-4'>
								<Avatar className='h-16 w-16'>
									<AvatarImage src='' alt='Amanda Neves' />
									<AvatarFallback>AN</AvatarFallback>
								</Avatar>
								<div className='text-center'>
									<h4 className='text-base font-semibold text-gray-800'>
										Amanda Neves
									</h4>
									<p className='text-sm text-gray-500'>
										amanda.neves@gmail.com
									</p>
								</div>
							</div>
							<div className='border-t border-gray-100 px-6 py-4'>
								<div className='flex justify-between items-center mb-2'>
									<span className='text-sm font-medium text-gray-700'>
										Última mensagem
									</span>
									<Button
										variant='link'
										className='text-green-600 hover:text-green-700 p-0 h-auto text-sm'>
										Abrir chat
									</Button>
								</div>
								<p className='text-sm text-gray-500 truncate'>
									Olá! Aqui é o Henrique. Gostaria de entender mais...
								</p>
							</div>
						</div>
						<div className='space-y-3'>
							<div className='flex justify-between items-center'>
								<span className='text-sm font-medium text-gray-700'>
									Tarefas
								</span>
								<span className='text-xs text-gray-400 font-medium'>02</span>
							</div>
							<div className='border border-gray-200 rounded-xl p-4 space-y-3'>
								<p className='text-sm text-gray-500 truncate'>
									Lorem ipsum dolor sit amet, consectetur adipiscing elit…
								</p>
								<div className='flex justify-between items-center'>
									<div className='flex items-center space-x-2'>
										<Avatar className='h-6 w-6'>
											<AvatarImage src='' alt='Alessandra Ribeiro' />
											<AvatarFallback>AR</AvatarFallback>
										</Avatar>
										<span className='text-xs text-gray-700'>
											Alessandra Ribeiro
										</span>
									</div>
									<span className='text-xs text-gray-500'>Hoje, 15:00</span>
								</div>
							</div>
						</div>
					</div>
					<div className='md:col-span-8 p-6 space-y-8'>
						<div className='space-y-4'>
							<h3 className='text-base font-semibold text-gray-800'>
								Sobre o cliente
							</h3>
							<div className='grid grid-cols-3 gap-y-3 text-sm'>
								<span className='text-gray-500'>Nome</span>
								<span className='col-span-2 text-gray-700'>Amanda Neves</span>

								<span className='text-gray-500'>E-mail</span>
								<span className='col-span-2 text-gray-700'>
									amanda.neves@gmail.com
								</span>

								<span className='text-gray-500'>Telefone</span>
								<span className='col-span-2 text-gray-700'>
									(11) 99999-9999
								</span>

								<span className='text-gray-500'>Segmento</span>
								<span className='col-span-2 text-gray-700'>
									Segmento da empresa
								</span>

								<span className='text-gray-500'>Empresa</span>
								<span className='col-span-2 text-gray-700'>
									Nome da empresa
								</span>

								<span className='text-gray-500'>Colaborador vinculado</span>
								<span className='col-span-2'>
									<Badge
										style={{ backgroundColor: '#90cd9e', color: '#083b26' }}
										className='px-2 py-0.5 text-[0.75rem] font-medium rounded-full'>
										Laura Souza
									</Badge>
								</span>

								<span className='text-gray-500'>Etiquetas</span>
								<span className='col-span-2'>
									<div className='flex flex-wrap gap-2'>
										<Badge
											style={{ backgroundColor: '#f9d4c3', color: '#d25c35' }}
											className='px-2 py-0.5 text-[0.75rem] font-medium rounded-full'>
											Lead qualificado
										</Badge>
										<Badge
											style={{ backgroundColor: '#e5e5e5', color: '#5f6368' }}
											className='px-2 py-0.5 text-[0.75rem] font-medium rounded-full'>
											Serviço A
										</Badge>
										<Badge
											style={{ backgroundColor: '#cde9d6', color: '#256d3f' }}
											className='px-2 py-0.5 text-[0.75rem] font-medium rounded-full'>
											Vendido
										</Badge>
									</div>
								</span>
							</div>
						</div>
						<div className='space-y-4'>
							<h3 className='text-base font-semibold text-gray-800'>
								Sobre a oportunidade
							</h3>
							<div className='grid grid-cols-3 gap-y-3 text-sm'>
								<span className='text-gray-500'>Etapa</span>
								<span className='col-span-2 text-gray-700'>Em aberto</span>

								<span className='text-gray-500'>Valor</span>
								<span className='col-span-2 text-gray-700'>R$ 4.000,00</span>

								<span className='text-gray-500'>Meio de contato</span>
								<span className='col-span-2 text-gray-700'>Whatsapp</span>
							</div>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
