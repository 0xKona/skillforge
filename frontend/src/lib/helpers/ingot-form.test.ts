import { ingotFormHelpers } from './ingot-form';
import { IngotField } from '../types/ingot-types';
import { INGOT_FIELD_LABELS } from '../constants/ingot-constants';

describe('ingotFormHelpers', () => {
    describe('getInputLabel', () => {
        it('returns the correct label from INGOT_FIELD_LABELS', () => {
            const label = ingotFormHelpers.getInputLabel('name');
            expect(label).toBe(INGOT_FIELD_LABELS['name']);
        });

        it('returns undefined for unknown keys', () => {
            const label = ingotFormHelpers.getInputLabel('nonExistentKey');
            expect(label).toBeUndefined();
        });
    });

    describe('getGroupedFields', () => {
        it('groups startDate and endDate into a row', () => {
            const fields: Record<string, IngotField> = {
                name: { value: 'Test', mandatory: false, inputType: 'text' },
                startDate: {
                    value: '2023-01-01',
                    mandatory: false,
                    inputType: 'date',
                },
                endDate: {
                    value: '2023-12-31',
                    mandatory: false,
                    inputType: 'date',
                },
            };

            const groups = ingotFormHelpers.getGroupedFields(fields);

            expect(groups).toContainEqual({ type: 'single', keys: ['name'] });
            expect(groups).toContainEqual({
                type: 'row',
                keys: ['startDate', 'endDate'],
            });
            expect(
                groups.filter((g) => g.keys.includes('startDate'))
            ).toHaveLength(1);
        });

        it('groups city and state into a row', () => {
            const fields: Record<string, IngotField> = {
                city: {
                    value: 'New York',
                    mandatory: false,
                    inputType: 'text',
                },
                state: { value: 'NY', mandatory: false, inputType: 'text' },
            };

            const groups = ingotFormHelpers.getGroupedFields(fields);

            expect(groups).toContainEqual({
                type: 'row',
                keys: ['city', 'state'],
            });
        });

        it('handles single fields correctly', () => {
            const fields: Record<string, IngotField> = {
                description: {
                    value: 'Desc',
                    mandatory: false,
                    inputType: 'textarea',
                },
            };

            const groups = ingotFormHelpers.getGroupedFields(fields);

            expect(groups).toHaveLength(1);
            expect(groups[0]).toEqual({
                type: 'single',
                keys: ['description'],
            });
        });

        it('handles startDate without endDate as single', () => {
            const fields: Record<string, IngotField> = {
                startDate: {
                    value: '2023-01-01',
                    mandatory: false,
                    inputType: 'date',
                },
            };

            const groups = ingotFormHelpers.getGroupedFields(fields);

            expect(groups).toEqual([{ type: 'single', keys: ['startDate'] }]);
        });
    });

    describe('getIngotFieldValues', () => {
        it('extracts simple string values', () => {
            const fields: Record<string, IngotField> = {
                name: {
                    value: 'Test Name',
                    mandatory: false,
                    inputType: 'text',
                },
                role: {
                    value: 'Developer',
                    mandatory: false,
                    inputType: 'text',
                },
            };

            const values = ingotFormHelpers.getIngotFieldValues(fields);

            expect(values).toEqual({
                name: 'Test Name',
                role: 'Developer',
            });
        });

        it('handles nested object values by extracting .value property', () => {
            const fields: Record<string, IngotField> = {
                complex: {
                    value: { value: 'Nested Value' } as unknown as string,
                    mandatory: false,
                    inputType: 'text',
                },
            };

            const values = ingotFormHelpers.getIngotFieldValues(fields);

            expect(values).toEqual({
                complex: 'Nested Value',
            });
        });

        it('handles null/undefined values gracefully', () => {
            const fields: Record<string, IngotField> = {
                empty: { value: '', mandatory: false, inputType: 'text' },
                // @ts-expect-error - Testing runtime safety
                missing: { value: null, mandatory: false, inputType: 'text' },
            };

            const values = ingotFormHelpers.getIngotFieldValues(fields);

            expect(values).toEqual({
                empty: '',
                missing: '',
            });
        });
    });
});
