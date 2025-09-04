import { create } from 'zustand';

interface IFastMessageState {
	showModalFastMessage: boolean;
	setModalFastMessage: (newState: boolean) => void;
}

export const useFastMessageDialogStore = create<IFastMessageState>((set) => ({
	showModalFastMessage: false,
	setModalFastMessage: (newState: boolean) => {
		set({ showModalFastMessage: newState });
	},
}));
