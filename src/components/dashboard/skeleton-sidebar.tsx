'use client';
import Image from 'next/image';
import styles from './sidebar.module.css';
import { Skeleton } from '../ui/skeleton';
import { randomString } from '@/utils/utilities';

const menuItems = {
	geral: [1, 2, 3, 4, 5, 6, 7, 8, 9],
	gerenciamento: [1, 2, 3],
} as const;

export function SkeletonSidebar() {
	const HeaderSidebar = () => {
		return (
			<section className='flex items-center justify-between p-4 border-b border-gray-loomis-100 relative'>
				<div className='flex items-center transition-all duration-300 space-x-3'>
					<div>
						<Image
							src='/short-logo.svg'
							width={45}
							height={45}
							alt='Logo da empresa'
						/>
					</div>
					<span className='text-lg font-semibold text-gray-800 transition-all duration-450 opacity-100'>
						Loomis
					</span>
				</div>
			</section>
		);
	};

	interface IGrouItemProps {
		nameGroup: string;
	}

	const GroupItem = ({ nameGroup }: IGrouItemProps) => {
		const listItems = menuItems[nameGroup as keyof typeof menuItems];
		return (
			<>
				<div className='p-3 text-gray-loomis-500 leading-[20px] capitalize mb-1 text-left pl-0'>
					<Skeleton className='h-6 w-[55%] bg-gray-300' />
				</div>
				{listItems.map(() => {
					return (
						<div key={randomString(3) + '-area'}>
							<Skeleton className='h-8 w-[96%] bg-gray-300' />
						</div>
					);
				})}
			</>
		);
	};

	const MenuItems = () => {
		return (
			<section
				className={`p-4 space-y-2 overflow-y-auto ${styles.HideScroolBar}`}>
				{Object.keys(menuItems).map((group: string) => {
					return <GroupItem key={group} nameGroup={group} />;
				})}
			</section>
		);
	};

	return (
		<aside className='bg-white flex flex-col min-h-screen transition-all duration-300 ease-in-out relative w-64 md:w-80'>
			<HeaderSidebar />
			<MenuItems />
		</aside>
	);
}
