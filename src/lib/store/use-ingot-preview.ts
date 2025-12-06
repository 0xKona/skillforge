import { create } from 'zustand';

interface UseIngotPreviewState {
    showPreviewModal: boolean;
}

interface UseIngotPreviewActions {
    openPreviewModal: () => void;
    closePreviewModal: () => void;
}

type UseIngotPreviewStore = UseIngotPreviewState & UseIngotPreviewActions;

const defaultIngotPreviewState: UseIngotPreviewState = {
    showPreviewModal: false,
};

export const useIngotPreviewState = create<UseIngotPreviewStore>((set) => ({
    ...defaultIngotPreviewState,

    openPreviewModal: () => {
        set({ showPreviewModal: true });
    },

    closePreviewModal: () => {
        set({ showPreviewModal: false });
    },
}));
