import { Skeleton } from '../../shadcn-components/skeleton';
import { Card } from '../../shadcn-components/card';

export default function CvCardSkeleton() {
    return (
        <Card className="bg-slate-900 border-slate-800 h-full p-0 overflow-hidden">
            <div className="h-1.5 w-full bg-slate-800 animate-pulse" />
            <div className="p-5 space-y-4">
                <div className="flex justify-between items-start">
                    <Skeleton className="h-9 w-9 rounded-lg bg-slate-800" />
                    <Skeleton className="h-6 w-20 rounded-full bg-slate-800" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-6 w-3/4 bg-slate-800" />
                    <Skeleton className="h-4 w-1/2 bg-slate-800" />
                </div>
            </div>
            <div className="px-5 pb-5 flex justify-end gap-2">
                <Skeleton className="h-8 w-16 bg-slate-800" />
                <Skeleton className="h-8 w-8 bg-slate-800" />
            </div>
        </Card>
    );
}
