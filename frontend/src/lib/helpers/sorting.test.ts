import { sortingHelpers } from './sorting';

describe('sortingHelpers', () => {
    describe('getLabel', () => {
        it('returns correct label for date-desc', () => {
            expect(sortingHelpers.getLabel('date-desc')).toBe('Newest First');
        });

        it('returns correct label for date-asc', () => {
            expect(sortingHelpers.getLabel('date-asc')).toBe('Oldest First');
        });

        it('returns correct label for none', () => {
            expect(sortingHelpers.getLabel('none')).toBe('No Sorting');
        });
    });

    describe('getOptions', () => {
        it('returns all available sort options', () => {
            const options = sortingHelpers.getOptions();
            expect(options).toHaveLength(3);
            expect(options).toContain('date-desc');
            expect(options).toContain('date-asc');
            expect(options).toContain('none');
        });
    });
});
