import { IPasswordValidedResponse, PasswordPolicy } from '@/utils/utilities';
import { Check, X } from 'lucide-react';

export interface IRequirimentsPassowordProps {
	errosState: IPasswordValidedResponse;
	rulesPolicy: PasswordPolicy;
}

interface IRuleComponent {
	hasError: boolean;
	text: string;
}

export function RequirimentsPassowordComponent({
	errosState,
	rulesPolicy,
}: IRequirimentsPassowordProps) {
	const RuleComponent = ({ hasError, text }: IRuleComponent) => {
		return (
			<div
				className={`flex ${hasError ? 'text-error-500' : 'text-success-500'} items-center p-1 pl-0`}>
				{hasError ? <X className='size-4' /> : <Check className='size-4' />}
				<p>{text}</p>
			</div>
		);
	};

	return (
		<div className='text-details-loomis'>
			<RuleComponent
				hasError={errosState?.minLength ?? true}
				text={`Deve ter pelo menos ${rulesPolicy.minLength} caracteres`}
			/>
			<RuleComponent
				hasError={errosState?.minUppercase ?? true}
				text={`Deve ter pelo menos ${rulesPolicy.minUppercase} letra maiúscula`}
			/>
			<RuleComponent
				hasError={errosState?.minLowercase ?? true}
				text={`Deve ter pelo menos ${rulesPolicy.minLowercase} letra minúscula`}
			/>
			<RuleComponent
				hasError={errosState?.minSymbols ?? true}
				text={`Deve ter pelo menos ${rulesPolicy.minSymbols} simbolo`}
			/>
			<RuleComponent
				hasError={errosState?.minNumbers ?? true}
				text={`Deve ter pelo menos ${rulesPolicy.minNumbers} número`}
			/>
		</div>
	);
}
