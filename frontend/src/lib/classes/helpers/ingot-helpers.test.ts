import IngotHelpers from './ingot-helpers';
import { Ingot } from '../../types/ingot-types';

describe('IngotHelpers', () => {
    const mockIngotWithDate: Ingot = {
        id: '1',
        name: 'Ingot 1',
        type: 'ingot_experience',
        createdAt: '2023-01-01',
        updatedAt: '2023-01-01',
        content: {
            fields: {
                startDate: {
                    value: '2023-01-01',
                    mandatory: false,
                    inputType: 'date',
                },
            },
            billetFormat: null,
            billets: [],
        },
    };

    const mockIngotWithoutDate: Ingot = {
        id: '2',
        name: 'Ingot 2',
        type: 'ingot_skill',
        createdAt: '2023-02-01',
        updatedAt: '2023-02-01',
        content: {
            fields: {
                skillName: {
                    value: 'React',
                    mandatory: false,
                    inputType: 'text',
                },
            },
            billetFormat: null,
            billets: [],
        },
    };

    const mockIngotWithBilletDate: Ingot = {
        id: '3',
        name: 'Ingot 3',
        type: 'ingot_project',
        createdAt: '2023-03-01',
        updatedAt: '2023-03-01',
        content: {
            fields: {},
            billetFormat: null,
            billets: [
                {
                    id: 'b1',
                    type: 'default',
                    fields: {
                        date: {
                            value: '2023-03-01',
                            mandatory: false,
                            inputType: 'date',
                        },
                    },
                },
            ],
        },
    };

    describe('checkBilletsCanBeSortedByDate', () => {
        it('returns true if any billet has a date field', () => {
            expect(
                IngotHelpers.checkBilletsCanBeSortedByDate(
                    mockIngotWithBilletDate
                )
            ).toBe(true);
        });

        it('returns false if no billets have date fields', () => {
            expect(
                IngotHelpers.checkBilletsCanBeSortedByDate(mockIngotWithDate)
            ).toBe(false);
        });

        it('handles array input', () => {
            expect(
                IngotHelpers.checkBilletsCanBeSortedByDate([
                    mockIngotWithDate,
                    mockIngotWithBilletDate,
                ])
            ).toBe(true);
        });
    });

    describe('checkIngotsCanBeSortedByDate', () => {
        it('returns true if ingot has a date field', () => {
            expect(
                IngotHelpers.checkIngotsCanBeSortedByDate(mockIngotWithDate)
            ).toBe(true);
        });

        it('returns false if ingot has no date field', () => {
            expect(
                IngotHelpers.checkIngotsCanBeSortedByDate(mockIngotWithoutDate)
            ).toBe(false);
        });

        it('handles array input', () => {
            expect(
                IngotHelpers.checkIngotsCanBeSortedByDate([
                    mockIngotWithoutDate,
                    mockIngotWithDate,
                ])
            ).toBe(true);
        });
    });

    describe('sortIngots', () => {
        const ingotOld: Ingot = {
            ...mockIngotWithDate,
            id: 'old',
            content: {
                ...mockIngotWithDate.content,
                fields: {
                    startDate: {
                        value: '2020-01-01',
                        mandatory: false,
                        inputType: 'date',
                    },
                },
            },
        };
        const ingotNew: Ingot = {
            ...mockIngotWithDate,
            id: 'new',
            content: {
                ...mockIngotWithDate.content,
                fields: {
                    startDate: {
                        value: '2024-01-01',
                        mandatory: false,
                        inputType: 'date',
                    },
                },
            },
        };
        const ingotPresent: Ingot = {
            ...mockIngotWithDate,
            id: 'present',
            content: {
                ...mockIngotWithDate.content,
                fields: {
                    startDate: {
                        value: 'Present',
                        mandatory: false,
                        inputType: 'date',
                    },
                },
            },
        };

        it('returns original array if sortBy is undefined or none', () => {
            const result = IngotHelpers.sortIngots(
                [ingotNew, ingotOld],
                'none'
            );
            expect(result).toEqual([ingotNew, ingotOld]);
        });

        it('sorts by date ascending', () => {
            const result = IngotHelpers.sortIngots(
                [ingotNew, ingotOld],
                'date-asc'
            );
            expect(result[0].id).toBe('old');
            expect(result[1].id).toBe('new');
        });

        it('sorts by date descending', () => {
            const result = IngotHelpers.sortIngots(
                [ingotOld, ingotNew],
                'date-desc'
            );
            expect(result[0].id).toBe('new');
            expect(result[1].id).toBe('old');
        });

        it('handles "Present" as current date', () => {
            const result = IngotHelpers.sortIngots(
                [ingotNew, ingotPresent],
                'date-desc'
            );
            expect(result[0].id).toBe('present');
            expect(result[1].id).toBe('new');
        });

        it('falls back to createdAt if no date field exists', () => {
            const ingotNoDateOld: Ingot = {
                ...mockIngotWithoutDate,
                id: 'nd-old',
                createdAt: '2020-01-01',
            };
            const ingotNoDateNew: Ingot = {
                ...mockIngotWithoutDate,
                id: 'nd-new',
                createdAt: '2024-01-01',
            };

            const result = IngotHelpers.sortIngots(
                [ingotNoDateOld, ingotNoDateNew],
                'date-desc'
            );
            expect(result[0].id).toBe('nd-new');
            expect(result[1].id).toBe('nd-old');
        });
    });
});
