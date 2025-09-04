import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SidebarState {
	isCollapsed: boolean;
	toggle: () => void;
}

interface objectCollapsed {
	state: {
		isCollapsed: boolean;
	};
	version: number;
}

function getInitialCollapsed(): boolean {
	if (typeof window !== 'undefined') {
		try {
			const stored =
				localStorage.getItem('loomis-sidebar') ??
				'{"state":{"isCollapsed":false},"version":0}';
			const parsed = JSON.parse(stored) as objectCollapsed;
			return stored ? (parsed?.state?.isCollapsed ?? false) : false;
		} catch {
			return false;
		}
	}
	return false;
}

export const useSidebarStore = create<SidebarState>()(
	persist(
		(set) => ({
			isCollapsed: getInitialCollapsed(),
			toggle: () =>
				set((state) => ({
					isCollapsed: !state.isCollapsed,
				})),
		}),
		{
			name: 'loomis-sidebar',
		},
	),
);
