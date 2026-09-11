import type {
    Billet,
    Ingot,
    IngotField,
    IngotType,
    NewIngot,
} from '../types/ingot-types';
import type { DocumentItem, SectionType } from '../types/cv-document-types';
import { SECTION_META, SECTION_SCHEMAS } from '../constants/cv-constants';

/**
 * Flattens IngotField records into simple string key-value pairs.
 * Strips metadata (mandatory, inputType) — only keeps values.
 */
function extractFields(
    fields: Record<string, IngotField>
): Record<string, string> {
    const result: Record<string, string> = {};
    for (const [key, field] of Object.entries(fields)) {
        result[key] = String(field.value ?? '');
    }
    return result;
}

/**
 * Converts a single Billet into a DocumentItem (used as subItem).
 */
function fromBillet(billet: Billet): DocumentItem {
    return {
        id: crypto.randomUUID(),
        fields: extractFields(billet.fields),
    };
}

/**
 * Converts an Ingot (library entry) into a DocumentItem for inline CV use.
 * Billets become subItems. Field values are copied as-is.
 */
function fromIngot(ingot: Ingot): DocumentItem {
    return {
        id: crypto.randomUUID(),
        fields: extractFields(ingot.content.fields),
        subItems:
            ingot.content.billets.length > 0
                ? ingot.content.billets.map(fromBillet)
                : undefined,
        sourceIngotId: ingot.id,
    };
}

/**
 * Converts an Ingot with only specified billets included as subItems.
 */
function fromIngotWithBillets(ingot: Ingot, billetIds: string[]): DocumentItem {
    const filtered = ingot.content.billets.filter((b) =>
        billetIds.includes(b.id)
    );
    return {
        id: crypto.randomUUID(),
        fields: extractFields(ingot.content.fields),
        subItems: filtered.length > 0 ? filtered.map(fromBillet) : undefined,
        sourceIngotId: ingot.id,
    };
}

/**
 * Maps an IngotType to the new SectionType (strips 'ingot_' prefix).
 */
function toSectionType(ingotType: IngotType): SectionType {
    return ingotType.replace('ingot_', '') as SectionType;
}

/**
 * Creates a blank DocumentItem with empty fields matching the section schema.
 */
function emptyItem(sectionType: SectionType): DocumentItem {
    const schema = SECTION_SCHEMAS[sectionType];
    const fields: Record<string, string> = {};
    for (const key of Object.keys(schema.fields)) {
        fields[key] = '';
    }
    return { id: crypto.randomUUID(), fields };
}

/**
 * Creates a blank sub-item matching the section's sub-field schema.
 */
function emptySubItem(sectionType: SectionType): DocumentItem {
    const schema = SECTION_SCHEMAS[sectionType];
    if (!schema.subFields) return { id: crypto.randomUUID(), fields: {} };
    const fields: Record<string, string> = {};
    for (const key of Object.keys(schema.subFields)) {
        fields[key] = '';
    }
    return { id: crypto.randomUUID(), fields };
}

/**
 * Converts a DocumentItem and its subItems back into a NewIngot structure.
 */
function toIngot(
    item: DocumentItem,
    sectionType: SectionType,
    customName?: string
): NewIngot {
    const schema = SECTION_SCHEMAS[sectionType];
    const ingotType = `ingot_${sectionType}` as IngotType;

    const fields: Record<string, IngotField> = {};
    for (const [key, val] of Object.entries(item.fields)) {
        const fieldDef = schema.fields[key];
        fields[key] = {
            mandatory: fieldDef?.required ?? false,
            value: val ?? '',
            inputType: (fieldDef?.type as IngotField['inputType']) ?? 'text',
            label: fieldDef?.label,
        };
    }

    const billets: Billet[] = (item.subItems ?? []).map((sub) => {
        const billetFields: Record<string, IngotField> = {};
        for (const [key, val] of Object.entries(sub.fields)) {
            const subDef = schema.subFields?.[key];
            billetFields[key] = {
                mandatory: false,
                value: val ?? '',
                inputType: (subDef?.type as IngotField['inputType']) ?? 'text',
                label: subDef?.label,
            };
        }
        return {
            id: sub.id || crypto.randomUUID(),
            type: schema.subFields
                ? (Object.keys(schema.subFields)[0] ?? 'entry')
                : 'entry',
            fields: billetFields,
        };
    });

    const fieldKeys = Object.keys(schema.fields);
    const primaryKey =
        fieldKeys.find((k) => schema.fields[k].required) ?? fieldKeys[0];
    const derivedName =
        customName ||
        item.fields[primaryKey] ||
        `New ${SECTION_META[sectionType]?.singularLabel ?? 'Ingot'}`;

    return {
        name: derivedName,
        type: ingotType,
        content: {
            fields,
            billetFormat: null,
            billets,
        },
    };
}

export const cvImport = {
    fromIngot,
    fromBillet,
    fromIngotWithBillets,
    toIngot,
    toSectionType,
    emptyItem,
    emptySubItem,
    extractFields,
};
