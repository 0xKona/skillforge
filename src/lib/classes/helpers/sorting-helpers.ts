import { SortOrder } from '../../types/sorting-types';

/**
 * Utility class providing helper methods for handling sorting options and labels.
 * This class includes mappings for sort order labels and methods to retrieve labels and options.
 */
export default class SortingHelpers {
    /**
     * Private static map of sort order keys to their human-readable labels.
     * Used for displaying sort options in the UI.
     */
    private static sortOrderLabelsMap = {
        'date-desc': 'Newest First',
        'date-asc': 'Oldest First',
        none: 'No Sorting',
    };

    /**
     * Gets a sort order label from a sort order.
     * @param sortOrder - The SortOrder key to look up.
     * @returns The corresponding human-readable label string.
     */
    static getSortOrderLabel(sortOrder: SortOrder) {
        return this.sortOrderLabelsMap[sortOrder];
    }

    /**
     * Gets a list of sort option values.
     * @returns An array of SortOrder keys representing available sort options.
     */
    static getSortOrderOptions() {
        return Object.keys(this.sortOrderLabelsMap) as SortOrder[];
    }
}
