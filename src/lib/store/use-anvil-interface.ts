import { create } from 'zustand';
import { Ingot } from '../types/ingot-types';
import { IngotService } from '../classes/ingot-service';
import { toast } from 'sonner';
import { redirect } from 'next/navigation';

interface AnvilInterfaceState {
    loading: boolean;
    anvilIngots: Ingot[];
    searchQuery: string;
    typeFilter: string | 'ALL';
}

interface AnvilInterfaceActions {
    loadAnvilIngots: () => void;
    deleteAnvilIngot: (id: string) => void;
    openAnvilIngot: (id: string) => void;
    setSearchQuery: (query: string) => void;
    setTypeFilter: (type: string | 'ALL') => void;
    resetFilters: () => void;
}

type UseAnvilInterfaceStore = AnvilInterfaceState & AnvilInterfaceActions;

const defaultAnvilInterfaceState: AnvilInterfaceState = {
    loading: true,
    anvilIngots: [],
    searchQuery: '',
    typeFilter: 'ALL',
};

export const useAnvilInterfaceState = create<UseAnvilInterfaceStore>((set) => ({
    ...defaultAnvilInterfaceState,

    loadAnvilIngots: async () => {
        set({ loading: true });
        try {
            const data = await IngotService.listAnvilIngotData();
            set({ anvilIngots: data });
        } catch (error) {
            console.error('Failed to list ingots', error);
            toast.error('Failed to load ingots, please try again!');
        } finally {
            set({ loading: false });
        }
    },

    deleteAnvilIngot: async (id: string) => {
        try {
            await IngotService.deleteIngot(id);
            // Filter existing list rather than reloading, reduces database load
            // User can manually refresh if they absolutely need to
            set((state) => ({
                anvilIngots: state.anvilIngots.filter((i) => i.id !== id),
            }));
            toast.success('Ingot deleted');
        } catch (error) {
            console.error('Failed to delete ingot', error);
            toast.error('Failed to delete ingot, please try again');
        }
    },

    openAnvilIngot: (id: string) => {
        redirect(`/anvil/edit/${id}`);
    },

    setSearchQuery: (query: string) => set({ searchQuery: query }),
    setTypeFilter: (type: string | 'ALL') => set({ typeFilter: type }),
    resetFilters: () => set({ searchQuery: '', typeFilter: 'ALL' }),
}));
