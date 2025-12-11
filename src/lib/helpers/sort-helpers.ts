import { Billet } from '@/lib/types/ingot-types';
import { SortOrder } from '../types/preview-util-types';

export const getBilletDate = (billet: Billet): number => {
    const dateField = Object.values(billet.fields).find(
        (f) => f.inputType === 'date'
    );
    if (dateField && dateField.value) {
        if (
            dateField.value.toLowerCase() === 'present' ||
            dateField.value.toLowerCase() === 'current'
        ) {
            return new Date().getTime();
        }
        return new Date(dateField.value).getTime();
    }
    return 0;
};

export const sortBillets = (
    billets: Billet[],
    sortBy?: SortOrder
): Billet[] => {
    if (!sortBy) return billets;

    return [...billets].sort((a, b) => {
        const dateA = getBilletDate(a);
        const dateB = getBilletDate(b);
        return sortBy === 'date-desc' ? dateB - dateA : dateA - dateB;
    });
};
