'use client';
import { useRouter } from 'next/navigation';
import { toFormatCNPJ, validarCNPJ } from '@/utils/utilities';
import StepIndicator from '@/components/auth/step-indicator';
import { LoomisInputText } from '@/components/generics/loomis-input-text';
import { Label } from '@/components/ui/label';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoomisButton } from '@/components/generics/loomis-button';
import { useAuthStore } from '@/contexts/first-access';
import { ErrorMensageComponent } from '@/components/generics/error-message-inputs';
import { FormSelect } from '@/components/generics/loomis-select-form';
import { Form } from '@/components/ui/form';
import { useEffect } from 'react';

const CompanySchema = z.object({
	companyName: z
		.string({
			error: 'Nome da empresa é obrigatório',
		})
		.min(3, {
			error: 'Nome deve conter no minimo 3 caracteres!',
		}),
	companyCNPJ: z
		.string({
			error: 'CPNJ é obrigatório!',
		})
		.regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, {
			error: 'O campo deve ser um CPNJ válido!',
		})
		.length(18)
		.refine((value) => validarCNPJ(value.replace(/\D/g, '')), {
			message: 'O campo deve ser um CPNJ válido!',
		}),
	typeCompany: z.enum(
		['DIGITAL_MARKETING_AGENCY', 'SERVICE_COMPANY', 'BUSINESS', 'STARTUP'],
		{
			error: 'É obrigatório definir o tipo da empresa!',
		},
	),
	employeesCompany: z.enum(
		['JUST_ME', '1_10', '11_20', '21_50', '51_100', '100+'],
		{
			error: 'É obrigatório definir o número de funcionários!',
		},
	),
	customersCompany: z.enum(['1_10', '11_20', '21_50', '51_100', '100+'], {
		error: 'É obrigatório definir o número médio de clientes!',
	}),
});

export type CompanyType = z.infer<typeof CompanySchema>;

type itemsTypeCompanyType = Array<{
	key: 'DIGITAL_MARKETING_AGENCY' | 'SERVICE_COMPANY' | 'BUSINESS' | 'STARTUP';
	label:
		| 'Agência de marketing digital'
		| 'Empresa de serviço'
		| 'Comércio'
		| 'Startup';
}>;

const itemsTypeCompany: itemsTypeCompanyType = [
	{ key: 'DIGITAL_MARKETING_AGENCY', label: 'Agência de marketing digital' },
	{ key: 'SERVICE_COMPANY', label: 'Empresa de serviço' },
	{ key: 'BUSINESS', label: 'Comércio' },
	{ key: 'STARTUP', label: 'Startup' },
];

type itemsEmployeesCompanyType = Array<{
	key: 'JUST_ME' | '1_10' | '11_20' | '21_50' | '51_100' | '100+';
	label:
		| 'Somente eu'
		| '1 a 10'
		| '11 a 20'
		| '21 a 50'
		| '51 a 100'
		| 'Acima de 100';
}>;

const itemsEmployeesCompany: itemsEmployeesCompanyType = [
	{ key: 'JUST_ME', label: 'Somente eu' },
	{ key: '1_10', label: '1 a 10' },
	{ key: '11_20', label: '11 a 20' },
	{ key: '21_50', label: '21 a 50' },
	{ key: '51_100', label: '51 a 100' },
	{ key: '100+', label: 'Acima de 100' },
];

type itemsCustomerCompanyType = Array<{
	key: '1_10' | '11_20' | '21_50' | '51_100' | '100+';
	label: '1 a 10' | '11 a 20' | '21 a 50' | '51 a 100' | 'Acima de 100';
}>;

const itemsCustomerCompany: itemsCustomerCompanyType = [
	{ key: '1_10', label: '1 a 10' },
	{ key: '11_20', label: '11 a 20' },
	{ key: '21_50', label: '21 a 50' },
	{ key: '51_100', label: '51 a 100' },
	{ key: '100+', label: 'Acima de 100' },
];

export type itemsListType =
	| itemsCustomerCompanyType
	| itemsEmployeesCompanyType
	| itemsTypeCompanyType;

const steps = [
	{ label: 'Seus dados', active: false, completed: true },
	{ label: 'Sobre a empresa', active: true, completed: false },
	{ label: 'Sua equipe', active: false, completed: false },
];

export default function AboutCompanyPage() {
	const router = useRouter();
	const { setCompany, user } = useAuthStore();
	const formHookForm = useForm<CompanyType>({
		resolver: zodResolver(CompanySchema),
	});

	const { register, handleSubmit, formState, control } = formHookForm;
	const { errors } = formState;

	useEffect(() => {
		const isDontHasUser = user === null || user === undefined;
		if (isDontHasUser) {
			router.push('/first-access');
		}
	}, []);

	const maskCNPJ = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = event.target;
		event.target.value = toFormatCNPJ(value);
	};

	const handlerFormCompany = (company: CompanyType) => {
		setCompany(company);
		router.push('/first-access/your-squad/');
	};

	return (
		<>
			<div className='flex items-center gap-2'>
				<StepIndicator steps={steps} />
			</div>

			<div className='space-y-2'>
				<h1 className='text-title-loomis'>Sobre a empresa</h1>
				<p className='text-medium-loomis text-gray-400'>
					Agora nos conte mais sobre a sua empresa e seus clientes
				</p>
			</div>

			<Form {...formHookForm}>
				<form onSubmit={handleSubmit(handlerFormCompany)} className='space-y-2'>
					<div>
						<Label
							htmlFor='client-name'
							className='text-small-loomis text-gray-600 pb-2'>
							Nome
						</Label>
						<LoomisInputText
							id='client-name'
							placeholder='Digite o nome da sua empresa'
							{...register('companyName')}
						/>
						<p className='text-details-loomis text-gray-500 mt-1'>
							Adicione o nome da empresa que deseja gerenciar na plataforma
						</p>
						{errors.companyName && (
							<ErrorMensageComponent
								messageError={errors.companyName.message}
							/>
						)}
					</div>

					<div>
						<Label
							htmlFor='client-document'
							className='text-small-loomis text-gray-600 pb-2'>
							CNPJ
						</Label>
						<LoomisInputText
							id='client-document'
							placeholder='00.000.000/0000-00'
							{...register('companyCNPJ', {
								onChange: maskCNPJ,
							})}
						/>
						{errors.companyCNPJ && (
							<ErrorMensageComponent
								messageError={errors.companyCNPJ.message}
							/>
						)}
					</div>

					<FormSelect
						formName='typeCompany'
						items={itemsTypeCompany}
						textLabel='Qual o tipo da sua empresa'
						controlForm={control}
					/>

					<FormSelect
						formName='employeesCompany'
						items={itemsEmployeesCompany}
						textLabel='Quantidade de funcionários'
						controlForm={control}
					/>

					<FormSelect
						formName='customersCompany'
						items={itemsCustomerCompany}
						textLabel='Número médio de clientes'
						controlForm={control}
					/>

					<LoomisButton type='submit'>Avançar</LoomisButton>
				</form>
			</Form>
		</>
	);
}
