import { BILLET_TEMPLATES } from '../templates/ingot-templates';
import { Billet } from '../types/ingot-types';
import { SortOrder } from '../types/sorting-types';

export class BilletHelper {
    /**
     * Returns a array of string, representing field names for a billet
     * @param billet
     * @returns
     */
    static getBilletFieldNames(billet: Billet): string[] {
        const billetType = billet.type;
        const fieldNames = Object.keys(BILLET_TEMPLATES[billetType].fields);
        return fieldNames;
    }

    /**
     * Gets the display name for a provided billet
     * @param billet
     * @returns
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
     * Sort billets by sort by parameter
     * @param billets
     * @param sortBy
     * @returns
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
