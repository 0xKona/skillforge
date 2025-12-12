import { SortOrder } from '../../types/sorting-types';

export default class SortingHelpers {
    // Map of sort options / labels
    private static sortOrderLabelsMap = {
        'date-desc': 'Newest First',
        'date-asc': 'Oldest First',
        none: 'No Sorting',
    };

    /**
     * Gets a sort order label from a sort order
     * @param sortOrder
     * @returns
     */
    static getSortOrderLabel(sortOrder: SortOrder) {
        return this.sortOrderLabelsMap[sortOrder];
    }

    /**
     * Gets a list of sort option values
     * @returns
     */
    static getSortOrderOptions() {
        return Object.keys(this.sortOrderLabelsMap) as SortOrder[];
    }
}
