import { create } from 'zustand';
import { CV } from '../types/cv-types';
import { CvService } from '../classes/cv-service';
import { toast } from 'sonner';
import { redirect } from 'next/navigation';

interface CvInterfaceState {
    loading: boolean;
    cvs: CV[];
    searchQuery: string;
}

interface CvInterfaceActions {
    loadCvs: () => void;
    deleteCv: (id: string) => void;
    openCv: (id: string) => void;
    setSearchQuery: (query: string) => void;
}

type UseCvInterfaceStore = CvInterfaceState & CvInterfaceActions;

const defaultCvInterfaceState: CvInterfaceState = {
    loading: true,
    cvs: [],
    searchQuery: '',
};

export const useCvInterfaceState = create<UseCvInterfaceStore>((set) => ({
    ...defaultCvInterfaceState,

    loadCvs: async () => {
        set({ loading: true });
        try {
            const data = await CvService.listCvs();
            set({ cvs: data });
        } catch (error) {
            console.error('Failed to list CVs', error);
            toast.error('Failed to load CVs, please try again!');
        } finally {
            set({ loading: false });
        }
    },

    deleteCv: async (id: string) => {
        try {
            await CvService.deleteCv(id);
            set((state) => ({
                cvs: state.cvs.filter((c) => c.id !== id),
            }));
            toast.success('CV deleted');
        } catch (error) {
            console.error('Failed to delete CV', error);
            toast.error('Failed to delete CV, please try again');
        }
    },

    openCv: (id: string) => {
        redirect(`/forge/edit/${id}`);
    },

    setSearchQuery: (query: string) => set({ searchQuery: query }),
}));
