import { Skeleton } from '@/components/ui/component-library/shadcn-components/skeleton';

export default function IngotEditorSkeleton() {
    return (
        <div className="w-full mx-auto p-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48 bg-slate-800" />
                    <Skeleton className="h-4 w-32 bg-slate-800" />
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-24 bg-slate-800" />
                    <Skeleton className="h-10 w-24 bg-slate-800" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7 space-y-6">
                    <Skeleton className="h-[600px] w-full bg-slate-800 rounded-xl" />
                </div>
                <div className="hidden lg:block lg:col-span-5 space-y-6">
                    <Skeleton className="h-[600px] w-full bg-slate-800 rounded-xl" />
                </div>
            </div>
        </div>
    );
}
