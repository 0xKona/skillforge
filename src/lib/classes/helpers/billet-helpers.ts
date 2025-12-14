import { BILLET_TEMPLATES } from '../../templates/ingot-templates';
import { Billet } from '../../types/ingot-types';
import { SortOrder } from '../../types/sorting-types';

/**
 * Utility class providing helper methods for managing and manipulating Billet objects.
 * Billets represent various types of items (e.g., jobs, projects, certifications) with fields defined by templates.
 * This class includes methods for retrieving field names, display names, dates, and sorting billets.
 */
export class BilletHelper {
    /**
     * Retrieves an array of field names for a given billet based on its type.
     * The field names are derived from the corresponding template in BILLET_TEMPLATES.
     * @param billet - The Billet object whose field names are to be retrieved.
     * @returns An array of strings representing the field names.
     */
    static getBilletFieldNames(billet: Billet): string[] {
        const billetType = billet.type;
        const fieldNames = Object.keys(BILLET_TEMPLATES[billetType].fields);
        return fieldNames;
    }

    /**
     * Generates a display name for a billet by checking specific fields in order of preference.
     * It prioritizes fields like 'name', 'jobTitle', 'projectName', etc., and falls back to 'Untitled Item' if none are available.
     * @param billet - The Billet object for which to generate the display name.
     * @returns A string representing the display name of the billet.
     */
    static getBilletDisplayName(billet: Billet): string {
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
     * Private helper method to extract and convert the date from a billet's fields.
     * It looks for the first field with inputType 'date', handles special cases like 'present' or 'current' as the current date,
     * and returns the timestamp. If no valid date is found, returns 0.
     * @param billet - The Billet object from which to extract the date.
     * @returns A number representing the timestamp of the date, or 0 if not found.
     */
    private static getBilletDate = (billet: Billet): number => {
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

    /**
     * Sorts an array of billets based on the provided sort order.
     * Currently supports sorting by date in ascending or descending order.
     * If no sortBy is provided, returns the billets unchanged.
     * @param billets - The array of Billet objects to sort.
     * @param sortBy - The sort order, either 'date-asc' or 'date-desc'.
     * @returns A new sorted array of Billet objects.
     */
    static sortBillets = (billets: Billet[], sortBy?: SortOrder): Billet[] => {
        if (!sortBy) return billets;

        return [...billets].sort((a, b) => {
            const dateA = this.getBilletDate(a);
            const dateB = this.getBilletDate(b);
            return sortBy === 'date-desc' ? dateB - dateA : dateA - dateB;
        });
    };
}
