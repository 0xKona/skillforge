import { create } from 'zustand';
import { CV, NewCV, Section } from '../types/cv-types';
import { Ingot, IngotType } from '../types/ingot-types';
import { CvFormValues, validateCv } from '../zod-form-schemas/cv-schema';

interface CvEditorState {
    loading: boolean;
    saving: boolean;
    isAutoSaving: boolean;
    cv: CV | NewCV | null;
    originalCv: CV | null;
    availableIngots: Ingot[];
    validationErrors: string[];
    validationWarnings: string[];
    activeSectionIndex: number | null;
}

interface CvEditorActions {
    // Initialization
    setCvData: (cv: CV | NewCV, ingots: Ingot[]) => void;
    setLoading: (loading: boolean) => void;
    setSaving: (saving: boolean) => void;
    setAutoSaving: (isAutoSaving: boolean) => void;

    // Metadata
    updateMetadata: (title: string, description?: string) => void;

    // Section Management
    addSection: (type: IngotType) => void;
    removeSection: (index: number) => void;
    reorderSections: (startIndex: number, endIndex: number) => void;
    updateSection: (index: number, updates: Partial<Section>) => void;
    setActiveSection: (index: number | null) => void;

    // Ingot Management within Section
    toggleIngotInSection: (sectionIndex: number, ingotId: string) => void;

    // Billet Management
    toggleBillet: (sectionIndex: number, billetId: string) => void;

    // Validation
    runValidation: () => { errors: string[]; warnings: string[] };

    resetState: () => void;
}

type UseCvEditorStore = CvEditorState & CvEditorActions;

const defaultState: CvEditorState = {
    loading: true,
    saving: false,
    isAutoSaving: false,
    cv: null,
    originalCv: null,
    availableIngots: [],
    validationErrors: [],
    validationWarnings: [],
    activeSectionIndex: null,
};

export const useCvEditorState = create<UseCvEditorStore>((set, get) => ({
    ...defaultState,

    setCvData: (cv: CV | NewCV, ingots: Ingot[]) => {
        const { errors, warnings } = validateCv(cv as CvFormValues);
        set({
            cv,
            originalCv: 'id' in cv ? (cv as CV) : null,
            availableIngots: ingots,
            loading: false,
            validationErrors: errors,
            validationWarnings: warnings,
        });
    },

    setLoading: (loading: boolean) => set({ loading }),
    setSaving: (saving: boolean) => set({ saving }),
    setAutoSaving: (isAutoSaving: boolean) => set({ isAutoSaving }),

    updateMetadata: (title, description) => {
        set((state) => {
            if (!state.cv) return state;
            return { cv: { ...state.cv, title, description } };
        });
    },

    addSection: (type) => {
        set((state) => {
            if (!state.cv) return state;
            const newSection: Section = {
                sectionType: type,
                ingotIds: [],
                billetIds: [],
                sortBilletsBy: 'date-desc',
                sortIngotsBy: 'date-desc',
                isVisible: true,
            };
            return {
                cv: {
                    ...state.cv,
                    cvContent: {
                        sections: [...state.cv.cvContent.sections, newSection],
                    },
                },
                activeSectionIndex: state.cv.cvContent.sections.length,
            };
        });
    },

    removeSection: (index) => {
        set((state) => {
            if (!state.cv) return state;
            const newSections = [...state.cv.cvContent.sections];
            newSections.splice(index, 1);
            return {
                cv: { ...state.cv, cvContent: { sections: newSections } },
                activeSectionIndex: null,
            };
        });
    },

    reorderSections: (startIndex, endIndex) => {
        set((state) => {
            if (!state.cv) return state;
            const newSections = [...state.cv.cvContent.sections];
            const [removed] = newSections.splice(startIndex, 1);
            newSections.splice(endIndex, 0, removed);
            return {
                cv: { ...state.cv, cvContent: { sections: newSections } },
            };
        });
    },

    updateSection: (index, updates) => {
        set((state) => {
            if (!state.cv) return state;
            const newSections = [...state.cv.cvContent.sections];
            newSections[index] = { ...newSections[index], ...updates };
            return {
                cv: { ...state.cv, cvContent: { sections: newSections } },
            };
        });
    },

    setActiveSection: (index) => set({ activeSectionIndex: index }),

    toggleIngotInSection: (sectionIndex, ingotId) => {
        set((state) => {
            if (!state.cv) return state;
            const section = state.cv.cvContent.sections[sectionIndex];
            const newIngotIds = new Set(section.ingotIds);

            if (newIngotIds.has(ingotId)) {
                newIngotIds.delete(ingotId);
            } else {
                if (
                    section.sectionType === 'ingot_personal_statement' ||
                    section.sectionType === 'ingot_personal_info'
                ) {
                    newIngotIds.clear();
                }
                newIngotIds.add(ingotId);
            }

            const newSections = [...state.cv.cvContent.sections];
            newSections[sectionIndex] = {
                ...section,
                ingotIds: Array.from(newIngotIds),
            };

            return {
                cv: { ...state.cv, cvContent: { sections: newSections } },
            };
        });
    },

    toggleBillet: (sectionIndex, billetId) => {
        set((state) => {
            if (!state.cv) return state;
            const section = state.cv.cvContent.sections[sectionIndex];
            const newBilletIds = new Set(section.billetIds);

            if (newBilletIds.has(billetId)) {
                newBilletIds.delete(billetId);
            } else {
                newBilletIds.add(billetId);
            }

            const newSections = [...state.cv.cvContent.sections];
            newSections[sectionIndex] = {
                ...section,
                billetIds: Array.from(newBilletIds),
            };

            return {
                cv: { ...state.cv, cvContent: { sections: newSections } },
            };
        });
    },

    runValidation: () => {
        const { cv } = get();
        if (!cv) return { errors: [], warnings: [] };
        const { errors, warnings } = validateCv(cv as CvFormValues);
        set({ validationErrors: errors, validationWarnings: warnings });
        return { errors, warnings };
    },

    resetState: () => set(defaultState),
}));
