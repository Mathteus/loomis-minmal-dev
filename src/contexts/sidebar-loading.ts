import { create } from 'zustand';

interface SkeletonSidebarState {
	activeSkeletonSidebar: boolean;
	setActiveSkeletonSidebar: (newLoading: boolean) => void;
}

export const useSidebarLoadingStore = create<SkeletonSidebarState>((set) => ({
	activeSkeletonSidebar: false,
	setActiveSkeletonSidebar: (newLoading: boolean) => {
		set({
			activeSkeletonSidebar: newLoading,
		});
	},
}));
