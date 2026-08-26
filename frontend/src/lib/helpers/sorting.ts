export type SortOrder = 'date-desc' | 'date-asc' | 'none';

const SORT_ORDER_LABELS: Record<SortOrder, string> = {
    'date-desc': 'Newest First',
    'date-asc': 'Oldest First',
    none: 'No Sorting',
};

/**
 * Returns the human-readable label for a sort order.
 */
function getLabel(sortOrder: SortOrder): string {
    return SORT_ORDER_LABELS[sortOrder];
}

/**
 * Returns all available sort order options.
 */
function getOptions(): SortOrder[] {
    return Object.keys(SORT_ORDER_LABELS) as SortOrder[];
}

export const sortingHelpers = {
    getLabel,
    getOptions,
};
