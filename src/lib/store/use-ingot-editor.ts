import { create } from 'zustand';
import {
    Billet,
    IngotField,
    IngotTemplate,
    IngotType,
    IngotEditorData,
} from '../types/ingot-types';
import { IngotService } from '../classes/ingot-service';
import { toast } from 'sonner';
import { generateSchemaFromIngotFields } from '../form-schemas/ingot-form-generator';

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
    saveIngot: () => Promise<boolean>;
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

export const useIngotEditorState = create<UseIngotEditorStore>((set, get) => ({
    ...defaultIngotEditorState,

    // Actions here
    initialize: (ingot: IngotEditorData) => {
        set({
            ingotData: ingot,
            isLoading: false,
        });
    },
    initializeNewIngot: (currentTemplate: IngotTemplate) => {
        // Deep copy to avoid mutating template
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
    saveIngot: async () => {
        const { ingotData } = get();
        const {
            name: ingotName,
            type: ingotType,
            content: ingotContent,
        } = ingotData;
        const ingotId = 'id' in ingotData ? ingotData.id : null;

        if (!ingotType) return false;

        // Validation
        if (!ingotName.trim()) {
            toast.error('Display Name is required');
            return false;
        }

        // Helper to extract values for DynamicForm and Preview
        const getFieldValues = (fields: Record<string, IngotField>) => {
            const values: Record<string, string> = {};
            Object.keys(fields).forEach((key) => {
                const field = fields[key];
                const value = field?.value;

                // Handle potential object values (nested fields)
                if (typeof value === 'object' && value !== null) {
                    // @ts-expect-error - Handle runtime data issue
                    values[key] = value.value || '';
                } else {
                    values[key] = String(value || '');
                }
            });
            return values;
        };

        // Zod Validation
        const schema = generateSchemaFromIngotFields(ingotContent.fields);
        const values = getFieldValues(ingotContent.fields);

        const result = schema.safeParse(values);

        if (!result.success) {
            const newErrors: Record<string, string> = {};
            result.error.issues.forEach((err) => {
                if (err.path[0]) {
                    newErrors[err.path[0] as string] = err.message;
                }
            });
            set({ errors: newErrors });
            toast.error('Please fix the errors in the form');
            return false;
        }

        set({ errors: {} });
        set({ isLoading: true });

        try {
            if (ingotId) {
                await IngotService.updateIngot(
                    ingotId,
                    ingotName,
                    ingotContent
                );
                toast.success('Ingot updated successfully');
            } else {
                await IngotService.createIngot(
                    ingotType as IngotType,
                    ingotName || 'Untitled Ingot',
                    ingotContent
                );
                toast.success('Ingot created successfully');
            }
            return true;
        } catch (error) {
            console.error('Failed to save', error);
            toast.error('Failed to save ingot');
            return false;
        } finally {
            set({ isLoading: false });
        }
    },
}));
