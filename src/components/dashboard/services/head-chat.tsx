import { useProfileChatStore } from '@/contexts/open-profile-chat';
import { PhoneCall, Search, MoreVertical, X } from 'lucide-react';
import { Avatar } from 'react-chat-elements';
import { useState } from 'react';

export interface IHeadChatProps {
	name: string;
	avatar: string;
	searchTerm: string;
	setSearchTerm: (value: string) => void;
}

export function HeadChat({
	name,
	avatar,
	searchTerm,
	setSearchTerm,
}: IHeadChatProps) {
	const { setProfileShow } = useProfileChatStore();
	const [showSearch, setShowSearch] = useState(false);

	const openProfile = () => {
		setProfileShow(true);
	};

	return (
		<div className='flex items-center justify-between p-4 border-b border-gray-200 bg-white w-full'>
			<div className='flex items-center gap-3'>
				<Avatar src={avatar} alt='avatar' size='xlarge' type='circle' />
				<span className='font-bold text-gray-900'>{name}</span>
			</div>
			<div className='flex items-center gap-2'>
				<div className='border border-green-loomis rounded-lg p-2'>
					<button className='py-1 px-2 text-green-loomis cursor-pointer active:scale-110'>
						<PhoneCall size={18} />
					</button>
				</div>
				{showSearch ? (
					<div className='border border-green-loomis rounded-lg p-2'>
						<div className='flex items-center px-2 py-1'>
							<Search size={18} className='text-green-loomis' />
							<input
								className='ml-2 flex-1 text-sm focus:outline-none'
								placeholder='Pesquise'
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
							<button
								className='ml-2'
								onClick={() => {
									setSearchTerm('');
									setShowSearch(false);
								}}>
								<X size={18} className='text-gray-500' />
							</button>
						</div>
					</div>
				) : (
					<div className='border border-green-loomis rounded-lg p-2'>
						<button
							className='py-1 px-2 text-green-loomis cursor-pointer active:scale-110'
							onClick={() => setShowSearch(true)}>
							<Search size={18} />
						</button>
					</div>
				)}
				<div>
					<button
						className='p-2 cursor-pointer active:scale-110'
						onClick={openProfile}>
						<MoreVertical size={25} />
					</button>
				</div>
			</div>
		</div>
	);
}
