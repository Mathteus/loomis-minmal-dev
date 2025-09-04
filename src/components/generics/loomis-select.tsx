import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectGroup,
	SelectLabel,
	SelectItem,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { itemsListType } from '@/app/(auth)/first-access/about-company/page';

export interface ISelect {
	textLabel: string;
	items: itemsListType;
	onChangeForm: (value: string) => void;
	defaultValueForm: string;
}

export function LoomisSelect({
	items,
	textLabel,
	onChangeForm,
	defaultValueForm,
}: ISelect) {
	return (
		<>
			<Label className='text-small-loomis text-gray-600'>{textLabel}</Label>
			<Select defaultValue={defaultValueForm} onValueChange={onChangeForm}>
				<SelectTrigger className='w-full px-3 py-2 border rounded-md text-sm text-gray-loomis-700 shadow-sm focus-visible:outline-none focus-visible:border-green-loomis focus-visible:ring-green-loomis cursor-pointer'>
					<SelectValue placeholder='Selecione uma opção' />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectLabel>{textLabel}</SelectLabel>
						{items.map((e) => {
							return (
								<SelectItem value={e.key} key={e.key}>
									{e.label}
								</SelectItem>
							);
						})}
					</SelectGroup>
				</SelectContent>
			</Select>
		</>
	);
}
