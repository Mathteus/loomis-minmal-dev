import { getStringDate, randomString } from '@/utils/utilities';
import { ListTodo } from 'lucide-react';

export type Task = {
	label: string;
	username: string;
	iconLink: string;
	time: Date;
};

export interface ITaskProps {
	tasks: Array<Task>;
}

export function TasksCard({ tasks }: ITaskProps) {
	return (
		<div className='h-full mt-0 min-w-[36%]'>
			<h3 className='text-small-loomis text-green-loomis-dark bg-[#238E5214] rounded-t-xl mb-0 p-4 border border-b-[#238E521F] flex gap-2 items-center'>
				<ListTodo className='size-4' /> Tarefas
			</h3>
			<div className='space-y-4 bg-white p-4 rounded-b-xl shadow-sm mt-0'>
				{tasks.map(({ label, iconLink, time, username }: Task) => (
					<div
						key={String(label + randomString(3))}
						className='flex items-start gap-3 border border-[#EFEFEF] p-4 rounded-lg'>
						<div className='flex-1'>
							<p className='text-small-loomis text-gray-600 mb-2 bg-[#FAFAFA] rounded p-2'>
								{label}
							</p>
							<div className='flex items-center gap-2'>
								<div className='size-6 bg-gray-300 rounded-full'></div>
								<div className='text-details-loomis'>
									<p className='text-gray-700'>{username}</p>
									<p className='text-gray-400'>{getStringDate(time)}</p>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
