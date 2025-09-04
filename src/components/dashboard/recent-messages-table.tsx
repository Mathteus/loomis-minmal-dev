import { CircleDashed, MessageCircle, User } from 'lucide-react';

export interface Service {
	usuario: string;
	status: 'Aguardando resposta' | 'Respondido';
	mensagem: string;
}

const STATUS_COLOR = {
	'Aguardando resposta': 'bg-orange-100 text-orange-600',
	Respondido: 'bg-green-100 text-green-600',
};

export function RecentMessagesTable({ data }: { data: Service[] }) {
	return (
		<div className='min-w-[112%]'>
			<table className='size-full text-sm rounded-xl shadow-sm'>
				<thead className='text-small-loomis text-green-loomis-dark bg-[#238E5214] border border-b-[#238E521F] mb-0'>
					<tr>
						<th>
							<div className='flex items-center justify-center p-4 gap-2'>
								<User className='size-5 text-green-loomis-dark' /> Usuário
							</div>
						</th>
						<th>
							<div className='flex items-center justify-center p-4 gap-2'>
								<CircleDashed className='size-5 text-green-loomis-dark' />{' '}
								Status
							</div>
						</th>
						<th>
							<div className='flex items-center justify-center p-4 gap-2'>
								<MessageCircle className='size-5 text-green-loomis-dark' />{' '}
								Mensagem
							</div>
						</th>
					</tr>
				</thead>
				<tbody className='bg-white h-full'>
					{data.map((item, i) => (
						<tr key={i} className='text-center border border-gray-200'>
							<td className='p-6 font-medium text-gray-800'>{item.usuario}</td>
							<td className='p-6'>
								<span
									className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLOR[item.status]}`}>
									{item.status}
								</span>
							</td>
							<td className='p-6 text-gray-600'>{item.mensagem}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
