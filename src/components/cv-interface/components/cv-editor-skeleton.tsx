import { Skeleton } from '@/components/ui/component-library/shadcn-components/skeleton';

export default function CvEditorSkeleton() {
    return (
        <div className="bg-slate-900 w-full min-h-[850px] rounded-xl border border-slate-700 flex flex-col overflow-hidden shadow-2xl">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800">
                <Skeleton className="h-8 w-32 bg-slate-700" />
                <Skeleton className="h-10 w-24 bg-slate-700" />
            </div>
            {/* Body Skeleton */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* Left Panel Skeleton */}
                <div className="w-full md:w-1/2 bg-slate-900 border-r border-slate-700 p-8 flex items-center justify-center">
                    <Skeleton className="h-full w-full rounded-lg bg-slate-800" />
                </div>
                {/* Right Panel Skeleton */}
                <div className="w-full md:w-1/2 bg-slate-800/50 p-4 space-y-6">
                    <Skeleton className="h-12 w-full bg-slate-700" />
                    <div className="space-y-4">
                        <Skeleton className="h-24 w-full bg-slate-700" />
                        <Skeleton className="h-24 w-full bg-slate-700" />
                        <Skeleton className="h-24 w-full bg-slate-700" />
                    </div>
                </div>
            </div>
        </div>
    );
}
