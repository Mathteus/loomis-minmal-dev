import { Calendar, File, Image, Plus } from 'lucide-react';
import { Dropdown } from 'react-chat-elements';
import { useScheduleDialogStore } from '@/contexts/schedule-message-dialog';
import './button-plus-chat.css';

const itemsDropdown = [
	{
		text: 'Fotos e videos',
		icon: {
			float: 'left',
			size: 10,
			color: '#85888E',
			component: <Image />,
		},
	},
	{
		text: 'Documento',
		icon: {
			float: 'left',
			size: 10,
			color: '#85888E',
			component: <File />,
		},
	},
	{
		text: 'Agendar mensagem',
		icon: {
			float: 'left',
			size: 10,
			color: '#85888E',
			component: <Calendar />,
		},
	},
];

export type PlusItem = 'Fotos e videos' | 'Documento' | 'Agendar mensagem';

export function ButtonPlusChat({
	onPick,
}: {
	onPick?: (item: PlusItem) => void;
}) {
	const { setModalSchedule } = useScheduleDialogStore();
	return (
		<Dropdown
			title=''
			animationType='default'
			animationPosition='southeast'
			buttonProps={{
				icon: {
					component: <Plus size={25} />,
				},
			}}
			onSelect={(e: number) => {
				// Index 2 -> "Agendar mensagem"
				const selected = itemsDropdown[e]?.text as PlusItem | undefined;
				if (!selected) return;
				if (selected === 'Agendar mensagem') {
					setModalSchedule(true);
					onPick?.(selected);
				} else {
					onPick?.(selected);
				}
			}}
			items={itemsDropdown}
			style={{
				borderColor: 'linear-gradient(45deg, #ff6b6b, #ee5a24)',
				color: '#85888E',
			}}
		/>
	);
}
