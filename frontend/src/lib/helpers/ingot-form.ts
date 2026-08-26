import { IngotField } from '../types/ingot-types';
import { INGOT_FIELD_LABELS } from '../constants/ingot-constants';
import { generateSchemaFromIngotFields } from '../schemas/ingot-form-generator';

interface ValidationResult {
    valid: boolean;
    errors: Record<string, string>;
}

/**
 * Returns the human-readable label for a field key.
 */
function getInputLabel(key: string): string {
    return INGOT_FIELD_LABELS[key];
}

/**
 * Groups related fields together for layout purposes
 * (e.g. putting start/end dates on the same row).
 */
function getGroupedFields(fields: Record<string, IngotField>) {
    const fieldKeys = Object.keys(fields);
    const groups: { type: 'row' | 'single'; keys: string[] }[] = [];
    const processed = new Set<string>();

    fieldKeys.forEach((fieldKey) => {
        if (processed.has(fieldKey)) return;

        // endDate will be picked up when we process startDate
        if (fieldKey === 'endDate' && fieldKeys.includes('startDate')) {
            return;
        }

        // Group Start Date and End Date into a single row
        if (fieldKey === 'startDate' && fieldKeys.includes('endDate')) {
            groups.push({ type: 'row', keys: ['startDate', 'endDate'] });
            processed.add('startDate');
            processed.add('endDate');
            return;
        }

        // Group City and State into a single row
        if (fieldKey === 'city' && fieldKeys.includes('state')) {
            groups.push({ type: 'row', keys: ['city', 'state'] });
            processed.add('city');
            processed.add('state');
            return;
        }

        groups.push({ type: 'single', keys: [fieldKey] });
        processed.add(fieldKey);
    });

    return groups;
}

/**
 * Extracts a simplified key-value map from a complex IngotField record.
 * Useful for form previews or validation where field metadata is not needed.
 */
function getIngotFieldValues(fields: Record<string, IngotField>) {
    const values: Record<string, string> = {};
    Object.keys(fields).forEach((key) => {
        const field = fields[key];
        const value = field?.value;

        if (typeof value === 'object' && value !== null) {
            // @ts-expect-error - Handle runtime data issue with nested objects
            values[key] = value.value || '';
        } else {
            values[key] = String(value || '');
        }
    });
    return values;
}

/**
 * Validates ingot fields against their generated Zod schema.
 */
function validateIngotFields(
    fields: Record<string, IngotField>
): ValidationResult {
    const schema = generateSchemaFromIngotFields(fields);
    const values = getIngotFieldValues(fields);
    const result = schema.safeParse(values);

    if (result.success) {
        return { valid: true, errors: {} };
    }

    const errors: Record<string, string> = {};
    result.error.issues.forEach((err) => {
        if (err.path[0]) {
            errors[err.path[0] as string] = err.message;
        }
    });
    return { valid: false, errors };
}

export const ingotFormHelpers = {
    getInputLabel,
    getGroupedFields,
    getIngotFieldValues,
    validateIngotFields,
};
