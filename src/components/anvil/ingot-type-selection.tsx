import { TypographyH2 } from '../ui/typography/typography';
import { Card } from '../shadcn-components/card';
import Link from 'next/link';
import { IngotService } from '@/lib/classes/ingot-service';
import { cn } from '@/lib/utils';
import {
    INGOT_TYPE_LABELS,
    IngotTypeLabelMap,
} from '@/lib/mappings/ingot-mappings';

function IngotTypeCard({ ingotType }: { ingotType: IngotTypeLabelMap }) {
    const {
        color,
        icon: Icon,
        label,
    } = IngotService.getAnvilCardDisplayDetails(ingotType.value);

    return (
        <Link
            href={`/anvil/create?ingotType=${ingotType.value}`}
            className="block h-full"
        >
            <Card className="group relative overflow-hidden bg-slate-900 border-slate-800 hover:border-slate-600 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer flex flex-col h-full p-0 gap-0">
                {/* Banner / Type Indicator */}
                <div
                    className={cn('h-1.5 w-full absolute top-0 left-0', color)}
                />

                <div className="p-5 flex-1 flex flex-col gap-4 pt-6">
                    {/* Header with Icon and Type */}
                    <div className="flex justify-between items-start">
                        <div
                            className={cn(
                                'p-2 rounded-lg bg-slate-800/50 text-slate-300',
                                color.replace('bg-', 'text-')
                            )}
                        >
                            <Icon className="h-5 w-5" />
                        </div>
                        <span
                            className={cn(
                                'text-[10px] font-bold px-2 py-1 rounded-full bg-slate-800/80 uppercase tracking-wider border border-slate-700',
                                color.replace('bg-', 'text-')
                            )}
                        >
                            {label}
                        </span>
                    </div>

                    {/* Title */}
                    <div className="space-y-1.5">
                        <h3 className="font-semibold text-lg text-slate-100 leading-tight group-hover:text-forge-orange transition-colors">
                            {ingotType.label}
                        </h3>
                        <p className="text-xs text-slate-500">
                            Create a new {ingotType.label.toLowerCase()} entry.
                        </p>
                    </div>
                </div>
            </Card>
        </Link>
    );
}

export default function IngotTypeSelection() {
    return (
        <div className="w-full mx-auto p-6 space-y-6">
            <div className="flex items-center gap-4 mb-8">
                <TypographyH2 className="text-slate-50 border-none m-0">
                    Select Ingot Type
                </TypographyH2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.values(INGOT_TYPE_LABELS).map(
                    (ingotType: IngotTypeLabelMap) => (
                        <IngotTypeCard
                            key={ingotType.value}
                            ingotType={ingotType}
                        />
                    )
                )}
            </div>
        </div>
    );
}
