import { cn } from '@/lib/utils';

interface EmptyStateProps {
    message: string;
    icon?: React.ReactNode;
    children?: React.ReactNode;
    className?: string;
}

export function EmptyState({
    message,
    icon,
    children,
    className,
}: EmptyStateProps) {
    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center py-16 gap-4',
                className
            )}
        >
            {icon && <div className="mb-1">{icon}</div>}
            <p className="text-base text-ash">{message}</p>
            {children}
        </div>
    );
}
