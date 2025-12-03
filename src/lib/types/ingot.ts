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
