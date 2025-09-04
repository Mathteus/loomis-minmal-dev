import { create } from 'zustand';

interface IScheduleMessageState {
	showModalSchedule: boolean;
	setModalSchedule: (newState: boolean) => void;
}

export const useScheduleDialogStore = create<IScheduleMessageState>((set) => ({
	showModalSchedule: false,
	setModalSchedule: (newLoading: boolean) => {
		set({
			showModalSchedule: newLoading,
		});
	},
}));
