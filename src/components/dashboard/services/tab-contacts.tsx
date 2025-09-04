import { Contact, Contacts } from './contacts';

export type TabsType = 'todos' | 'nao-lidos';
export interface ITabContactsProps {
	activeTab: TabsType;
	setActiveTab: (tab: TabsType) => void;
	contacts: Contact[];
	selectedContactId: string | null;
	onSelectContact: (id: string) => void;
}

const tabActiveStyle =
	'text-green-loomis bg-[#238E521A] py-2 px-4 rounded-full text-small-loomis transition-colors';
const tabInactiveStyle =
	'text-gray-loomis-300 bg-[#FAFAFA] py-2 px-4 rounded-full text-small-loomis transition-colors';

export function TabContacts({
	activeTab,
	setActiveTab,
	contacts,
	selectedContactId,
	onSelectContact,
}: ITabContactsProps) {
	return (
		<>
			<div className='flex gap-2 my-2 text-center mx-2'>
				<button
					onClick={() => setActiveTab('todos')}
					className={activeTab === 'todos' ? tabActiveStyle : tabInactiveStyle}>
					Todos
				</button>
				<button
					onClick={() => setActiveTab('nao-lidos')}
					className={
						activeTab === 'nao-lidos' ? tabActiveStyle : tabInactiveStyle
					}>
					Não lidos
				</button>
			</div>
			{contacts.length === 0 ? (
				<p className='text-center text-sm text-gray-500 mt-4'>
					Nenhum contato encontrado.
				</p>
			) : (
				<Contacts
					contacts={contacts}
					selectedContactId={selectedContactId}
					onSelectContact={onSelectContact}
				/>
			)}
		</>
	);
}
