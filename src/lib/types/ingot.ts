export interface FieldDefinition {
    mandatory: string | boolean; // Templates use "true"/"false" strings, but we might want booleans
    included: string | boolean;
    value: string;
    label?: string; // Optional label for UI
    type?: 'text' | 'date' | 'textarea' | 'select'; // Hint for UI
    options?: string[]; // For select inputs
}

export interface TemplateFields {
    [key: string]: FieldDefinition;
}

export interface BilletTemplate {
    type: string;
    fields: TemplateFields;
}

export interface IngotTemplate {
    type: string;
    fields: TemplateFields;
    billets: unknown[]; // Usually empty in template
}

export interface IngotContent {
    [key: string]: string | number | boolean | null | undefined;
}

export interface Billet {
    id: string;
    type: string;
    content: IngotContent;
}
