import React from 'react';
import clsx from 'clsx';
import { ChevronRight } from 'lucide-react';

interface Step {
	label: string;
	active: boolean;
	completed: boolean;
}

interface StepIndicatorProps {
	steps: Step[];
}

export default function StepIndicator({ steps }: StepIndicatorProps) {
	return (
		<div className='mt-8 flex items-center space-x-2 text-medium-loomis'>
			{steps.map((step, index) => (
				<React.Fragment key={step.label}>
					<div
						className={clsx(
							'flex items-center min-w-max',
							step.active
								? 'text-green-loomis'
								: step.completed
									? 'text-green-loomis'
									: 'text-gray-400 opacity-50',
						)}>
						<span
							className={clsx(
								'size-6 rounded-full flex items-center justify-center text-xs mr-1',
								step.active || step.completed
									? 'bg-green-loomis text-white'
									: 'bg-white border border-gray-400',
							)}>
							{index + 1}
						</span>
						{step.label}
					</div>
					{index < steps.length - 1 && <ChevronRight className='size-4' />}
				</React.Fragment>
			))}
		</div>
	);
}
