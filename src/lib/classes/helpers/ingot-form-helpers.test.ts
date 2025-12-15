import { IngotFormHelper } from './ingot-form-helpers';
import { IngotField, INGOT_FIELD_LABELS } from '../../types/ingot-types';

describe('IngotFormHelper', () => {
    describe('getInputLabel', () => {
        it('returns the correct label from INGOT_FIELD_LABELS', () => {
            const label = IngotFormHelper.getInputLabel('name');
            expect(label).toBe(INGOT_FIELD_LABELS['name']);
        });

        it('returns undefined for unknown keys', () => {
            const label = IngotFormHelper.getInputLabel('nonExistentKey');
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

            const groups = IngotFormHelper.getGroupedFields(fields);

            // Expect 'name' to be single
            expect(groups).toContainEqual({ type: 'single', keys: ['name'] });
            // Expect 'startDate' and 'endDate' to be a row
            expect(groups).toContainEqual({
                type: 'row',
                keys: ['startDate', 'endDate'],
            });
            // Should not contain separate single entries for start/end date
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

            const groups = IngotFormHelper.getGroupedFields(fields);

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

            const groups = IngotFormHelper.getGroupedFields(fields);

            expect(groups).toHaveLength(1);
            expect(groups[0]).toEqual({
                type: 'single',
                keys: ['description'],
            });
        });

        it('handles missing partner fields (e.g. startDate without endDate)', () => {
            const fields: Record<string, IngotField> = {
                startDate: {
                    value: '2023-01-01',
                    mandatory: false,
                    inputType: 'date',
                },
            };

            const groups = IngotFormHelper.getGroupedFields(fields);

            // Should be treated as single since endDate is missing
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

            const values = IngotFormHelper.getIngotFieldValues(fields);

            expect(values).toEqual({
                name: 'Test Name',
                role: 'Developer',
            });
        });

        it('handles nested object values by extracting .value property', () => {
            // Simulating a case where value might be an object (runtime data issue mentioned in code)
            const fields: Record<string, IngotField> = {
                complex: {
                    value: { value: 'Nested Value' } as unknown as string,
                    mandatory: false,
                    inputType: 'text',
                },
            };

            const values = IngotFormHelper.getIngotFieldValues(fields);

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

            const values = IngotFormHelper.getIngotFieldValues(fields);

            expect(values).toEqual({
                empty: '',
                missing: '',
            });
        });
    });
});
