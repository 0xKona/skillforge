import { z } from 'zod';
import { IngotField } from '@/lib/types/ingot-types';

// Helped me do this - keeping here in case needed in future
// https://stackoverflow.com/questions/75984188/zod-how-to-dynamically-generate-a-schema

/**
 * Generates a Zod schema object from a record of IngotField objects.
 * This function dynamically creates validation rules based on the field properties like mandatory status and field names.
 * @param fields - A record where keys are field names and values are IngotField objects.
 * @returns A Zod object schema with validation rules for each field.
 */
export const generateSchemaFromIngotFields = (
    fields: Record<string, IngotField>
) => {
    // Initialize an empty object to hold the schema shape for each field
    const shape: Record<string, z.ZodTypeAny> = {};

    // Iterate over each field in the fields record
    Object.entries(fields).forEach(([key, field]) => {
        // Start with a base string schema for each field
        let schema: z.ZodTypeAny = z.string();

        // Generate a human-readable label from the field key if no label is provided
        // Convert camelCase to Title Case with spaces
        const label =
            field.label ||
            key
                .replace(/([A-Z])/g, ' $1') // Insert space before uppercase letters
                .replace(/^./, (str) => str.toUpperCase()); // Capitalize the first letter

        // If the field is mandatory, add a minimum length validation requiring at least 1 character
        if (field.mandatory) {
            schema = (schema as z.ZodString).min(1, {
                message: `${label} is required`,
            });
        } else {
            // If not mandatory, make it optional or allow an empty string
            schema = (schema as z.ZodString).optional().or(z.literal(''));
        }

        // Special validation for fields that include 'email' in the key
        if (key.toLowerCase().includes('email')) {
            if (field.mandatory) {
                // For mandatory email fields, enforce email format
                schema = (schema as z.ZodString).email({
                    message: 'Invalid email address',
                });
            } else {
                // For optional email fields, allow valid email or empty string
                schema = z.union([z.string().email(), z.literal('')]);
            }
        }

        // Special validation for fields that include 'url' or 'website' in the key
        if (
            key.toLowerCase().includes('url') ||
            key.toLowerCase().includes('website')
        ) {
            if (field.mandatory) {
                // For mandatory URL fields, enforce URL format
                schema = (schema as z.ZodString).url({
                    message: 'Invalid URL',
                });
            } else {
                // For optional URL fields, allow valid URL or empty string
                schema = z.union([z.string().url(), z.literal('')]);
            }
        }

        // Add the constructed schema for this field to the shape object
        shape[key] = schema;
    });

    // Return a Zod object schema created from the shape
    return z.object(shape);
};
