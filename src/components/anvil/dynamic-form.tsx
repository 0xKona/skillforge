'use client';

import { Input } from '@/components/shadcn-components/input';
import { Label } from '@/components/shadcn-components/label';
import { Textarea } from '@/components/shadcn-components/textarea';
import { Checkbox } from '@/components/shadcn-components/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/shadcn-components/select';
import { TemplateFields } from '@/lib/types/ingot';

interface Props {
    fields: TemplateFields;
    values: Record<string, unknown>;
    onChange: (key: string, value: string) => void;
    readOnlyFields?: string[];
}

export default function DynamicForm({
    fields,
    values,
    onChange,
    readOnlyFields = [],
}: Props) {
    // Helper to determine input type
    const getInputType = (key: string) => {
        const lowerKey = key.toLowerCase();
        if (lowerKey.includes('date')) return 'date';
        if (lowerKey.includes('email')) return 'email';
        if (lowerKey.includes('phone')) return 'tel';
        if (lowerKey.includes('url')) return 'url';
        return 'text';
    };

    // Helper to format label
    const getLabel = (key: string) => {
        return key
            .replace(/([A-Z])/g, ' $1') // Add space before capital letters
            .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter
    };

    const QUALIFICATION_LEVELS = [
        'GCSE',
        'A-Level',
        'BTEC',
        "Bachelor's Degree",
        "Master's Degree",
        'PhD',
        'Certification',
        'Diploma',
        'Other',
    ];

    const PROFICIENCY_LEVELS = [
        'Beginner',
        'Intermediate',
        'Advanced',
        'Expert',
        'Master',
    ];

    const renderField = (key: string) => {
        const fieldDef = fields[key];
        const isTextArea =
            key.toLowerCase().includes('description') ||
            key.toLowerCase().includes('statement') ||
            key.toLowerCase().includes('summary');

        const isSelect = key === 'billetTemplateType';
        const isQualification = key === 'qualificationLevel';
        const isProficiency = key === 'proficiencyLevel';
        const isEndDate = key === 'endDate';

        if (isQualification || isProficiency) {
            const options = isQualification
                ? QUALIFICATION_LEVELS
                : PROFICIENCY_LEVELS;
            const placeholder = isQualification
                ? 'Select level...'
                : 'Select proficiency...';

            return (
                <div key={key} className="space-y-2">
                    <Label htmlFor={key} className="text-slate-200">
                        {getLabel(key)}
                        {fieldDef.mandatory === 'true' && (
                            <span className="text-red-400 ml-1">*</span>
                        )}
                    </Label>
                    <Select
                        value={(values[key] as string) || ''}
                        onValueChange={(val) => onChange(key, val)}
                    >
                        <SelectTrigger className="bg-slate-900 border-slate-700 text-slate-100">
                            <SelectValue placeholder={placeholder} />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
                            {options.map((opt) => (
                                <SelectItem
                                    key={opt}
                                    value={opt}
                                    className="focus:bg-slate-700 focus:text-white"
                                >
                                    {opt}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            );
        }

        if (isSelect) {
            const options = fieldDef.value
                .split('|')
                .map((s) => s.trim())
                .filter((s) => s.length > 0);

            const isReadOnly = readOnlyFields.includes(key);

            if (options.length > 0) {
                return (
                    <div key={key} className="space-y-2">
                        <Label htmlFor={key} className="text-slate-200">
                            {getLabel(key)}
                            {fieldDef.mandatory === 'true' && (
                                <span className="text-red-400 ml-1">*</span>
                            )}
                        </Label>
                        <Select
                            value={(values[key] as string) || ''}
                            onValueChange={(val) => onChange(key, val)}
                            disabled={isReadOnly}
                        >
                            <SelectTrigger className="bg-slate-900 border-slate-700 text-slate-100 disabled:opacity-50 disabled:cursor-not-allowed">
                                <SelectValue placeholder="Select format..." />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
                                {options.map((opt) => (
                                    <SelectItem
                                        key={opt}
                                        value={opt}
                                        className="focus:bg-slate-700 focus:text-white"
                                    >
                                        {opt
                                            .replace('billet_', '')
                                            .replace(/_/g, ' ')}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {isReadOnly && (
                            <p className="text-xs text-amber-500">
                                Cannot change format while billets exist. Delete
                                all billets to change format.
                            </p>
                        )}
                    </div>
                );
            }
        }

        return (
            <div key={key} className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor={key} className="text-slate-200">
                        {getLabel(key)}
                        {fieldDef.mandatory === 'true' && (
                            <span className="text-red-400 ml-1">*</span>
                        )}
                    </Label>
                    {isEndDate && (
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id={`${key}-present`}
                                checked={!values[key]}
                                onCheckedChange={(checked) => {
                                    if (checked) {
                                        onChange(key, '');
                                    }
                                }}
                            />
                            <Label
                                htmlFor={`${key}-present`}
                                className="text-xs text-slate-400 font-normal cursor-pointer"
                            >
                                Current / Present
                            </Label>
                        </div>
                    )}
                </div>
                {isTextArea ? (
                    <Textarea
                        id={key}
                        value={(values[key] as string) || ''}
                        onChange={(e) => onChange(key, e.target.value)}
                        className="bg-slate-900 border-slate-700 text-slate-100 focus:border-forge-orange min-h-[100px]"
                        placeholder={`Enter ${getLabel(key).toLowerCase()}...`}
                    />
                ) : (
                    <Input
                        id={key}
                        type={getInputType(key)}
                        value={(values[key] as string) || ''}
                        onChange={(e) => onChange(key, e.target.value)}
                        className="bg-slate-900 border-slate-700 text-slate-100 focus:border-forge-orange disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder={`Enter ${getLabel(key).toLowerCase()}...`}
                        disabled={isEndDate && !values[key]}
                    />
                )}
            </div>
        );
    };

    // Group fields for layout
    const getGroupedFields = () => {
        const keys = Object.keys(fields).filter(
            (k) => fields[k].included !== 'false'
        );
        const groups: { type: 'row' | 'single'; keys: string[] }[] = [];
        const processed = new Set<string>();

        keys.forEach((key) => {
            if (processed.has(key)) return;

            // Group Start Date and End Date
            if (key === 'startDate' && keys.includes('endDate')) {
                groups.push({ type: 'row', keys: ['startDate', 'endDate'] });
                processed.add('startDate');
                processed.add('endDate');
                return;
            }

            // Group City, State, Country if they exist (future proofing)
            // Currently we just have 'location', but if we had city/state
            if (key === 'city' && keys.includes('state')) {
                groups.push({ type: 'row', keys: ['city', 'state'] });
                processed.add('city');
                processed.add('state');
                return;
            }

            groups.push({ type: 'single', keys: [key] });
            processed.add(key);
        });

        return groups;
    };

    return (
        <div className="space-y-4">
            {getGroupedFields().map((group, i) => {
                if (group.type === 'row') {
                    return (
                        <div
                            key={i}
                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                        >
                            {group.keys.map((k) => renderField(k))}
                        </div>
                    );
                }
                return <div key={i}>{renderField(group.keys[0])}</div>;
            })}
        </div>
    );
}
