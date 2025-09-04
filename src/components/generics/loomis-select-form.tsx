import { itemsListType } from '@/app/(auth)/first-access/about-company/page';
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../ui/form';
import { LoomisSelect } from './loomis-select';
import { Control } from 'react-hook-form';

interface IFormSelect {
	formName: 'employeesCompany' | 'typeCompany' | 'customersCompany';
	textLabel: string;
	items: itemsListType;
	controlForm:
		| Control<
				{
					companyName: string;
					companyCNPJ: string;
					typeCompany:
						| 'DIGITAL_MARKETING_AGENCY'
						| 'SERVICE_COMPANY'
						| 'BUSINESS'
						| 'STARTUP';
					employeesCompany:
						| 'JUST_ME'
						| '1_10'
						| '11_20'
						| '21_50'
						| '51_100'
						| '100+';
					customersCompany: '1_10' | '11_20' | '21_50' | '51_100' | '100+';
				},
				any,
				{
					companyName: string;
					companyCNPJ: string;
					typeCompany:
						| 'DIGITAL_MARKETING_AGENCY'
						| 'SERVICE_COMPANY'
						| 'BUSINESS'
						| 'STARTUP';
					employeesCompany:
						| 'JUST_ME'
						| '1_10'
						| '11_20'
						| '21_50'
						| '51_100'
						| '100+';
					customersCompany: '1_10' | '11_20' | '21_50' | '51_100' | '100+';
				}
		  >
		| undefined;
}
export function FormSelect({
	formName,
	textLabel,
	items,
	controlForm,
}: IFormSelect) {
	return (
		<FormField
			control={controlForm}
			name={formName}
			render={({ field }) => (
				<FormItem>
					<FormLabel />
					<FormControl>
						<LoomisSelect
							items={items}
							textLabel={textLabel}
							onChangeForm={field.onChange}
							defaultValueForm={field.value as string}
						/>
					</FormControl>
					<FormDescription />
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
