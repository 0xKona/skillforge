import { create } from 'zustand';
import { Billet, IngotTemplate, IngotEditorData } from '../types/ingot-types';

interface UseIngotEditorState {
    isLoading: boolean;
    ingotData: IngotEditorData;
    errors: Record<string, string>;
}

interface UseIngotEditorActions {
    initialize: (ingot: IngotEditorData) => void;
    initializeNewIngot: (currentTemplate: IngotTemplate) => void;
    setIngotName: (name: string) => void;
    handleContentChange: (key: string, value: string) => void;
    handleBilletsChange: (newBillets: Billet[]) => void;
    setErrors: (errors: Record<string, string>) => void;
    clearErrors: () => void;
    reset: () => void;
}

type UseIngotEditorStore = UseIngotEditorState & UseIngotEditorActions;

const defaultIngotEditorState: UseIngotEditorState = {
    isLoading: true,
    ingotData: {
        name: '',
        type: '',
        content: {
            fields: {},
            billetFormat: null,
            billets: [],
        },
    },
    errors: {},
};

export const useIngotEditorState = create<UseIngotEditorStore>((set) => ({
    ...defaultIngotEditorState,

    initialize: (ingot: IngotEditorData) => {
        set({
            ingotData: ingot,
            isLoading: false,
            errors: {},
        });
    },

    initializeNewIngot: (currentTemplate: IngotTemplate) => {
        set((state) => ({
            ingotData: {
                ...state.ingotData,
                content: JSON.parse(JSON.stringify(currentTemplate.content)),
            },
        }));
    },

    setIngotName: (name: string) =>
        set((state) => ({
            ingotData: { ...state.ingotData, name },
        })),

    handleContentChange: (key: string, value: string) => {
        set((state) => {
            const newErrors = { ...state.errors };
            delete newErrors[key];

            return {
                ingotData: {
                    ...state.ingotData,
                    content: {
                        ...state.ingotData.content,
                        fields: {
                            ...state.ingotData.content.fields,
                            [key]: {
                                ...state.ingotData.content.fields[key],
                                value,
                            },
                        },
                    },
                },
                errors: newErrors,
            };
        });
    },

    handleBilletsChange: (newBillets: Billet[]) => {
        set((state) => ({
            ingotData: {
                ...state.ingotData,
                content: {
                    ...state.ingotData.content,
                    billets: newBillets,
                },
            },
        }));
    },

    setErrors: (errors: Record<string, string>) => set({ errors }),

    clearErrors: () => set({ errors: {} }),

    reset: () => set(defaultIngotEditorState),
}));
