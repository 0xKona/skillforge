import { cn } from '@/lib/utils';

interface EmptyStateProps {
    message: string;
    children?: React.ReactNode;
    className?: string;
}

export function EmptyState({ message, children, className }: EmptyStateProps) {
    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center py-16 gap-4',
                className
            )}
        >
            <p className="text-base text-ash">{message}</p>
            {children}
        </div>
    );
}
