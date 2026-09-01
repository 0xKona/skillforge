import { z } from 'zod';
import { SECTION_SCHEMAS } from '../constants/cv-constants';
import type { FieldDef, SectionType } from '../types/cv-document-types';

// -- Base schemas --

const sectionTypeSchema = z.enum([
    'personal_info',
    'personal_statement',
    'education',
    'experience',
    'project',
    'skill',
    'certification',
    'hobby',
    'reference',
]);

const documentItemSchema: z.ZodType = z.object({
    id: z.string().min(1),
    fields: z.record(z.string(), z.string()),
    subItems: z.array(z.lazy(() => documentItemSchema)).optional(),
    sourceIngotId: z.string().optional(),
});

const documentSectionSchema = z.object({
    id: z.string().min(1),
    type: sectionTypeSchema,
    title: z.string().min(1),
    visible: z.boolean(),
    items: z.array(documentItemSchema),
});

const documentContentSchema = z.object({
    sections: z.array(documentSectionSchema),
});

export const cvDocumentSchema = z.object({
    id: z.string().min(1),
    version: z.number().int().positive(),
    title: z.string().min(1),
    description: z.string().optional(),
    content: documentContentSchema,
    createdAt: z.string().min(1),
    updatedAt: z.string().min(1),
});

export const newCvDocumentSchema = cvDocumentSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});

// -- Field-level validation --

/**
 * Validates a single field value against its FieldDef.
 * Returns an error message or null if valid.
 */
function validateFieldValue(
    key: string,
    value: string | undefined,
    def: FieldDef
): string | null {
    const val = value?.trim() ?? '';

    if (def.required && val === '') {
        return `${def.label} is required`;
    }

    if (val === '') return null; // optional empty is fine

    switch (def.type) {
        case 'email': {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(val)) {
                return `${def.label} must be a valid email`;
            }
            break;
        }
        case 'url': {
            try {
                new URL(val);
            } catch {
                return `${def.label} must be a valid URL`;
            }
            break;
        }
        case 'select': {
            if (def.options && !def.options.includes(val)) {
                return `${def.label} must be one of: ${def.options.join(', ')}`;
            }
            break;
        }
    }

    return null;
}

// -- Item validation --

export interface ValidationError {
    itemId: string;
    field: string;
    message: string;
}

/**
 * Validates all items in a section against its schema.
 * Returns an array of errors (empty = valid).
 */
function validateSectionItems(
    sectionType: SectionType,
    items: Array<{
        id: string;
        fields: Record<string, string>;
        subItems?: Array<{ id: string; fields: Record<string, string> }>;
    }>
): ValidationError[] {
    const schema = SECTION_SCHEMAS[sectionType];
    if (!schema) return [];

    const errors: ValidationError[] = [];

    for (const item of items) {
        // Validate top-level fields
        for (const [key, def] of Object.entries(schema.fields)) {
            const error = validateFieldValue(key, item.fields[key], def);
            if (error) {
                errors.push({ itemId: item.id, field: key, message: error });
            }
        }

        // Validate sub-items
        if (schema.subFields && item.subItems) {
            for (const sub of item.subItems) {
                for (const [key, def] of Object.entries(schema.subFields)) {
                    const error = validateFieldValue(key, sub.fields[key], def);
                    if (error) {
                        errors.push({
                            itemId: sub.id,
                            field: key,
                            message: error,
                        });
                    }
                }
            }
        }
    }

    return errors;
}

/**
 * Validates an entire document's content.
 * Returns all validation errors grouped by section.
 */
function validateDocument(
    sections: Array<{
        type: SectionType;
        items: Array<{
            id: string;
            fields: Record<string, string>;
            subItems?: Array<{ id: string; fields: Record<string, string> }>;
        }>;
    }>
): Record<string, ValidationError[]> {
    const result: Record<string, ValidationError[]> = {};

    for (const section of sections) {
        const errors = validateSectionItems(section.type, section.items);
        if (errors.length > 0) {
            result[section.type] = errors;
        }
    }

    return result;
}

export const cvDocumentValidation = {
    validateFieldValue,
    validateSectionItems,
    validateDocument,
};
