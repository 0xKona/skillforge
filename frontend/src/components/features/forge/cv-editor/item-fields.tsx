'use client';

import { useCallback, useState } from 'react';

import { Input } from '@/ui/shadcn/input';
import { Textarea } from '@/ui/shadcn/textarea';
import { Label } from '@/ui/shadcn/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/ui/shadcn/select';
import { useCvDocumentStore } from '@/lib/store/use-cv-document';
import { SECTION_SCHEMAS } from '@/lib/constants/cv-constants';
import type {
    DocumentItem,
    FieldDef,
    SectionType,
} from '@/lib/types/cv-document-types';

interface ItemFieldsProps {
    item: DocumentItem;
    sectionIndex: number;
    itemIndex: number;
    sectionType: SectionType;
}

export function ItemFields({
    item,
    sectionIndex,
    itemIndex,
    sectionType,
}: ItemFieldsProps) {
    const updateItemField = useCvDocumentStore((s) => s.updateItemField);
    const schema = SECTION_SCHEMAS[sectionType];
    const fields = Object.entries(schema.fields);

    const handleCommit = useCallback(
        (field: string, value: string) => {
            // Only commit if the value actually changed
            if (item.fields[field] !== value) {
                updateItemField(sectionIndex, itemIndex, field, value);
            }
        },
        [sectionIndex, itemIndex, item.fields, updateItemField]
    );

    // Group fields in pairs for 2-column layout (dates often pair)
    const rows: Array<[string, FieldDef][]> = [];
    let i = 0;
    while (i < fields.length) {
        const current = fields[i];
        const next = fields[i + 1];
        // Pair short fields (text, date, email, tel, select) together
        if (
            next &&
            current[1].type !== 'textarea' &&
            next[1].type !== 'textarea'
        ) {
            rows.push([current, next]);
            i += 2;
        } else {
            rows.push([current]);
            i += 1;
        }
    }

    return (
        <div className="flex flex-col gap-2.5">
            {rows.map((row, rowIndex) => (
                <div
                    key={rowIndex}
                    className={
                        row.length === 2 ? 'grid grid-cols-2 gap-2.5' : ''
                    }
                >
                    {row.map(([key, def]) => (
                        <FieldInput
                            key={key}
                            fieldKey={key}
                            def={def}
                            value={item.fields[key] ?? ''}
                            onCommit={handleCommit}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}

// -- Individual field input with local state --

interface FieldInputProps {
    fieldKey: string;
    def: FieldDef;
    value: string;
    onCommit: (field: string, value: string) => void;
}

function FieldInput({ fieldKey, def, value, onCommit }: FieldInputProps) {
    const [localValue, setLocalValue] = useState(value);

    const handleBlur = () => {
        onCommit(fieldKey, localValue);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && def.type !== 'textarea') {
            onCommit(fieldKey, localValue);
        }
    };

    const inputClasses =
        'h-8 text-sm bg-forge-card border-forge-border focus-visible:ring-1 focus-visible:ring-forge-border-hot focus-visible:border-forge-border-hot';

    return (
        <div className="flex flex-col gap-1">
            <Label className="text-xs text-forge-text-muted">
                {def.label}
                {def.required && (
                    <span className="text-forge-accent ml-0.5">*</span>
                )}
            </Label>

            {def.type === 'textarea' ? (
                <Textarea
                    value={localValue}
                    onChange={(e) => setLocalValue(e.target.value)}
                    onBlur={handleBlur}
                    placeholder={def.placeholder}
                    className="min-h-[60px] resize-y text-sm bg-forge-card border-forge-border focus-visible:ring-1 focus-visible:ring-forge-border-hot"
                />
            ) : def.type === 'select' && def.options ? (
                <Select
                    value={localValue}
                    onValueChange={(v) => {
                        setLocalValue(v);
                        onCommit(fieldKey, v); // Select commits immediately on change
                    }}
                >
                    <SelectTrigger className={inputClasses}>
                        <SelectValue
                            placeholder={def.placeholder ?? 'Select...'}
                        />
                    </SelectTrigger>
                    <SelectContent>
                        {def.options.map((opt) => (
                            <SelectItem key={opt} value={opt}>
                                {opt}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            ) : (
                <Input
                    type={def.type === 'date' ? 'text' : def.type}
                    value={localValue}
                    onChange={(e) => setLocalValue(e.target.value)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    placeholder={def.placeholder}
                    className={inputClasses}
                />
            )}
        </div>
    );
}
