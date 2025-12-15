import { Input } from '@/ui/shadcn/input';
import { Label } from '@/ui/shadcn/label';
import { Textarea } from '@/ui/shadcn/textarea';
import { Checkbox } from '@/ui/shadcn/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/ui/shadcn/select';
import {
    IngotField,
    QUALIFICATION_LEVELS,
    SKILL_PROFICIENCY_LEVELS,
} from '@/lib/types/ingot-types';
import { IngotFormHelper } from '@/lib/classes/helpers/ingot-form-helpers';

interface FormFieldProps {
    fieldKey: string;
    field: IngotField;
    value: string;
    error?: string;
    onChange: (key: string, value: string) => void;
}

export function FormField({
    fieldKey,
    field,
    value,
    error,
    onChange,
}: FormFieldProps) {
    const label = field.label || IngotFormHelper.getInputLabel(fieldKey);
    const isTextArea = field.inputType === 'textarea';

    const isQualification = fieldKey === 'qualificationLevel';
    const isProficiency = fieldKey === 'proficiencyLevel';
    const isEndDate = fieldKey === 'endDate';
    const isSelect = field.inputType === 'select';

    if (isSelect) {
        let options: string[] = [];
        let placeholder = 'Select...';

        if (field.options) {
            options = field.options;
        } else if (isQualification) {
            options = QUALIFICATION_LEVELS;
            placeholder = 'Select level...';
        } else if (isProficiency) {
            options = SKILL_PROFICIENCY_LEVELS;
            placeholder = 'Select proficiency...';
        }

        return (
            <div className="space-y-2">
                <Label htmlFor={fieldKey} className="text-slate-200">
                    {label}
                    {field.mandatory && (
                        <span className="text-red-400 ml-1">*</span>
                    )}
                </Label>
                <Select
                    value={value || ''}
                    onValueChange={(val) => onChange(fieldKey, val)}
                >
                    <SelectTrigger
                        className={`bg-slate-900 border-slate-700 text-slate-100 ${error ? 'border-red-500' : ''}`}
                    >
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
                {error && <p className="text-xs text-red-400">{error}</p>}
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <Label htmlFor={fieldKey} className="text-slate-200">
                    {label}
                    {field.mandatory && (
                        <span className="text-red-400 ml-1">*</span>
                    )}
                </Label>
                {isEndDate && (
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id={`${fieldKey}-present`}
                            checked={value === 'Current'}
                            onCheckedChange={(checked) => {
                                if (checked) {
                                    onChange(fieldKey, 'Current');
                                } else {
                                    onChange(
                                        fieldKey,
                                        new Date().toISOString().split('T')[0]
                                    );
                                }
                            }}
                        />
                        <Label
                            htmlFor={`${fieldKey}-present`}
                            className="text-xs text-slate-400 font-normal cursor-pointer"
                        >
                            Current / Present
                        </Label>
                    </div>
                )}
            </div>
            {isTextArea ? (
                <Textarea
                    id={fieldKey}
                    value={value || ''}
                    onChange={(e) => onChange(fieldKey, e.target.value)}
                    className={`bg-slate-900 border-slate-700 text-slate-100 focus:border-forge-orange min-h-[100px] ${error ? 'border-red-500' : ''}`}
                    placeholder={`Enter ${label.toLowerCase()}...`}
                />
            ) : (
                <Input
                    id={fieldKey}
                    type={field.inputType}
                    value={value === 'Current' ? '' : value || ''}
                    onChange={(e) => onChange(fieldKey, e.target.value)}
                    disabled={value === 'Current'}
                    className={`bg-slate-900 border-slate-700 text-slate-100 focus:border-forge-orange disabled:opacity-50 disabled:cursor-not-allowed ${error ? 'border-red-500' : ''}`}
                    placeholder={
                        value === 'Current'
                            ? 'Current'
                            : `Enter ${label.toLowerCase()}...`
                    }
                />
            )}
            {error && <p className="text-xs text-red-400">{error}</p>}
        </div>
    );
}
