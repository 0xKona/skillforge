import { Skeleton } from '@/ui/shadcn/skeleton';
import { PageContainer } from '@/components/layout/wrappers/page-container';

const skeletonBlock =
    'bg-gradient-to-r from-gunmetal via-slag to-gunmetal bg-[length:200%_100%] animate-skeleton';

export default function IngotEditorSkeleton() {
    return (
        <PageContainer className="relative py-8 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-2">
                    <Skeleton className={`h-8 w-48 ${skeletonBlock}`} />
                    <Skeleton className={`h-4 w-32 ${skeletonBlock}`} />
                </div>
                <div className="flex gap-2">
                    <Skeleton className={`h-10 w-24 ${skeletonBlock}`} />
                    <Skeleton className={`h-10 w-24 ${skeletonBlock}`} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-7 space-y-6">
                    <Skeleton
                        className={`h-[600px] w-full ${skeletonBlock} rounded-xl`}
                    />
                </div>
                <div className="hidden lg:block lg:col-span-5 space-y-6">
                    <Skeleton
                        className={`h-[600px] w-full ${skeletonBlock} rounded-xl`}
                    />
                </div>
            </div>
        </PageContainer>
    );
}
