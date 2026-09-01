import { cn } from '@/lib/utils';

interface SkeletonCardProps {
    className?: string;
}

export function SkeletonCard({ className }: SkeletonCardProps) {
    return (
        <div
            className={cn(
                'rounded-lg border border-border-default bg-gunmetal p-4 space-y-3',
                className
            )}
        >
            <div className="h-5 w-3/4 rounded bg-gradient-to-r from-gunmetal via-slag to-gunmetal bg-[length:200%_100%] animate-skeleton" />
            <div className="h-4 w-1/2 rounded bg-gradient-to-r from-gunmetal via-slag to-gunmetal bg-[length:200%_100%] animate-skeleton" />
            <div className="h-3 w-1/3 rounded bg-gradient-to-r from-gunmetal via-slag to-gunmetal bg-[length:200%_100%] animate-skeleton" />
        </div>
    );
}
