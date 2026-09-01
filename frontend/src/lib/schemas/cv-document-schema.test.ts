import {
    cvDocumentSchema,
    newCvDocumentSchema,
    cvDocumentValidation,
} from './cv-document-schema';

describe('cvDocumentSchema', () => {
    const validDocument = {
        id: 'cv-123',
        version: 1,
        title: 'My CV',
        content: {
            sections: [
                {
                    id: 'section-1',
                    type: 'experience',
                    title: 'Experience',
                    visible: true,
                    items: [
                        {
                            id: 'item-1',
                            fields: {
                                companyName: 'Acme',
                                startDate: '2022-01',
                            },
                        },
                    ],
                },
            ],
        },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
    };

    it('accepts a valid document', () => {
        const result = cvDocumentSchema.safeParse(validDocument);
        expect(result.success).toBe(true);
    });

    it('rejects a document with empty title', () => {
        const result = cvDocumentSchema.safeParse({
            ...validDocument,
            title: '',
        });
        expect(result.success).toBe(false);
    });

    it('rejects a document with missing id', () => {
        const result = cvDocumentSchema.safeParse({ ...validDocument, id: '' });
        expect(result.success).toBe(false);
    });

    it('rejects a document with invalid section type', () => {
        const doc = {
            ...validDocument,
            content: {
                sections: [
                    {
                        id: 'section-bad',
                        type: 'invalid_type',
                        title: 'Bad',
                        visible: true,
                        items: [],
                    },
                ],
            },
        };
        const result = cvDocumentSchema.safeParse(doc);
        expect(result.success).toBe(false);
    });

    it('accepts a document with optional description', () => {
        const result = cvDocumentSchema.safeParse({
            ...validDocument,
            description: 'A great CV',
        });
        expect(result.success).toBe(true);
    });

    it('accepts items with subItems', () => {
        const doc = {
            ...validDocument,
            content: {
                sections: [
                    {
                        id: 'section-edu',
                        type: 'education',
                        title: 'Education',
                        visible: true,
                        items: [
                            {
                                id: 'item-1',
                                fields: { schoolName: 'Uni' },
                                subItems: [
                                    {
                                        id: 'sub-1',
                                        fields: { name: 'Maths', grade: 'A' },
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        };
        const result = cvDocumentSchema.safeParse(doc);
        expect(result.success).toBe(true);
    });

    it('accepts items with sourceIngotId', () => {
        const doc = {
            ...validDocument,
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
                                fields: { companyName: 'Acme' },
                                sourceIngotId: 'ingot-abc',
                            },
                        ],
                    },
                ],
            },
        };
        const result = cvDocumentSchema.safeParse(doc);
        expect(result.success).toBe(true);
    });
});

describe('newCvDocumentSchema', () => {
    it('accepts a document without id, createdAt, updatedAt', () => {
        const result = newCvDocumentSchema.safeParse({
            version: 1,
            title: 'New CV',
            content: { sections: [] },
        });
        expect(result.success).toBe(true);
    });

    it('rejects if version is missing', () => {
        const result = newCvDocumentSchema.safeParse({
            title: 'New CV',
            content: { sections: [] },
        });
        expect(result.success).toBe(false);
    });
});

describe('cvDocumentValidation.validateFieldValue', () => {
    const { validateFieldValue } = cvDocumentValidation;

    it('returns error for required empty field', () => {
        const def = { type: 'text' as const, required: true, label: 'Name' };
        expect(validateFieldValue('name', '', def)).toBe('Name is required');
    });

    it('returns error for required undefined field', () => {
        const def = { type: 'text' as const, required: true, label: 'Name' };
        expect(validateFieldValue('name', undefined, def)).toBe(
            'Name is required'
        );
    });

    it('returns null for optional empty field', () => {
        const def = {
            type: 'text' as const,
            required: false,
            label: 'Address',
        };
        expect(validateFieldValue('address', '', def)).toBeNull();
    });

    it('returns null for valid text field', () => {
        const def = { type: 'text' as const, required: true, label: 'Name' };
        expect(validateFieldValue('name', 'John', def)).toBeNull();
    });

    it('returns error for invalid email', () => {
        const def = { type: 'email' as const, required: false, label: 'Email' };
        expect(validateFieldValue('email', 'not-an-email', def)).toBe(
            'Email must be a valid email'
        );
    });

    it('returns null for valid email', () => {
        const def = { type: 'email' as const, required: false, label: 'Email' };
        expect(validateFieldValue('email', 'john@example.com', def)).toBeNull();
    });

    it('returns error for invalid URL', () => {
        const def = { type: 'url' as const, required: false, label: 'Website' };
        expect(validateFieldValue('url', 'not-a-url', def)).toBe(
            'Website must be a valid URL'
        );
    });

    it('returns null for valid URL', () => {
        const def = { type: 'url' as const, required: false, label: 'Website' };
        expect(
            validateFieldValue('url', 'https://example.com', def)
        ).toBeNull();
    });

    it('returns error for invalid select option', () => {
        const def = {
            type: 'select' as const,
            required: false,
            label: 'Level',
            options: ['GCSE', 'A-Level'] as readonly string[],
        };
        expect(validateFieldValue('level', 'PhD', def)).toBe(
            'Level must be one of: GCSE, A-Level'
        );
    });

    it('returns null for valid select option', () => {
        const def = {
            type: 'select' as const,
            required: false,
            label: 'Level',
            options: ['GCSE', 'A-Level'] as readonly string[],
        };
        expect(validateFieldValue('level', 'GCSE', def)).toBeNull();
    });
});

describe('cvDocumentValidation.validateSectionItems', () => {
    const { validateSectionItems } = cvDocumentValidation;

    it('returns empty array for valid experience items', () => {
        const items = [
            {
                id: 'item-1',
                fields: {
                    companyName: 'Acme',
                    startDate: '2022-01',
                    endDate: 'Present',
                    location: 'London',
                },
            },
        ];
        const errors = validateSectionItems('experience', items);
        expect(errors).toEqual([]);
    });

    it('returns errors for missing required fields', () => {
        const items = [{ id: 'item-1', fields: { location: 'London' } }];
        const errors = validateSectionItems('experience', items);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors.some((e) => e.field === 'companyName')).toBe(true);
        expect(errors.some((e) => e.field === 'startDate')).toBe(true);
        expect(errors.some((e) => e.field === 'endDate')).toBe(true);
    });

    it('validates sub-items when present', () => {
        const items = [
            {
                id: 'item-1',
                fields: { groupName: 'Languages' },
                subItems: [
                    { id: 'sub-1', fields: { skillName: '' } }, // required but empty
                ],
            },
        ];
        const errors = validateSectionItems('skill', items);
        expect(errors.length).toBe(1);
        expect(errors[0].itemId).toBe('sub-1');
        expect(errors[0].field).toBe('skillName');
    });

    it('returns empty for valid personal_info with sub-items', () => {
        const items = [
            {
                id: 'item-1',
                fields: { name: 'John Smith', email: 'john@example.com' },
                subItems: [
                    {
                        id: 'sub-1',
                        fields: {
                            platform: 'LinkedIn',
                            handle: '/in/john',
                            url: 'https://linkedin.com/in/john',
                        },
                    },
                ],
            },
        ];
        const errors = validateSectionItems('personal_info', items);
        expect(errors).toEqual([]);
    });

    it('catches invalid email in personal_info', () => {
        const items = [
            { id: 'item-1', fields: { name: 'John', email: 'bad-email' } },
        ];
        const errors = validateSectionItems('personal_info', items);
        expect(errors.length).toBe(1);
        expect(errors[0].field).toBe('email');
    });
});

describe('cvDocumentValidation.validateDocument', () => {
    const { validateDocument } = cvDocumentValidation;

    it('returns empty object for fully valid document', () => {
        const sections = [
            {
                type: 'experience' as const,
                items: [
                    {
                        id: 'item-1',
                        fields: {
                            companyName: 'Acme',
                            startDate: '2022',
                            endDate: 'Present',
                        },
                    },
                ],
            },
            {
                type: 'education' as const,
                items: [
                    {
                        id: 'item-2',
                        fields: {
                            schoolName: 'Uni',
                            startDate: '2018',
                            endDate: '2022',
                        },
                    },
                ],
            },
        ];
        const result = validateDocument(sections);
        expect(Object.keys(result)).toHaveLength(0);
    });

    it('groups errors by section type', () => {
        const sections = [
            {
                type: 'experience' as const,
                items: [{ id: 'item-1', fields: {} }],
            },
            {
                type: 'education' as const,
                items: [{ id: 'item-2', fields: {} }],
            },
        ];
        const result = validateDocument(sections);
        expect(result['experience']).toBeDefined();
        expect(result['education']).toBeDefined();
        expect(result['experience'].length).toBeGreaterThan(0);
        expect(result['education'].length).toBeGreaterThan(0);
    });

    it('skips sections with no errors', () => {
        const sections = [
            {
                type: 'experience' as const,
                items: [
                    {
                        id: 'item-1',
                        fields: {
                            companyName: 'Acme',
                            startDate: '2022',
                            endDate: 'Present',
                        },
                    },
                ],
            },
            {
                type: 'education' as const,
                items: [{ id: 'item-2', fields: {} }], // missing required fields
            },
        ];
        const result = validateDocument(sections);
        expect(result['experience']).toBeUndefined();
        expect(result['education']).toBeDefined();
    });
});
