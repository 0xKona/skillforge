import { mappingHelpers } from './mapping';

describe('mappingHelpers', () => {
    describe('getCvSectionsList', () => {
        it('returns a list of ingot types', () => {
            const list = mappingHelpers.getCvSectionsList();
            expect(list).toBeInstanceOf(Array);
            expect(list).toContain('ingot_experience');
            expect(list.length).toBeGreaterThan(0);
        });
    });

    describe('getCvSectionLabel', () => {
        it('returns correct label for known type', () => {
            expect(mappingHelpers.getCvSectionLabel('ingot_experience')).toBe(
                'Experience'
            );
            expect(mappingHelpers.getCvSectionLabel('ingot_education')).toBe(
                'Education'
            );
        });

        it('returns plural forms for collection types', () => {
            expect(mappingHelpers.getCvSectionLabel('ingot_project')).toBe(
                'Projects'
            );
            expect(mappingHelpers.getCvSectionLabel('ingot_skill')).toBe(
                'Skills'
            );
        });
    });

    describe('getIngotLabel', () => {
        it('returns correct singular label for known type', () => {
            expect(mappingHelpers.getIngotLabel('ingot_experience')).toBe(
                'Experience'
            );
            expect(mappingHelpers.getIngotLabel('ingot_project')).toBe(
                'Project'
            );
        });
    });

    describe('getIngotTypeList', () => {
        it('returns a list of all ingot types', () => {
            const list = mappingHelpers.getIngotTypeList();
            expect(list).toBeInstanceOf(Array);
            expect(list).toContain('ingot_skill');
        });
    });

    describe('isValidIngotType', () => {
        it('returns true for valid types', () => {
            expect(mappingHelpers.isValidIngotType('ingot_experience')).toBe(
                true
            );
        });

        it('returns false for invalid types', () => {
            expect(mappingHelpers.isValidIngotType('invalid_type')).toBe(false);
        });

        it('returns false for null/undefined', () => {
            expect(mappingHelpers.isValidIngotType(null)).toBe(false);
            expect(mappingHelpers.isValidIngotType(undefined)).toBe(false);
        });
    });
});
