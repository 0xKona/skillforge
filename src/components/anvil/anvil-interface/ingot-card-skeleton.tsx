import { Card } from '../../ui/component-library/shadcn-components/card';
import { Skeleton } from '../../ui/component-library/shadcn-components/skeleton';

export default function IngotCardSkeleton() {
    return (
        <Card className="group relative overflow-hidden bg-slate-900 border-slate-800 flex flex-col h-full p-0 gap-0">
            {/* Banner / Type Indicator */}
            <div className="h-1.5 w-full absolute top-0 left-0 bg-slate-800" />

            <div className="p-5 flex-1 flex flex-col gap-4 pt-6">
                {/* Header with Icon and Type */}
                <div className="flex justify-between items-start">
                    <Skeleton className="h-9 w-9 rounded-lg bg-slate-800" />
                    <Skeleton className="h-6 w-24 rounded-full bg-slate-800" />
                </div>

                {/* Title */}
                <div className="space-y-2">
                    <Skeleton className="h-7 w-3/4 bg-slate-800" />
                    <Skeleton className="h-4 w-1/2 bg-slate-800" />
                </div>
            </div>

            {/* Actions Footer */}
            <div className="px-5 pb-5 pt-0 flex justify-end gap-2">
                <Skeleton className="h-8 w-20 bg-slate-800" />
                <Skeleton className="h-8 w-8 bg-slate-800" />
            </div>
        </Card>
    );
}
