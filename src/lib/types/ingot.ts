export interface IngotField {
    mandatory: boolean;
    included: boolean;
    value: string;
    label?: string;
    type?: 'text' | 'date' | 'textarea' | 'select';
    options?: string[];
}

export interface Billet {
    id: string;
    type: string;
    fields: Record<string, IngotField>;
}

export interface IngotContent {
    fields: Record<string, IngotField>;
    billetFormat: string | null;
    billets: Billet[];
}

export interface Ingot {
    id: string;
    name: string;
    type: string;
    content: IngotContent;
    createdAt: string;
    updatedAt: string;
}

export interface BilletTemplate {
    type: string;
    fields: Record<string, IngotField>;
}

export interface IngotTemplate {
    type: string;
    content: IngotContent;
}

export const INGOT_TYPE_LABELS = [
    { value: 'ingot_education', label: 'Education' },
    { value: 'ingot_experience', label: 'Experience' },
    { value: 'ingot_project', label: 'Project' },
    { value: 'ingot_skill', label: 'Skill' },
    { value: 'ingot_single_certification', label: 'Certification (Single)' },
    { value: 'ingot_grouped_certification', label: 'Certification (Grouped)' },
    { value: 'ingot_personal_info', label: 'Personal Info' },
    { value: 'ingot_personal_statement', label: 'Personal Statement' },
    { value: 'ingot_hobby', label: 'Hobby' },
    { value: 'ingot_reference', label: 'Reference' },
];
