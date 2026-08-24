import { BILLET_TEMPLATES } from '../templates/ingot-templates';
import { Billet } from '../types/ingot-types';
import { SortOrder } from '../types/sorting-types';

/**
 * Returns the field names defined by the template for a billet's type.
 */
function getBilletFieldNames(billet: Billet): string[] {
    return Object.keys(BILLET_TEMPLATES[billet.type].fields);
}

/**
 * Derives a human-readable display name from a billet's fields,
 * checking common name fields in priority order.
 * Falls back to 'Untitled Item' if no suitable field is found.
 */
function getBilletDisplayName(billet: Billet): string {
    const fields = billet.fields;
    return (
        (fields.name?.value as string) ||
        (fields.jobTitle?.value as string) ||
        (fields.projectName?.value as string) ||
        (fields.certName?.value as string) ||
        (fields.platform?.value as string) ||
        (fields.skillName?.value as string) ||
        'Untitled Item'
    );
}

/**
 * Extracts the timestamp from a billet's first date-typed field.
 * Treats 'present' / 'current' as the current date.
 * Returns 0 if no date field is found.
 */
function getBilletDate(billet: Billet): number {
    const dateField = Object.values(billet.fields).find(
        (f) => f.inputType === 'date'
    );
    if (dateField && dateField.value) {
        const lower = dateField.value.toLowerCase();
        if (lower === 'present' || lower === 'current') {
            return Date.now();
        }
        return new Date(dateField.value).getTime();
    }
    return 0;
}

/**
 * Returns a new array of billets sorted by their date field.
 * If no sortBy is provided, returns the array unchanged.
 */
function sortBillets(billets: Billet[], sortBy?: SortOrder): Billet[] {
    if (!sortBy) return billets;

    return [...billets].sort((a, b) => {
        const dateA = getBilletDate(a);
        const dateB = getBilletDate(b);
        return sortBy === 'date-desc' ? dateB - dateA : dateA - dateB;
    });
}

export const billetHelpers = {
    getBilletFieldNames,
    getBilletDisplayName,
    getBilletDate,
    sortBillets,
};
