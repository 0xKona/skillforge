import { z } from 'zod';
import { IngotField } from '@/lib/types/ingot-types';

// Helped me do this
// https://stackoverflow.com/questions/75984188/zod-how-to-dynamically-generate-a-schema

// Came back to this a week later and am completely lost, TODO - Refactor to make more readable / maintainable

export const generateSchemaFromIngotFields = (
    fields: Record<string, IngotField>
) => {
    const shape: Record<string, z.ZodTypeAny> = {};

    Object.entries(fields).forEach(([key, field]) => {
        let schema: z.ZodTypeAny = z.string();

        const label =
            field.label ||
            key
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, (str) => str.toUpperCase());

        if (field.mandatory) {
            schema = (schema as z.ZodString).min(1, {
                message: `${label} is required`,
            });
        } else {
            schema = (schema as z.ZodString).optional().or(z.literal(''));
        }

        // Specific validations
        if (key.toLowerCase().includes('email')) {
            if (field.mandatory) {
                schema = (schema as z.ZodString).email({
                    message: 'Invalid email address',
                });
            } else {
                schema = z.union([z.string().email(), z.literal('')]);
            }
        }

        if (
            key.toLowerCase().includes('url') ||
            key.toLowerCase().includes('website')
        ) {
            if (field.mandatory) {
                schema = (schema as z.ZodString).url({
                    message: 'Invalid URL',
                });
            } else {
                schema = z.union([z.string().url(), z.literal('')]);
            }
        }

        shape[key] = schema;
    });

    return z.object(shape);
};
