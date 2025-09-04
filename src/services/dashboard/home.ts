import { Service } from '@/components/dashboard/recent-messages-table';
import { Task } from '@/components/dashboard/tasks-card';
import type { ServiceDataBarChartType } from '@/components/dashboard/services-bar-chart';

export interface DashboardHomeProps {
	tasks: Task[];
	service: Service[];
	MetricCardInfos: string[];
	serviceBarNumbers: ServiceDataBarChartType[];
}

const STORAGE_KEY = 'dashboard-home-data';

const randomNumber = (max: number, min = 0) =>
	Math.floor(Math.random() * (max - min + 1)) + min;

const DEFAULT_DATA: DashboardHomeProps = {
	tasks: [
		{
			iconLink: 'https://github.com/mathteus.png',
			label: 'Tarefa da sprint',
			username: 'Samuel Lopes',
			time: new Date('2025-08-15T13:00:00'),
		},
		{
			iconLink: 'https://github.com/mathteus.png',
			label: 'Tarefa da sprint',
			username: 'Heloísa Ribeiro',
			time: new Date('2025-06-15T13:00:00'),
		},
		{
			iconLink: 'https://github.com/mathteus.png',
			label: 'Tarefa da sprint',
			username: 'Amanda Souza',
			time: new Date('2025-10-15T13:00:00'),
		},
	],
	service: [
		{
			usuario: 'Heloísa Ribeiro',
			status: 'Aguardando resposta',
			mensagem: 'Lorem ipsum dolor sit amet consectetu...',
		},
		{
			usuario: 'Samuel Lopes',
			status: 'Aguardando resposta',
			mensagem: 'Lorem ipsum dolor sit amet consectetu...',
		},
		{
			usuario: 'Amanda Souza',
			status: 'Respondido',
			mensagem: 'Lorem ipsum dolor sit amet consectetu...',
		},
		{
			usuario: 'Letícia Nascimento',
			status: 'Respondido',
			mensagem: 'Lorem ipsum dolor sit amet consectetu...',
		},
		{
			usuario: 'Felipe Cardoso',
			status: 'Respondido',
			mensagem: 'Lorem ipsum dolor sit amet consectetu...',
		},
	],
	MetricCardInfos: [
		'+17 em relação ao último mês',
		'em relação ao último mês',
		'Clique para visualizar as tarefas',
	],
	serviceBarNumbers: [
		{ nome: 'Seg', atendimentos: randomNumber(30, 1) },
		{ nome: 'Ter', atendimentos: randomNumber(30, 1) },
		{ nome: 'Qua', atendimentos: randomNumber(30, 1) },
		{ nome: 'Qui', atendimentos: randomNumber(30, 1) },
		{ nome: 'Sex', atendimentos: randomNumber(30, 1) },
		{ nome: 'Sab', atendimentos: randomNumber(30, 1) },
		{ nome: 'Dom', atendimentos: randomNumber(30, 1) },
	],
};

export function loadHomeData(): DashboardHomeProps {
	if (typeof window !== 'undefined') {
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (stored) {
				return JSON.parse(stored) as DashboardHomeProps;
			}
		} catch (error) {
			console.error('Error loading home data from localStorage:', error);
		}
	}

	return DEFAULT_DATA;
}

export function saveHomeData(data: DashboardHomeProps): void {
	if (typeof window !== 'undefined') {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
		} catch (error) {
			console.error('Error saving home data to localStorage:', error);
		}
	}
}
