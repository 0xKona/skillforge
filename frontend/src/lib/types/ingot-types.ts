// -- Ingot Types --

export type IngotType =
    | 'ingot_education'
    | 'ingot_experience'
    | 'ingot_project'
    | 'ingot_skill'
    | 'ingot_certification'
    | 'ingot_personal_info'
    | 'ingot_personal_statement'
    | 'ingot_hobby'
    | 'ingot_reference';

export interface IngotField {
    mandatory: boolean;
    value: string;
    inputType:
        'text' | 'date' | 'textarea' | 'select' | 'email' | 'tel' | 'url';
    label?: string;
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

export interface NewIngot {
    name: string;
    type: IngotType | '';
    content: IngotContent;
}

export interface Ingot extends NewIngot {
    id: string;
    createdAt: string;
    updatedAt: string;
}

export type IngotEditorData = NewIngot | Ingot;

// -- Template Types --

export interface BilletTemplate {
    type: string;
    fields: Record<string, IngotField>;
}

export interface IngotTemplate {
    type: string;
    content: IngotContent;
}
