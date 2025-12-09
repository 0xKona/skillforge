import { Ingot, Billet } from '@/lib/types/ingot-types';
import { SortOrder } from '../types/preview-util-types';

export const getIngotDate = (ingot: Ingot): number => {
    // Try to find a date field
    const dateField = Object.values(ingot.content.fields).find(
        (f) => f.inputType === 'date'
    );
    if (dateField && dateField.value) {
        // Handle "Present" or "Current"
        if (
            dateField.value.toLowerCase() === 'present' ||
            dateField.value.toLowerCase() === 'current'
        ) {
            return new Date().getTime();
        }
        return new Date(dateField.value).getTime();
    }
    // Fallback to createdAt
    return new Date(ingot.createdAt).getTime();
};

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

export const sortIngots = (ingots: Ingot[], sortBy?: SortOrder): Ingot[] => {
    if (!sortBy || sortBy === 'none') return ingots;

    return [...ingots].sort((a, b) => {
        const dateA = getIngotDate(a);
        const dateB = getIngotDate(b);
        return sortBy === 'date-desc' ? dateB - dateA : dateA - dateB;
    });
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
