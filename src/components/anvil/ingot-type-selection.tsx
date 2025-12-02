import { TypographyH2 } from '../ui/typography/typography';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '../shadcn-components/card';
import { INGOT_TEMPLATES } from '@/lib/ingot-templates';
import Link from 'next/link';

export default function IngotTypeSelection() {
    return (
        <div className="w-full mx-auto p-6 space-y-6">
            <div className="flex items-center gap-4 mb-8">
                <TypographyH2 className="text-slate-50 border-none m-0">
                    Select Ingot Type
                </TypographyH2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.values(INGOT_TEMPLATES).map((template) => (
                    <Link
                        key={template.type}
                        href={`/anvil/create?ingotType=${template.type}`}
                    >
                        <Card className="bg-slate-800 border-slate-700 hover:border-forge-orange cursor-pointer transition-all hover:scale-[1.02]">
                            <CardHeader>
                                <CardTitle className="text-slate-100 text-lg">
                                    {template.type
                                        .replace('ingot_', '')
                                        .replace(/_/g, ' ')
                                        .replace(/\b\w/g, (l) =>
                                            l.toUpperCase()
                                        )}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-400 text-sm">
                                    Create a new{' '}
                                    {template.type
                                        .replace('ingot_', '')
                                        .replace(/_/g, ' ')}{' '}
                                    entry.
                                </p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
