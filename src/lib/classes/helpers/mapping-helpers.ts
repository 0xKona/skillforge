import { IngotType } from '@/lib/types/ingot-types';

export default class MappingHelpers {
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

    static getCvSectionsList() {
        return Object.keys(this.cvSectionLabels) as IngotType[];
    }

    static getCvSectionLabelBySectionType(type: IngotType) {
        return this.cvSectionLabels[type];
    }
}
