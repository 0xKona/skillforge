import { cvImport } from './cv-import';
import type { Ingot, Billet, IngotField } from '../types/ingot-types';

function makeField(
    value: string,
    inputType = 'text',
    mandatory = false
): IngotField {
    return {
        value,
        inputType: inputType as IngotField['inputType'],
        mandatory,
    };
}

function makeIngot(overrides?: Partial<Ingot>): Ingot {
    return {
        id: 'ingot-1',
        name: 'Test Ingot',
        type: 'ingot_experience',
        content: {
            fields: {
                companyName: makeField('Acme Corp'),
                startDate: makeField('2022-01', 'date', true),
                endDate: makeField('Present', 'date', true),
                location: makeField('London'),
            },
            billetFormat: 'billet_exp_job',
            billets: [
                {
                    id: 'billet-1',
                    type: 'billet_exp_job',
                    fields: {
                        jobTitle: makeField('Developer', 'text', true),
                        jobDescription: makeField('Built things', 'textarea'),
                        startDate: makeField('2022-01', 'date', true),
                        endDate: makeField('Present', 'date', true),
                    },
                },
                {
                    id: 'billet-2',
                    type: 'billet_exp_job',
                    fields: {
                        jobTitle: makeField('Junior Dev', 'text', true),
                        jobDescription: makeField('Learned things', 'textarea'),
                        startDate: makeField('2022-01', 'date', true),
                        endDate: makeField('2022-06', 'date', true),
                    },
                },
            ],
        },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        ...overrides,
    };
}

describe('cvImport.extractFields', () => {
    it('converts IngotField records to flat string map', () => {
        const fields = {
            name: makeField('John'),
            email: makeField('john@test.com', 'email'),
        };
        const result = cvImport.extractFields(fields);
        expect(result).toEqual({ name: 'John', email: 'john@test.com' });
    });

    it('converts null/undefined values to empty string', () => {
        const fields = {
            name: { value: '', inputType: 'text' as const, mandatory: true },
        };
        expect(cvImport.extractFields(fields).name).toBe('');
    });
});

describe('cvImport.fromBillet', () => {
    it('converts a billet to a DocumentItem', () => {
        const billet: Billet = {
            id: 'billet-1',
            type: 'billet_exp_job',
            fields: {
                jobTitle: makeField('Developer'),
                jobDescription: makeField('Built stuff'),
            },
        };
        const item = cvImport.fromBillet(billet);

        expect(item.id).toBeDefined();
        expect(item.id).not.toBe('billet-1'); // new unique ID
        expect(item.fields.jobTitle).toBe('Developer');
        expect(item.fields.jobDescription).toBe('Built stuff');
        expect(item.subItems).toBeUndefined();
        expect(item.sourceIngotId).toBeUndefined();
    });
});

describe('cvImport.fromIngot', () => {
    it('converts an ingot with billets to DocumentItem with subItems', () => {
        const ingot = makeIngot();
        const item = cvImport.fromIngot(ingot);

        expect(item.id).toBeDefined();
        expect(item.fields.companyName).toBe('Acme Corp');
        expect(item.fields.startDate).toBe('2022-01');
        expect(item.fields.endDate).toBe('Present');
        expect(item.fields.location).toBe('London');
        expect(item.sourceIngotId).toBe('ingot-1');
        expect(item.subItems).toHaveLength(2);
        expect(item.subItems![0].fields.jobTitle).toBe('Developer');
        expect(item.subItems![1].fields.jobTitle).toBe('Junior Dev');
    });

    it('converts an ingot without billets (subItems is undefined)', () => {
        const ingot = makeIngot({
            type: 'ingot_certification',
            content: {
                fields: {
                    certName: makeField('AWS SA'),
                    certDate: makeField('2024-03', 'date'),
                    certDescription: makeField('Cloud cert'),
                },
                billetFormat: null,
                billets: [],
            },
        });
        const item = cvImport.fromIngot(ingot);

        expect(item.fields.certName).toBe('AWS SA');
        expect(item.subItems).toBeUndefined();
        expect(item.sourceIngotId).toBe('ingot-1');
    });

    it('generates unique IDs for each call', () => {
        const ingot = makeIngot();
        const item1 = cvImport.fromIngot(ingot);
        const item2 = cvImport.fromIngot(ingot);

        expect(item1.id).not.toBe(item2.id);
    });

    it('generates unique IDs for sub-items', () => {
        const ingot = makeIngot();
        const item = cvImport.fromIngot(ingot);

        expect(item.subItems![0].id).not.toBe(item.subItems![1].id);
    });
});

