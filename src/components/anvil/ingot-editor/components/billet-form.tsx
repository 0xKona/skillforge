import { useState, useEffect } from 'react';
import { BilletTemplate, IngotField } from '@/lib/types/ingot-types';
import DynamicForm from './dynamic-form';
import { Button } from '@/components/shadcn-components/button';
import { X, Check } from 'lucide-react';
import { generateSchemaFromIngotFields } from '@/lib/form-schemas/ingot-form-generator';
import { toast } from 'sonner';

interface BilletFormProps {
    template: BilletTemplate;
    initialFields: Record<string, IngotField>;
    type: string;
    isAdding: boolean;
    onSave: (fields: Record<string, IngotField>) => void;
    onCancel: () => void;
}

export function BilletForm({
    template,
    initialFields,
    type,
    isAdding,
    onSave,
    onCancel,
}: BilletFormProps) {
    const [fields, setFields] =
        useState<Record<string, IngotField>>(initialFields);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Reset fields when initialFields changes (e.g. switching between add/edit)
    useEffect(() => {
        setFields(initialFields);
        setErrors({});
    }, [initialFields]);

    const handleContentChange = (key: string, value: string) => {
        setFields((prev) => ({
            ...prev,
            [key]: { ...prev[key], value },
        }));

        // Clear error when user types
        if (errors[key]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[key];
                return newErrors;
            });
        }
    };

    const handleSave = () => {
        // Zod Validation
        const schema = generateSchemaFromIngotFields(fields);

        // Extract values for validation
        const values: Record<string, string> = {};
        Object.keys(fields).forEach((key) => {
            values[key] = fields[key].value;
        });

        const result = schema.safeParse(values);

        if (!result.success) {
            const newErrors: Record<string, string> = {};
            result.error.issues.forEach((err) => {
                if (err.path[0]) {
                    newErrors[err.path[0] as string] = err.message;
                }
            });
            setErrors(newErrors);
            toast.error('Please fix the errors in the form');
            return;
        }

        onSave(fields);
    };

    // Helper to extract values for DynamicForm
    const getFieldValues = (fields: Record<string, IngotField>) => {
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
    };

    return (
        <div className="mb-6 p-4 rounded-lg bg-slate-900/50 border border-slate-700 animate-in fade-in slide-in-from-top-2 space-y-4">
            <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium text-slate-200">
                    {isAdding ? 'New Billet' : 'Edit Billet'}
                </h4>
                <span className="text-xs text-slate-500 uppercase font-mono">
                    {type.replace('billet_', '').replace(/_/g, ' ')}
                </span>
            </div>

            <DynamicForm
                fields={template.fields}
                values={getFieldValues(fields)}
                onChange={handleContentChange}
                errors={errors}
            />

            <div className="flex justify-end gap-2 pt-2">
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={onCancel}
                    className="h-8 text-slate-400 hover:text-white"
                >
                    <X className="h-4 w-4 mr-1" /> Cancel
                </Button>
                <Button
                    size="sm"
                    onClick={handleSave}
                    className="h-8 bg-forge-orange hover:bg-forge-ember"
                >
                    <Check className="h-4 w-4 mr-1" />{' '}
                    {isAdding ? 'Add' : 'Update'}
                </Button>
            </div>
        </div>
    );
}
