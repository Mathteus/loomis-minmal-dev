interface MetricCardProps {
	label: string;
	value: string;
	sublabel?: string;
}

export function MetricCard({ label, value, sublabel }: MetricCardProps) {
	return (
		<div className='p-4 bg-white rounded-xl shadow-sm text-sm'>
			<p className='text-gray-600 text-details-loomis'>{label}</p>
			<p className='text-details-big-loomis text-green-600'>{value}</p>
			{sublabel && (
				<p className='text-xs text-gray-400 mt-1 text-details-loomis'>
					{sublabel}
				</p>
			)}
		</div>
	);
}
