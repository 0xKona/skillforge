import { cn } from '@/lib/utils';

interface SkeletonCardProps {
    className?: string;
}

export function SkeletonCard({ className }: SkeletonCardProps) {
    return (
        <div
            className={cn(
                'rounded-lg border border-border-default bg-gunmetal p-5',
                className
            )}
        >
            {/* Badge row */}
            <div className="mb-2 h-5 w-24 rounded-full bg-gradient-to-r from-gunmetal via-slag to-gunmetal bg-[length:200%_100%] animate-skeleton" />
            {/* Title row */}
            <div className="h-5 w-3/4 rounded bg-gradient-to-r from-gunmetal via-slag to-gunmetal bg-[length:200%_100%] animate-skeleton" />
            {/* Footer row */}
            <div className="mt-3 flex items-center justify-between border-t border-border-default pt-3">
                <div className="h-3 w-16 rounded bg-gradient-to-r from-gunmetal via-slag to-gunmetal bg-[length:200%_100%] animate-skeleton" />
                <div className="h-3 w-20 rounded bg-gradient-to-r from-gunmetal via-slag to-gunmetal bg-[length:200%_100%] animate-skeleton" />
            </div>
        </div>
    );
}
