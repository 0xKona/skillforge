import { Card, CardContent, CardHeader, CardTitle } from '@/ui/shadcn/card';
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
        <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
                <CardTitle className="text-slate-100">Ingot Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Top Level Name Field */}
                <div className="space-y-2">
                    <Label htmlFor="ingotName" className="text-slate-200">
                        Display Name <span className="text-red-400">*</span>
                    </Label>
                    <Input
                        id="ingotName"
                        value={ingotName}
                        onChange={(e) => onNameChange(e.target.value)}
                        className="bg-slate-900 border-slate-700 text-slate-100 focus:border-forge-orange"
                        placeholder="e.g. My Degree, Company"
                    />
                    <TypographyP className="text-xs text-slate-500">
                        This name is used by you to identify this ingot in your
                        list. It will not show in your CV.
                    </TypographyP>
                </div>

                {/* Ingot Form */}
                <div className="border-t border-slate-700/50 pt-6">
                    <DynamicForm
                        fields={fields}
                        values={values}
                        onChange={onFieldChange}
                        errors={errors}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
