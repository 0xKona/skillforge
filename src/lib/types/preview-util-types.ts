export type SortOrder = 'date-desc' | 'date-asc' | 'none';

export const sortOrderOptions: SortOrder[] = ['date-desc', 'date-asc', 'none'];

export const sortOrderLabelMap = {
    'date-desc': 'Newest First',
    'date-asc': 'Oldest First',
    none: 'No Sorting',
};
