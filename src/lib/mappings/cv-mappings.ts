import { IngotType } from '../types/ingot-types';

export interface CvSectionLabelMap {
    value: IngotType;
    label: string;
}

export const CV_SECTION_LABELS: CvSectionLabelMap[] = [
    { value: 'ingot_personal_info', label: 'Personal Info' },
    { value: 'ingot_personal_statement', label: 'Personal Statement' },
    { value: 'ingot_education', label: 'Education' },
    { value: 'ingot_experience', label: 'Experience' },
    { value: 'ingot_project', label: 'Projects' },
    { value: 'ingot_skill', label: 'Skills' },
    { value: 'ingot_single_certification', label: 'Certifications' },
    { value: 'ingot_hobby', label: 'Hobbies' },
    { value: 'ingot_reference', label: 'References' },
];

export function getCvSectionLabelByValue(value: IngotType) {
    const label = CV_SECTION_LABELS.find(
        (section) => section.value === value
    )?.label;

    if (!label) {
        throw new Error('Could not find a label for that type');
    }

    return label
}
