import { IngotType } from '../types/ingot-types';

/**
 * CV section labels — plural forms used as section headings in the CV editor.
 */
const CV_SECTION_LABELS: Record<IngotType, string> = {
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
 * Ingot type labels — singular forms used for individual ingot display.
 */
const INGOT_TYPE_LABELS: Record<IngotType, string> = {
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
 * Returns the list of all IngotType values (used for dropdowns, iteration).
 */
function getIngotTypeList(): IngotType[] {
    return Object.keys(INGOT_TYPE_LABELS) as IngotType[];
}

/**
 * Returns the singular label for an ingot type (e.g. 'Experience', 'Project').
 */
function getIngotLabel(type: IngotType): string {
    return INGOT_TYPE_LABELS[type];
}

/**
 * Returns the list of CV section types (same keys as ingot types).
 */
function getCvSectionsList(): IngotType[] {
    return Object.keys(CV_SECTION_LABELS) as IngotType[];
}

/**
 * Returns the plural/section label for a CV section type (e.g. 'Projects', 'Skills').
 */
function getCvSectionLabel(type: IngotType): string {
    return CV_SECTION_LABELS[type];
}

/**
 * Type guard — checks if a string is a valid IngotType.
 */
function isValidIngotType(type: string | null | undefined): type is IngotType {
    return !!type && Object.keys(INGOT_TYPE_LABELS).includes(type);
}

export const mappingHelpers = {
    getIngotTypeList,
    getIngotLabel,
    getCvSectionsList,
    getCvSectionLabel,
    isValidIngotType,
};
