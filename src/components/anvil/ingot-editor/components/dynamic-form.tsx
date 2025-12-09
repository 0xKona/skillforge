'use client';

import { IngotField } from '@/lib/types/ingot-types';
import { FormField } from './form-field';
import { IngotFormHelper } from '@/lib/helpers/ingot-form-helpers';

interface Props {
    fields: Record<string, IngotField>;
    values: Record<string, string>;
    onChange: (key: string, value: string) => void;
    errors?: Record<string, string>;
}

export default function DynamicForm({
    fields,
    values,
    onChange,
    errors = {},
}: Props) {
    const groupedFields = IngotFormHelper.getGroupedFields(fields);

    return (
        <div className="space-y-4">
            {groupedFields.map((group, i) => {
                if (group.type === 'row') {
                    return (
                        <div
                            key={i}
                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                        >
                            {group.keys.map((key) => (
                                <FormField
                                    key={key}
                                    fieldKey={key}
                                    field={fields[key]}
                                    value={values[key]}
                                    error={errors[key]}
                                    onChange={onChange}
                                />
                            ))}
                        </div>
                    );
                }
                const key = group.keys[0];
                return (
                    <div key={i}>
                        <FormField
                            fieldKey={key}
                            field={fields[key]}
                            value={values[key]}
                            error={errors[key]}
                            onChange={onChange}
                        />
                    </div>
                );
            })}
        </div>
    );
}
