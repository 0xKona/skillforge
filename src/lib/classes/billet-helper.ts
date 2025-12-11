import { BILLET_TEMPLATES } from '../templates/ingot-templates';
import { Billet } from '../types/ingot-types';

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
}
