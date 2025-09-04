'use client';

import { formatNumber } from '@/utils/utilities';
import { MessageCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

export type ServiceDataBarChartType = {
	nome: string;
	atendimentos: number;
};

export interface IServiceBarChartProps {
	datas: Array<ServiceDataBarChartType>;
}

export function ServiceBarChart({ datas }: IServiceBarChartProps) {
	return (
		<div className='h-[57%]'>
			<h3 className='text-small-loomis text-green-loomis-dark bg-[#238E5214] border border-b-[#238E521F] rounded-t-xl p-4 mb-0 flex gap-2 items-center'>
				<MessageCircle className='size-5 text-green-loomis-dark' /> Atendimentos
				por dia
			</h3>
			<div className='bg-white p-4 rounded-b-xl shadow-sm h-full'>
				<ResponsiveContainer width='100%' height='100%'>
					<BarChart data={datas}>
						<XAxis dataKey='nome' />
						<Tooltip
							formatter={(value: number) => [
								formatNumber(value),
								'Atendimentos em progresso',
							]}
						/>
						<Bar dataKey='atendimentos' fill='#238E52' radius={[4, 4, 0, 0]} />
					</BarChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}
