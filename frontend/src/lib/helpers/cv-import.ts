import type {
    Billet,
    Ingot,
    IngotField,
    IngotType,
} from '../types/ingot-types';
import type { DocumentItem, SectionType } from '../types/cv-document-types';
import { SECTION_SCHEMAS } from '../constants/cv-constants';

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

export const cvImport = {
    fromIngot,
    fromBillet,
    fromIngotWithBillets,
    toSectionType,
    emptyItem,
    emptySubItem,
    extractFields,
};
