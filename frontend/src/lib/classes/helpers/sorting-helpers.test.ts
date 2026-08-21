import SortingHelpers from './sorting-helpers';

describe('SortingHelpers', () => {
    describe('getSortOrderLabel', () => {
        it('returns correct label for date-desc', () => {
            expect(SortingHelpers.getSortOrderLabel('date-desc')).toBe(
                'Newest First'
            );
        });

        it('returns correct label for date-asc', () => {
            expect(SortingHelpers.getSortOrderLabel('date-asc')).toBe(
                'Oldest First'
            );
        });

        it('returns correct label for none', () => {
            expect(SortingHelpers.getSortOrderLabel('none')).toBe('No Sorting');
        });
    });

    describe('getSortOrderOptions', () => {
        it('returns all available sort options', () => {
            const options = SortingHelpers.getSortOrderOptions();
            expect(options).toHaveLength(3);
            expect(options).toContain('date-desc');
            expect(options).toContain('date-asc');
            expect(options).toContain('none');
        });
    });
});
