import { CompanyType } from '@/app/(auth)/first-access/about-company/page';
import { create } from 'zustand';

interface IData {
	username: string;
	password: string;
	email: string;
}

interface IFirstAcessState {
	company?: CompanyType | null;
	user?: IData | null;
	setCompany: (newCompany: CompanyType) => void;
	setSelfData: (newUser: IData) => void;
	eraseDatas: () => void;
}

export const useAuthStore = create<IFirstAcessState>((set, get) => ({
	company: undefined,
	user: undefined,
	setCompany: (newCompany: CompanyType) => {
		set({
			company: newCompany,
			...get().user,
		});
	},
	setSelfData: (newUser: IData) => {
		set({
			user: newUser,
			...get().company,
		});
	},
	eraseDatas: () => {
		set({
			company: null,
			user: null,
		});
	},
}));
