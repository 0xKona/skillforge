import { IngotField, INGOT_FIELD_LABELS } from '../../types/ingot-types';

export class IngotFormHelper {
    /**
     * Retrieves the human-readable label for a given field key.
     * @param key - The field key to look up
     * @returns The mapped label string
     */
    static getInputLabel(key: string) {
        return INGOT_FIELD_LABELS[key];
    }

    /**
     * Groups related fields together for layout purposes (e.g., putting start/end dates on the same row).
     * @param fields - The record of IngotFields to process
     * @returns An array of field groups, where each group is either a single field or a row of fields
     */
    static getGroupedFields(fields: Record<string, IngotField>) {
        const fieldKeys = Object.keys(fields);
        const groups: { type: 'row' | 'single'; keys: string[] }[] = [];
        const processed = new Set<string>();

        fieldKeys.forEach((fieldKey) => {
            // If we've already handled this key (e.g., as part of a group), skip it
            if (processed.has(fieldKey)) return;

            // Special handling for 'endDate':
            // If 'startDate' is also present, we skip 'endDate' here because it will be
            // picked up when we process 'startDate' below.
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

            // Group City and State into a single row (future proofing)
            if (fieldKey === 'city' && fieldKeys.includes('state')) {
                groups.push({ type: 'row', keys: ['city', 'state'] });
                processed.add('city');
                processed.add('state');
                return;
            }

            // Default case: Add the field as a single item on its own row
            groups.push({ type: 'single', keys: [fieldKey] });
            processed.add(fieldKey);
        });

        return groups;
    }

    /**
     * Extracts a simplified key-value map from the complex IngotField record.
     * Useful for generating previews or processing form data where metadata (mandatory, included) is not needed.
     * @param fields - The record of IngotFields
     * @returns A simple record of field keys to their string values
     */
    static getIngotFieldValues(fields: Record<string, IngotField>) {
        const values: Record<string, string> = {};
        Object.keys(fields).forEach((key) => {
            const field = fields[key];
            const value = field?.value;

            // Handle potential object values (nested fields)
            if (typeof value === 'object' && value !== null) {
                // @ts-expect-error - Handle runtime data issue
                values[key] = value.value || '';
            } else {
                values[key] = String(value || '');
            }
        });
        return values;
    }
}
