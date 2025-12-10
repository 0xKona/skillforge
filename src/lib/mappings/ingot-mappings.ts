import { IngotType } from "../types/ingot-types";

export interface IngotTypeLabelMap {
    value: IngotType;
    label: string;
}

// TODO - Move to a mappings helper file

export const INGOT_TYPE_LABELS: IngotTypeLabelMap[] = [
    { value: 'ingot_education', label: 'Education' },
    { value: 'ingot_experience', label: 'Experience' },
    { value: 'ingot_project', label: 'Project' },
    { value: 'ingot_skill', label: 'Skill' },
    { value: 'ingot_single_certification', label: 'Certification (Single)' },
    { value: 'ingot_personal_info', label: 'Personal Info' },
    { value: 'ingot_personal_statement', label: 'Personal Statement' },
    { value: 'ingot_hobby', label: 'Hobby' },
    { value: 'ingot_reference', label: 'Reference' },
];

export function getIngotLabelByValue(value: IngotType) {
    const label = INGOT_TYPE_LABELS.find(
        (ingot) => ingot.value === value
    )?.label;

    if (!label) {
        throw new Error('Could not find a label for that type');
    }

    return label;
}