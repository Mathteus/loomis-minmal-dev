import { useState } from 'react';
import { Filter, MoreVertical, PlusIcon, Search } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { TabContacts, TabsType } from './tab-contacts';
import { Contact } from './contacts';
import { getContacts } from '@/services/dashboard/chat/contacts';
import { markMessagesAsRead } from '@/services/dashboard/chat/messages';
import { Skeleton } from '@/components/ui/skeleton';

export interface ISidebarContactsProps {
	activeTab: TabsType;
	setActiveTab: (tab: TabsType) => void;
	selectedContactId: string | null;
	onSelectContact: (id: string) => void;
}

export function SidebarContacts({
	activeTab,
	setActiveTab,
	selectedContactId,
	onSelectContact,
}: ISidebarContactsProps) {
	const [searchTerm, setSearchTerm] = useState('');
	const queryClient = useQueryClient();

	const {
		data: contacts = [],
		isLoading,
		isError,
	} = useQuery<Contact[]>({
		queryKey: ['contacts'],
		queryFn: getContacts,
	});

	const filteredContacts = contacts.filter((contact) => {
		const matchesTab =
			activeTab === 'todos' ? true : contact.unreadMessages > 0;
		const matchesSearch = contact.name
			.toLowerCase()
			.includes(searchTerm.toLowerCase());
		return matchesTab && matchesSearch;
	});

	const handleSelectContact = (id: string) => {
		markMessagesAsRead(id);

		queryClient.setQueryData<Contact[]>(['contacts'], (oldContacts) => {
			if (!oldContacts) return oldContacts;

			return oldContacts.map((contact) =>
				contact.id === id ? { ...contact, unreadMessages: 0 } : contact,
			);
		});

		onSelectContact(id);
	};

	if (isLoading) {
		return (
			<aside className='w-80 bg-white border-r border-gray-200 flex flex-col'>
				<div className='p-6 border-b border-gray-200'>
					<div className='flex items-center justify-between mb-4'>
						<Skeleton className='h-6 w-32 bg-gray-300' />
						<div className='flex items-center gap-2'>
							<Skeleton className='h-8 w-8 rounded-full bg-gray-300' />
							<Skeleton className='h-8 w-8 rounded-full bg-gray-300' />
						</div>
					</div>
					<section className='relative mb-4'>
						<Skeleton className='h-10 w-full bg-gray-300 rounded-lg' />
					</section>
					<div className='flex gap-2 my-2'>
						<Skeleton className='h-7 w-20 rounded-full bg-gray-300' />
						<Skeleton className='h-7 w-24 rounded-full bg-gray-300' />
					</div>
				</div>
				<div className='p-4 space-y-4'>
					{Array.from({ length: 5 }).map((_, i) => (
						<div key={i} className='flex items-center gap-4'>
							<Skeleton className='h-12 w-12 rounded-full bg-gray-300' />
							<div className='flex-1 space-y-2'>
								<Skeleton className='h-4 w-3/4 bg-gray-300' />
								<Skeleton className='h-4 w-1/2 bg-gray-300' />
							</div>
						</div>
					))}
				</div>
			</aside>
		);
	}

	if (isError) {
		return (
			<aside className='w-80 bg-white border-r border-gray-200 flex flex-col'>
				<div className='p-6 text-red-500'>Erro ao carregar contatos.</div>
			</aside>
		);
	}

	return (
		<aside className='w-80 bg-white border-r border-gray-200 flex flex-col'>
			<div className='p-6 border-b border-gray-200'>
				<div className='flex items-center justify-between mb-4'>
					<h1 className='text-2xl font-bold text-gray-900'>Atendimentos</h1>
					<div className='flex items-center gap-2'>
						<button className='p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full'>
							<PlusIcon size={20} />
						</button>
						<button className='p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full'>
							<MoreVertical size={20} />
						</button>
					</div>
				</div>

				<section className='relative mb-4'>
					<Search
						className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer'
						size={16}
					/>
					<input
						type='text'
						placeholder='Pesquise'
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className='w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
					/>
					<button className='absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded'>
						<Filter size={16} />
					</button>
				</section>
			</div>
			<TabContacts
				activeTab={activeTab}
				setActiveTab={(tab: TabsType) => setActiveTab(tab)}
				contacts={filteredContacts}
				selectedContactId={selectedContactId}
				onSelectContact={handleSelectContact}
			/>
		</aside>
	);
}
