'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ForwardRefExoticComponent, RefAttributes, useState } from 'react';
import styles from './sidebar.module.css';
import {
	Home,
	MessageCircle,
	Send,
	MessageSquareMore,
	Bot,
	Headphones,
	Wrench,
	Settings,
	LogOut,
	ChevronLeft,
	ChevronRight,
	Contact,
	SquareKanban,
	ListTodo,
	LucideProps,
	Menu,
} from 'lucide-react';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { deleteSession } from '@/utils/utilities';
import { useRouter } from 'next/navigation';
import { SkeletonSidebar } from './skeleton-sidebar';
import { useSidebarLoadingStore } from '@/contexts/sidebar-loading';
import { useSidebarStore } from '@/contexts/sidebar-state';
import { useIsMobile } from '@/hooks/use-mobile';

export function DashboardSidebar() {
	const { activeSkeletonSidebar } = useSidebarLoadingStore();
	const router = useRouter();
	const isMobile = useIsMobile();
	const menuItems = {
		geral: [
			{ icon: Home, label: 'Início', href: '/dashboard', action: () => {} },
			{
				icon: MessageCircle,
				label: 'Atendimentos',
				href: '/dashboard/service',
				action: () => {},
			},
			{
				icon: Contact,
				label: 'Contatos',
				href: '/dashboard/contacts',
				action: () => {},
			},
			{
				icon: SquareKanban,
				label: 'Funil de vendas',
				href: '/dashboard/funnel',
				action: () => {},
			},
			{
				icon: Send,
				label: 'Mensagens em massa',
				href: '/dashboard/mass-message',
				action: () => {},
			},
			{
				icon: MessageSquareMore,
				label: 'Mensagens rápidas',
				href: '/dashboard/fast-message',
				action: () => {},
			},
			{
				icon: ListTodo,
				label: 'Tarefas',
				href: '/dashboard/task',
				action: () => {},
			},
			{
				icon: Headphones,
				label: 'Agentes',
				href: '/dashboard/agents',
				action: () => {},
			},
			{
				icon: Bot,
				label: 'Automatização',
				href: '/dashboard/automation',
				action: () => {},
			},
		],
		gerenciamento: [
			{
				icon: Wrench,
				label: 'Integrações',
				href: '/dashboard/integrations',
				action: () => {},
			},
			{
				icon: Settings,
				label: 'Configurações',
				href: '/dashboard/settings',
				action: () => {},
			},
			{
				icon: LogOut,
				label: 'Sair',
				href: '#',
				action: () => {
					deleteSession();
					router.push('/login');
				},
			},
		],
	} as const;
	const groupsName: Array<string> = Object.keys(menuItems);
	const pathname = usePathname();
	const { isCollapsed, toggle } = useSidebarStore();
	const [isMobileOpen, setIsMobileOpen] = useState(false);
	const toggleMobileSidebar = () => {
		setIsMobileOpen(!isMobileOpen);
	};
	const HeaderSidebar = () => {
		return (
			<section className='flex items-center justify-between p-4 border-b border-gray-loomis-100 relative'>
				<div
					className={`flex items-center transition-all duration-300 ${
						isCollapsed ? 'm-auto' : 'space-x-3'
					}`}>
					<div>
						<Image
							src='/short-logo.svg'
							width={45}
							height={45}
							alt='Logo da empresa'
						/>
					</div>
					<span
						className={`text-lg font-semibold text-gray-800 transition-all duration-450 ${
							isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
						}`}>
						Loomis
					</span>
				</div>

				{!isMobile && (
					<button
						onClick={toggle}
						aria-expanded={!isCollapsed}
						className={`size-8 p-2 scale-110 rounded-full transition-all duration-200 flex-shrink-0 absolute cursor-pointer bg-[#FAFAFA] border hover:border-green-loomis ${
							isCollapsed ? 'left-[82%]' : 'left-[93%]'
						}`}>
						{isCollapsed ? (
							<ChevronRight size={16} className='text-gray-700' />
						) : (
							<ChevronLeft size={16} className='text-gray-700' />
						)}
					</button>
				)}
			</section>
		);
	};

	interface ILinkItem {
		href: string;
		children: React.ReactElement;
		label: string;
		isActive: boolean;
		action: () => void;
	}

	const LinkItem = ({ href, children, label, isActive, action }: ILinkItem) => {
		return (
			<Link
				key={label}
				href={href}
				onClick={action}
				className={`flex items-center p-3 rounded-lg text-sm transition-all duration-200 relative ${
					isCollapsed ? 'justify-center' : 'space-x-3'
				} ${
					isActive
						? `bg-green-50 border-solid border-green-loomis text-green-loomis`
						: `text-gray-loomis-300 hover:text-gray-loomis-700 hover:bg-gray-loomis-50 hover:scale-105`
				}`}
				title={isCollapsed ? label : undefined}>
				{children}
			</Link>
		);
	};

	interface IItemSidebarProps {
		isActive: boolean;
		label: string;
		href: string;
		action: () => void;
		Icon: ForwardRefExoticComponent<
			Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
		>;
		isCollapsed: boolean;
	}

	const ItemSidebar = ({
		isActive,
		Icon,
		label,
		href,
		action,
		isCollapsed,
	}: IItemSidebarProps) => {
		return (
			<LinkItem
				action={action}
				key={label}
				href={href}
				isActive={isActive}
				label={label}>
				{isCollapsed ? (
					<Tooltip>
						<TooltipTrigger>
							<Icon
								size={20}
								className={`flex-shrink-0 cursor-pointer ${
									isActive ? 'text-green-loomis' : 'text-gray-loomis-300'
								}`}
							/>
						</TooltipTrigger>
						<TooltipContent>
							<p>{label}</p>
						</TooltipContent>
					</Tooltip>
				) : (
					<div className='flex gap-3'>
						<Icon
							size={20}
							className={`flex-shrink-0 cursor-pointer ${
								isActive ? 'text-green-loomis' : 'text-gray-loomis-300'
							}`}
						/>
						{label}
					</div>
				)}
			</LinkItem>
		);
	};

	interface IGrouItemProps {
		nameGroup: string;
	}

	const GroupItem = ({ nameGroup }: IGrouItemProps) => {
		const listItems = menuItems[nameGroup as keyof typeof menuItems];
		return (
			<>
				{!isCollapsed && (
					<div
						className={`p-3 text-gray-loomis-500 leading-[20px] capitalize mb-1 text-left pl-0`}>
						{nameGroup}
					</div>
				)}
				{listItems.map(({ icon: Icon, label, href, action }) => {
					const isActive = pathname === href;
					return (
						<ItemSidebar
							key={label}
							Icon={Icon}
							isActive={isActive}
							label={label}
							href={href}
							action={action}
							isCollapsed={isCollapsed}
						/>
					);
				})}
			</>
		);
	};

	const MenuItems = () => {
		return (
			<section
				className={`p-4 space-y-2 overflow-y-auto ${styles.HideScroolBar}`}>
				{groupsName.map((group: string) => {
					return <GroupItem key={group} nameGroup={group} />;
				})}
			</section>
		);
	};

	if (activeSkeletonSidebar) {
		return <SkeletonSidebar />;
	}

	return (
		<>
			{isMobile && (
				<button
					onClick={toggleMobileSidebar}
					aria-controls='dashboard-sidebar'
					aria-expanded={isMobileOpen}
					className='fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow sm:hidden'>
					<Menu size={20} />
				</button>
			)}
			{isMobile && isMobileOpen && (
				<div
					onClick={toggleMobileSidebar}
					aria-hidden={!isMobileOpen}
					className='fixed inset-0 bg-black/50 z-40 sm:hidden'></div>
			)}
			<aside
				id='dashboard-sidebar'
				aria-hidden={isMobile && !isMobileOpen}
				className={`bg-white flex flex-col min-h-screen transition-transform duration-300 ease-in-out ${
					isMobile
						? `fixed top-0 left-0 z-50 w-64 transform ${
								isMobileOpen ? 'translate-x-0' : '-translate-x-full'
							}`
						: `relative ${isCollapsed ? 'w-[7vw]' : 'w-[15vw]'}`
				}`}>
				<HeaderSidebar />
				<MenuItems />
			</aside>
		</>
	);
}