describe('cvImport.fromIngotWithBillets', () => {
    it('includes only specified billets', () => {
        const ingot = makeIngot();
        const item = cvImport.fromIngotWithBillets(ingot, ['billet-1']);

        expect(item.subItems).toHaveLength(1);
        expect(item.subItems![0].fields.jobTitle).toBe('Developer');
    });

    it('returns undefined subItems when no billets match', () => {
        const ingot = makeIngot();
        const item = cvImport.fromIngotWithBillets(ingot, ['nonexistent']);

        expect(item.subItems).toBeUndefined();
    });

    it('still copies top-level fields correctly', () => {
        const ingot = makeIngot();
        const item = cvImport.fromIngotWithBillets(ingot, []);

        expect(item.fields.companyName).toBe('Acme Corp');
        expect(item.sourceIngotId).toBe('ingot-1');
    });
});

describe('cvImport.toSectionType', () => {
    it('strips ingot_ prefix for all types', () => {
        expect(cvImport.toSectionType('ingot_education')).toBe('education');
        expect(cvImport.toSectionType('ingot_experience')).toBe('experience');
        expect(cvImport.toSectionType('ingot_project')).toBe('project');
        expect(cvImport.toSectionType('ingot_skill')).toBe('skill');
        expect(cvImport.toSectionType('ingot_certification')).toBe(
            'certification'
        );
        expect(cvImport.toSectionType('ingot_personal_info')).toBe(
            'personal_info'
        );
        expect(cvImport.toSectionType('ingot_personal_statement')).toBe(
            'personal_statement'
        );
        expect(cvImport.toSectionType('ingot_hobby')).toBe('hobby');
        expect(cvImport.toSectionType('ingot_reference')).toBe('reference');
    });
});

describe('cvImport.emptyItem', () => {
    it('creates empty fields matching experience schema', () => {
        const item = cvImport.emptyItem('experience');

        expect(item.id).toBeDefined();
        expect(Object.keys(item.fields)).toEqual([
            'companyName',
            'location',
            'startDate',
            'endDate',
        ]);
        expect(Object.values(item.fields).every((v) => v === '')).toBe(true);
    });

    it('creates empty fields matching education schema', () => {
        const item = cvImport.emptyItem('education');

        expect(Object.keys(item.fields)).toContain('schoolName');
        expect(Object.keys(item.fields)).toContain('qualificationLevel');
    });

    it('creates empty fields matching personal_info schema', () => {
        const item = cvImport.emptyItem('personal_info');

        expect(Object.keys(item.fields)).toEqual([
            'name',
            'email',
            'phone',
            'address',
        ]);
    });

    it('generates unique IDs', () => {
        const a = cvImport.emptyItem('experience');
        const b = cvImport.emptyItem('experience');
        expect(a.id).not.toBe(b.id);
    });
});

describe('cvImport.emptySubItem', () => {
    it('creates empty sub-fields matching experience sub-schema', () => {
        const sub = cvImport.emptySubItem('experience');

        expect(Object.keys(sub.fields)).toEqual([
            'jobTitle',
            'jobDescription',
            'startDate',
            'endDate',
        ]);
        expect(Object.values(sub.fields).every((v) => v === '')).toBe(true);
    });

    it('creates empty sub-fields matching skill sub-schema', () => {
        const sub = cvImport.emptySubItem('skill');

        expect(Object.keys(sub.fields)).toEqual(['skillName', 'description']);
    });

    it('returns empty fields object for sections without sub-schemas', () => {
        const sub = cvImport.emptySubItem('certification');

        expect(sub.fields).toEqual({});
    });

    it('creates empty sub-fields matching personal_info sub-schema (socials)', () => {
        const sub = cvImport.emptySubItem('personal_info');

        expect(Object.keys(sub.fields)).toEqual(['platform', 'handle', 'url']);
    });
});

describe('cvImport.toIngot', () => {
    it('converts a DocumentItem and its subItems back into a valid NewIngot', () => {
        const docItem = {
            id: 'item-123',
            fields: {
                companyName: 'Meta',
                location: 'London',
            },
            subItems: [
                {
                    id: 'sub-1',
                    fields: {
                        jobTitle: 'Production Engineer',
                        jobDescription: 'Managed large fleet infrastructure',
                    },
                },
            ],
        };

        const ingot = cvImport.toIngot(docItem, 'experience', 'Meta Career');

        expect(ingot.name).toBe('Meta Career');
        expect(ingot.type).toBe('ingot_experience');
        expect(ingot.content.fields.companyName.value).toBe('Meta');
        expect(ingot.content.billets).toHaveLength(1);
        expect(ingot.content.billets[0].fields.jobTitle.value).toBe(
            'Production Engineer'
        );
    });
});
