import { create } from 'zustand';
import type {
    CvDocument,
    DocumentContent,
    DocumentItem,
    DocumentSection,
    DocumentSettings,
    NewCvDocument,
    SectionType,
} from '../types/cv-document-types';
import { SECTION_META, SECTION_SCHEMAS } from '../constants/cv-constants';
import type { CvFontFamily } from '../pdf/font-options';
import { parseDateTimestamp } from '../helpers/date';

// -- Constants --

const MAX_HISTORY = 20;

// -- State & Actions --

interface CvDocumentState {
    document: CvDocument | NewCvDocument | null;
    history: DocumentContent[];
    future: DocumentContent[];
    isDirty: boolean;
    lastSavedContent: DocumentContent | null;
}

interface CvDocumentActions {
    // Lifecycle
    setDocument: (doc: CvDocument | NewCvDocument) => void;
    markSaved: () => void;
    reset: () => void;

    // Metadata (not undoable)
    updateTitle: (title: string) => void;
    updateDescription: (description: string) => void;
    updateFontFamily: (fontFamily: CvFontFamily) => void;
    updateSettings: (settings: Partial<DocumentSettings>) => void;

    // Sections (undoable)
    addSection: (type: SectionType, afterIndex?: number) => void;
    removeSection: (index: number) => void;
    moveSection: (from: number, to: number) => void;
    updateSectionTitle: (index: number, title: string) => void;
    toggleSectionVisibility: (index: number) => void;

    // Items (undoable)
    addItem: (sectionIndex: number, item: DocumentItem) => void;
    removeItem: (sectionIndex: number, itemIndex: number) => void;
    moveItem: (sectionIndex: number, from: number, to: number) => void;
    updateItemField: (
        sectionIndex: number,
        itemIndex: number,
        field: string,
        value: string
    ) => void;
    setItemSourceIngotId: (
        sectionIndex: number,
        itemIndex: number,
        sourceIngotId: string | undefined
    ) => void;

    // Sub-items (undoable)
    addSubItem: (
        sectionIndex: number,
        itemIndex: number,
        subItem: DocumentItem
    ) => void;
    removeSubItem: (
        sectionIndex: number,
        itemIndex: number,
        subItemIndex: number
    ) => void;
    moveSubItem: (
        sectionIndex: number,
        itemIndex: number,
        from: number,
        to: number
    ) => void;
    updateSubItemField: (
        sectionIndex: number,
        itemIndex: number,
        subItemIndex: number,
        field: string,
        value: string
    ) => void;

    // Sorting (undoable)
    sortItemsByDate: (sectionIndex: number, direction: 'asc' | 'desc') => void;

    // History
    undo: () => void;
    redo: () => void;
    canUndo: () => boolean;
    canRedo: () => boolean;
}

type CvDocumentStore = CvDocumentState & CvDocumentActions;

// -- Helpers --

function cloneContent(content: DocumentContent): DocumentContent {
    return JSON.parse(JSON.stringify(content));
}

function findFirstDateField(sectionType: SectionType): string | null {
    const schema = SECTION_SCHEMAS[sectionType];
    if (!schema) return null;
    for (const [key, def] of Object.entries(schema.fields)) {
        if (def.type === 'date') return key;
    }
    return null;
}

// -- Store --

const defaultState: CvDocumentState = {
    document: null,
    history: [],
    future: [],
    isDirty: false,
    lastSavedContent: null,
};

