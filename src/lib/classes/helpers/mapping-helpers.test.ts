import MappingHelpers from './mapping-helpers';

describe('MappingHelpers', () => {
    describe('getCvSectionsList', () => {
        it('returns a list of ingot types', () => {
            const list = MappingHelpers.getCvSectionsList();
            expect(list).toBeInstanceOf(Array);
            expect(list).toContain('ingot_experience');
            expect(list.length).toBeGreaterThan(0);
        });
    });

    describe('getCvSectionLabelBySectionType', () => {
        it('returns correct label for known type', () => {
            expect(
                MappingHelpers.getCvSectionLabelBySectionType(
                    'ingot_experience'
                )
            ).toBe('Experience');
            expect(
                MappingHelpers.getCvSectionLabelBySectionType('ingot_education')
            ).toBe('Education');
        });
    });

    describe('getIngotLabelByType', () => {
        it('returns correct label for known type', () => {
            expect(MappingHelpers.getIngotLabelByType('ingot_experience')).toBe(
                'Experience'
            );
            // Note: Some labels might differ slightly (singular vs plural)
            expect(MappingHelpers.getIngotLabelByType('ingot_project')).toBe(
                'Project'
            );
        });
    });

    describe('getIngotTypeList', () => {
        it('returns a list of all ingot types', () => {
            const list = MappingHelpers.getIngotTypeList();
            expect(list).toBeInstanceOf(Array);
            expect(list).toContain('ingot_skill');
        });
    });

    describe('checkIsValidIngotType', () => {
        it('returns true for valid types', () => {
            expect(
                MappingHelpers.checkIsValidIngotType('ingot_experience')
            ).toBe(true);
        });

        it('returns false for invalid types', () => {
            expect(MappingHelpers.checkIsValidIngotType('invalid_type')).toBe(
                false
            );
        });

        it('returns false for null/undefined', () => {
            expect(MappingHelpers.checkIsValidIngotType(null)).toBe(false);
            expect(MappingHelpers.checkIsValidIngotType(undefined)).toBe(false);
        });
    });
});
