import { useCvDocumentStore } from './use-cv-document';
import type { CvDocument, DocumentItem } from '../types/cv-document-types';

// Reset store before each test
beforeEach(() => {
    useCvDocumentStore.getState().reset();
});

function makeDocument(overrides?: Partial<CvDocument>): CvDocument {
    return {
        id: 'cv-1',
        version: 1,
        title: 'Test CV',
        content: {
            sections: [
                {
                    id: 'section-exp',
                    type: 'experience',
                    title: 'Experience',
                    visible: true,
                    items: [
                        {
                            id: 'item-1',
                            fields: {
                                companyName: 'Acme',
                                startDate: '2022-01',
                                endDate: 'Present',
                            },
                        },
                        {
                            id: 'item-2',
                            fields: {
                                companyName: 'BigCo',
                                startDate: '2020-06',
                                endDate: '2021-12',
                            },
                        },
                    ],
                },
                {
                    id: 'section-edu',
                    type: 'education',
                    title: 'Education',
                    visible: true,
                    items: [
                        {
                            id: 'item-3',
                            fields: {
                                schoolName: 'Uni',
                                startDate: '2018',
                                endDate: '2022',
                            },
                            subItems: [
                                {
                                    id: 'sub-1',
                                    fields: { name: 'Maths', grade: 'A' },
                                },
                                {
                                    id: 'sub-2',
                                    fields: { name: 'Physics', grade: 'B' },
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        ...overrides,
    };
}

function makeItem(id: string, fields: Record<string, string>): DocumentItem {
    return { id, fields };
}

describe('use-cv-document: lifecycle', () => {
    it('starts with null document', () => {
        const { document } = useCvDocumentStore.getState();
        expect(document).toBeNull();
    });

    it('setDocument loads a document and clears history', () => {
        const doc = makeDocument();
        useCvDocumentStore.getState().setDocument(doc);

        const state = useCvDocumentStore.getState();
        expect(state.document).toEqual(doc);
        expect(state.history).toHaveLength(0);
        expect(state.future).toHaveLength(0);
        expect(state.isDirty).toBe(false);
    });

    it('markSaved clears isDirty', () => {
        useCvDocumentStore.getState().setDocument(makeDocument());
        useCvDocumentStore.getState().updateTitle('Changed');
        expect(useCvDocumentStore.getState().isDirty).toBe(true);

        useCvDocumentStore.getState().markSaved();
        expect(useCvDocumentStore.getState().isDirty).toBe(false);
    });

    it('reset returns to default state', () => {
        useCvDocumentStore.getState().setDocument(makeDocument());
        useCvDocumentStore.getState().addSection('skill');
        useCvDocumentStore.getState().reset();

        const state = useCvDocumentStore.getState();
        expect(state.document).toBeNull();
        expect(state.history).toHaveLength(0);
        expect(state.isDirty).toBe(false);
    });
});

describe('use-cv-document: metadata', () => {
    it('updateTitle changes the title', () => {
        useCvDocumentStore.getState().setDocument(makeDocument());
        useCvDocumentStore.getState().updateTitle('New Title');

        expect(useCvDocumentStore.getState().document!.title).toBe('New Title');
        expect(useCvDocumentStore.getState().isDirty).toBe(true);
    });

    it('updateDescription changes the description', () => {
        useCvDocumentStore.getState().setDocument(makeDocument());
        useCvDocumentStore.getState().updateDescription('A new description');

        expect(useCvDocumentStore.getState().document!.description).toBe(
            'A new description'
        );
    });

    it('metadata changes do not push to undo stack', () => {
        useCvDocumentStore.getState().setDocument(makeDocument());
        useCvDocumentStore.getState().updateTitle('Changed');
        useCvDocumentStore.getState().updateDescription('Desc');

        expect(useCvDocumentStore.getState().history).toHaveLength(0);
    });
});

describe('use-cv-document: sections', () => {
    it('addSection appends a new section', () => {
        useCvDocumentStore.getState().setDocument(makeDocument());
        useCvDocumentStore.getState().addSection('skill');

        const sections =
            useCvDocumentStore.getState().document!.content.sections;
        expect(sections).toHaveLength(3);
        expect(sections[2].type).toBe('skill');
        expect(sections[2].title).toBe('Skills');
        expect(sections[2].visible).toBe(true);
        expect(sections[2].items).toEqual([]);
    });

    it('addSection inserts after specified index', () => {
        useCvDocumentStore.getState().setDocument(makeDocument());
        useCvDocumentStore.getState().addSection('skill', 0);

        const sections =
            useCvDocumentStore.getState().document!.content.sections;
        expect(sections).toHaveLength(3);
        expect(sections[1].type).toBe('skill');
    });

    it('removeSection removes the section at index', () => {
        useCvDocumentStore.getState().setDocument(makeDocument());
        useCvDocumentStore.getState().removeSection(0);

        const sections =
            useCvDocumentStore.getState().document!.content.sections;
        expect(sections).toHaveLength(1);
        expect(sections[0].type).toBe('education');
    });

    it('moveSection reorders sections', () => {
        useCvDocumentStore.getState().setDocument(makeDocument());
        useCvDocumentStore.getState().moveSection(0, 1);

        const sections =
            useCvDocumentStore.getState().document!.content.sections;
        expect(sections[0].type).toBe('education');
        expect(sections[1].type).toBe('experience');
    });

    it('moveSection with same index is a no-op', () => {
        useCvDocumentStore.getState().setDocument(makeDocument());
        useCvDocumentStore.getState().moveSection(0, 0);

        expect(useCvDocumentStore.getState().history).toHaveLength(0);
    });

    it('updateSectionTitle changes the title', () => {
        useCvDocumentStore.getState().setDocument(makeDocument());
        useCvDocumentStore.getState().updateSectionTitle(0, 'Work History');

        expect(
            useCvDocumentStore.getState().document!.content.sections[0].title
        ).toBe('Work History');
    });

    it('toggleSectionVisibility flips the visible flag', () => {
        useCvDocumentStore.getState().setDocument(makeDocument());
        useCvDocumentStore.getState().toggleSectionVisibility(0);

        expect(
            useCvDocumentStore.getState().document!.content.sections[0].visible
        ).toBe(false);

        useCvDocumentStore.getState().toggleSectionVisibility(0);
        expect(
            useCvDocumentStore.getState().document!.content.sections[0].visible
        ).toBe(true);
    });
});

describe('use-cv-document: items', () => {
    it('addItem appends an item to the section', () => {
        useCvDocumentStore.getState().setDocument(makeDocument());
        useCvDocumentStore
            .getState()
            .addItem(0, makeItem('item-new', { companyName: 'NewCo' }));

        const items =
            useCvDocumentStore.getState().document!.content.sections[0].items;
        expect(items).toHaveLength(3);
        expect(items[2].fields.companyName).toBe('NewCo');
    });

    it('removeItem removes item at index', () => {
        useCvDocumentStore.getState().setDocument(makeDocument());
        useCvDocumentStore.getState().removeItem(0, 0);

        const items =
            useCvDocumentStore.getState().document!.content.sections[0].items;
        expect(items).toHaveLength(1);
        expect(items[0].id).toBe('item-2');
    });

    it('moveItem reorders items within a section', () => {
        useCvDocumentStore.getState().setDocument(makeDocument());
        useCvDocumentStore.getState().moveItem(0, 0, 1);

        const items =
            useCvDocumentStore.getState().document!.content.sections[0].items;
        expect(items[0].id).toBe('item-2');
        expect(items[1].id).toBe('item-1');
    });

    it('updateItemField updates a single field value', () => {
        useCvDocumentStore.getState().setDocument(makeDocument());
        useCvDocumentStore
            .getState()
            .updateItemField(0, 0, 'companyName', 'Acme Inc');

        const item =
            useCvDocumentStore.getState().document!.content.sections[0]
                .items[0];
        expect(item.fields.companyName).toBe('Acme Inc');
        // Other fields unchanged
        expect(item.fields.startDate).toBe('2022-01');
    });
});

describe('use-cv-document: sub-items', () => {
    it('addSubItem appends a sub-item to an item', () => {
        useCvDocumentStore.getState().setDocument(makeDocument());
        useCvDocumentStore
            .getState()
            .addSubItem(1, 0, makeItem('sub-new', { name: 'Chemistry' }));

        const subItems =
            useCvDocumentStore.getState().document!.content.sections[1].items[0]
                .subItems!;
        expect(subItems).toHaveLength(3);
        expect(subItems[2].fields.name).toBe('Chemistry');
    });

    it('removeSubItem removes a sub-item', () => {
        useCvDocumentStore.getState().setDocument(makeDocument());
        useCvDocumentStore.getState().removeSubItem(1, 0, 0);

        const subItems =
            useCvDocumentStore.getState().document!.content.sections[1].items[0]
                .subItems!;
        expect(subItems).toHaveLength(1);
        expect(subItems[0].id).toBe('sub-2');
    });

    it('moveSubItem reorders sub-items', () => {
        useCvDocumentStore.getState().setDocument(makeDocument());
        useCvDocumentStore.getState().moveSubItem(1, 0, 0, 1);

        const subItems =
            useCvDocumentStore.getState().document!.content.sections[1].items[0]
                .subItems!;
        expect(subItems[0].id).toBe('sub-2');
        expect(subItems[1].id).toBe('sub-1');
    });

    it('updateSubItemField updates a sub-item field', () => {
        useCvDocumentStore.getState().setDocument(makeDocument());
        useCvDocumentStore
            .getState()
            .updateSubItemField(1, 0, 0, 'grade', 'A*');

        const sub =
            useCvDocumentStore.getState().document!.content.sections[1].items[0]
                .subItems![0];
        expect(sub.fields.grade).toBe('A*');
        expect(sub.fields.name).toBe('Maths'); // unchanged
    });
});

describe('use-cv-document: sortItemsByDate', () => {
    it('sorts items descending by first date field', () => {
        useCvDocumentStore.getState().setDocument(makeDocument());
        useCvDocumentStore.getState().sortItemsByDate(0, 'desc');

        const items =
            useCvDocumentStore.getState().document!.content.sections[0].items;
        // "Present" is treated as current date (largest), so item-1 comes first
        expect(items[0].id).toBe('item-1');
        expect(items[1].id).toBe('item-2');
    });

    it('sorts items ascending by first date field', () => {
        useCvDocumentStore.getState().setDocument(makeDocument());
        useCvDocumentStore.getState().sortItemsByDate(0, 'asc');

        const items =
            useCvDocumentStore.getState().document!.content.sections[0].items;
        // 2020-06 < 2022-01, so item-2 comes first
        expect(items[0].id).toBe('item-2');
        expect(items[1].id).toBe('item-1');
    });

    it('does nothing for sections without date fields', () => {
        const doc = makeDocument();
        doc.content.sections.push({
            id: 'section-hobby',
            type: 'hobby',
            title: 'Hobbies',
            visible: true,
            items: [
                { id: 'h1', fields: { hobbyName: 'B' } },
                { id: 'h2', fields: { hobbyName: 'A' } },
            ],
        });
        useCvDocumentStore.getState().setDocument(doc);
        useCvDocumentStore.getState().sortItemsByDate(2, 'asc');

        const items =
            useCvDocumentStore.getState().document!.content.sections[2].items;
        expect(items[0].id).toBe('h1'); // unchanged
        expect(useCvDocumentStore.getState().history).toHaveLength(0); // no history push
    });
});

describe('use-cv-document: undo/redo', () => {
    it('canUndo returns false initially', () => {
        useCvDocumentStore.getState().setDocument(makeDocument());
        expect(useCvDocumentStore.getState().canUndo()).toBe(false);
    });

    it('canUndo returns true after an undoable action', () => {
        useCvDocumentStore.getState().setDocument(makeDocument());
        useCvDocumentStore.getState().addSection('skill');
        expect(useCvDocumentStore.getState().canUndo()).toBe(true);
    });

    it('undo reverts the last action', () => {
        useCvDocumentStore.getState().setDocument(makeDocument());
        useCvDocumentStore.getState().addSection('skill');
        useCvDocumentStore.getState().undo();

        const sections =
            useCvDocumentStore.getState().document!.content.sections;
        expect(sections).toHaveLength(2); // back to original 2
    });

    it('redo re-applies an undone action', () => {
        useCvDocumentStore.getState().setDocument(makeDocument());
        useCvDocumentStore.getState().addSection('skill');
        useCvDocumentStore.getState().undo();
        useCvDocumentStore.getState().redo();

        const sections =
            useCvDocumentStore.getState().document!.content.sections;
        expect(sections).toHaveLength(3);
        expect(sections[2].type).toBe('skill');
    });

    it('new action clears redo stack', () => {
        useCvDocumentStore.getState().setDocument(makeDocument());
        useCvDocumentStore.getState().addSection('skill');
        useCvDocumentStore.getState().undo();
        expect(useCvDocumentStore.getState().canRedo()).toBe(true);

        useCvDocumentStore.getState().addSection('hobby');
        expect(useCvDocumentStore.getState().canRedo()).toBe(false);
    });

    it('history is capped at 20 entries', () => {
        useCvDocumentStore.getState().setDocument(makeDocument());

        for (let i = 0; i < 25; i++) {
            useCvDocumentStore.getState().updateSectionTitle(0, `Title ${i}`);
        }

        expect(
            useCvDocumentStore.getState().history.length
        ).toBeLessThanOrEqual(20);
    });

    it('multiple undos restore progressively earlier states', () => {
        useCvDocumentStore.getState().setDocument(makeDocument());
        useCvDocumentStore.getState().updateSectionTitle(0, 'First');
        useCvDocumentStore.getState().updateSectionTitle(0, 'Second');
        useCvDocumentStore.getState().updateSectionTitle(0, 'Third');

        useCvDocumentStore.getState().undo();
        expect(
            useCvDocumentStore.getState().document!.content.sections[0].title
        ).toBe('Second');

        useCvDocumentStore.getState().undo();
        expect(
            useCvDocumentStore.getState().document!.content.sections[0].title
        ).toBe('First');

        useCvDocumentStore.getState().undo();
        expect(
            useCvDocumentStore.getState().document!.content.sections[0].title
        ).toBe('Experience');
    });
});

describe('use-cv-document: isDirty', () => {
    it('is false after setDocument', () => {
        useCvDocumentStore.getState().setDocument(makeDocument());
        expect(useCvDocumentStore.getState().isDirty).toBe(false);
    });

    it('becomes true after content change', () => {
        useCvDocumentStore.getState().setDocument(makeDocument());
        useCvDocumentStore.getState().addSection('skill');
        expect(useCvDocumentStore.getState().isDirty).toBe(true);
    });

    it('becomes false after markSaved', () => {
        useCvDocumentStore.getState().setDocument(makeDocument());
        useCvDocumentStore.getState().addSection('skill');
        useCvDocumentStore.getState().markSaved();
        expect(useCvDocumentStore.getState().isDirty).toBe(false);
    });

    it('becomes true after undo', () => {
        useCvDocumentStore.getState().setDocument(makeDocument());
        useCvDocumentStore.getState().addSection('skill');
        useCvDocumentStore.getState().markSaved();
        useCvDocumentStore.getState().undo();
        expect(useCvDocumentStore.getState().isDirty).toBe(true);
    });
});

describe('use-cv-document: settings preservation', () => {
    it('preserves document content settings during section and item mutations', () => {
        const doc = makeDocument();
        doc.content.settings = { fontFamily: 'times' };
        useCvDocumentStore.getState().setDocument(doc);

        useCvDocumentStore.getState().addSection('skill');
        expect(
            useCvDocumentStore.getState().document!.content.settings?.fontFamily
        ).toBe('times');

        useCvDocumentStore
            .getState()
            .addItem(0, makeItem('item-new', { companyName: 'NewCo' }));
        expect(
            useCvDocumentStore.getState().document!.content.settings?.fontFamily
        ).toBe('times');

        useCvDocumentStore
            .getState()
            .updateItemField(0, 0, 'companyName', 'Acme Ltd');
        expect(
            useCvDocumentStore.getState().document!.content.settings?.fontFamily
        ).toBe('times');

        useCvDocumentStore.getState().sortItemsByDate(0, 'asc');
        expect(
            useCvDocumentStore.getState().document!.content.settings?.fontFamily
        ).toBe('times');
    });
});
