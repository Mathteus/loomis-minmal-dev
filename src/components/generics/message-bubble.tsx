export function MessageBubble({
	from,
	text,
}: {
	from: 'client' | 'agent';
	text: string;
}) {
	const isClient = from === 'client';

	return (
		<div className={`flex ${isClient ? 'justify-start' : 'justify-end'} mb-2`}>
			<div
				className={`max-w-sm text-sm p-3 rounded-lg ${
					isClient ? 'bg-gray-200 text-gray-800' : 'bg-green-100 text-green-900'
				}`}>
				{text}
			</div>
		</div>
	);
}
