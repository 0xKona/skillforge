import { BilletHelper } from './billet-helpers';
import { Billet, IngotField } from '../../types/ingot-types';

// Mock the BILLET_TEMPLATES to have predictable data for testing
jest.mock('../../templates/ingot-templates', () => ({
    BILLET_TEMPLATES: {
        'test-type': {
            fields: {
                name: {},
                jobTitle: {},
                startDate: {},
            },
        },
    },
}));

describe('BilletHelper', () => {
    const mockBillet: Billet = {
        id: '1',
        type: 'test-type',
        fields: {
            name: { value: 'Test Name', mandatory: false, inputType: 'text' },
            jobTitle: {
                value: 'Developer',
                mandatory: false,
                inputType: 'text',
            },
            startDate: {
                value: '2023-01-01',
                mandatory: false,
                inputType: 'date',
            },
        },
    };

    describe('getBilletFieldNames', () => {
        it('returns keys from the template definition', () => {
            const fieldNames = BilletHelper.getBilletFieldNames(mockBillet);
            // Expect the keys defined in the mock BILLET_TEMPLATES
            expect(fieldNames).toEqual(['name', 'jobTitle', 'startDate']);
        });
    });

    describe('getBilletDisplayName', () => {
        it('returns name if present', () => {
            const billet: Billet = {
                ...mockBillet,
                fields: {
                    name: {
                        value: 'My Name',
                        mandatory: false,
                        inputType: 'text',
                    },
                },
            };
            expect(BilletHelper.getBilletDisplayName(billet)).toBe('My Name');
        });

        it('returns jobTitle if name is missing', () => {
            const billet: Billet = {
                ...mockBillet,
                fields: {
                    jobTitle: {
                        value: 'Engineer',
                        mandatory: false,
                        inputType: 'text',
                    },
                },
            };
            expect(BilletHelper.getBilletDisplayName(billet)).toBe('Engineer');
        });

        it('returns Untitled Item if no display fields are found', () => {
            const billet: Billet = {
                ...mockBillet,
                fields: {
                    otherField: {
                        value: 'Something',
                        mandatory: false,
                        inputType: 'text',
                    },
                } as unknown as Record<string, IngotField>,
            };
            expect(BilletHelper.getBilletDisplayName(billet)).toBe(
                'Untitled Item'
            );
        });
    });

    describe('sortBillets', () => {
        const billet1: Billet = {
            ...mockBillet,
            id: '1',
            fields: {
                startDate: {
                    value: '2023-01-01',
                    mandatory: false,
                    inputType: 'date',
                },
            },
        };
        const billet2: Billet = {
            ...mockBillet,
            id: '2',
            fields: {
                startDate: {
                    value: '2024-01-01',
                    mandatory: false,
                    inputType: 'date',
                },
            },
        };
        const billetPresent: Billet = {
            ...mockBillet,
            id: '3',
            fields: {
                startDate: {
                    value: 'Present',
                    mandatory: false,
                    inputType: 'date',
                },
            },
        };

        it('returns original array if sortBy is undefined', () => {
            const result = BilletHelper.sortBillets([billet2, billet1]);
            expect(result).toEqual([billet2, billet1]);
        });

        it('sorts by date ascending (oldest first)', () => {
            const result = BilletHelper.sortBillets(
                [billet2, billet1],
                'date-asc'
            );
            expect(result[0].id).toBe('1'); // 2023
            expect(result[1].id).toBe('2'); // 2024
        });

        it('sorts by date descending (newest first)', () => {
            const result = BilletHelper.sortBillets(
                [billet1, billet2],
                'date-desc'
            );
            expect(result[0].id).toBe('2'); // 2024
            expect(result[1].id).toBe('1'); // 2023
        });

        it('handles "Present" as current date (newest)', () => {
            const result = BilletHelper.sortBillets(
                [billet2, billetPresent],
                'date-desc'
            );
            // Present should be newer than 2024
            expect(result[0].id).toBe('3');
            expect(result[1].id).toBe('2');
        });
    });
});
