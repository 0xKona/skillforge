import { create } from 'zustand';
import type {
    CvDocument,
    DocumentContent,
    DocumentItem,
    DocumentSection,
    NewCvDocument,
    SectionType,
} from '../types/cv-document-types';
import { SECTION_META, SECTION_SCHEMAS } from '../constants/cv-constants';

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

function getDateValue(value: string): number {
    if (!value) return 0;
    const lower = value.toLowerCase();
    if (lower === 'present' || lower === 'current') return Date.now();
    const ts = new Date(value).getTime();
    return isNaN(ts) ? 0 : ts;
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

export const useCvDocumentStore = create<CvDocumentStore>((set, get) => ({
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
        set((state) => {
            if (!state.document) return state;
            return { document: { ...state.document, title }, isDirty: true };
        });
    },

    updateDescription: (description) => {
        set((state) => {
            if (!state.document) return state;
            return {
                document: { ...state.document, description },
                isDirty: true,
            };
        });
    },

    // -- Sections --

    addSection: (type, afterIndex) => {
        const { document } = get();
        if (!document) return;
        pushHistory(set, get);

        const newSection: DocumentSection = {
            id: crypto.randomUUID(),
            type,
            title: SECTION_META[type].defaultTitle,
            visible: true,
            items: [],
        };

        const sections = [...document.content.sections];
        const insertAt =
            afterIndex !== undefined ? afterIndex + 1 : sections.length;
        sections.splice(insertAt, 0, newSection);

        set({
            document: { ...document, content: { sections } },
            isDirty: true,
        });
    },

    removeSection: (index) => {
        const { document } = get();
        if (!document) return;
        pushHistory(set, get);

        const sections = [...document.content.sections];
        sections.splice(index, 1);

        set({
            document: { ...document, content: { sections } },
            isDirty: true,
        });
    },

    moveSection: (from, to) => {
        const { document } = get();
        if (!document) return;
        if (from === to) return;
        pushHistory(set, get);

        const sections = [...document.content.sections];
        const [moved] = sections.splice(from, 1);
        sections.splice(to, 0, moved);

        set({
            document: { ...document, content: { sections } },
            isDirty: true,
        });
    },

    updateSectionTitle: (index, title) => {
        const { document } = get();
        if (!document) return;
        pushHistory(set, get);

        const sections = [...document.content.sections];
        sections[index] = { ...sections[index], title };

        set({
            document: { ...document, content: { sections } },
            isDirty: true,
        });
    },

    toggleSectionVisibility: (index) => {
        const { document } = get();
        if (!document) return;
        pushHistory(set, get);

        const sections = [...document.content.sections];
        sections[index] = {
            ...sections[index],
            visible: !sections[index].visible,
        };

        set({
            document: { ...document, content: { sections } },
            isDirty: true,
        });
    },

    // -- Items --

    addItem: (sectionIndex, item) => {
        const { document } = get();
        if (!document) return;
        pushHistory(set, get);

        const sections = [...document.content.sections];
        const section = { ...sections[sectionIndex] };
        section.items = [...section.items, item];
        sections[sectionIndex] = section;

        set({
            document: { ...document, content: { sections } },
            isDirty: true,
        });
    },

    removeItem: (sectionIndex, itemIndex) => {
        const { document } = get();
        if (!document) return;
        pushHistory(set, get);

        const sections = [...document.content.sections];
        const section = { ...sections[sectionIndex] };
        section.items = [...section.items];
        section.items.splice(itemIndex, 1);
        sections[sectionIndex] = section;

        set({
            document: { ...document, content: { sections } },
            isDirty: true,
        });
    },

    moveItem: (sectionIndex, from, to) => {
        const { document } = get();
        if (!document) return;
        if (from === to) return;
        pushHistory(set, get);

        const sections = [...document.content.sections];
        const section = { ...sections[sectionIndex] };
        section.items = [...section.items];
        const [moved] = section.items.splice(from, 1);
        section.items.splice(to, 0, moved);
        sections[sectionIndex] = section;

        set({
            document: { ...document, content: { sections } },
            isDirty: true,
        });
    },

    updateItemField: (sectionIndex, itemIndex, field, value) => {
        const { document } = get();
        if (!document) return;
        pushHistory(set, get);

        const sections = [...document.content.sections];
        const section = { ...sections[sectionIndex] };
        section.items = [...section.items];
        section.items[itemIndex] = {
            ...section.items[itemIndex],
            fields: { ...section.items[itemIndex].fields, [field]: value },
        };
        sections[sectionIndex] = section;

        set({
            document: { ...document, content: { sections } },
            isDirty: true,
        });
    },

    // -- Sub-items --

    addSubItem: (sectionIndex, itemIndex, subItem) => {
        const { document } = get();
        if (!document) return;
        pushHistory(set, get);

        const sections = [...document.content.sections];
        const section = { ...sections[sectionIndex] };
        section.items = [...section.items];
        const item = { ...section.items[itemIndex] };
        item.subItems = [...(item.subItems || []), subItem];
        section.items[itemIndex] = item;
        sections[sectionIndex] = section;

        set({
            document: { ...document, content: { sections } },
            isDirty: true,
        });
    },

    removeSubItem: (sectionIndex, itemIndex, subItemIndex) => {
        const { document } = get();
        if (!document) return;
        pushHistory(set, get);

        const sections = [...document.content.sections];
        const section = { ...sections[sectionIndex] };
        section.items = [...section.items];
        const item = { ...section.items[itemIndex] };
        item.subItems = [...(item.subItems || [])];
        item.subItems.splice(subItemIndex, 1);
        section.items[itemIndex] = item;
        sections[sectionIndex] = section;

        set({
            document: { ...document, content: { sections } },
            isDirty: true,
        });
    },

    moveSubItem: (sectionIndex, itemIndex, from, to) => {
        const { document } = get();
        if (!document) return;
        if (from === to) return;
        pushHistory(set, get);

        const sections = [...document.content.sections];
        const section = { ...sections[sectionIndex] };
        section.items = [...section.items];
        const item = { ...section.items[itemIndex] };
        item.subItems = [...(item.subItems || [])];
        const [moved] = item.subItems.splice(from, 1);
        item.subItems.splice(to, 0, moved);
        section.items[itemIndex] = item;
        sections[sectionIndex] = section;

        set({
            document: { ...document, content: { sections } },
            isDirty: true,
        });
    },

    updateSubItemField: (
        sectionIndex,
        itemIndex,
        subItemIndex,
        field,
        value
    ) => {
        const { document } = get();
        if (!document) return;
        pushHistory(set, get);

        const sections = [...document.content.sections];
        const section = { ...sections[sectionIndex] };
        section.items = [...section.items];
        const item = { ...section.items[itemIndex] };
        item.subItems = [...(item.subItems || [])];
        item.subItems[subItemIndex] = {
            ...item.subItems[subItemIndex],
            fields: { ...item.subItems[subItemIndex].fields, [field]: value },
        };
        section.items[itemIndex] = item;
        sections[sectionIndex] = section;

        set({
            document: { ...document, content: { sections } },
            isDirty: true,
        });
    },

    // -- Sorting --

    sortItemsByDate: (sectionIndex, direction) => {
        const { document } = get();
        if (!document) return;

        const section = document.content.sections[sectionIndex];
        const dateField = findFirstDateField(section.type);
        if (!dateField) return;

        pushHistory(set, get);

        const sections = [...document.content.sections];
        const sorted = [...section.items].sort((a, b) => {
            const dateA = getDateValue(a.fields[dateField] || '');
            const dateB = getDateValue(b.fields[dateField] || '');
            return direction === 'desc' ? dateB - dateA : dateA - dateB;
        });
        sections[sectionIndex] = { ...section, items: sorted };

        set({
            document: { ...document, content: { sections } },
            isDirty: true,
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
}));

// -- Internal: push current content to history stack --

function pushHistory(
    set: (partial: Partial<CvDocumentState>) => void,
    get: () => CvDocumentStore
) {
    const { document, history } = get();
    if (!document) return;

    const newHistory = [...history, cloneContent(document.content)];
    if (newHistory.length > MAX_HISTORY) {
        newHistory.shift();
    }

    set({ history: newHistory, future: [] });
}
