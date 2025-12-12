import { create } from 'zustand';
import { CV, NewCV, Section } from '../types/cv-types';
import { Ingot, IngotType } from '../types/ingot-types';
import { CvService } from '../classes/service-cv';
import { IngotService } from '../classes/ingot-service';
import { toast } from 'sonner';
import { CvFormValues, validateCv } from '../form-schemas/cv-schema';
import { redirect } from 'next/navigation';

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
    initializeEditor: (cvId?: string) => Promise<void>;
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

    saveCv: () => Promise<void>;
    autoSaveCv: () => Promise<void>;
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

    initializeEditor: async (cvId?: string) => {
        set({ loading: true });
        try {
            const ingots = await IngotService.listIngots();

            let cv: CV | NewCV;
            if (cvId) {
                // If a cvId is provided, attempt to fetch the existing CV data
                const existingCv = await CvService.getCv(cvId);
                console.log('Existing CV: ', existingCv);
                // If the CV doesn't exist, throw an error to be caught below
                if (!existingCv) throw new Error('CV not found');
                // Assign the fetched CV to the local variable
                cv = existingCv;

                // Check for missing ingots
                const availableIngotIds = new Set(ingots.map((i) => i.id));
                let missingIngotsFound = false;

                // Iterate through sections and filter out missing ingot IDs
                const updatedSections = cv.cvContent.sections.map((section) => {
                    const originalCount = section.ingotIds.length;
                    const validIngotIds = section.ingotIds.filter((id) =>
                        availableIngotIds.has(id)
                    );

                    if (validIngotIds.length !== originalCount) {
                        missingIngotsFound = true;
                    }

                    return {
                        ...section,
                        ingotIds: validIngotIds,
                    };
                });

                // If missing ingots were found, update the CV and notify the user
                if (missingIngotsFound) {
                    cv = {
                        ...cv,
                        cvContent: {
                            ...cv.cvContent,
                            sections: updatedSections,
                        },
                    };
                    // Save the cleaned CV immediately
                    // We cast to CV because we know it has an ID at this point
                    cv = await CvService.updateCv(cv as CV);
                    toast.warning(
                        'Some ingots in this CV were missing and have been removed.'
                    );
                }
            } else {
                // If no cvId is provided, initialize a new default CV object
                cv = {
                    version: 1,
                    title: 'My New CV',
                    description: '',
                    cvContent: { sections: [] },
                };
            }

            // Update the store with the loaded CV, available ingots, and set loading to false
            set({
                cv,
                originalCv: cv as CV,
                availableIngots: ingots,
                loading: false,
            });

            // Check for any issues with the CV on load and alert user
            const { errors, warnings } = validateCv(cv as CvFormValues);
            set({ validationErrors: errors, validationWarnings: warnings });
        } catch (error) {
            console.error('Failed to initialize editor', error);
            toast.error('Failed to load editor');
        } finally {
            set({ loading: false });
        }
    },

    // Update the CV's metadata (title and description)
    updateMetadata: (title, description) => {
        set((state) => {
            // If there is no CV loaded, return the current state unchanged
            if (!state.cv) return state;
            // Return a new state object with the updated CV title and description
            return {
                cv: { ...state.cv, title, description },
            };
        });
    },

    // Add a new section of the specified type to the CV
    addSection: (type) => {
        set((state) => {
            // If no CV is loaded, do nothing
            if (!state.cv) return state;
            // Create a new section object with default values
            const newSection: Section = {
                sectionType: type,
                ingotIds: [], // Initialize with empty list of ingots
                billetIds: [], // Initialize with empty list of billets
                sortBilletsBy: 'date-desc', // Default sort order for billets
                sortIngotsBy: 'date-desc', // Default sort order for ingots
                isVisible: true, // Section is visible by default
            };
            // Return updated state
            return {
                cv: {
                    ...state.cv,
                    cvContent: {
                        // Append the new section to the existing sections array
                        sections: [...state.cv.cvContent.sections, newSection],
                    },
                },
                // Automatically set the newly added section as active
                activeSectionIndex: state.cv.cvContent.sections.length,
            };
        });
    },

    // Remove a section at the specified index
    removeSection: (index) => {
        set((state) => {
            // If no CV is loaded, do nothing
            if (!state.cv) return state;
            // Create a copy of the sections array to avoid mutating state directly
            const newSections = [...state.cv.cvContent.sections];
            // Remove 1 element at the specified index
            newSections.splice(index, 1);
            // Return updated state
            return {
                cv: {
                    ...state.cv,
                    cvContent: { sections: newSections },
                },
                // Deselect any active section
                activeSectionIndex: null,
            };
        });
    },

    // Move a section from startIndex to endIndex
    reorderSections: (startIndex, endIndex) => {
        set((state) => {
            // If no CV is loaded, do nothing
            if (!state.cv) return state;
            // Create a copy of the sections array
            const newSections = [...state.cv.cvContent.sections];
            // Remove the section from the start index
            const [removed] = newSections.splice(startIndex, 1);
            // Insert the removed section at the end index
            newSections.splice(endIndex, 0, removed);
            // Return updated state with reordered sections
            return {
                cv: {
                    ...state.cv,
                    cvContent: { sections: newSections },
                },
            };
        });
    },

    // Update specific properties of a section at the given index
    updateSection: (index, updates) => {
        set((state) => {
            // If no CV is loaded, do nothing
            if (!state.cv) return state;
            // Create a copy of the sections array
            const newSections = [...state.cv.cvContent.sections];
            // Merge the existing section data with the provided updates
            newSections[index] = { ...newSections[index], ...updates };
            // Return updated state
            return {
                cv: {
                    ...state.cv,
                    cvContent: { sections: newSections },
                },
            };
        });
    },

    // Set the index of the currently active section (for UI highlighting/editing)
    setActiveSection: (index) => set({ activeSectionIndex: index }),

    toggleIngotInSection: (sectionIndex, ingotId) => {
        // Toggle the inclusion of an ingot in a specific section
        set((state) => {
            // If no CV is loaded, do nothing
            if (!state.cv) return state;
            // Get the target section
            const section = state.cv.cvContent.sections[sectionIndex];
            // Create a Set from existing ingotIds for efficient O(1) lookups and uniqueness
            const newIngotIds = new Set(section.ingotIds);

            if (newIngotIds.has(ingotId)) {
                // If the ingot is already in the section, remove it
                newIngotIds.delete(ingotId);
            } else {
                // Enforce single selection for personal statement or info sections
                if (
                    section.sectionType === 'ingot_personal_statement' ||
                    section.sectionType === 'ingot_personal_info'
                ) {
                    // Clear any existing selection so only one can be selected
                    newIngotIds.clear();
                }
                // Add the new ingot ID
                newIngotIds.add(ingotId);
            }

            // TODO - Also need to handle billets. If adding ingot, maybe add all its billets by default?
            // For now, let's just toggle the ingot ID.
            // If removing ingot, should probably clean up billet IDs from that ingot,
            // but keeping them doesn't hurt as they just won't be found.

            // Create a copy of the sections array
            const newSections = [...state.cv.cvContent.sections];
            // Update the specific section with the new list of ingot IDs
            newSections[sectionIndex] = {
                ...section,
                ingotIds: Array.from(newIngotIds),
            };

            // Return updated state
            return {
                cv: {
                    ...state.cv,
                    cvContent: { sections: newSections },
                },
            };
        });
    },

    // Toggle the inclusion of a billet (sub-item) in a specific section
    toggleBillet: (sectionIndex, billetId) => {
        set((state) => {
            // If no CV is loaded, do nothing
            if (!state.cv) return state;
            // Get the target section
            const section = state.cv.cvContent.sections[sectionIndex];
            // Create a Set from existing billetIds for efficient operations
            const newBilletIds = new Set(section.billetIds);

            if (newBilletIds.has(billetId)) {
                // If billet is present, remove it
                newBilletIds.delete(billetId);
            } else {
                // If billet is not present, add it
                newBilletIds.add(billetId);
            }

            // Create a copy of the sections array
            const newSections = [...state.cv.cvContent.sections];
            // Update the specific section with the new list of billet IDs
            newSections[sectionIndex] = {
                ...section,
                billetIds: Array.from(newBilletIds),
            };

            // Return updated state
            return {
                cv: {
                    ...state.cv,
                    cvContent: { sections: newSections },
                },
            };
        });
    },

    saveCv: async () => {
        // Get the current state
        const state = get();
        // If no CV is loaded, do nothing
        if (!state.cv) return;

        // Set saving state to true to show spinner/disable buttons
        set({ saving: true });

        try {
            // If no changes have been made, do not save (saved DB usage and cost)
            if (JSON.stringify(state.cv) === JSON.stringify(state.originalCv)) {
                set({ saving: false });
                return;
            }
            // Validate the CV data against the schema before saving
            const { errors, warnings } = validateCv(state.cv as CvFormValues);
            // Update state with validation results
            set({ validationErrors: errors, validationWarnings: warnings });

            // If there are validation errors, stop the save process
            if (errors.length > 0) {
                toast.error('Please fix validation errors before saving');
                return;
            }

            // Check if the CV already has an ID (exists in DB)
            // (Should always be the case at this point)
            if ('id' in state.cv) {
                // Update existing CV
                const updated = await CvService.updateCv(state.cv as CV);
                // Update local state with the response from the server
                set({ cv: updated });
                toast.success('CV saved successfully');
            } else {
                // Create new CV - ( Shouldn't be required at this stage but kept as a backup )
                const created = await CvService.createCv(state.cv as NewCV);
                // Update local state with the newly created CV (which now has an ID)
                set({ cv: created });
                toast.success('CV created successfully');
                redirect(`/forge/cv/${created.id}`);
            }
        } catch (error) {
            console.error('Failed to save CV', error);
            toast.error('Failed to save CV, Please try again');
        } finally {
            set({ saving: false });
            redirect('/forge');
        }
    },
    autoSaveCv: async () => {
        // Get the current state
        const state = get();
        // If no CV is loaded, do nothing
        if (!state.cv) return;

        // Only autosave if the CV has an ID (it's been saved at least once)
        if (!('id' in state.cv)) return;

        // Set auto-saving state to true
        set({ isAutoSaving: true });
        try {
            // Validate the CV data against the schema before saving
            // We don't block autosave on validation errors, but we could log them or update the state
            // For now, let's just update the validation state so the user sees errors if they exist
            const { errors, warnings } = validateCv(state.cv as CvFormValues);
            set({ validationErrors: errors, validationWarnings: warnings });

            // Update existing CV
            // We ignore the return value to avoid re-rendering the UI with a new object reference
            await CvService.updateCv(state.cv as CV);
        } catch (error) {
            console.error('Failed to auto-save CV', error);
            // We might want to show a toast here if autosave fails repeatedly,
            // but for now let's keep it quiet or maybe a small indicator
        } finally {
            set({ isAutoSaving: false });
        }
    },
    resetState: () => set(defaultState),
}));
