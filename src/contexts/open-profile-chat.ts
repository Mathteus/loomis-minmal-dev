import { create } from 'zustand';

interface IProfileChatState {
	showProfileChat: boolean;
	setProfileShow: (newLoading: boolean) => void;
}

export const useProfileChatStore = create<IProfileChatState>((set) => ({
	showProfileChat: false,
	setProfileShow: (newLoading: boolean) => {
		console.log('showProfileChat=', newLoading);
		set({
			showProfileChat: newLoading,
		});
	},
}));