export const useCvDocumentStore = create<CvDocumentStore>((set, get) => {
    function pushHistory() {
        const { document, history } = get();
        if (!document) return;

        const newHistory = [...history, cloneContent(document.content)];
        if (newHistory.length > MAX_HISTORY) {
            newHistory.shift();
        }

        set({ history: newHistory, future: [] });
    }

    function mutateSections(mutator: (sections: DocumentSection[]) => void) {
        const { document } = get();
        if (!document) return;
        pushHistory();

        const sections = cloneContent(document.content).sections;
        mutator(sections);

        set({
            document: {
                ...document,
                content: {
                    ...document.content,
                    sections,
                },
            },
            isDirty: true,
        });
    }

    return {
        ...defaultState,

        // -- Lifecycle --

        setDocument: (doc) => {
            set({
                document: doc,
                history: [],
                future: [],
                isDirty: false,
                lastSavedContent: cloneContent(doc.content),
            });
        },

        markSaved: () => {
            const { document } = get();
            if (!document) return;
            set({
                isDirty: false,
                lastSavedContent: cloneContent(document.content),
            });
        },

        reset: () => set(defaultState),

        // -- Metadata (not undoable) --

        updateTitle: (title) => {
            const { document } = get();
            if (!document) return;
            set({
                document: { ...document, title },
                isDirty: true,
            });
        },

        updateDescription: (description) => {
            const { document } = get();
            if (!document) return;
            set({
                document: { ...document, description },
                isDirty: true,
            });
        },

        updateFontFamily: (fontFamily) => {
            const { document } = get();
            if (!document) return;
            set({
                document: {
                    ...document,
                    content: {
                        ...document.content,
                        settings: {
                            ...document.content.settings,
                            fontFamily,
                        },
                    },
                },
                isDirty: true,
            });
        },

        updateSettings: (settings) => {
            const { document } = get();
            if (!document) return;
            set({
                document: {
                    ...document,
                    content: {
                        ...document.content,
                        settings: {
                            ...document.content.settings,
                            ...settings,
                        },
                    },
                },
                isDirty: true,
            });
        },

        // -- Sections (undoable) --

        addSection: (type, afterIndex) => {
            const newSection: DocumentSection = {
                id: crypto.randomUUID(),
                type,
                title: SECTION_META[type].defaultTitle,
                visible: true,
                items: [],
            };
            mutateSections((sections) => {
                const insertAt =
                    afterIndex !== undefined ? afterIndex + 1 : sections.length;
                sections.splice(insertAt, 0, newSection);
            });
        },

        removeSection: (index) => {
            mutateSections((sections) => {
                sections.splice(index, 1);
            });
        },

        moveSection: (from, to) => {
            if (from === to) return;
            mutateSections((sections) => {
                const [moved] = sections.splice(from, 1);
                if (moved) sections.splice(to, 0, moved);
            });
        },

        updateSectionTitle: (index, title) => {
            mutateSections((sections) => {
                if (sections[index]) {
                    sections[index].title = title;
                }
            });
        },

        toggleSectionVisibility: (index) => {
            mutateSections((sections) => {
                if (sections[index]) {
                    sections[index].visible = !sections[index].visible;
                }
            });
        },

        // -- Items (undoable) --

        addItem: (sectionIndex, item) => {
            mutateSections((sections) => {
                sections[sectionIndex]?.items.push(item);
            });
        },

        removeItem: (sectionIndex, itemIndex) => {
            mutateSections((sections) => {
                sections[sectionIndex]?.items.splice(itemIndex, 1);
            });
        },

        moveItem: (sectionIndex, from, to) => {
            if (from === to) return;
            mutateSections((sections) => {
                const items = sections[sectionIndex]?.items;
                if (!items) return;
                const [moved] = items.splice(from, 1);
                if (moved) items.splice(to, 0, moved);
            });
        },

        updateItemField: (sectionIndex, itemIndex, field, value) => {
            mutateSections((sections) => {
                const item = sections[sectionIndex]?.items[itemIndex];
                if (item) {
                    item.fields[field] = value;
                }
            });
        },

        setItemSourceIngotId: (sectionIndex, itemIndex, sourceIngotId) => {
            mutateSections((sections) => {
                const item = sections[sectionIndex]?.items[itemIndex];
                if (item) {
                    item.sourceIngotId = sourceIngotId;
                }
            });
        },

        // -- Sub-items (undoable) --

        addSubItem: (sectionIndex, itemIndex, subItem) => {
            mutateSections((sections) => {
                const item = sections[sectionIndex]?.items[itemIndex];
                if (!item) return;
                item.subItems = item.subItems || [];
                item.subItems.push(subItem);
            });
        },

        removeSubItem: (sectionIndex, itemIndex, subItemIndex) => {
            mutateSections((sections) => {
                sections[sectionIndex]?.items[itemIndex]?.subItems?.splice(
                    subItemIndex,
                    1
                );
            });
        },

        moveSubItem: (sectionIndex, itemIndex, from, to) => {
            if (from === to) return;
            mutateSections((sections) => {
                const subItems =
                    sections[sectionIndex]?.items[itemIndex]?.subItems;
                if (!subItems) return;
                const [moved] = subItems.splice(from, 1);
                if (moved) subItems.splice(to, 0, moved);
            });
        },

        updateSubItemField: (
            sectionIndex,
            itemIndex,
            subItemIndex,
            field,
            value
        ) => {
            mutateSections((sections) => {
                const subItem =
                    sections[sectionIndex]?.items[itemIndex]?.subItems?.[
                        subItemIndex
                    ];
                if (subItem) {
                    subItem.fields[field] = value;
                }
            });
        },

        // -- Sorting (undoable) --

        sortItemsByDate: (sectionIndex, direction) => {
            const { document } = get();
            if (!document) return;

            const section = document.content.sections[sectionIndex];
            if (!section) return;

            const dateField = findFirstDateField(section.type);
            if (!dateField) return;

            mutateSections((sections) => {
                const target = sections[sectionIndex];
                if (!target) return;
                target.items.sort((a, b) => {
                    const dateA = parseDateTimestamp(a.fields[dateField]);
                    const dateB = parseDateTimestamp(b.fields[dateField]);
                    return direction === 'desc' ? dateB - dateA : dateA - dateB;
                });
            });
        },

        // -- History --

        undo: () => {
            const { document, history, future } = get();
            if (!document || history.length === 0) return;

            const previous = history[history.length - 1];
            const newHistory = history.slice(0, -1);

            set({
                document: { ...document, content: previous },
                history: newHistory,
                future: [cloneContent(document.content), ...future],
                isDirty: true,
            });
        },

        redo: () => {
            const { document, history, future } = get();
            if (!document || future.length === 0) return;

            const next = future[0];
            const newFuture = future.slice(1);

            set({
                document: { ...document, content: next },
                history: [...history, cloneContent(document.content)],
                future: newFuture,
                isDirty: true,
            });
        },

        canUndo: () => get().history.length > 0,
        canRedo: () => get().future.length > 0,
    };
});
