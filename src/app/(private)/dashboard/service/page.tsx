'use client';
import { useState } from 'react';
import { TabsType } from '@/components/dashboard/services/tab-contacts';
import { SidebarContacts } from '@/components/dashboard/services/sidebar-contacts';
import 'react-chat-elements/dist/main.css';
import { ChatArea } from '@/components/dashboard/services/chat-area';
import { ScheduledMessage } from '@/components/dashboard/services/dialog-scheduled-message';
import { useScheduleDialogStore } from '@/contexts/schedule-message-dialog';
import { useQuery } from '@tanstack/react-query';
import { getContacts } from '@/services/dashboard/chat/contacts';
import { useRequireAuth } from '@/hooks/use-require-auth';

export default function ServicePage() {
	useRequireAuth();
	const [activeTab, setActiveTab] = useState<TabsType>('todos');
	const [selectedContactId, setSelectedContactId] = useState<string | null>(
		null,
	);
	const { showModalSchedule } = useScheduleDialogStore();
	const { data: contacts = [] } = useQuery({
		queryKey: ['contacts'],
		queryFn: getContacts,
	});
	const contactName = contacts.find((c) => c.id === selectedContactId)?.name;

	return (
		<div className='flex flex-1'>
			<SidebarContacts
				activeTab={activeTab}
				setActiveTab={setActiveTab}
				selectedContactId={selectedContactId}
				onSelectContact={setSelectedContactId}
			/>
			<ChatArea selectedContactId={selectedContactId} />
			{showModalSchedule && selectedContactId && (
				<ScheduledMessage
					contactName={contactName}
					contactId={selectedContactId}
				/>
			)}
		</div>
	);
}
