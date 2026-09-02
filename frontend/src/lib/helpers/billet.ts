import { BILLET_TEMPLATES } from '../templates/ingot-templates';
import { Billet } from '../types/ingot-types';
import { SortOrder } from './sorting';

/**
 * Returns the field names defined by the template for a billet's type.
 */
function getBilletFieldNames(billet: Billet): string[] {
    return Object.keys(BILLET_TEMPLATES[billet.type].fields);
}

/**
 * Derives a human-readable display name from a billet's fields,
 * checking common name fields in priority order.
 * Falls back to 'Untitled Entry' if no suitable field is found.
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
        'Untitled Entry'
    );
}

/**
 * Human-readable labels for a billet's type, keyed by persisted type id.
 * Keep this in sync with BILLET_TEMPLATES.
 */
const BILLET_TYPE_LABELS: Record<string, string> = {
    billet_exp_job: 'Job detail',
    billet_edu_subject: 'Subject',
    billet_grouped_certfication: 'Certification',
    billet_pi_social: 'Social link',
    billet_skill: 'Skill',
    cert: 'Certification',
};

/**
 * Returns a curated, human-readable label for a billet's type.
 * Falls back to a cleaned-up version of the raw type id for unknown types.
 */
function getBilletLabel(billet: Billet): string {
    return (
        BILLET_TYPE_LABELS[billet.type] ??
        billet.type.replace('billet_', '').replace(/_/g, ' ')
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
    getBilletLabel,
    getBilletDate,
    sortBillets,
};
