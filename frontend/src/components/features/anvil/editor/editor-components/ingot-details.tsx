import { TypographyP } from '@/ui/typography/typography';
import { Input } from '@/ui/shadcn/input';
import { Label } from '@/ui/shadcn/label';
import DynamicForm from './dynamic-form';
import { IngotField } from '@/lib/types/ingot-types';

interface IngotDetailsProps {
    ingotName: string;
    onNameChange: (name: string) => void;
    fields: Record<string, IngotField>;
    values: Record<string, string>;
    onFieldChange: (key: string, value: string) => void;
    errors?: Record<string, string>;
}

export function IngotDetails({
    ingotName,
    onNameChange,
    fields,
    values,
    onFieldChange,
    errors,
}: IngotDetailsProps) {
    return (
        <div className="rounded-lg border border-border-default bg-gunmetal p-6">
            <div className="space-y-6">
                {/* Top Level Name Field */}
                <div className="space-y-2">
                    <Label htmlFor="ingotName" className="text-text-secondary">
                        Display Name <span className="text-red-400">*</span>
                    </Label>
                    <Input
                        id="ingotName"
                        value={ingotName}
                        onChange={(e) => onNameChange(e.target.value)}
                        className="bg-input-bg border-input-border text-input-text focus:border-flux"
                        placeholder="e.g. My Degree, Company"
                    />
                    <TypographyP className="text-xs text-ash">
                        Used to identify this ingot in your library — not shown
                        on your CV.
                    </TypographyP>
                </div>

                {/* Ingot Form */}
                <div className="border-t border-border-default pt-6">
                    <DynamicForm
                        fields={fields}
                        values={values}
                        onChange={onFieldChange}
                        errors={errors}
                    />
                </div>
            </div>
        </div>
    );
}
