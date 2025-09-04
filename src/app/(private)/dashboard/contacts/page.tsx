'use client';
import { useState } from 'react';
import {
	Search,
	Filter,
	Plus,
	MoreVertical,
	Grid3X3,
	Grid2X2,
	User,
	Mail,
	Phone,
	Building,
	Tag,
	Users,
} from 'lucide-react';

export default function ContactsPage() {
	const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

	return (
		<main className='flex-1 p-6'>
			{/* Header */}
			<div className='mb-6'>
				<h1 className='text-2xl font-bold text-gray-900'>Contatos</h1>
			</div>

			{/* Barra de Controles */}
			<div className='flex items-center justify-between mb-6'>
				<div className='flex items-center gap-4'>
					{/* Barra de Pesquisa */}
					<div className='relative'>
						<Search
							className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
							size={16}
						/>
						<input
							type='text'
							placeholder='Pesquisar contato'
							className='pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
						/>
					</div>

					{/* Botões de Visualização */}
					<div className='flex items-center gap-1'>
						<button
							onClick={() => setViewMode('grid')}
							className={`p-2 rounded-lg transition-colors ${
								viewMode === 'grid'
									? 'bg-green-100 text-green-700'
									: 'bg-white text-gray-500 hover:bg-gray-50'
							}`}>
							<Grid3X3 size={16} />
						</button>
						<button
							onClick={() => setViewMode('list')}
							className={`p-2 rounded-lg transition-colors ${
								viewMode === 'list'
									? 'bg-green-100 text-green-700'
									: 'bg-white text-gray-500 hover:bg-gray-50'
							}`}>
							<Grid2X2 size={16} />
						</button>
					</div>

					{/* Botão Filtros */}
					<button className='flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors'>
						<Filter size={16} />
						Filtros
					</button>
				</div>

				<div className='flex items-center gap-2'>
					{/* Botão Novo Contato */}
					<button className='flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors'>
						<Plus size={16} />
						Novo contato
					</button>

					{/* Botão Mais Opções */}
					<button className='p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg'>
						<MoreVertical size={16} />
					</button>
				</div>
			</div>

			{/* Tabela de Contatos */}
			<div className='bg-white rounded-lg shadow-sm border border-gray-200'>
				{/* Header da Tabela */}
				<div className='bg-green-50 px-6 py-3 border-b border-gray-200'>
					<div className='grid grid-cols-6 gap-4 items-center'>
						<div className='flex items-center gap-2'>
							<input
								type='checkbox'
								disabled
								className='rounded border-gray-300 text-green-600 focus:ring-green-500'
							/>
						</div>
						<div className='flex items-center gap-2 text-sm font-medium text-gray-700'>
							<User size={16} />
							Contato
						</div>
						<div className='flex items-center gap-2 text-sm font-medium text-gray-700'>
							<Mail size={16} />
							E-mail
						</div>
						<div className='flex items-center gap-2 text-sm font-medium text-gray-700'>
							<Phone size={16} />
							Telefone
						</div>
						<div className='flex items-center gap-2 text-sm font-medium text-gray-700'>
							<Building size={16} />
							Empresa
						</div>
						<div className='flex items-center gap-2 text-sm font-medium text-gray-700'>
							<Tag size={16} />
							Tags
						</div>
					</div>
				</div>

				{/* Estado Vazio */}
				<div className='flex flex-col items-center justify-center py-16'>
					<div className='w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-4'>
						<Users size={48} className='text-green-600' />
					</div>
					<h3 className='text-lg font-bold text-gray-900 mb-2'>
						Nenhum contato adicionado
					</h3>
					<p className='text-sm text-gray-500 text-center'>
						Clique em &apos;Novo contato&apos; acima para começar a gerenciar
					</p>
				</div>
			</div>
		</main>
	);
}
