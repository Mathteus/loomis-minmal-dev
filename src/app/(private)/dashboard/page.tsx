'use client';
import React from 'react';
import { QuickActionCard } from '@/components/dashboard/quick-action-card';
import { MetricCard } from '@/components/dashboard/metric-card';
import { RecentMessagesTable } from '@/components/dashboard/recent-messages-table';
import { ServiceBarChart } from '@/components/dashboard/services-bar-chart';
import { TasksCard } from '@/components/dashboard/tasks-card';
import { Send, MessageCircle, User, ListTodo } from 'lucide-react';
import { SkeletonHomeDashboard } from '@/components/dashboard/skeleton-home-dashboard';
import { useQuery } from '@tanstack/react-query';
import {
	loadHomeData,
	type DashboardHomeProps,
} from '@/services/dashboard/home';
import { useSidebarLoadingStore } from '@/contexts/sidebar-loading';
import { useRequireAuth } from '@/hooks/use-require-auth';

export default function DashboardPage() {
	useRequireAuth();
	const { setActiveSkeletonSidebar } = useSidebarLoadingStore();
	const { data, isPending } = useQuery({
		queryKey: ['home-dash'],
		queryFn: async (): Promise<DashboardHomeProps> => {
			setActiveSkeletonSidebar(true);
			const data = await loadHomeData();
			setActiveSkeletonSidebar(false);
			return data;
		},
	});

	if (isPending) {
		return <SkeletonHomeDashboard />;
	}

	return (
		<main className='p-6 space-y-6 bg-gray-50 w-full'>
			<h1 className='text-title-loomis'>Início</h1>
			<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4'>
				<QuickActionCard
					icon={<MessageCircle className='size-5 text-green-loomis-dark' />}
					title='24'
					description='Atendimentos ativos'
				/>
				<QuickActionCard
					icon={<User />}
					title='Novo contato'
					description='Adicione um novo contato'
				/>
				<QuickActionCard
					icon={<ListTodo />}
					title='Nova tarefa'
					description='Crie uma nova tarefa'
				/>
				<QuickActionCard
					icon={<Send />}
					title='Novo envio em massa'
					description='Crie um novo envio em massa'
				/>
			</div>

			<hr />

			<div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
				<div className='lg:col-span-3 h-[150%]'>
					<ServiceBarChart datas={data?.serviceBarNumbers ?? []} />
				</div>
				<div className='lg:col-span-1 space-y-4'>
					<MetricCard
						label='Conversas atuais'
						value='211'
						sublabel={data?.MetricCardInfos[0]}
					/>
					<MetricCard
						label='Tempo médio de resposta'
						value='2 hrs'
						sublabel={data?.MetricCardInfos[1]}
					/>
					<MetricCard
						label='Tarefas pendentes'
						value='2'
						sublabel={data?.MetricCardInfos[2]}
					/>
				</div>
			</div>

			<hr />

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				<div className='lg:col-span-2'>
					<h3 className='text-medium-loomis text-gray-700 mb-4'>
						Últimos atendimentos
					</h3>
					<div className='flex justify-between w-full gap-8'>
						<RecentMessagesTable data={data?.service ?? []} />
						<TasksCard tasks={data?.tasks ?? []} />
					</div>
				</div>
			</div>
		</main>
	);
}
