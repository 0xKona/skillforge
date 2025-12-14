import { IngotType } from '@/lib/types/ingot-types';

/**
 * Utility class providing helper methods for mapping and validating IngotType values.
 * This class includes mappings for CV section labels and Ingot type labels, along with methods to retrieve lists, labels, and validate types.
 */
export default class MappingHelpers {
    /**
     * Private static record mapping IngotType to CV section labels.
     * Used for displaying section names in CV contexts.
     */
    private static cvSectionLabels: Record<IngotType, string> = {
        ingot_personal_info: 'Personal Info',
        ingot_personal_statement: 'Personal Statement',
        ingot_education: 'Education',
        ingot_experience: 'Experience',
        ingot_project: 'Projects',
        ingot_skill: 'Skills',
        ingot_certification: 'Certifications',
        ingot_hobby: 'Hobbies',
        ingot_reference: 'References',
    };

    /**
     * Private static record mapping IngotType to Ingot type labels.
     * Used for displaying type names in general contexts.
     */
    private static ingotTypeLabels: Record<IngotType, string> = {
        ingot_personal_info: 'Personal Info',
        ingot_personal_statement: 'Personal Statement',
        ingot_education: 'Education',
        ingot_experience: 'Experience',
        ingot_project: 'Project',
        ingot_skill: 'Skill',
        ingot_certification: 'Certification',
        ingot_hobby: 'Hobby',
        ingot_reference: 'Reference',
    };

    /**
     * Returns an array of all IngotType keys from the cvSectionLabels record.
     * This represents the list of available CV section types.
     * @returns An array of IngotType values.
     */
    static getCvSectionsList() {
        return Object.keys(this.cvSectionLabels) as IngotType[];
    }

    /**
     * Retrieves the CV section label for a given IngotType.
     * @param type - The IngotType for which to get the label.
     * @returns The corresponding string label from cvSectionLabels.
     */
    static getCvSectionLabelBySectionType(type: IngotType) {
        return this.cvSectionLabels[type];
    }

    /**
     * Retrieves the Ingot type label for a given IngotType.
     * @param type - The IngotType for which to get the label.
     * @returns The corresponding string label from ingotTypeLabels.
     */
    static getIngotLabelByType(type: IngotType) {
        return this.ingotTypeLabels[type];
    }

    /**
     * Returns an array of all IngotType keys from the ingotTypeLabels record.
     * This represents the list of all available Ingot types.
     * @returns An array of IngotType values.
     */
    static getIngotTypeList() {
        return Object.keys(this.ingotTypeLabels) as IngotType[];
    }

    /**
     * Type guard to check if a given string is a valid IngotType.
     * Checks if the type exists in the ingotTypeLabels keys.
     * @param type - The string to validate.
     * @returns True if the type is a valid IngotType, false otherwise.
     */
    static checkIsValidIngotType(
        type: string | null | undefined
    ): type is IngotType {
        return !!type && Object.keys(this.ingotTypeLabels).includes(type);
    }
}
